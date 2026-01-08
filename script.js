// Mobile navigation functionality
document.addEventListener('DOMContentLoaded', function() {
    // User data storage
    let userData = {
        allowance: 10000,
        expenses: 4500,
        avatarInitials: 'RJ',
        name: 'Ralf Jove Sanchez',
        email: 'ralf.sanchez@pupsmb.edu.ph',
        course: 'BS Information Technology',
        yearLevel: '1st Year',
        studentId: '2024-12345'
    };

    // Initialize UI with user data
    function initializeUI() {
        updateBudgetUI();
        updateProfileUI();
    }

    // Calculate budget metrics
    function calculateBudgetMetrics() {
        const allowance = userData.allowance;
        const expenses = userData.expenses;
        const balance = allowance - expenses;
        const usagePercent = allowance > 0 ? Math.min(100, Math.round((expenses / allowance) * 100)) : 0;
        const dailyAverage = Math.round(allowance / 30); // 30 days in a month
        
        return {
            balance,
            usagePercent,
            dailyAverage
        };
    }

    // Update all budget-related UI elements
    function updateBudgetUI() {
        const metrics = calculateBudgetMetrics();
        
        // Dashboard page
        document.getElementById('current-balance').textContent = `₱${metrics.balance.toLocaleString()}`;
        document.getElementById('budget-usage-percent').textContent = `${metrics.usagePercent}%`;
        document.getElementById('budget-progress').style.width = `${metrics.usagePercent}%`;
        document.getElementById('dashboard-allowance').textContent = `₱${userData.allowance.toLocaleString()}`;
        document.getElementById('dashboard-expenses').textContent = `₱${userData.expenses.toLocaleString()}`;
        document.getElementById('daily-average').textContent = metrics.dailyAverage.toLocaleString();
        
        // Budget page
        document.getElementById('budget-page-balance').textContent = `₱${metrics.balance.toLocaleString()}`;
        document.getElementById('budget-page-usage').textContent = `${metrics.usagePercent}%`;
        document.getElementById('budget-page-progress').style.width = `${metrics.usagePercent}%`;
        document.getElementById('budget-page-allowance').textContent = `₱${userData.allowance.toLocaleString()}`;
        document.getElementById('budget-page-expenses').textContent = `₱${userData.expenses.toLocaleString()}`;
        
        // Profile page
        document.getElementById('profile-allowance').textContent = `₱${userData.allowance.toLocaleString()}`;
        document.getElementById('profile-expenses').textContent = `₱${userData.expenses.toLocaleString()}`;
        
        // Budget edit form
        document.getElementById('edit-allowance').value = userData.allowance;
        document.getElementById('edit-expenses').value = userData.expenses;
        document.getElementById('calculated-balance').textContent = `₱${metrics.balance.toLocaleString()}`;
        document.getElementById('calculated-usage').textContent = `${metrics.usagePercent}%`;
        document.getElementById('calculated-daily-avg').textContent = `₱${metrics.dailyAverage.toLocaleString()}`;
        
        // Add animation effect
        const elements = document.querySelectorAll('[id*="balance"], [id*="allowance"], [id*="expenses"], [id*="usage"]');
        elements.forEach(el => {
            el.classList.add('updating');
            setTimeout(() => el.classList.remove('updating'), 500);
        });
    }

    // Update profile UI
    function updateProfileUI() {
        document.getElementById('header-avatar').textContent = userData.avatarInitials;
        document.getElementById('profile-avatar').querySelector('.avatar-initials').textContent = userData.avatarInitials;
        document.getElementById('profile-name').textContent = userData.name;
        document.getElementById('profile-course').textContent = userData.course;
        document.getElementById('profile-id').textContent = `Student ID: ${userData.studentId}`;
        document.getElementById('edit-name').value = userData.name;
        document.getElementById('edit-email').value = userData.email;
        document.getElementById('edit-course').value = userData.course;
        document.getElementById('edit-year').value = userData.yearLevel;
    }

    // Show success message
    function showSuccessMessage(message) {
        const existingMessage = document.querySelector('.success-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
        document.body.appendChild(successDiv);
        
        setTimeout(() => {
            if (successDiv.parentNode) {
                successDiv.remove();
            }
        }, 2500);
    }

    // Navigation between pages
    const navItems = document.querySelectorAll('.nav-item, .nav-link');
    const pages = document.querySelectorAll('.page');
    
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get target page
            const targetPage = this.getAttribute('data-page');
            
            // Update active nav item
            navItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
            
            // Show target page
            pages.forEach(page => page.classList.remove('active'));
            document.getElementById(targetPage).classList.add('active');
            
            // Scroll to top
            window.scrollTo(0, 0);
            
            // Update budget UI when navigating to budget or dashboard
            if (targetPage === 'dashboard' || targetPage === 'budget') {
                updateBudgetUI();
            }
        });
    });

    // Profile picture editing
    const profileAvatar = document.getElementById('profile-avatar');
    const avatarUpload = document.getElementById('avatar-upload');
    
    profileAvatar.addEventListener('click', function() {
        avatarUpload.click();
    });
    
    avatarUpload.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                // Create image element
                const img = document.createElement('img');
                img.src = event.target.result;
                img.className = 'avatar-image';
                
                // Replace initials with image
                const avatarDiv = document.getElementById('profile-avatar');
                const initials = avatarDiv.querySelector('.avatar-initials');
                initials.style.display = 'none';
                avatarDiv.insertBefore(img, initials);
                
                // Update header avatar with first letter
                const firstName = userData.name.split(' ')[0];
                const lastName = userData.name.split(' ')[1] || '';
                userData.avatarInitials = (firstName[0] + (lastName[0] || '')).toUpperCase();
                document.getElementById('header-avatar').textContent = userData.avatarInitials;
                
                showSuccessMessage('Profile picture updated successfully!');
            };
            reader.readAsDataURL(file);
        }
    });

    // Allowance/Expenses edit buttons
    const editButtons = document.querySelectorAll('.stat-edit-btn');
    const budgetEditModal = document.getElementById('budget-edit-modal');
    const closeModal = document.querySelector('.close-modal');
    const cancelEdit = document.getElementById('cancel-edit');
    const saveBudgetChange = document.getElementById('save-budget-change');
    const editTypeSpan = document.getElementById('edit-type');
    const editLabel = document.getElementById('edit-label');
    const editBudgetAmount = document.getElementById('edit-budget-amount');
    let currentEditType = '';

    editButtons.forEach(button => {
        button.addEventListener('click', function() {
            currentEditType = this.getAttribute('data-target');
            const currentValue = currentEditType === 'allowance' ? userData.allowance : userData.expenses;
            
            editTypeSpan.textContent = currentEditType.charAt(0).toUpperCase() + currentEditType.slice(1);
            editLabel.textContent = `New ${currentEditType.charAt(0).toUpperCase() + currentEditType.slice(1)} Amount`;
            editBudgetAmount.value = currentValue;
            editBudgetAmount.focus();
            
            budgetEditModal.style.display = 'block';
            budgetEditModal.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
    });

    // Quick edit from budget page
    const quickSaveButtons = document.querySelectorAll('.btn-save');
    quickSaveButtons.forEach(button => {
        button.addEventListener('click', function() {
            const target = this.getAttribute('data-target');
            const input = document.getElementById(`edit-${target}`);
            const newValue = parseInt(input.value) || 0;
            
            if (newValue >= 0) {
                if (target === 'allowance') {
                    userData.allowance = newValue;
                } else if (target === 'expenses') {
                    userData.expenses = newValue;
                }
                
                updateBudgetUI();
                showSuccessMessage(`${target.charAt(0).toUpperCase() + target.slice(1)} updated to ₱${newValue.toLocaleString()}`);
            } else {
                alert('Please enter a valid amount (0 or greater)');
            }
        });
    });

    // Close modal
    closeModal.addEventListener('click', function() {
        budgetEditModal.style.display = 'none';
    });

    cancelEdit.addEventListener('click', function() {
        budgetEditModal.style.display = 'none';
    });

    // Save budget change
    saveBudgetChange.addEventListener('click', function() {
        const newAmount = parseInt(editBudgetAmount.value) || 0;
        const reason = document.getElementById('edit-reason').value;
        const notes = document.getElementById('edit-notes').value;
        
        if (newAmount >= 0) {
            if (currentEditType === 'allowance') {
                userData.allowance = newAmount;
            } else if (currentEditType === 'expenses') {
                userData.expenses = newAmount;
            }
            
            updateBudgetUI();
            budgetEditModal.style.display = 'none';
            
            // Log the change
            console.log(`Budget ${currentEditType} updated to ${newAmount}. Reason: ${reason}. Notes: ${notes}`);
            
            showSuccessMessage(`${currentEditType.charAt(0).toUpperCase() + currentEditType.slice(1)} updated to ₱${newAmount.toLocaleString()}`);
        } else {
            alert('Please enter a valid amount (0 or greater)');
        }
    });

    // Profile form submission
    document.getElementById('profile-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        userData.name = document.getElementById('edit-name').value;
        userData.email = document.getElementById('edit-email').value;
        userData.course = document.getElementById('edit-course').value;
        userData.yearLevel = document.getElementById('edit-year').value;
        
        // Update avatar initials based on new name
        const firstName = userData.name.split(' ')[0];
        const lastName = userData.name.split(' ')[1] || '';
        userData.avatarInitials = (firstName[0] + (lastName[0] || '')).toUpperCase();
        
        updateProfileUI();
        showSuccessMessage('Profile updated successfully!');
    });

    // Form submissions
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        if (form.id !== 'profile-form') {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Show success message
                showSuccessMessage('Action completed successfully!');
                
                // Reset form if needed
                if (this.id === 'transaction-form') {
                    this.reset();
                }
            });
        }
    });

    // Task checkbox functionality
    const taskCheckboxes = document.querySelectorAll('.task-checkbox input');
    taskCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const taskItem = this.closest('.task-item');
            if (this.checked) {
                taskItem.style.opacity = '0.7';
                taskItem.querySelector('.task-date').textContent = 'Completed';
                taskItem.querySelector('.task-date').style.background = 'linear-gradient(to right, rgba(50, 205, 50, 0.1), rgba(34, 139, 34, 0.1))';
                taskItem.querySelector('.task-date').style.color = '#32CD32';
            } else {
                taskItem.style.opacity = '1';
                const originalDate = taskItem.getAttribute('data-original-date') || 'Due: Oct 30';
                taskItem.querySelector('.task-date').textContent = originalDate;
                taskItem.querySelector('.task-date').style.background = 'linear-gradient(to right, rgba(139, 0, 0, 0.1), rgba(218, 165, 32, 0.1))';
                taskItem.querySelector('.task-date').style.color = 'var(--primary)';
            }
        });
    });
    
    // Save original dates for task items
    document.querySelectorAll('.task-item').forEach(item => {
        const dateElement = item.querySelector('.task-date');
        if (dateElement && !dateElement.textContent.includes('Completed')) {
            item.setAttribute('data-original-date', dateElement.textContent);
        }
    });

    // Weekly navigation
    const weekNavs = document.querySelectorAll('.week-nav');
    weekNavs.forEach(nav => {
        nav.addEventListener('click', function() {
            const currentWeek = document.querySelector('.current-week');
            if (this.textContent === '‹') {
                currentWeek.textContent = 'Oct 21 - Oct 27';
            } else {
                currentWeek.textContent = 'Nov 4 - Nov 10';
            }
        });
    });

    // Interactive graph bars
    const graphBars = document.querySelectorAll('.graph-bar');
    graphBars.forEach(bar => {
        bar.addEventListener('click', function() {
            const percentage = this.querySelector('.graph-percentage').textContent;
            const metrics = calculateBudgetMetrics();
            const dailyAmount = Math.round((parseInt(percentage) / 100) * metrics.dailyAverage);
            alert(`You spent ₱${dailyAmount.toLocaleString()} (${percentage} of your daily budget target) on this day.`);
        });
    });

    // Mobile menu toggle
    document.querySelector('.user-avatar').addEventListener('click', function() {
        alert('User menu would open here');
    });

    // Calendar navigation
    const calendarNavs = document.querySelectorAll('.btn-secondary');
    calendarNavs.forEach(button => {
        button.addEventListener('click', function() {
            if (this.textContent === '‹') {
                alert('Previous month would load here');
            } else if (this.textContent === '›') {
                alert('Next month would load here');
            }
        });
    });

    // Settings buttons
    const settingButtons = document.querySelectorAll('.settings-list .btn-secondary');
    settingButtons.forEach(button => {
        button.addEventListener('click', function() {
            const settingTitle = this.closest('.setting-item').querySelector('.task-title').textContent;
            alert(`${settingTitle} settings would open here.`);
        });
    });

    // Initialize the UI
    initializeUI();
});

