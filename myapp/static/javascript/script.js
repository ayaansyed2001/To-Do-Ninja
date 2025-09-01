// To-Do App JavaScript
class TodoApp {
    constructor() {
        this.tasks = [];
        this.currentFilter = 'all';
        this.editingTaskId = null;
        this.taskIdCounter = 1;
        
        this.initializeElements();
        this.loadTasksFromStorage();
        this.bindEvents();
        this.updateDisplay();
    }

    initializeElements() {
        // Form elements
        this.taskForm = document.getElementById('taskForm');
        this.taskInput = document.getElementById('taskInput');
        this.inputError = document.getElementById('inputError');
        
        // Display elements
        this.taskList = document.getElementById('taskList');
        this.emptyState = document.getElementById('emptyState');
        
        // Filter buttons
        this.filterButtons = document.querySelectorAll('[data-filter]');
        this.clearCompletedBtn = document.getElementById('clearCompleted');
        
        // Counters
        this.allCount = document.getElementById('allCount');
        this.activeCount = document.getElementById('activeCount');
        this.completedCount = document.getElementById('completedCount');
    }

    bindEvents() {
        // Form submission
        this.taskForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleAddTask();
        });

        // Input validation
        this.taskInput.addEventListener('input', () => {
            this.validateInput();
        });

        // Filter buttons
        this.filterButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.setFilter(e.target.dataset.filter);
            });
        });

        // Clear completed button
        this.clearCompletedBtn.addEventListener('click', () => {
            this.clearCompleted();
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardShortcuts(e);
        });

        // Focus task input on page load
        this.taskInput.focus();
    }

    validateInput() {
        const value = this.taskInput.value.trim();
        const isValid = value.length >= 2;
        
        this.taskInput.classList.toggle('is-invalid', !isValid && value.length > 0);
        this.inputError.classList.toggle('d-none', isValid || value.length === 0);
        
        return isValid;
    }

    handleAddTask() {
        const taskText = this.taskInput.value.trim();
        
        if (!this.validateInput()) {
            this.taskInput.focus();
            return;
        }

        if (taskText) {
            this.addTask(taskText);
            this.taskInput.value = '';
            this.taskInput.classList.remove('is-invalid');
            this.inputError.classList.add('d-none');
            this.taskInput.focus();
        }
    }

    addTask(text) {
        const task = {
            id: this.taskIdCounter++,
            text: text,
            completed: false,
            createdAt: new Date().toISOString()
        };

        this.tasks.unshift(task); // Add to beginning for newest first
        this.saveTasksToStorage();
        this.updateDisplay();
        
        // Animate new task
        setTimeout(() => {
            const taskElement = document.querySelector(`[data-task-id="${task.id}"]`);
            if (taskElement) {
                taskElement.classList.add('task-fade-in');
            }
        }, 10);
    }

    deleteTask(taskId) {
        const taskElement = document.querySelector(`[data-task-id="${taskId}"]`);
        
        if (taskElement) {
            taskElement.classList.add('task-fade-out');
            setTimeout(() => {
                this.tasks = this.tasks.filter(task => task.id !== taskId);
                this.saveTasksToStorage();
                this.updateDisplay();
            }, 300);
        }
    }

    toggleTask(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
            task.completed = !task.completed;
            this.saveTasksToStorage();
            this.updateDisplay();
        }
    }

    editTask(taskId, newText) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task && newText.trim()) {
            task.text = newText.trim();
            this.saveTasksToStorage();
            this.updateDisplay();
        }
    }

    setFilter(filter) {
        this.currentFilter = filter;
        
        // Update active button
        this.filterButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.filter === filter);
        });
        
        this.updateDisplay();
    }

    clearCompleted() {
        const completedTasks = this.tasks.filter(task => task.completed);
        
        if (completedTasks.length === 0) {
            return;
        }

        // Animate removal of completed tasks
        completedTasks.forEach(task => {
            const taskElement = document.querySelector(`[data-task-id="${task.id}"]`);
            if (taskElement) {
                taskElement.classList.add('task-fade-out');
            }
        });

        setTimeout(() => {
            this.tasks = this.tasks.filter(task => !task.completed);
            this.saveTasksToStorage();
            this.updateDisplay();
        }, 300);
    }

    getFilteredTasks() {
        switch (this.currentFilter) {
            case 'active':
                return this.tasks.filter(task => !task.completed);
            case 'completed':
                return this.tasks.filter(task => task.completed);
            default:
                return this.tasks;
        }
    }

    updateDisplay() {
        this.renderTasks();
        this.updateCounters();
        this.updateEmptyState();
    }

    renderTasks() {
        const filteredTasks = this.getFilteredTasks();
        
        this.taskList.innerHTML = filteredTasks.map(task => `
            <div class="task-item ${task.completed ? 'completed' : ''} d-flex align-items-center p-3 border rounded mb-2" 
                 data-task-id="${task.id}">
                <input type="checkbox" 
                       class="form-check-input task-checkbox" 
                       ${task.completed ? 'checked' : ''}
                       onchange="todoApp.toggleTask(${task.id})">
                
                <input type="text" 
                       class="task-text" 
                       value="${this.escapeHtml(task.text)}"
                       readonly
                       ondblclick="todoApp.startEditTask(${task.id})"
                       onblur="todoApp.finishEditTask(${task.id})"
                       onkeydown="todoApp.handleTaskKeydown(event, ${task.id})">
                
                <div class="task-actions ms-2">
                    <button class="btn-task-action btn-edit" 
                            onclick="todoApp.startEditTask(${task.id})"
                            title="Edit task">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-task-action btn-delete ms-1" 
                            onclick="todoApp.deleteTask(${task.id})"
                            title="Delete task">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }

    updateCounters() {
        const allTasks = this.tasks.length;
        const activeTasks = this.tasks.filter(task => !task.completed).length;
        const completedTasks = this.tasks.filter(task => task.completed).length;
        
        this.allCount.textContent = allTasks;
        this.activeCount.textContent = activeTasks;
        this.completedCount.textContent = completedTasks;
        
        // Disable clear completed button if no completed tasks
        this.clearCompletedBtn.disabled = completedTasks === 0;
    }

    updateEmptyState() {
        const filteredTasks = this.getFilteredTasks();
        const hasNoTasks = this.tasks.length === 0;
        const hasNoFilteredTasks = filteredTasks.length === 0 && this.tasks.length > 0;
        
        if (hasNoTasks) {
            this.emptyState.innerHTML = `
                <i class="fas fa-clipboard-list fa-3x mb-3 opacity-50"></i>
                <h5>No tasks yet</h5>
                <p>Add your first task above to get started!</p>
            `;
            this.emptyState.classList.add('show');
        } else if (hasNoFilteredTasks) {
            const filterName = this.currentFilter.charAt(0).toUpperCase() + this.currentFilter.slice(1);
            this.emptyState.innerHTML = `
                <i class="fas fa-filter fa-3x mb-3 opacity-50"></i>
                <h5>No ${filterName.toLowerCase()} tasks</h5>
                <p>Try switching to a different filter to see your tasks.</p>
            `;
            this.emptyState.classList.add('show');
        } else {
            this.emptyState.classList.remove('show');
        }
    }

    startEditTask(taskId) {
        if (this.editingTaskId && this.editingTaskId !== taskId) {
            this.finishEditTask(this.editingTaskId);
        }
        
        this.editingTaskId = taskId;
        const taskElement = document.querySelector(`[data-task-id="${taskId}"] .task-text`);
        
        if (taskElement) {
            taskElement.readOnly = false;
            taskElement.focus();
            taskElement.select();
        }
    }

    finishEditTask(taskId) {
        if (this.editingTaskId !== taskId) return;
        
        const taskElement = document.querySelector(`[data-task-id="${taskId}"] .task-text`);
        
        if (taskElement) {
            const newText = taskElement.value.trim();
            
            if (newText && newText.length >= 2) {
                this.editTask(taskId, newText);
            } else {
                // Restore original text if invalid
                const task = this.tasks.find(t => t.id === taskId);
                if (task) {
                    taskElement.value = task.text;
                }
            }
            
            taskElement.readOnly = true;
            this.editingTaskId = null;
        }
    }

    handleTaskKeydown(event, taskId) {
        if (event.key === 'Enter') {
            this.finishEditTask(taskId);
        } else if (event.key === 'Escape') {
            const taskElement = event.target;
            const task = this.tasks.find(t => t.id === taskId);
            if (task) {
                taskElement.value = task.text;
            }
            this.finishEditTask(taskId);
        }
    }

    handleKeyboardShortcuts(event) {
        // Delete key to remove selected task (when not editing)
        if (event.key === 'Delete' && !this.editingTaskId) {
            const activeElement = document.activeElement;
            if (activeElement && activeElement.classList.contains('task-text')) {
                const taskId = parseInt(activeElement.closest('.task-item').dataset.taskId);
                this.deleteTask(taskId);
            }
        }
        
        // Escape to cancel editing
        if (event.key === 'Escape' && this.editingTaskId) {
            this.finishEditTask(this.editingTaskId);
        }
    }

    saveTasksToStorage() {
        try {
            localStorage.setItem('todoAppTasks', JSON.stringify(this.tasks));
            localStorage.setItem('todoAppTaskCounter', this.taskIdCounter.toString());
        } catch (error) {
            console.error('Failed to save tasks to localStorage:', error);
        }
    }

    loadTasksFromStorage() {
        try {
            const storedTasks = localStorage.getItem('todoAppTasks');
            const storedCounter = localStorage.getItem('todoAppTaskCounter');
            
            if (storedTasks) {
                this.tasks = JSON.parse(storedTasks);
            }
            
            if (storedCounter) {
                this.taskIdCounter = parseInt(storedCounter);
            }
            
            // Ensure task counter is always higher than existing task IDs
            if (this.tasks.length > 0) {
                const maxId = Math.max(...this.tasks.map(task => task.id));
                this.taskIdCounter = Math.max(this.taskIdCounter, maxId + 1);
            }
        } catch (error) {
            console.error('Failed to load tasks from localStorage:', error);
            this.tasks = [];
            this.taskIdCounter = 1;
        }
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.todoApp = new TodoApp();
});

// Service worker registration for offline functionality (optional enhancement)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Service worker can be added later for offline functionality
    });
}
