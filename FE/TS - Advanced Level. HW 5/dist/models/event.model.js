// Event types enum
export var EventType;
(function (EventType) {
    EventType["MEETING"] = "meeting";
    EventType["TASK"] = "task";
    EventType["REMINDER"] = "reminder";
})(EventType || (EventType = {}));
// Type guard functions
export function isMeetingEvent(event) {
    return event.type === EventType.MEETING;
}
export function isTaskEvent(event) {
    return event.type === EventType.TASK;
}
export function isReminderEvent(event) {
    return event.type === EventType.REMINDER;
}
// Type guard factory
export function isEventOfType(type) {
    return (event) => event.type === type;
}
