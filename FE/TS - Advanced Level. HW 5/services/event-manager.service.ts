import { 
    AppEvent, 
    EventType, 
    CreateEventDTO, 
    UpdateEventDTO,
    isMeetingEvent,
    isTaskEvent,
    isReminderEvent,
    EventStatistics,
    MeetingEvent,
    TaskEvent,
    ReminderEvent
} from '../models/event.model.js';

// Custom error classes
export class EventNotFoundError extends Error {
    constructor(eventId: string) {
        super(`Event with id ${eventId} not found`);
        this.name = 'EventNotFoundError';
    }
}

export class InvalidEventDataError extends Error {
    constructor(message: string) {
        super(`Invalid event data: ${message}`);
        this.name = 'InvalidEventDataError';
    }
}

export class EventManager {
    private events: Map<string, AppEvent> = new Map();
    
    // Generic method to get events by type
    public getEventsByType<T extends AppEvent>(type: EventType): T[] {
        return Array.from(this.events.values())
            .filter(event => event.type === type) as T[];
    }
    
    // Add event with validation
    public addEvent(eventData: CreateEventDTO): AppEvent {
        this.validateEventData(eventData);
        
        let event: AppEvent;
        const id = this.generateId();
        const createdAt = new Date();
        
        if (eventData.type === EventType.MEETING) {
            event = {
                ...eventData,
                id,
                createdAt,
                type: EventType.MEETING
            } as MeetingEvent;
        } else if (eventData.type === EventType.TASK) {
            event = {
                ...eventData,
                id,
                createdAt,
                type: EventType.TASK
            } as TaskEvent;
        } else {
            event = {
                ...eventData,
                id,
                createdAt,
                type: EventType.REMINDER
            } as ReminderEvent;
        }
        
        this.events.set(event.id, event);
        return event;
    }
    
    // Remove event
    public removeEvent(eventId: string): boolean {
        if (!this.events.has(eventId)) {
            throw new EventNotFoundError(eventId);
        }
        return this.events.delete(eventId);
    }
    
    // Update event
 // Update event - виправлена версія
public updateEvent(eventId: string, updates: UpdateEventDTO): AppEvent {
    const existingEvent = this.events.get(eventId);
    
    if (!existingEvent) {
        throw new EventNotFoundError(eventId);
    }
    
    // Validate updated data
    if (updates.title === '') {
        throw new InvalidEventDataError('Title cannot be empty');
    }
    
    if (updates.date && isNaN(updates.date.getTime())) {
        throw new InvalidEventDataError('Invalid date');
    }
    
    // Type-safe update
    let updatedEvent: AppEvent;
    
    if (isMeetingEvent(existingEvent)) {
        updatedEvent = {
            ...existingEvent,
            ...updates
        } as MeetingEvent;
    } else if (isTaskEvent(existingEvent)) {
        updatedEvent = {
            ...existingEvent,
            ...updates
        } as TaskEvent;
    } else if (isReminderEvent(existingEvent)) {
        updatedEvent = {
            ...existingEvent,
            ...updates
        } as ReminderEvent;
    } else {
        throw new InvalidEventDataError('Unknown event type');
    }
    
    this.events.set(eventId, updatedEvent);
    return updatedEvent;
}
    
    // Get all events
    public getAllEvents(): AppEvent[] {
        return Array.from(this.events.values());
    }
    
    // Get events by custom filter
    public filterEvents(predicate: (event: AppEvent) => boolean): AppEvent[] {
        return Array.from(this.events.values()).filter(predicate);
    }
    
    // Get grouped events by type (Record with mapped types)
    public getGroupedEvents(): Record<EventType, AppEvent[]> {
        const grouped: Record<EventType, AppEvent[]> = {
            [EventType.MEETING]: [],
            [EventType.TASK]: [],
            [EventType.REMINDER]: []
        };
        
        this.events.forEach(event => {
            grouped[event.type].push(event);
        });
        
        return grouped;
    }
    
    // Get event statistics
    public getStatistics(): EventStatistics {
        const stats: EventStatistics = {
            [EventType.MEETING]: 0,
            [EventType.TASK]: 0,
            [EventType.REMINDER]: 0
        };
        
        this.events.forEach(event => {
            stats[event.type]++;
        });
        
        return stats;
    }
    
    // Get upcoming events (next 7 days)
    public getUpcomingEvents(): AppEvent[] {
        const now = new Date();
        const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
        
        return this.filterEvents(event => 
            event.date >= now && event.date <= nextWeek
        );
    }
    
    // Get overdue tasks
    public getOverdueTasks(): TaskEvent[] {
        const now = new Date();
        const tasks = this.getEventsByType<TaskEvent>(EventType.TASK);
        
        return tasks.filter(task => 
            !task.completed && task.deadline < now
        );
    }
    
    // Search events by text in title or description
    public searchEvents(query: string): AppEvent[] {
        const lowerQuery = query.toLowerCase();
        return this.filterEvents(event =>
            event.title.toLowerCase().includes(lowerQuery) ||
            event.description.toLowerCase().includes(lowerQuery)
        );
    }
    
    // Clear all events
    public clearAllEvents(): void {
        this.events.clear();
    }
    
    // Get event by id
    public getEventById(eventId: string): AppEvent | undefined {
        return this.events.get(eventId);
    }
    
    // Private helper methods
    private generateId(): string {
        return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
    
    private validateEventData(eventData: CreateEventDTO): void {
        if (!eventData.title || eventData.title.trim() === '') {
            throw new InvalidEventDataError('Title is required');
        }
        
        if (!eventData.date || isNaN(eventData.date.getTime())) {
            throw new InvalidEventDataError('Valid date is required');
        }
        
        if (eventData.date < new Date()) {
            throw new InvalidEventDataError('Event date cannot be in the past');
        }
        
        // Type-specific validation
        switch (eventData.type) {
            case EventType.MEETING:
                const meeting = eventData as any;
                if (!meeting.location) {
                    throw new InvalidEventDataError('Meeting location is required');
                }
                if (meeting.duration && meeting.duration <= 0) {
                    throw new InvalidEventDataError('Meeting duration must be positive');
                }
                break;
                
            case EventType.TASK:
                const task = eventData as any;
                if (!task.assignee) {
                    throw new InvalidEventDataError('Task assignee is required');
                }
                if (!task.deadline) {
                    throw new InvalidEventDataError('Task deadline is required');
                }
                if (task.deadline < new Date()) {
                    throw new InvalidEventDataError('Task deadline cannot be in the past');
                }
                break;
                
            case EventType.REMINDER:
                const reminder = eventData as any;
                if (!reminder.reminderTime) {
                    throw new InvalidEventDataError('Reminder time is required');
                }
                break;
        }
    }
}