
// Enhanced To-Do App JavaScript with improved interactivity
class TodoApp {
    constructor() {
        this.tasks = [];
        this.currentFilter = 'all';
        this.editingTaskId = null;
        this.taskIdCounter = 1;
        this.isLoading = false;
        
        this.initializeElements();
        this.loadTasksFromStorage();
        this.bindEvents();
        this.updateDisplay();
        this.initializeInteractivity();
    }

    initializeElements() {
        // Form elements
        this.taskForm = document.getElementById('taskForm');
        this.taskInput = document.getElementById('taskInput');
        this.inputError = document.getElementById('inputError');
        
        // Display elements
        this.taskList = document.getElementById('taskList');
        this.emptyState = document.getElementById('emptyState');
        this.loadingOverlay = document.getElementById('loadingOverlay');
        
        // Filter buttons
        this.filterButtons = document.querySelectorAll('[data-filter]');
        this.clearCompletedBtn = document.getElementById('clearCompleted');
        
        // Counters
        this.allCount = document.getElementById('allCount');
        this.activeCount = document.getElementById('activeCount');
        this.completedCount = document.getElementById('completedCount');
    }

    initializeInteractivity() {
        // Initialize tooltips
        this.initializeTooltips();
        
        // Initialize smooth scrolling
        this.initializeSmoothScrolling();
        
        // Initialize keyboard shortcuts
        this.initializeKeyboardShortcuts();
        
        // Initialize drag and drop (future enhancement)
        this.initializeDragDrop();
        
        // Initialize theme persistence
        this.initializeTheme();
        
        // Initialize progressive enhancement
        this.enhanceProgressively();
    }

