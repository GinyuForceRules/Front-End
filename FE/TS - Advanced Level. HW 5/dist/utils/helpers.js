import { isMeetingEvent, isTaskEvent, isReminderEvent } from '../models/event.model.js';
// Generic function to find element by id (with generic constraint)
export function findEventById(events, id) {
    return events.find(event => event.id === id);
}
// Generic function with constraints
export function getEventProperty(event, property) {
    return event[property];
}
// Type-safe event formatter
export function formatEventDetails(event) {
    let details = `${event.title} (${event.type}): ${event.description}\n`;
    details += `Date: ${event.date.toLocaleString()}\n`;
    if (isMeetingEvent(event)) {
        details += `Location: ${event.location}\n`;
        details += `Attendees: ${event.attendees.join(', ')}\n`;
        details += `Duration: ${event.duration} minutes\n`;
    }
    else if (isTaskEvent(event)) {
        details += `Priority: ${event.priority}\n`;
        details += `Assignee: ${event.assignee}\n`;
        details += `Deadline: ${event.deadline.toLocaleString()}\n`;
        details += `Status: ${event.completed ? 'Completed' : 'Pending'}\n`;
    }
    else if (isReminderEvent(event)) {
        details += `Reminder at: ${event.reminderTime.toLocaleString()}\n`;
        details += `Repeat: ${event.repeatInterval || 'never'}\n`;
    }
    return details;
}
// Batch operation helper
export function batchProcessEvents(events, processor) {
    return events.map(processor);
}
// Sort events by date
export function sortEventsByDate(events) {
    return [...events].sort((a, b) => a.date.getTime() - b.date.getTime());
}
