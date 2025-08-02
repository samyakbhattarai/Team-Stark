// DOM Elements
const sidebar = document.querySelector('.sidebar');
const mainContent = document.querySelector('.main-content');
const sidebarToggle = document.getElementById('sidebarToggle');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navItems = document.querySelectorAll('.nav-item');
const contentPages = document.querySelectorAll('.content-page');
const pageTitle = document.getElementById('pageTitle');

// Navigation functionality
function initNavigation() {
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Remove active class from all nav items
            navItems.forEach(nav => nav.classList.remove('active'));
            
            // Add active class to clicked item
            item.classList.add('active');
            
            // Get the page to show
            const pageToShow = item.getAttribute('data-page');
            
            // Hide all content pages
            contentPages.forEach(page => page.classList.remove('active'));
            
            // Show the selected page
            const targetPage = document.getElementById(`${pageToShow}-content`);
            if (targetPage) {
                targetPage.classList.add('active');
            }
            
            // Update page title
            const navText = item.querySelector('span').textContent;
            pageTitle.textContent = navText;
            
            // Close sidebar on mobile after selection
            if (window.innerWidth <= 1024) {
                sidebar.classList.remove('open');
            }
        });
    });
}

// Sidebar toggle functionality
function initSidebarToggle() {
    const toggleSidebar = () => {
        sidebar.classList.toggle('open');
    };
    
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', toggleSidebar);
    }
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', toggleSidebar);
    }
    
    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 1024) {
            if (!sidebar.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                sidebar.classList.remove('open');
            }
        }
    });
}

// Search functionality
function initSearch() {
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            console.log('Searching for:', searchTerm);
            // Implement search functionality here
            // This could filter tables, cards, or other content based on the search term
        });
    }
}

// Table interactions
function initTableInteractions() {
    // Add click handlers for table rows
    const tableRows = document.querySelectorAll('tbody tr');
    tableRows.forEach(row => {
        row.addEventListener('click', (e) => {
            // Don't trigger if clicking on buttons
            if (e.target.tagName === 'BUTTON') return;
            
            // Add selection styling
            tableRows.forEach(r => r.classList.remove('selected'));
            row.classList.add('selected');
            
            console.log('Selected row:', row);
        });
    });
    
    // Add hover effects for better UX
    const cards = document.querySelectorAll('.stat-card, .assignment-card, .teacher-card, .dashboard-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-2px)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });
    });
}

