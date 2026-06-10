import { EventType, isMeetingEvent, isTaskEvent, isReminderEvent } from '../models/event.model.js';
// Custom error classes
export class EventNotFoundError extends Error {
    constructor(eventId) {
        super(`Event with id ${eventId} not found`);
        this.name = 'EventNotFoundError';
    }
}
export class InvalidEventDataError extends Error {
    constructor(message) {
        super(`Invalid event data: ${message}`);
        this.name = 'InvalidEventDataError';
    }
}
export class EventManager {
    constructor() {
        this.events = new Map();
    }
    // Generic method to get events by type
    getEventsByType(type) {
        return Array.from(this.events.values())
            .filter(event => event.type === type);
    }
    // Add event with validation
    addEvent(eventData) {
        this.validateEventData(eventData);
        let event;
        const id = this.generateId();
        const createdAt = new Date();
        if (eventData.type === EventType.MEETING) {
            event = {
                ...eventData,
                id,
                createdAt,
                type: EventType.MEETING
            };
        }
        else if (eventData.type === EventType.TASK) {
            event = {
                ...eventData,
                id,
                createdAt,
                type: EventType.TASK
            };
        }
        else {
            event = {
                ...eventData,
                id,
                createdAt,
                type: EventType.REMINDER
            };
        }
        this.events.set(event.id, event);
        return event;
    }
    // Remove event
    removeEvent(eventId) {
        if (!this.events.has(eventId)) {
            throw new EventNotFoundError(eventId);
        }
        return this.events.delete(eventId);
    }
    // Update event
    // Update event - виправлена версія
    updateEvent(eventId, updates) {
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
        let updatedEvent;
        if (isMeetingEvent(existingEvent)) {
            updatedEvent = {
                ...existingEvent,
                ...updates
            };
        }
        else if (isTaskEvent(existingEvent)) {
            updatedEvent = {
                ...existingEvent,
                ...updates
            };
        }
        else if (isReminderEvent(existingEvent)) {
            updatedEvent = {
                ...existingEvent,
                ...updates
            };
        }
        else {
            throw new InvalidEventDataError('Unknown event type');
        }
        this.events.set(eventId, updatedEvent);
        return updatedEvent;
    }
    // Get all events
    getAllEvents() {
        return Array.from(this.events.values());
    }
    // Get events by custom filter
    filterEvents(predicate) {
        return Array.from(this.events.values()).filter(predicate);
    }
    // Get grouped events by type (Record with mapped types)
    getGroupedEvents() {
        const grouped = {
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
    getStatistics() {
        const stats = {
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
    getUpcomingEvents() {
        const now = new Date();
        const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
        return this.filterEvents(event => event.date >= now && event.date <= nextWeek);
    }
    // Get overdue tasks
    getOverdueTasks() {
        const now = new Date();
        const tasks = this.getEventsByType(EventType.TASK);
        return tasks.filter(task => !task.completed && task.deadline < now);
    }
    // Search events by text in title or description
    searchEvents(query) {
        const lowerQuery = query.toLowerCase();
        return this.filterEvents(event => event.title.toLowerCase().includes(lowerQuery) ||
            event.description.toLowerCase().includes(lowerQuery));
    }
    // Clear all events
    clearAllEvents() {
        this.events.clear();
    }
    // Get event by id
    getEventById(eventId) {
        return this.events.get(eventId);
    }
    // Private helper methods
    generateId() {
        return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
    validateEventData(eventData) {
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
                const meeting = eventData;
                if (!meeting.location) {
                    throw new InvalidEventDataError('Meeting location is required');
                }
                if (meeting.duration && meeting.duration <= 0) {
                    throw new InvalidEventDataError('Meeting duration must be positive');
                }
                break;
            case EventType.TASK:
                const task = eventData;
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
                const reminder = eventData;
                if (!reminder.reminderTime) {
                    throw new InvalidEventDataError('Reminder time is required');
                }
                break;
        }
    }
}