// Add these functions to your existing script.js file

// Tasks page functionality
function initializeTasksPage() {
    // Task form submission
    const taskForm = document.getElementById('task-form');
    if (taskForm) {
        taskForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const title = this.querySelector('input[type="text"]').value;
            const priority = this.querySelector('select').value;
            const date = this.querySelector('input[type="date"]').value;
            const category = this.querySelectorAll('select')[1].value;
            const description = this.querySelector('textarea').value;
            
            if (title && date) {
                // Create new task item
                const newTask = {
                    title,
                    priority,
                    date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                    category,
                    description
                };
                
                // Add to To Do list
                addTaskToUI(newTask);
                
                // Reset form
                this.reset();
                
                // Show success message
                showSuccessMessage('New task added successfully!');
                
                // Update task counts
                updateTaskCounts();
            } else {
                alert('Please fill in all required fields');
            }
        });
    }
    
    // Event form submission
    const eventForm = document.getElementById('event-form');
    if (eventForm) {
        eventForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const title = this.querySelector('input[type="text"]').value;
            const date = this.querySelector('input[type="date"]').value;
            const time = this.querySelector('input[type="time"]').value;
            const type = this.querySelector('select').value;
            const description = this.querySelector('textarea').value;
            
            if (title && date) {
                // Create new event item
                const newEvent = {
                    title,
                    date,
                    time,
                    type,
                    description
                };
                
                // Add to events list
                addEventToUI(newEvent);
                
                // Reset form
                this.reset();
                
                // Show success message
                showSuccessMessage('New event added to calendar!');
            } else {
                alert('Please fill in all required fields');
            }
        });
    }
    
    // Calendar navigation
    const calendarPrev = document.querySelector('.calendar-prev');
    const calendarNext = document.querySelector('.calendar-next');
    
    if (calendarPrev && calendarNext) {
        calendarPrev.addEventListener('click', function() {
            navigateCalendar('prev');
        });
        
        calendarNext.addEventListener('click', function() {
            navigateCalendar('next');
        });
    }
    
    // Initialize task counts
    updateTaskCounts();
}