// Form interactions
function initFormInteractions() {
    // Settings form
    const settingsInputs = document.querySelectorAll('.setting-input, .setting-select');
    settingsInputs.forEach(input => {
        input.addEventListener('change', () => {
            console.log('Setting changed:', input.name || input.id, input.value);
            // Add visual feedback for unsaved changes
            input.style.borderColor = '#f59e0b';
        });
    });
    
    // Save settings button
    const saveBtn = document.querySelector('.settings-actions .btn-primary');
    if (saveBtn) {
        saveBtn.addEventListener('click', () => {
            // Reset border colors
            settingsInputs.forEach(input => {
                input.style.borderColor = '#d1d5db';
            });
            
            showNotification('Settings saved successfully!', 'success');
        });
    }
    
    // Filter controls
    const filterSelects = document.querySelectorAll('.filter-select');
    filterSelects.forEach(select => {
        select.addEventListener('change', () => {
            console.log('Filter changed:', select.value);
            // Implement filtering logic here
            showNotification('Filters applied', 'info');
        });
    });
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Styling
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 24px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    `;
    
    // Type-specific colors
    const colors = {
        success: '#10b981',
        error: '#ef4444',
        warning: '#f59e0b',
        info: '#3b82f6'
    };
    
    notification.style.backgroundColor = colors[type] || colors.info;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after delay
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Button interactions
function initButtonInteractions() {
    // Primary action buttons
    const primaryButtons = document.querySelectorAll('.btn-primary');
    primaryButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const buttonText = btn.textContent.trim();
            console.log('Primary action:', buttonText);
            
            // Add loading state
            const originalText = btn.textContent;
            btn.textContent = 'Loading...';
            btn.disabled = true;
            
            // Simulate async operation
            setTimeout(() => {
                btn.textContent = originalText;
                btn.disabled = false;
                
                // Show success message based on button text
                if (buttonText.includes('Create')) {
                    showNotification('Item created successfully!', 'success');
                } else if (buttonText.includes('Add')) {
                    showNotification('Item added successfully!', 'success');
                } else if (buttonText.includes('Save')) {
                    showNotification('Changes saved successfully!', 'success');
                }
            }, 1000);
        });
    });
    
    // Icon buttons
    const iconButtons = document.querySelectorAll('.btn-icon');
    iconButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const action = btn.textContent.includes('👁️') ? 'view' : 'edit';
            console.log('Icon action:', action);
            showNotification(`${action.charAt(0).toUpperCase() + action.slice(1)} action triggered`, 'info');
        });
    });
}

// Date picker functionality
function initDatePicker() {
    const dateInput = document.querySelector('.date-input');
    if (dateInput) {
        dateInput.addEventListener('change', (e) => {
            console.log('Date changed:', e.target.value);
            showNotification('Date updated', 'info');
            // Here you would typically reload attendance data for the selected date
        });
    }
}

// Responsive handling
function handleResize() {
    if (window.innerWidth > 1024) {
        sidebar.classList.remove('open');
        mainContent.classList.remove('expanded');
    }
}

// Animation on scroll
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe cards and other elements
    const animatedElements = document.querySelectorAll('.stat-card, .assignment-card, .teacher-card, .dashboard-card');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// User profile dropdown (placeholder)
function initUserProfile() {
    const userProfile = document.querySelector('.user-profile');
    if (userProfile) {
        userProfile.addEventListener('click', () => {
            console.log('User profile clicked');
            showNotification('Profile menu would open here', 'info');
        });
    }
}

// Initialize all functionality
function init() {
    initNavigation();
    initSidebarToggle();
    initSearch();
    initTableInteractions();
    initFormInteractions();
    initButtonInteractions();
    initDatePicker();
    initScrollAnimations();
    initUserProfile();
    
    // Add resize listener
    window.addEventListener('resize', handleResize);
    
    // Initial setup
    handleResize();
    
    console.log('SchoolHub Management System initialized');
}

// Start the application when DOM is loaded
document.addEventListener('DOMContentLoaded', init);

// Additional utility functions
const utils = {
    // Format date
    formatDate: (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    },
    
    // Format time
    formatTime: (time) => {
        return new Date(`2000-01-01 ${time}`).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    },
    
    // Calculate grade color
    getGradeColor: (grade) => {
        const gradeMap = {
            'A+': '#10b981',
            'A': '#10b981',
            'B+': '#3b82f6',
            'B': '#3b82f6',
            'C+': '#f59e0b',
            'C': '#f59e0b',
            'D': '#ef4444',
            'F': '#ef4444'
        };
        return gradeMap[grade] || '#6b7280';
    },
    
    // Generate random data (for demo purposes)
    generateRandomData: () => {
        const names = ['Alice Johnson', 'Bob Smith', 'Carol Davis', 'David Wilson', 'Emma Brown'];
        const subjects = ['Mathematics', 'English', 'Science', 'History', 'Art'];
        const grades = ['A+', 'A', 'B+', 'B', 'C+', 'C', 'D'];
        
        return {
            name: names[Math.floor(Math.random() * names.length)],
            subject: subjects[Math.floor(Math.random() * subjects.length)],
            grade: grades[Math.floor(Math.random() * grades.length)],
            score: Math.floor(Math.random() * 40) + 60 // 60-100
        };
    }
};

// Export utils for use in other scripts
window.SchoolHubUtils = utils;