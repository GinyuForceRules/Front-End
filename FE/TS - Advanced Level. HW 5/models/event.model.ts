// Base interface
export interface BaseEvent {
    readonly id: string;
    readonly createdAt: Date;
    title: string;
    description: string;
    date: Date;
    type: EventType;
}

// Event types enum
export enum EventType {
    MEETING = 'meeting',
    TASK = 'task',
    REMINDER = 'reminder'
}

// Specialized event interfaces
export interface MeetingEvent extends BaseEvent {
    readonly type: EventType.MEETING;
    location: string;
    attendees: string[];
    agenda: string;
    duration: number; // in minutes
}

export interface TaskEvent extends BaseEvent {
    readonly type: EventType.TASK;
    priority: 'low' | 'medium' | 'high';
    assignee: string;
    deadline: Date;
    completed: boolean;
    subtasks: string[];
}

export interface ReminderEvent extends BaseEvent {
    readonly type: EventType.REMINDER;
    reminderTime: Date;
    repeatInterval?: 'daily' | 'weekly' | 'monthly' | 'never';
    notifyByEmail: boolean;
    notifyByPush: boolean;
}

// Discriminated union
export type AppEvent = MeetingEvent | TaskEvent | ReminderEvent;

// Type for creating new event using discriminated union
export type CreateEventDTO = 
    | Omit<MeetingEvent, 'id' | 'createdAt'>
    | Omit<TaskEvent, 'id' | 'createdAt'>
    | Omit<ReminderEvent, 'id' | 'createdAt'>;

// Type for partial update
export type UpdateEventDTO = Partial<Omit<AppEvent, 'id' | 'createdAt'>>;

// Conditional type for event-specific fields
export type EventSpecificFields<T extends AppEvent> = T extends MeetingEvent
    ? Pick<MeetingEvent, 'location' | 'attendees' | 'agenda' | 'duration'>
    : T extends TaskEvent
    ? Pick<TaskEvent, 'priority' | 'assignee' | 'deadline' | 'completed' | 'subtasks'>
    : T extends ReminderEvent
    ? Pick<ReminderEvent, 'reminderTime' | 'repeatInterval' | 'notifyByEmail' | 'notifyByPush'>
    : never;

// Mapped type for event statistics
export type EventStatistics = {
    [K in EventType]: number;
};

// Readonly event collection
export type ReadonlyEventCollection = Readonly<Map<string, AppEvent>>;

// Type guard functions
export function isMeetingEvent(event: AppEvent): event is MeetingEvent {
    return event.type === EventType.MEETING;
}

export function isTaskEvent(event: AppEvent): event is TaskEvent {
    return event.type === EventType.TASK;
}

export function isReminderEvent(event: AppEvent): event is ReminderEvent {
    return event.type === EventType.REMINDER;
}

// Type guard factory
export function isEventOfType<T extends AppEvent>(
    type: EventType
): (event: AppEvent) => event is T {
    return (event: AppEvent): event is T => event.type === type;
}