// Add task to UI
function addTaskToUI(task) {
    const toDoList = document.querySelector('.task-section:nth-child(2) .task-list');
    
    const taskItem = document.createElement('div');
    taskItem.className = 'task-item';
    taskItem.innerHTML = `
        <div class="task-checkbox">
            <input type="checkbox">
        </div>
        <div class="task-content">
            <div class="task-title">${task.title}</div>
            <div class="task-meta">${task.description || 'No description'} • ${task.priority} Priority</div>
            <div class="task-date">Due: ${task.date}</div>
        </div>
    `;
    
    // Add checkbox functionality
    const checkbox = taskItem.querySelector('input[type="checkbox"]');
    checkbox.addEventListener('change', function() {
        if (this.checked) {
            taskItem.classList.add('completed');
            taskItem.querySelector('.task-date').textContent = 'Completed';
            taskItem.querySelector('.task-date').style.background = 'linear-gradient(to right, rgba(50, 205, 50, 0.2), rgba(34, 139, 34, 0.1))';
            taskItem.querySelector('.task-date').style.color = '#32CD32';
            
            // Move to completed section after delay
            setTimeout(() => {
                const completedSection = document.querySelector('.task-section:nth-child(4) .task-list');
                if (completedSection) {
                    completedSection.appendChild(taskItem);
                    updateTaskCounts();
                }
            }, 300);
        }
    });
    
    // Set original date
    taskItem.setAttribute('data-original-date', `Due: ${task.date}`);
    
    toDoList.appendChild(taskItem);
}