    initializeTooltips() {
        if (typeof bootstrap !== 'undefined') {
            const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
            this.tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
                return new bootstrap.Tooltip(tooltipTriggerEl, {
                    animation: true,
                    delay: { show: 500, hide: 100 }
                });
            });
        }
    }

    initializeSmoothScrolling() {
        // Add smooth scrolling to all anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    initializeKeyboardShortcuts() {
        // Global keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + Enter to add task (when input is focused)
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && this.taskInput === document.activeElement) {
                this.handleAddTask();
            }
            
            // Escape to clear input
            if (e.key === 'Escape' && this.taskInput === document.activeElement) {
                this.taskInput.value = '';
                this.taskInput.blur();
            }
            
            // Filter shortcuts
            if (e.altKey) {
                switch(e.key) {
                    case 'a':
                        e.preventDefault();
                        this.setFilter('all');
                        break;
                    case 's':
                        e.preventDefault();
                        this.setFilter('active');
                        break;
                    case 'd':
                        e.preventDefault();
                        this.setFilter('completed');
                        break;
                }
            }
        });
    }

    initializeDragDrop() {
        // Placeholder for future drag and drop functionality
        console.log('Drag and drop initialized (placeholder)');
    }

    initializeTheme() {
        // Theme preference persistence
        const savedTheme = localStorage.getItem('todoAppTheme');
        if (savedTheme) {
            document.documentElement.setAttribute('data-bs-theme', savedTheme);
        }
    }

    enhanceProgressively() {
        // Add progressive enhancement features
        this.addRippleEffect();
        this.addLoadingStates();
        this.addVisualFeedback();
    }

    addRippleEffect() {
        // Add ripple effect to buttons
        document.querySelectorAll('.btn').forEach(button => {
            button.addEventListener('click', function(e) {
                const ripple = document.createElement('span');
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.width = ripple.style.height = size + 'px';
                ripple.style.left = x + 'px';
                ripple.style.top = y + 'px';
                ripple.classList.add('ripple');
                
                this.appendChild(ripple);
                
                setTimeout(() => {
                    ripple.remove();
                }, 600);
            });
        });
    }

    addLoadingStates() {
        // Add loading states to form submissions
        document.querySelectorAll('form').forEach(form => {
            form.addEventListener('submit', () => {
                this.showLoading();
            });
        });
        
        // Add loading states to navigation
        document.querySelectorAll('a[href]').forEach(link => {
            link.addEventListener('click', (e) => {
                if (!link.href.includes('#') && !link.href.includes('javascript:')) {
                    this.showLoading();
                }
            });
        });
    }

    addVisualFeedback() {
        // Add visual feedback for interactions
        document.querySelectorAll('.task-card').forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.borderColor = 'rgba(13, 110, 253, 0.3)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.borderColor = 'rgba(255, 255, 255, 0.1)';
            });
        });
    }

    showLoading() {
        if (this.loadingOverlay) {
            this.loadingOverlay.style.display = 'flex';
        }
    }

    hideLoading() {
        if (this.loadingOverlay) {
            this.loadingOverlay.style.display = 'none';
        }
    }

    bindEvents() {
        // Form submission
        if (this.taskForm) {
            this.taskForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleAddTask();
            });
        }

        // Input validation with debouncing
        if (this.taskInput) {
            let debounceTimer;
            this.taskInput.addEventListener('input', () => {
                clearTimeout(debounceTimer);
                debounceTimer = setTimeout(() => {
                    this.validateInput();
                }, 300);
            });

            // Enhanced input interactions
            this.taskInput.addEventListener('focus', () => {
                this.taskInput.parentElement.classList.add('input-focused');
            });

            this.taskInput.addEventListener('blur', () => {
                this.taskInput.parentElement.classList.remove('input-focused');
            });
        }

        // Filter buttons with enhanced feedback
        this.filterButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.setFilterWithAnimation(e.target.dataset.filter);
            });
        });

        // Clear completed with confirmation
        if (this.clearCompletedBtn) {
            this.clearCompletedBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.confirmClearCompleted();
            });
        }

        // Enhanced window events
        window.addEventListener('beforeunload', () => {
            this.saveTasksToStorage();
        });

        // Focus task input on page load
        if (this.taskInput) {
            setTimeout(() => {
                this.taskInput.focus();
            }, 500);
        }
    }

    setFilterWithAnimation(filter) {
        // Add loading animation
        this.showLoading();
        
        // Animate filter change
        const taskCards = document.querySelectorAll('.task-card');
        taskCards.forEach((card, index) => {
            setTimeout(() => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(-20px)';
            }, index * 50);
        });

        setTimeout(() => {
            this.setFilter(filter);
            this.hideLoading();
        }, 300);
    }

    confirmClearCompleted() {
        const completedCount = this.tasks.filter(task => task.completed).length;
        
        if (completedCount === 0) {
            this.showNotification('No completed tasks to clear', 'info');
            return;
        }

        if (confirm(`Are you sure you want to clear ${completedCount} completed task${completedCount > 1 ? 's' : ''}?`)) {
            this.clearCompleted();
        }
    }

    showNotification(message, type = 'info') {
        // Create toast notification
        const toast = document.createElement('div');
        toast.className = `toast position-fixed top-0 end-0 m-3`;
        toast.setAttribute('role', 'alert');
        toast.style.zIndex = '9999';
        
        toast.innerHTML = `
            <div class="toast-header bg-${type} text-white">
                <i class="fas fa-info-circle me-2"></i>
                <strong class="me-auto">Todo App</strong>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast"></button>
            </div>
            <div class="toast-body">
                ${message}
            </div>
        `;
        
        document.body.appendChild(toast);
        
        if (typeof bootstrap !== 'undefined') {
            const bsToast = new bootstrap.Toast(toast);
            bsToast.show();
            
            toast.addEventListener('hidden.bs.toast', () => {
                toast.remove();
            });
        }
    }

    validateInput() {
        if (!this.taskInput) return true;
        
        const value = this.taskInput.value.trim();
        const isValid = value.length >= 2;
        
        this.taskInput.classList.toggle('is-invalid', !isValid && value.length > 0);
        
        if (this.inputError) {
            this.inputError.classList.toggle('d-none', isValid || value.length === 0);
        }
        
        // Add visual feedback
        if (isValid && value.length > 0) {
            this.taskInput.classList.add('is-valid');
        } else {
            this.taskInput.classList.remove('is-valid');
        }
        
        return isValid;
    }

    handleAddTask() {
        if (!this.taskInput) return;
        
        const taskText = this.taskInput.value.trim();
        
        if (!this.validateInput()) {
            this.taskInput.focus();
            this.showNotification('Task must be at least 2 characters long', 'warning');
            return;
        }

        if (taskText) {
            this.addTask(taskText);
            this.taskInput.value = '';
            this.taskInput.classList.remove('is-invalid', 'is-valid');
            if (this.inputError) {
                this.inputError.classList.add('d-none');
            }
            this.taskInput.focus();
            this.showNotification('Task added successfully!', 'success');
        }
    }

    addTask(text) {
        const task = {
            id: this.taskIdCounter++,
            text: text,
            completed: false,
            createdAt: new Date().toISOString()
        };

        this.tasks.unshift(task);
        this.saveTasksToStorage();
        this.updateDisplayWithAnimation();
        
        // Enhanced animation for new task
        setTimeout(() => {
            const taskElement = document.querySelector(`[data-task-id="${task.id}"]`);
            if (taskElement) {
                taskElement.classList.add('task-slide-in');
                taskElement.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'nearest' 
                });
            }
        }, 100);
    }

    deleteTask(taskId) {
        const taskElement = document.querySelector(`[data-task-id="${taskId}"]`);
        
        if (taskElement) {
            taskElement.classList.add('task-slide-out');
            setTimeout(() => {
                this.tasks = this.tasks.filter(task => task.id !== taskId);
                this.saveTasksToStorage();
                this.updateDisplay();
                this.showNotification('Task deleted', 'info');
            }, 300);
        }
    }

    toggleTask(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
            task.completed = !task.completed;
            this.saveTasksToStorage();
            this.updateDisplayWithAnimation();
            
            const message = task.completed ? 'Task completed! 🎉' : 'Task marked as pending';
            const type = task.completed ? 'success' : 'info';
            this.showNotification(message, type);
        }
    }

    updateDisplayWithAnimation() {
        const currentTasks = document.querySelectorAll('.task-card');
        
        // Fade out current tasks
        currentTasks.forEach((task, index) => {
            setTimeout(() => {
                task.style.opacity = '0';
                task.style.transform = 'translateY(-10px)';
            }, index * 50);
        });

        // Update display after animation
        setTimeout(() => {
            this.updateDisplay();
            
            // Fade in new tasks
            const newTasks = document.querySelectorAll('.task-card');
            newTasks.forEach((task, index) => {
                task.style.opacity = '0';
                task.style.transform = 'translateY(10px)';
                
                setTimeout(() => {
                    task.style.transition = 'all 0.3s ease';
                    task.style.opacity = '1';
                    task.style.transform = 'translateY(0)';
                }, index * 100);
            });
        }, 200);
    }

    setFilter(filter) {
        this.currentFilter = filter;
        
        // Update active button with animation
        this.filterButtons.forEach(btn => {
            const isActive = btn.dataset.filter === filter;
            btn.classList.toggle('active', isActive);
            
            if (isActive) {
                btn.style.transform = 'scale(1.05)';
                setTimeout(() => {
                    btn.style.transform = '';
                }, 200);
            }
        });
        
        this.updateDisplay();
        
        // Update URL without reload
        const url = new URL(window.location);
        url.searchParams.set('filter', filter);
        window.history.pushState({}, '', url);
    }

    clearCompleted() {
        const completedTasks = this.tasks.filter(task => task.completed);
        
        if (completedTasks.length === 0) {
            this.showNotification('No completed tasks to clear', 'info');
            return;
        }

        // Enhanced animation for clearing completed tasks
        completedTasks.forEach((task, index) => {
            const taskElement = document.querySelector(`[data-task-id="${task.id}"]`);
            if (taskElement) {
                setTimeout(() => {
                    taskElement.classList.add('task-clear-out');
                }, index * 100);
            }
        });

        setTimeout(() => {
            this.tasks = this.tasks.filter(task => !task.completed);
            this.saveTasksToStorage();
            this.updateDisplay();
            this.showNotification(`Cleared ${completedTasks.length} completed task${completedTasks.length > 1 ? 's' : ''}`, 'success');
        }, 500);
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
        this.updateProgressBar();
    }

    updateProgressBar() {
        const progressBar = document.querySelector('.progress-bar');
        if (progressBar && this.tasks.length > 0) {
            const completedCount = this.tasks.filter(task => task.completed).length;
            const percentage = Math.round((completedCount / this.tasks.length) * 100);
            
            setTimeout(() => {
                progressBar.style.width = percentage + '%';
                progressBar.setAttribute('aria-valuenow', percentage);
            }, 100);
        }
    }

    renderTasks() {
        if (!this.taskList) return;
        
        const filteredTasks = this.getFilteredTasks();
        
        this.taskList.innerHTML = filteredTasks.map(task => `
            <div class="task-card ${task.completed ? 'task-completed' : ''}" 
                 data-task-id="${task.id}">
                <div class="task-content">
                    <div class="task-header d-flex align-items-start justify-content-between mb-3">
                        <div class="task-info flex-grow-1">
                            <h6 class="task-title mb-2 ${task.completed ? 'text-decoration-line-through text-muted' : ''}">
                                ${this.escapeHtml(task.text)}
                            </h6>
                            <div class="task-meta">
                                <small class="text-muted d-flex align-items-center mb-1">
                                    <i class="fas fa-calendar-plus me-2"></i>
                                    Created: ${new Date(task.createdAt).toLocaleDateString()}
                                </small>
                            </div>
                        </div>
                        
                        <div class="task-status">
                            ${task.completed ? 
                                '<span class="badge bg-success"><i class="fas fa-check me-1"></i>Completed</span>' :
                                '<span class="badge bg-warning"><i class="fas fa-clock me-1"></i>Pending</span>'
                            }
                        </div>
                    </div>

                    <div class="task-actions d-flex gap-2 justify-content-end">
                        <button class="btn btn-sm ${task.completed ? 'btn-outline-warning' : 'btn-outline-success'} btn-action-hover" 
                                onclick="todoApp.toggleTask(${task.id})"
                                data-bs-toggle="tooltip" 
                                title="${task.completed ? 'Mark as pending' : 'Mark as completed'}">
                            <i class="fas fa-${task.completed ? 'undo' : 'check'} me-1"></i>
                            <span class="d-none d-sm-inline">${task.completed ? 'Undo' : 'Complete'}</span>
                        </button>
                        
                        <button class="btn btn-sm btn-outline-info btn-action-hover" 
                                onclick="todoApp.startEditTask(${task.id})"
                                data-bs-toggle="tooltip" 
                                title="Edit task">
                            <i class="fas fa-edit me-1"></i>
                            <span class="d-none d-sm-inline">Edit</span>
                        </button>
                        
                        <button class="btn btn-sm btn-outline-danger btn-action-hover" 
                                onclick="todoApp.deleteTask(${task.id})"
                                data-bs-toggle="tooltip" 
                                title="Delete task">
                            <i class="fas fa-trash me-1"></i>
                            <span class="d-none d-sm-inline">Delete</span>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
        
        // Reinitialize tooltips for new elements
        this.initializeTooltips();
    }

    updateCounters() {
        if (!this.allCount) return;
        
        const allTasks = this.tasks.length;
        const activeTasks = this.tasks.filter(task => !task.completed).length;
        const completedTasks = this.tasks.filter(task => task.completed).length;
        
        // Animate counter updates
        this.animateCounterUpdate(this.allCount, allTasks);
        this.animateCounterUpdate(this.activeCount, activeTasks);
        this.animateCounterUpdate(this.completedCount, completedTasks);
        
        // Update clear button state
        if (this.clearCompletedBtn) {
            this.clearCompletedBtn.disabled = completedTasks === 0;
        }
    }

    animateCounterUpdate(element, newValue) {
        const currentValue = parseInt(element.textContent) || 0;
        
        if (currentValue !== newValue) {
            element.style.transform = 'scale(1.2)';
            element.style.color = 'var(--bs-info)';
            
            setTimeout(() => {
                element.textContent = newValue;
                element.style.transform = 'scale(1)';
                element.style.color = '';
            }, 150);
        }
    }

    updateEmptyState() {
        if (!this.emptyState) return;
        
        const filteredTasks = this.getFilteredTasks();
        const hasNoTasks = this.tasks.length === 0;
        const hasNoFilteredTasks = filteredTasks.length === 0 && this.tasks.length > 0;
        
        if (hasNoTasks || hasNoFilteredTasks) {
            this.emptyState.style.display = 'block';
            this.emptyState.style.opacity = '0';
            
            setTimeout(() => {
                this.emptyState.style.opacity = '1';
            }, 100);
        } else {
            this.emptyState.style.display = 'none';
        }
    }

    startEditTask(taskId) {
        console.log('Edit task:', taskId);
        // Placeholder for edit functionality
        this.showNotification('Edit functionality coming soon!', 'info');
    }

    saveTasksToStorage() {
        try {
            localStorage.setItem('todoAppTasks', JSON.stringify(this.tasks));
            localStorage.setItem('todoAppTaskCounter', this.taskIdCounter.toString());
            localStorage.setItem('todoAppFilter', this.currentFilter);
        } catch (error) {
            console.error('Failed to save tasks to localStorage:', error);
            this.showNotification('Failed to save tasks', 'danger');
        }
    }

    loadTasksFromStorage() {
        try {
            const storedTasks = localStorage.getItem('todoAppTasks');
            const storedCounter = localStorage.getItem('todoAppTaskCounter');
            const storedFilter = localStorage.getItem('todoAppFilter');
            
            if (storedTasks) {
                this.tasks = JSON.parse(storedTasks);
            }
            
            if (storedCounter) {
                this.taskIdCounter = parseInt(storedCounter);
            }
            
            if (storedFilter) {
                this.currentFilter = storedFilter;
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

    // Utility method for responsive breakpoints
    isMobile() {
        return window.innerWidth < 768;
    }

    isTablet() {
        return window.innerWidth >= 768 && window.innerWidth < 1200;
    }

    isDesktop() {
        return window.innerWidth >= 1200;
    }
}

// Enhanced global functions for better performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.todoApp = new TodoApp();
    
    // Add CSS for ripple effect
    const style = document.createElement('style');
    style.textContent = `
        .btn {
            position: relative;
            overflow: hidden;
        }
        
        .ripple {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.3);
            transform: scale(0);
            animation: ripple-animation 0.6s linear;
            pointer-events: none;
        }
        
        @keyframes ripple-animation {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
        
        .task-slide-in {
            animation: slideInRight 0.5s ease-out;
        }
        
        .task-slide-out {
            animation: slideOutLeft 0.3s ease-in;
        }
        
        .task-clear-out {
            animation: scaleOut 0.4s ease-in;
        }
        
        @keyframes slideInRight {
            from {
                opacity: 0;
                transform: translateX(50px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
        
        @keyframes slideOutLeft {
            from {
                opacity: 1;
                transform: translateX(0);
            }
            to {
                opacity: 0;
                transform: translateX(-50px);
            }
        }
        
        @keyframes scaleOut {
            from {
                opacity: 1;
                transform: scale(1);
            }
            to {
                opacity: 0;
                transform: scale(0.8);
            }
        }
        
        .input-focused {
            transform: translateY(-2px);
        }
    `;
    document.head.appendChild(style);
});

// Enhanced service worker registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Service worker registration for future offline functionality
        console.log('Service worker support detected');
    });
}

// Enhanced performance monitoring
if ('performance' in window) {
    window.addEventListener('load', () => {
        setTimeout(() => {
            const perfData = performance.getEntriesByType('navigation')[0];
            console.log('Page load time:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
        }, 0);
    });
}
