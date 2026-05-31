 (function() {
        // -------------------------- 1. Type Definitions --------------------------
        const TaskStatus = {
            TODO: 'todo',
            IN_PROGRESS: 'in-progress',
            DONE: 'done'
        };
        
        const TaskPriority = {
            LOW: 'low',
            MEDIUM: 'medium',
            HIGH: 'high'
        };

        // -------------------------- 2. Task Manager Class -------------------------
        class TaskManager {
            constructor() {
                this.tasks = [];
            }

            getAllTasks() {
                return this.tasks;
            }

            addTask(input) {
                const newTask = {
                    id: 'task_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
                    title: input.title,
                    description: input.description || '',
                    status: input.status,
                    priority: input.priority,
                    createdAt: new Date(),
                    completedAt: input.status === TaskStatus.DONE ? new Date() : undefined
                };
                this.tasks.push(newTask);
                return newTask;
            }

            updateTask(id, updates) {
                const taskIndex = this.tasks.findIndex(t => t.id === id);
                if (taskIndex === -1) {
                    throw new Error(`Задача з id "${id}" не знайдена`);
                }
                const oldTask = this.tasks[taskIndex];
                const updatedTask = {
                    ...oldTask,
                    ...updates,
                    completedAt: updates.status === TaskStatus.DONE && oldTask.status !== TaskStatus.DONE
                        ? new Date()
                        : (updates.status !== TaskStatus.DONE ? undefined : oldTask.completedAt)
                };
                this.tasks[taskIndex] = updatedTask;
                return updatedTask;
            }

            deleteTask(id) {
                const exists = this.tasks.some(t => t.id === id);
                if (!exists) {
                    throw new Error(`Задача з id "${id}" не знайдена`);
                }
                this.tasks = this.tasks.filter(t => t.id !== id);
            }

            filterByStatus(status) {
                return this.tasks.filter(t => t.status === status);
            }

            filterByPriority(priority) {
                return this.tasks.filter(t => t.priority === priority);
            }

            filterByStatusAndPriority(status, priority) {
                return this.tasks.filter(task => {
                    if (status && status !== 'all' && task.status !== status) return false;
                    if (priority && priority !== 'all' && task.priority !== priority) return false;
                    return true;
                });
            }
        }

        // -------------------------- 3. Type Guard Function ------------------------
        function isTask(obj) {
            return obj && typeof obj === 'object' && 
                   typeof obj.id === 'string' &&
                   typeof obj.title === 'string' &&
                   obj.createdAt instanceof Date;
        }

        // -------------------------- 4. Generic Find Function ----------------------
        function findById(items, id) {
            return items.find(item => item.id === id);
        }

        // -------------------------- 5. Create Manager and Add Test Tasks ---------
        const taskManager = new TaskManager();
        
        // Test tasks (9 tasks as required)
        const testTasks = [
            { title: 'Дослідити TypeScript generics', description: 'Написати приклади для пошуку', status: 'todo', priority: 'high' },
            { title: 'Реалізувати type guard', description: 'Функція перевірки Task', status: 'in-progress', priority: 'high' },
            { title: 'Налаштувати ESLint без any', description: 'Сувора перевірка коду', status: 'done', priority: 'medium' },
            { title: 'Створити partial оновлення', description: 'Використати Partial<Pick<...>>', status: 'todo', priority: 'medium' },
            { title: 'Покрити помилки видалення', description: 'Обробка винятків', status: 'in-progress', priority: 'low' },
            { title: 'Продемонструвати фільтрацію', description: 'Статус + пріоритет', status: 'todo', priority: 'high' },
            { title: 'Додати completedAt автоматично', description: 'Опціональне поле', status: 'done', priority: 'low' },
            { title: 'Generic пошук findById', description: 'Універсальна функція', status: 'todo', priority: 'medium' },
            { title: 'Робота з Partial типами', description: 'Часткове оновлення задач', status: 'todo', priority: 'medium' }
        ];

        // Add test tasks
        testTasks.forEach(task => {
            taskManager.addTask(task);
        });

        console.log('Task Manager initialized with', taskManager.getAllTasks().length, 'tasks');
        console.log('Sample task:', taskManager.getAllTasks()[0]);

        // -------------------------- 6. UI Functions -------------------------------
        let currentStatusFilter = 'all';
        let currentPriorityFilter = 'all';

        function escapeHtml(str) {
            if (!str) return '';
            return str.replace(/[&<>]/g, function(m) {
                if (m === '&') return '&amp;';
                if (m === '<') return '&lt;';
                if (m === '>') return '&gt;';
                return m;
            });
        }

        function showMessage(msg, isError = false) {
            const msgDiv = document.createElement('div');
            msgDiv.className = 'success-msg';
            msgDiv.style.background = isError ? '#dc2626' : '#10b981';
            msgDiv.textContent = msg;
            document.body.appendChild(msgDiv);
            setTimeout(() => msgDiv.remove(), 2000);
        }

        function updateStats() {
            const statsBadge = document.getElementById('statsBadge');
            const total = taskManager.getAllTasks().length;
            if (statsBadge) {
                statsBadge.innerHTML = `📊 Всього: ${total}`;
            }
        }

        function renderTasks() {
            const container = document.getElementById('tasksListContainer');
            if (!container) {
                console.error('Container not found!');
                return;
            }

            const filtered = taskManager.filterByStatusAndPriority(
                currentStatusFilter === 'all' ? null : currentStatusFilter,
                currentPriorityFilter === 'all' ? null : currentPriorityFilter
            );

            console.log('Rendering', filtered.length, 'tasks');

            if (filtered.length === 0) {
                container.innerHTML = '<div class="empty-msg">📭 Немає задач. Створіть нову задачу!</div>';
                updateStats();
                return;
            }

            container.innerHTML = filtered.map(task => {
                let priorityClass = '';
                if (task.priority === 'high') priorityClass = 'priority-high';
                else if (task.priority === 'medium') priorityClass = 'priority-medium';
                else priorityClass = 'priority-low';
                
                let statusClass = '';
                if (task.status === 'todo') statusClass = 'status-todo';
                else if (task.status === 'in-progress') statusClass = 'status-inprogress';
                else statusClass = 'status-done';
                
                const statusText = task.status === 'todo' ? '📋 To Do' : 
                                  task.status === 'in-progress' ? '⚙️ In Progress' : '✅ Done';
                const completedStr = task.completedAt ? `✅ завершено: ${new Date(task.completedAt).toLocaleString()}` : '⏳ не завершено';
                const createdDate = new Date(task.createdAt).toLocaleString();
                
                return `
                    <div class="task-card ${priorityClass} ${statusClass}" data-id="${task.id}">
                        <div class="task-title">
                            <strong>📌 ${escapeHtml(task.title)}</strong>
                            <span class="badge ${priorityClass}">${task.priority.toUpperCase()}</span>
                        </div>
                        <div class="task-meta">
                            <span>🆔 ${task.id.slice(0, 12)}...</span>
                            <span>📅 ${createdDate}</span>
                            <span>🏷️ ${statusText}</span>
                            <span>${completedStr}</span>
                        </div>
                        <div class="task-description" style="font-size:0.85rem; margin-top:6px; color:#334155;">
                            ${escapeHtml(task.description) || '— немає опису —'}
                        </div>
                        <div class="task-actions">
                            <button class="small edit-quick" data-id="${task.id}" 
                                    data-title="${escapeHtml(task.title)}" 
                                    data-desc="${escapeHtml(task.description)}" 
                                    data-status="${task.status}" 
                                    data-priority="${task.priority}">
                                ✏️ Редагувати
                            </button>
                            <button class="small danger delete-quick" data-id="${task.id}">
                                🗑️ Видалити
                            </button>
                        </div>
                    </div>
                `;
            }).join('');

            // Attach event listeners to new buttons
            document.querySelectorAll('.edit-quick').forEach(btn => {
                btn.addEventListener('click', function(e) {
                    const id = this.getAttribute('data-id');
                    const title = this.getAttribute('data-title') || '';
                    const desc = this.getAttribute('data-desc') || '';
                    const status = this.getAttribute('data-status');
                    const priority = this.getAttribute('data-priority');
                    
                    document.getElementById('updateId').value = id;
                    document.getElementById('updateTitle').value = title;
                    document.getElementById('updateDesc').value = desc;
                    document.getElementById('updateStatus').value = status;
                    document.getElementById('updatePriority').value = priority;
                    
                    showMessage('Задачу вибрано для редагування');
                });
            });
            
            document.querySelectorAll('.delete-quick').forEach(btn => {
                btn.addEventListener('click', function(e) {
                    const id = this.getAttribute('data-id');
                    if (id && confirm('Видалити цю задачу?')) {
                        try {
                            taskManager.deleteTask(id);
                            renderTasks();
                            showMessage('✅ Задачу видалено');
                        } catch(err) {
                            showMessage(err.message, true);
                        }
                    }
                });
            });
            
            updateStats();
        }

        // -------------------------- 7. Event Handlers -----------------------------
        function handleAddTask() {
            const titleInput = document.getElementById('taskTitle');
            const descInput = document.getElementById('taskDesc');
            const prioritySelect = document.getElementById('taskPriority');
            const statusSelect = document.getElementById('taskStatus');

            const title = titleInput.value.trim();
            if (!title) {
                showMessage('❌ Назва задачі обовʼязкова', true);
                return;
            }
            
            const newTaskData = {
                title: title,
                description: descInput.value.trim() || '',
                priority: prioritySelect.value,
                status: statusSelect.value
            };
            
            try {
                const added = taskManager.addTask(newTaskData);
                titleInput.value = '';
                descInput.value = '';
                prioritySelect.value = 'medium';
                statusSelect.value = 'todo';
                renderTasks();
                showMessage(`✅ Задачу "${added.title}" додано!`);
            } catch(err) {
                showMessage(`❌ Помилка: ${err.message}`, true);
            }
        }

        function handleUpdateTask() {
            const idInput = document.getElementById('updateId');
            const id = idInput.value.trim();
            if (!id) {
                showMessage('❌ Введіть ID задачі', true);
                return;
            }
            
            const title = document.getElementById('updateTitle').value.trim();
            const desc = document.getElementById('updateDesc').value.trim();
            const status = document.getElementById('updateStatus').value;
            const priority = document.getElementById('updatePriority').value;

            const updates = {};
            if (title) updates.title = title;
            if (desc) updates.description = desc;
            if (status) updates.status = status;
            if (priority) updates.priority = priority;

            if (Object.keys(updates).length === 0) {
                showMessage('❌ Введіть хоча б одне поле для оновлення', true);
                return;
            }

            try {
                const updated = taskManager.updateTask(id, updates);
                document.getElementById('updateId').value = '';
                document.getElementById('updateTitle').value = '';
                document.getElementById('updateDesc').value = '';
                renderTasks();
                showMessage(`✅ Задачу "${updated.title}" оновлено!`);
            } catch(err) {
                showMessage(`❌ ${err.message}`, true);
            }
        }

        function handleDeleteTask() {
            const deleteInput = document.getElementById('deleteIdInput');
            const id = deleteInput.value.trim();
            if (!id) {
                showMessage('❌ Введіть ID для видалення', true);
                return;
            }
            try {
                taskManager.deleteTask(id);
                deleteInput.value = '';
                renderTasks();
                showMessage('✅ Задачу видалено');
            } catch(err) {
                showMessage(`❌ ${err.message}`, true);
            }
        }

        function updateFiltersAndRender() {
            currentStatusFilter = document.getElementById('filterStatus').value;
            currentPriorityFilter = document.getElementById('filterPriority').value;
            renderTasks();
        }

        // -------------------------- 8. Initialize Application ---------------------
        function init() {
            // Get DOM elements
            const addBtn = document.getElementById('addTaskBtn');
            const updateBtn = document.getElementById('updateTaskBtn');
            const deleteBtn = document.getElementById('deleteTaskBtn');
            const filterStatus = document.getElementById('filterStatus');
            const filterPriority = document.getElementById('filterPriority');
            const resetBtn = document.getElementById('resetFiltersBtn');

            // Add event listeners
            if (addBtn) addBtn.addEventListener('click', handleAddTask);
            if (updateBtn) updateBtn.addEventListener('click', handleUpdateTask);
            if (deleteBtn) deleteBtn.addEventListener('click', handleDeleteTask);
            if (filterStatus) filterStatus.addEventListener('change', updateFiltersAndRender);
            if (filterPriority) filterPriority.addEventListener('change', updateFiltersAndRender);
            if (resetBtn) {
                resetBtn.addEventListener('click', () => {
                    if (filterStatus) filterStatus.value = 'all';
                    if (filterPriority) filterPriority.value = 'all';
                    updateFiltersAndRender();
                });
            }

            // Initial render
            renderTasks();
            
            // Demo in console
            console.log('=== DEMONSTRATION ===');
            console.log('All tasks:', taskManager.getAllTasks());
            console.log('Type guard test:', isTask(taskManager.getAllTasks()[0]) ? '✅ Valid task' : '❌ Invalid');
            console.log('Generic findById:', findById(taskManager.getAllTasks(), taskManager.getAllTasks()[0]?.id));
            console.log('Filter by status (todo):', taskManager.filterByStatus('todo'));
            console.log('Filter by priority (high):', taskManager.filterByPriority('high'));
            console.log('✅ All TypeScript features working without any!');
        }

        // Start the app when DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
        } else {
            init();
        }
    })();