// Add event to UI
function addEventToUI(event) {
    const eventList = document.querySelector('.event-list');
    
    const eventDate = new Date(event.date);
    const day = eventDate.getDate();
    const month = eventDate.toLocaleDateString('en-US', { month: 'short' });
    
    const eventItem = document.createElement('div');
    eventItem.className = 'event-item';
    eventItem.innerHTML = `
        <div class="event-date">
            <span class="event-day">${day}</span>
            <span class="event-month">${month}</span>
        </div>
        <div class="event-details">
            <div class="event-title">${event.title}</div>
            <div class="event-info">${event.description || 'No description'} • ${event.time || 'All day'}</div>
            <span class="event-type ${event.type}">${event.type}</span>
        </div>
    `;
    
    eventList.appendChild(eventItem);
    
    // Also add to calendar if date is in current month
    updateCalendarWithEvent(event);
}

// Update task counts
function updateTaskCounts() {
    const toDoTasks = document.querySelectorAll('.task-section:nth-child(2) .task-item').length;
    const inProgressTasks = document.querySelectorAll('.task-section:nth-child(3) .task-item').length;
    const completedTasks = document.querySelectorAll('.task-section:nth-child(4) .task-item').length;
    const totalTasks = toDoTasks + inProgressTasks + completedTasks;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    
    // Update counts in UI
    const taskCounts = document.querySelectorAll('.task-count');
    if (taskCounts.length >= 3) {
        taskCounts[0].textContent = `${toDoTasks} tasks`;
        taskCounts[1].textContent = `${inProgressTasks} tasks`;
        taskCounts[2].textContent = `${completedTasks} tasks`;
    }
    
    // Update progress bar
    const progressFill = document.querySelector('.progress-fill');
    const progressPercent = document.querySelector('.progress-label span:last-child');
    if (progressFill && progressPercent) {
        progressFill.style.width = `${completionRate}%`;
        progressPercent.textContent = `${completionRate}%`;
    }
    
    // Update stat cards
    const statValues = document.querySelectorAll('.stat-card .stat-value');
    if (statValues.length >= 4) {
        statValues[0].textContent = totalTasks;
        statValues[1].textContent = toDoTasks;
        statValues[2].textContent = inProgressTasks;
        statValues[3].textContent = completedTasks;
    }
}

