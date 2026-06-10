import { EventManager, EventNotFoundError, InvalidEventDataError } from './services/event-manager.service.js';
import { EventType, isMeetingEvent, isTaskEvent, isReminderEvent } from './models/event.model.js';
import { sortEventsByDate } from './utils/helpers.js';
class EventApp {
    constructor() {
        this.eventManager = new EventManager();
        this.initializeDemoEvents();
        this.setupEventListeners();
        this.render();
    }
    initializeDemoEvents() {
        // Перевіряємо чи вже є події, щоб не дублювати
        if (this.eventManager.getAllEvents().length > 0) {
            return;
        }
        // Meeting Events
        const meeting1 = {
            title: 'Team Sync',
            description: 'Weekly team synchronization meeting',
            date: new Date('2026-06-15T10:00:00'),
            type: EventType.MEETING,
            location: 'Conference Room A',
            attendees: ['john@example.com', 'jane@example.com', 'bob@example.com'],
            agenda: 'Sprint planning, Bug triage, Demo preparation',
            duration: 60
        };
        const meeting2 = {
            title: 'Client Presentation',
            description: 'Present Q3 results to client',
            date: new Date('2026-06-20T14:00:00'),
            type: EventType.MEETING,
            location: 'Virtual (Zoom)',
            attendees: ['client@company.com', 'team@example.com'],
            agenda: 'Quarter review, Future roadmap',
            duration: 90
        };
        const meeting3 = {
            title: 'Design Review',
            description: 'Review new UI/UX designs',
            date: new Date('2026-06-18T15:30:00'),
            type: EventType.MEETING,
            location: 'Design Studio',
            attendees: ['designer@example.com', 'dev@example.com'],
            agenda: 'New component library, User feedback integration',
            duration: 45
        };
        // Task Events
        const task1 = {
            title: 'Implement Authentication',
            description: 'Add OAuth2 authentication to the app',
            date: new Date('2026-06-10T09:00:00'),
            type: EventType.TASK,
            priority: 'high',
            assignee: 'developer@example.com',
            deadline: new Date('2026-06-20T18:00:00'),
            completed: false,
            subtasks: ['Setup OAuth provider', 'Implement login flow', 'Add token refresh']
        };
        const task2 = {
            title: 'Write Documentation',
            description: 'Create API documentation for the new features',
            date: new Date('2026-06-12T11:00:00'),
            type: EventType.TASK,
            priority: 'medium',
            assignee: 'writer@example.com',
            deadline: new Date('2026-06-25T17:00:00'),
            completed: false,
            subtasks: ['API endpoints', 'Setup guide', 'FAQ section']
        };
        const task3 = {
            title: 'Fix Critical Bug',
            description: 'Memory leak in event manager',
            date: new Date('2026-06-11T13:00:00'),
            type: EventType.TASK,
            priority: 'high',
            assignee: 'senior-dev@example.com',
            deadline: new Date('2026-06-13T20:00:00'),
            completed: true,
            subtasks: ['Profile memory usage', 'Fix leak', 'Write tests']
        };
        // Reminder Events
        const reminder1 = {
            title: 'Submit Timesheet',
            description: 'Weekly timesheet submission',
            date: new Date('2026-06-14T17:00:00'),
            type: EventType.REMINDER,
            reminderTime: new Date('2026-06-14T16:00:00'),
            repeatInterval: 'weekly',
            notifyByEmail: true,
            notifyByPush: true
        };
        const reminder2 = {
            title: 'Doctor Appointment',
            description: 'Annual check-up',
            date: new Date('2026-06-22T09:30:00'),
            type: EventType.REMINDER,
            reminderTime: new Date('2026-06-22T08:00:00'),
            repeatInterval: 'never',
            notifyByEmail: true,
            notifyByPush: true
        };
        const reminder3 = {
            title: 'Project Deadline',
            description: 'Final submission for project',
            date: new Date('2026-06-30T23:59:00'),
            type: EventType.REMINDER,
            reminderTime: new Date('2026-06-29T10:00:00'),
            repeatInterval: 'daily',
            notifyByEmail: true,
            notifyByPush: false
        };
        // Add all events
        const events = [meeting1, meeting2, meeting3, task1, task2, task3, reminder1, reminder2, reminder3];
        events.forEach(event => {
            try {
                this.eventManager.addEvent(event);
                console.log('Event added successfully:', event.title);
            }
            catch (error) {
                console.error('Failed to add event:', error);
            }
        });
        console.log('Total events after initialization:', this.eventManager.getAllEvents().length);
    }
    render() {
        const container = document.getElementById('events-container');
        if (!container) {
            console.error('Events container not found');
            return;
        }
        const allEvents = this.eventManager.getAllEvents();
        console.log('Rendering events:', allEvents.length);
        const sortedEvents = sortEventsByDate(allEvents);
        const stats = this.eventManager.getStatistics();
        // Update statistics
        this.updateStats(stats);
        // Render events
        if (sortedEvents.length === 0) {
            container.innerHTML = '<div class="no-events">No events found. Click "Add New Event" to create one!</div>';
        }
        else {
            container.innerHTML = sortedEvents.map(event => this.createEventCard(event)).join('');
        }
    }
    updateStats(stats) {
        const statsContainer = document.getElementById('stats-container');
        if (statsContainer) {
            const total = stats[EventType.MEETING] + stats[EventType.TASK] + stats[EventType.REMINDER];
            statsContainer.innerHTML = `
                <div class="stat-card">
                    <h3>📊 Statistics</h3>
                    <p>📅 Meetings: ${stats[EventType.MEETING]}</p>
                    <p>✅ Tasks: ${stats[EventType.TASK]}</p>
                    <p>⏰ Reminders: ${stats[EventType.REMINDER]}</p>
                    <p>📈 Total: ${total}</p>
                </div>
            `;
        }
    }
    createEventCard(event) {
        let specificInfo = '';
        if (isMeetingEvent(event)) {
            specificInfo = `
                <div class="event-specific">
                    <p>📍 Location: ${event.location}</p>
                    <p>👥 Attendees: ${event.attendees.length}</p>
                    <p>⏱️ Duration: ${event.duration} min</p>
                    <p>📋 Agenda: ${event.agenda.substring(0, 50)}${event.agenda.length > 50 ? '...' : ''}</p>
                </div>
            `;
        }
        else if (isTaskEvent(event)) {
            const priorityClass = `priority-${event.priority}`;
            specificInfo = `
                <div class="event-specific">
                    <p>⚡ Priority: <span class="${priorityClass}">${event.priority}</span></p>
                    <p>👤 Assignee: ${event.assignee}</p>
                    <p>📅 Deadline: ${event.deadline.toLocaleDateString()}</p>
                    <p>✅ Status: ${event.completed ? 'Completed' : 'Pending'}</p>
                    ${event.subtasks.length > 0 ? `<p>📝 Subtasks: ${event.subtasks.length}</p>` : ''}
                </div>
            `;
        }
        else if (isReminderEvent(event)) {
            specificInfo = `
                <div class="event-specific">
                    <p>⏰ Reminder: ${event.reminderTime.toLocaleString()}</p>
                    <p>🔄 Repeat: ${event.repeatInterval || 'Never'}</p>
                    <p>📧 Email: ${event.notifyByEmail ? 'Yes' : 'No'}</p>
                    <p>📱 Push: ${event.notifyByPush ? 'Yes' : 'No'}</p>
                </div>
            `;
        }
        return `
            <div class="event-card" data-id="${event.id}">
                <div class="event-header">
                    <h3>${this.escapeHtml(event.title)}</h3>
                    <span class="event-type ${event.type}">${event.type}</span>
                </div>
                <p class="event-description">${this.escapeHtml(event.description)}</p>
                <p class="event-date">📅 ${event.date.toLocaleString()}</p>
                <p class="event-created">🆔 Created: ${event.createdAt.toLocaleDateString()}</p>
                ${specificInfo}
                <div class="event-actions">
                    <button class="btn-delete" data-id="${event.id}">🗑️ Delete</button>
                    ${isTaskEvent(event) ? `<button class="btn-update" data-id="${event.id}">${event.completed ? '🔄 Reopen' : '✅ Complete'}</button>` : ''}
                </div>
            </div>
        `;
    }
    escapeHtml(str) {
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }
    setupEventListeners() {
        console.log('Setting up event listeners');
        const container = document.getElementById('events-container');
        if (!container) {
            console.error('Events container not found');
            return;
        }
        container.addEventListener('click', (e) => {
            const target = e.target;
            if (target.classList.contains('btn-delete')) {
                e.stopPropagation();
                const id = target.getAttribute('data-id');
                console.log('Delete button clicked for id:', id);
                if (id) {
                    if (confirm('Are you sure you want to delete this event?')) {
                        try {
                            this.eventManager.removeEvent(id);
                            this.render();
                            this.showNotification('Event deleted successfully!', 'success');
                        }
                        catch (error) {
                            if (error instanceof EventNotFoundError) {
                                this.showNotification(error.message, 'error');
                            }
                            else {
                                this.showNotification('Failed to delete event', 'error');
                            }
                        }
                    }
                }
            }
            if (target.classList.contains('btn-update')) {
                e.stopPropagation();
                const id = target.getAttribute('data-id');
                console.log('Update button clicked for id:', id);
                if (id) {
                    const event = this.eventManager.getEventById(id);
                    if (event && isTaskEvent(event)) {
                        const update = { completed: !event.completed };
                        try {
                            this.eventManager.updateEvent(id, update);
                            this.render();
                            this.showNotification(`Task marked as ${!event.completed ? 'completed' : 'reopened'}!`, 'success');
                        }
                        catch (error) {
                            console.error('Update error:', error);
                            this.showNotification('Failed to update event', 'error');
                        }
                    }
                }
            }
        });
        // Add event form
        const addButton = document.getElementById('add-event-btn');
        if (addButton) {
            console.log('Add button found');
            addButton.addEventListener('click', () => {
                console.log('Add button clicked');
                this.showAddEventForm();
            });
        }
        else {
            console.error('Add button not found');
        }
        // Filter buttons
        const filterAll = document.getElementById('filter-all');
        const filterMeeting = document.getElementById('filter-meeting');
        const filterTask = document.getElementById('filter-task');
        const filterReminder = document.getElementById('filter-reminder');
        if (filterAll) {
            filterAll.addEventListener('click', () => {
                console.log('Filter all clicked');
                this.filterEvents('all');
            });
        }
        if (filterMeeting) {
            filterMeeting.addEventListener('click', () => {
                console.log('Filter meeting clicked');
                this.filterEvents(EventType.MEETING);
            });
        }
        if (filterTask) {
            filterTask.addEventListener('click', () => {
                console.log('Filter task clicked');
                this.filterEvents(EventType.TASK);
            });
        }
        if (filterReminder) {
            filterReminder.addEventListener('click', () => {
                console.log('Filter reminder clicked');
                this.filterEvents(EventType.REMINDER);
            });
        }
    }
    filterEvents(type) {
        const container = document.getElementById('events-container');
        if (!container)
            return;
        let events;
        if (type === 'all') {
            events = this.eventManager.getAllEvents();
        }
        else {
            events = this.eventManager.getEventsByType(type);
        }
        console.log(`Filtered events (${type}):`, events.length);
        const sortedEvents = sortEventsByDate(events);
        if (sortedEvents.length === 0) {
            container.innerHTML = '<div class="no-events">No events found for this filter.</div>';
        }
        else {
            container.innerHTML = sortedEvents.map(event => this.createEventCard(event)).join('');
        }
    }
    showAddEventForm() {
        console.log('Showing add event form');
        // Remove existing modal if any
        const existingModal = document.getElementById('event-form-modal');
        if (existingModal) {
            existingModal.remove();
        }
        const formHtml = `
            <div id="event-form-modal" class="modal">
                <div class="modal-content">
                    <span class="close">&times;</span>
                    <h2>Add New Event</h2>
                    <form id="event-form">
                        <input type="text" id="title" placeholder="Title" required>
                        <textarea id="description" placeholder="Description" required></textarea>
                        <input type="datetime-local" id="date" required>
                        <select id="event-type" required>
                            <option value="meeting">Meeting</option>
                            <option value="task">Task</option>
                            <option value="reminder">Reminder</option>
                        </select>
                        <div id="dynamic-fields"></div>
                        <button type="submit">Add Event</button>
                    </form>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', formHtml);
        const modal = document.getElementById('event-form-modal');
        const typeSelect = document.getElementById('event-type');
        const dynamicFields = document.getElementById('dynamic-fields');
        const updateDynamicFields = () => {
            if (!dynamicFields)
                return;
            const type = typeSelect.value;
            if (type === 'meeting') {
                dynamicFields.innerHTML = `
                    <input type="text" id="location" placeholder="Location" required>
                    <input type="number" id="duration" placeholder="Duration (minutes)" required>
                    <input type="text" id="attendees" placeholder="Attendees (comma-separated)">
                    <textarea id="agenda" placeholder="Agenda"></textarea>
                `;
            }
            else if (type === 'task') {
                dynamicFields.innerHTML = `
                    <select id="priority" required>
                        <option value="low">Low Priority</option>
                        <option value="medium">Medium Priority</option>
                        <option value="high">High Priority</option>
                    </select>
                    <input type="text" id="assignee" placeholder="Assignee" required>
                    <input type="datetime-local" id="deadline" required>
                `;
            }
            else if (type === 'reminder') {
                dynamicFields.innerHTML = `
                    <input type="datetime-local" id="reminderTime" required>
                    <select id="repeatInterval">
                        <option value="never">Never</option>
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                    </select>
                    <label><input type="checkbox" id="notifyByEmail"> Notify by Email</label>
                    <label><input type="checkbox" id="notifyByPush"> Notify by Push</label>
                `;
            }
        };
        typeSelect?.addEventListener('change', updateDynamicFields);
        updateDynamicFields();
        const form = document.getElementById('event-form');
        form?.addEventListener('submit', (e) => {
            e.preventDefault();
            const title = document.getElementById('title').value;
            const description = document.getElementById('description').value;
            const date = new Date(document.getElementById('date').value);
            const type = typeSelect.value;
            let eventData = { title, description, date, type };
            if (type === EventType.MEETING) {
                eventData.location = document.getElementById('location').value;
                eventData.duration = parseInt(document.getElementById('duration').value);
                const attendeesStr = document.getElementById('attendees').value;
                eventData.attendees = attendeesStr ? attendeesStr.split(',').map(a => a.trim()) : [];
                eventData.agenda = document.getElementById('agenda').value || '';
            }
            else if (type === EventType.TASK) {
                eventData.priority = document.getElementById('priority').value;
                eventData.assignee = document.getElementById('assignee').value;
                eventData.deadline = new Date(document.getElementById('deadline').value);
                eventData.completed = false;
                eventData.subtasks = [];
            }
            else if (type === EventType.REMINDER) {
                eventData.reminderTime = new Date(document.getElementById('reminderTime').value);
                eventData.repeatInterval = document.getElementById('repeatInterval').value;
                eventData.notifyByEmail = document.getElementById('notifyByEmail').checked;
                eventData.notifyByPush = document.getElementById('notifyByPush').checked;
            }
            try {
                this.eventManager.addEvent(eventData);
                this.render();
                this.showNotification('Event added successfully!', 'success');
                modal?.remove();
            }
            catch (error) {
                if (error instanceof InvalidEventDataError) {
                    this.showNotification(error.message, 'error');
                }
                else {
                    this.showNotification('Failed to add event', 'error');
                }
            }
        });
        const closeBtn = modal?.querySelector('.close');
        closeBtn?.addEventListener('click', () => modal?.remove());
        // Click outside to close
        modal?.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }
    showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}
// Initialize the app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        console.log('DOM loaded, initializing app...');
        new EventApp();
    });
}
else {
    console.log('DOM already loaded, initializing app...');
    new EventApp();
}
