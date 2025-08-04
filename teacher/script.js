class SidebarNavigation {
    constructor() {
        this.sidebar = document.getElementById('sidebar');
        this.mainContent = document.getElementById('mainContent');
        this.menuToggle = document.getElementById('menuToggle');
        this.overlay = document.getElementById('overlay');
        this.navLinks = document.querySelectorAll('.nav-link');
        
        this.isCollapsed = false;
        this.isMobile = window.innerWidth <= 768;
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.setTooltips();
        this.handleResize();
    }
    
    bindEvents() {
        // Toggle button click
        this.menuToggle.addEventListener('click', () => {
            this.toggleSidebar();
        });
        
        // Overlay click (mobile)
        this.overlay.addEventListener('click', () => {
            this.closeMobileSidebar();
        });
        
        // Navigation link clicks
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.setActiveLink(link);
                
                // Close mobile sidebar when link is clicked
                if (this.isMobile) {
                    this.closeMobileSidebar();
                }
            });
        });
        
        // Window resize
        window.addEventListener('resize', () => {
            this.handleResize();
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isMobile) {
                this.closeMobileSidebar();
            }
        });
    }
    
    toggleSidebar() {
        if (this.isMobile) {
            this.toggleMobileSidebar();
        } else {
            this.toggleDesktopSidebar();
        }
    }
    
    toggleDesktopSidebar() {
        this.isCollapsed = !this.isCollapsed;
        
        if (this.isCollapsed) {
            this.sidebar.classList.add('collapsed');
            this.mainContent.classList.add('collapsed');
        } else {
            this.sidebar.classList.remove('collapsed');
            this.mainContent.classList.remove('collapsed');
        }
        
        // Update toggle button icon
        const icon = this.menuToggle.querySelector('i');
        icon.className = this.isCollapsed ? 'fas fa-chevron-right' : 'fas fa-bars';
    }
    
    toggleMobileSidebar() {
        const isOpen = this.sidebar.classList.contains('mobile-open');
        
        if (isOpen) {
            this.closeMobileSidebar();
        } else {
            this.openMobileSidebar();
        }
    }
    
    openMobileSidebar() {
        this.sidebar.classList.add('mobile-open');
        this.overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    closeMobileSidebar() {
        this.sidebar.classList.remove('mobile-open');
        this.overlay.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    setActiveLink(activeLink) {
        // Remove active class from all nav items
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        
        // Add active class to clicked item
        activeLink.closest('.nav-item').classList.add('active');
        
        // Update page title based on selection
        const linkText = activeLink.querySelector('.nav-text').textContent;
        document.querySelector('.header-title').textContent = linkText;
        
        // Simulate page content change
        this.updateMainContent(linkText);
    }
    
    updateMainContent(pageName) {
        const mainContent = document.getElementById('mainContent');
        const contentWrapper = mainContent.querySelector('.content-wrapper');
        
        // Clear existing content
        contentWrapper.innerHTML = '';
        
        // Load content based on selected page
        switch(pageName) {
            case 'Home':
                this.loadPage('teacherprofile.html', contentWrapper);
                break;
            case 'Dashboard':
                this.loadPage('teacherdashboard.html', contentWrapper);
                break;
            case 'Assignment':
                this.loadPage('../Team-Stark/assignment.html', contentWrapper);
                break;
            case 'AI Assistant':
                this.loadPage('../assistant/index.html', contentWrapper);
                break;
            case 'Course':
                this.loadPage('stuff.html', contentWrapper);
                break;
            case 'Leave':
                console.log('Loading leave.html...');
                this.loadPage('teacherleave.html', contentWrapper);
                break;
            case 'More':
                this.loadPage('../more/more.html', contentWrapper);
                break;
            default:
                this.loadPage('profile.html', contentWrapper);
        }
    }
    
    loadPage(pagePath, container) {
        // Show loading state
        container.innerHTML = '<div class="loading">Loading...</div>';
        
        // Create iframe to load the page
        const iframe = document.createElement('iframe');
        iframe.src = pagePath;
        iframe.style.width = '100%';
        iframe.style.height = '100vh';
        iframe.style.border = 'none';
        iframe.style.borderRadius = '8px';
        
        // Replace loading with iframe
        container.innerHTML = '';
        container.appendChild(iframe);
        
        // Add error handling
        iframe.onerror = () => {
            container.innerHTML = '<div class="error">Failed to load page. Please try again.</div>';
        };
    }
    
    setTooltips() {
        this.navLinks.forEach(link => {
            const text = link.querySelector('.nav-text').textContent;
            link.setAttribute('data-tooltip', text);
        });
    }
    
    handleResize() {
        const wasMobile = this.isMobile;
        this.isMobile = window.innerWidth <= 768;
        
        // If switching from mobile to desktop
        if (wasMobile && !this.isMobile) {
            this.sidebar.classList.remove('mobile-open');
            this.overlay.classList.remove('active');
            document.body.style.overflow = '';
            
            // Reset to collapsed state if it was collapsed before
            if (this.isCollapsed) {
                this.sidebar.classList.add('collapsed');
                this.mainContent.classList.add('collapsed');
            }
        }
        
        // If switching from desktop to mobile
        if (!wasMobile && this.isMobile) {
            this.sidebar.classList.remove('collapsed');
            this.mainContent.classList.remove('collapsed');
            this.isCollapsed = false;
        }
        
        // Update toggle button icon
        const icon = this.menuToggle.querySelector('i');
        if (this.isMobile) {
            icon.className = 'fas fa-bars';
        } else {
            icon.className = this.isCollapsed ? 'fas fa-chevron-right' : 'fas fa-bars';
        }
    }
}

// Animation utilities
class AnimationUtils {
    static fadeIn(element, duration = 300) {
        element.style.opacity = '0';
        element.style.display = 'block';
        
        let start = null;
        
        function animate(timestamp) {
            if (!start) start = timestamp;
            
            const progress = timestamp - start;
            const opacity = Math.min(progress / duration, 1);
            
            element.style.opacity = opacity;
            
            if (progress < duration) {
                requestAnimationFrame(animate);
            }
        }
        
        requestAnimationFrame(animate);
    }
    
    static slideIn(element, direction = 'left', duration = 300) {
        const translateValue = direction === 'left' ? '-100%' : '100%';
        
        element.style.transform = `translateX(${translateValue})`;
        element.style.transition = `transform ${duration}ms ease`;
        
        setTimeout(() => {
            element.style.transform = 'translateX(0)';
        }, 10);
    }
}

// Initialize the sidebar navigation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new SidebarNavigation();
    
    // Add some entrance animations
    setTimeout(() => {
        document.querySelector('.header').style.animation = 'slideInDown 0.5s ease';
        document.querySelector('.sidebar').style.animation = 'slideInLeft 0.5s ease';
        document.querySelector('.main-content').style.animation = 'fadeIn 0.5s ease 0.2s both';
    }, 100);
});

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInDown {
        from {
            transform: translateY(-100%);
            opacity: 0;
        }
        to {
            transform: translateY(0);
            opacity: 1;
        }
    }
    
    @keyframes slideInLeft {
        from {
            transform: translateX(-100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
`;
document.head.appendChild(style);