// Calendar navigation
function navigateCalendar(direction) {
    const monthYear = document.querySelector('.calendar-month-year h3');
    const currentDate = document.querySelector('.current-date');
    
    if (monthYear && currentDate) {
        const currentText = monthYear.textContent;
        const [currentMonth, currentYear] = currentText.split(' ');
        
        const months = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        
        let currentIndex = months.indexOf(currentMonth);
        let year = parseInt(currentYear);
        
        if (direction === 'prev') {
            currentIndex--;
            if (currentIndex < 0) {
                currentIndex = 11;
                year--;
            }
        } else {
            currentIndex++;
            if (currentIndex > 11) {
                currentIndex = 0;
                year++;
            }
        }
        
        const newMonth = months[currentIndex];
        monthYear.textContent = `${newMonth} ${year}`;
        
        // Update current date
        const today = new Date();
        currentDate.textContent = `Today: ${today.toLocaleDateString('en-US', { 
            month: 'long', 
            day: 'numeric', 
            year: 'numeric' 
        })}`;
        
        // Generate calendar for new month
        generateCalendar(newMonth, year);
    }
}

// Generate calendar for specific month
function generateCalendar(month, year) {
    // This is a simplified version - in a real app, you would generate the full calendar
    const calendarGrid = document.querySelector('.calendar-grid');
    if (calendarGrid) {
        // Remove all days except headers
        const days = calendarGrid.querySelectorAll('.calendar-day:not(.header)');
        days.forEach(day => day.remove());
        
        // For now, just show a message
        showSuccessMessage(`Calendar updated to ${month} ${year}`);
    }
}

// Update calendar with new event
function updateCalendarWithEvent(event) {
    const eventDate = new Date(event.date);
    const day = eventDate.getDate();
    
    // Find the calendar day and add event indicator
    const calendarDays = document.querySelectorAll('.calendar-day:not(.header):not(.other-month)');
    calendarDays.forEach(calendarDay => {
        const dayNumber = parseInt(calendarDay.textContent);
        if (dayNumber === day) {
            if (!calendarDay.classList.contains('event')) {
                calendarDay.classList.add('event');
            }
        }
    });
}

// Add this initialization call to the existing DOMContentLoaded event listener
// Find the initializeUI() function call and add after it:
initializeUI();
initializeTasksPage();