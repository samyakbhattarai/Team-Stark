// Sample data for the admin dashboard
const adminData = {
    students: [
        { id: 1, name: 'John Doe', email: 'john.doe@school.com', grade: '10th', subject: 'Physics', status: 'Active' },
        { id: 2, name: 'Jane Smith', email: 'jane.smith@school.com', grade: '11th', subject: 'Chemistry', status: 'Active' },
        { id: 3, name: 'Mike Johnson', email: 'mike.johnson@school.com', grade: '12th', subject: 'Mathematics', status: 'Inactive' },
        { id: 4, name: 'Sarah Wilson', email: 'sarah.wilson@school.com', grade: '10th', subject: 'Computer Science', status: 'Active' },
        { id: 5, name: 'David Brown', email: 'david.brown@school.com', grade: '11th', subject: 'English', status: 'Active' }
    ],
    teachers: [
        { id: 1, name: 'Dr. Robert Chen', email: 'robert.chen@school.com', subject: 'Physics', experience: '8 years', status: 'Active' },
        { id: 2, name: 'Prof. Lisa Park', email: 'lisa.park@school.com', subject: 'Chemistry', experience: '12 years', status: 'Active' },
        { id: 3, name: 'Mr. James Wilson', email: 'james.wilson@school.com', subject: 'Mathematics', experience: '15 years', status: 'Active' },
        { id: 4, name: 'Ms. Emily Davis', email: 'emily.davis@school.com', subject: 'Computer Science', experience: '6 years', status: 'Active' },
        { id: 5, name: 'Dr. Michael Thompson', email: 'michael.thompson@school.com', subject: 'English', experience: '10 years', status: 'Active' }
    ],
    courses: [
        { id: 1, name: 'Advanced Physics', subject: 'Physics', teacher: 'Dr. Robert Chen', students: 25, duration: '1 year' },
        { id: 2, name: 'Organic Chemistry', subject: 'Chemistry', teacher: 'Prof. Lisa Park', students: 30, duration: '1 year' },
        { id: 3, name: 'Calculus & Trigonometry', subject: 'Mathematics', teacher: 'Mr. James Wilson', students: 35, duration: '1 year' },
        { id: 4, name: 'Programming Fundamentals', subject: 'Computer Science', teacher: 'Ms. Emily Davis', students: 28, duration: '1 year' },
        { id: 5, name: 'Literature & Composition', subject: 'English', teacher: 'Dr. Michael Thompson', students: 22, duration: '1 year' }
    ],
    requests: [
        { id: 1, type: 'Leave Request', student: 'John Doe', teacher: 'Dr. Robert Chen', status: 'Pending', date: '2024-01-15' },
        { id: 2, type: 'Grade Appeal', student: 'Jane Smith', teacher: 'Prof. Lisa Park', status: 'Approved', date: '2024-01-10' },
        { id: 3, type: 'Course Change', student: 'Mike Johnson', teacher: 'Mr. James Wilson', status: 'Rejected', date: '2024-01-08' },
        { id: 4, type: 'Leave Request', student: 'Sarah Wilson', teacher: 'Ms. Emily Davis', status: 'Pending', date: '2024-01-12' },
        { id: 5, type: 'Grade Appeal', student: 'David Brown', teacher: 'Dr. Michael Thompson', status: 'Approved', date: '2024-01-05' }
    ]
};

class AdminDashboard {
    constructor() {
        this.currentSection = 'overview';
        this.isTransitioning = false;
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadData();
        this.updateStats();
        this.initializeCharts();
        this.initializeAnimations();
        this.setupKeyboardNavigation();
    }

    initializeAnimations() {
        // Add loading animation to stat cards
        document.querySelectorAll('.stat-card').forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('loading');
                setTimeout(() => {
                    card.classList.remove('loading');
                }, 1000);
            }, index * 200);
        });

        // Add stagger animation to navigation items
        document.querySelectorAll('.nav-item').forEach((item, index) => {
            item.style.animationDelay = `${index * 0.1}s`;
        });
    }

    setupKeyboardNavigation() {
        // Add keyboard navigation support
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAllModals();
            }
            
            // Navigate sections with arrow keys when focused
            if (e.target.classList.contains('nav-link')) {
                const navLinks = Array.from(document.querySelectorAll('.nav-link'));
                const currentIndex = navLinks.indexOf(e.target);
                
                if (e.key === 'ArrowDown' && currentIndex < navLinks.length - 1) {
                    e.preventDefault();
                    navLinks[currentIndex + 1].focus();
                } else if (e.key === 'ArrowUp' && currentIndex > 0) {
                    e.preventDefault();
                    navLinks[currentIndex - 1].focus();
                } else if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    e.target.click();
                }
            }
        });
    }

    closeAllModals() {
        document.querySelectorAll('.modal.active').forEach(modal => {
            this.closeModal(modal.id);
        });
    }

    bindEvents() {
        // Navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = e.target.getAttribute('data-section');
                this.navigateToSection(section);
            });
        });

        // Search functionality
        document.querySelectorAll('.search-input').forEach(input => {
            input.addEventListener('input', (e) => {
                const searchTerm = e.target.value.toLowerCase();
                const section = e.target.closest('.content-section').id;
                
                switch(section) {
                    case 'students-section':
                        this.filterStudents(searchTerm);
                        break;
                    case 'teachers-section':
                        this.filterTeachers(searchTerm);
                        break;
                    case 'courses-section':
                        this.filterCourses(searchTerm);
                        break;
                }
            });
        });

        // Filter functionality
        document.querySelectorAll('.filter-select').forEach(select => {
            select.addEventListener('change', (e) => {
                const filterValue = e.target.value;
                const section = e.target.closest('.content-section').id;
                
                switch(section) {
                    case 'students-section':
                        this.filterStudentsByGrade(filterValue);
                        break;
                    case 'teachers-section':
                        this.filterTeachersBySubject(filterValue);
                        break;
                }
            });
        });

        // Request filter
        const requestFilter = document.getElementById('requestFilter');
        if (requestFilter) {
            requestFilter.addEventListener('change', (e) => {
                this.filterRequests(e.target.value);
            });
        }

        // Form submissions
        document.querySelectorAll('.add-form').forEach(form => {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const formType = form.getAttribute('data-form');
                
                switch(formType) {
                    case 'student':
                        this.addStudent(form);
                        break;
                    case 'teacher':
                        this.addTeacher(form);
                        break;
                    case 'course':
                        this.addCourse(form);
                        break;
                }
            });
        });

        // Modal close buttons
        document.querySelectorAll('.close-modal').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const modalId = e.target.closest('.modal').id;
                this.closeModal(modalId);
            });
        });
    }

    navigateToSection(section) {
        if (this.isTransitioning || section === this.currentSection) return;
        
        this.isTransitioning = true;
        
        // Add fade-out animation to current section
        const currentSection = document.getElementById(`${this.currentSection}-section`);
        if (currentSection) {
            currentSection.classList.add('fade-out');
        }

        // Remove active class from all nav links
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });

        setTimeout(() => {
            // Hide all sections
            document.querySelectorAll('.content-section').forEach(section => {
                section.style.display = 'none';
                section.classList.remove('active', 'fade-out');
            });

            // Show selected section with animation
            const targetSection = document.getElementById(`${section}-section`);
            if (targetSection) {
                targetSection.style.display = 'block';
                setTimeout(() => {
                    targetSection.classList.add('active');
                }, 50);
            }

            // Add active class to clicked nav item
            const activeNavItem = document.querySelector(`[data-section="${section}"]`).closest('.nav-item');
            if (activeNavItem) {
                activeNavItem.classList.add('active');
            }

            // Update page title
            this.updatePageTitle(section);

            this.currentSection = section;
            this.isTransitioning = false;

            // Update charts if on reports section
            if (section === 'reports') {
                setTimeout(() => this.updateCharts(), 300);
            }

            // Load section-specific data
            this.loadSectionData(section);
        }, 200);
    }

    updatePageTitle(section) {
        const titles = {
            overview: 'Dashboard Overview',
            students: 'Students Management',
            teachers: 'Teachers Management',
            courses: 'Courses Management',
            requests: 'Requests Management',
            reports: 'Reports & Analytics',
            settings: 'Settings'
        };
        
        const titleElement = document.querySelector('.page-title');
        if (titleElement) {
            titleElement.textContent = titles[section] || 'Dashboard';
        }
    }

    loadSectionData(section) {
        // Load data based on section
        switch(section) {
            case 'students':
                this.renderStudentsTable();
                break;
            case 'teachers':
                this.renderTeachersTable();
                break;
            case 'courses':
                this.renderCoursesTable();
                break;
            case 'requests':
                this.renderRequests();
                break;
        }
    }

    loadData() {
        // Load data from localStorage if available
        const savedData = localStorage.getItem('adminDashboardData');
        if (savedData) {
            const parsedData = JSON.parse(savedData);
            Object.assign(adminData, parsedData);
        }
    }

    saveData() {
        // Save data to localStorage
        localStorage.setItem('adminDashboardData', JSON.stringify(adminData));
    }

    renderStudentsTable() {
        const tbody = document.querySelector('#studentsTable tbody');
        if (!tbody) return;

        tbody.innerHTML = '';
        adminData.students.forEach(student => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${student.name}</td>
                <td>${student.email}</td>
                <td>${student.grade}</td>
                <td>${student.subject}</td>
                <td><span class="status-badge ${student.status.toLowerCase()}">${student.status}</span></td>
                <td>
                    <button class="action-btn edit" onclick="adminDashboard.editStudent(${student.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete" onclick="adminDashboard.deleteStudent(${student.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    renderTeachersTable() {
        const tbody = document.querySelector('#teachersTable tbody');
        if (!tbody) return;

        tbody.innerHTML = '';
        adminData.teachers.forEach(teacher => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${teacher.name}</td>
                <td>${teacher.email}</td>
                <td>${teacher.subject}</td>
                <td>${teacher.experience}</td>
                <td><span class="status-badge ${teacher.status.toLowerCase()}">${teacher.status}</span></td>
                <td>
                    <button class="action-btn edit" onclick="adminDashboard.editTeacher(${teacher.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete" onclick="adminDashboard.deleteTeacher(${teacher.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    renderCoursesTable() {
        const tbody = document.querySelector('#coursesTable tbody');
        if (!tbody) return;

        tbody.innerHTML = '';
        adminData.courses.forEach(course => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${course.name}</td>
                <td>${course.subject}</td>
                <td>${course.teacher}</td>
                <td>${course.students}</td>
                <td>${course.duration}</td>
                <td>
                    <button class="action-btn edit" onclick="adminDashboard.editCourse(${course.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete" onclick="adminDashboard.deleteCourse(${course.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    renderRequests() {
        const container = document.querySelector('#requestsContainer');
        if (!container) return;

        container.innerHTML = '';
        adminData.requests.forEach(request => {
            const requestCard = document.createElement('div');
            requestCard.className = 'request-card';
            requestCard.innerHTML = `
                <div class="request-header">
                    <div class="request-icon">
                        <i class="${this.getRequestIcon(request.type)}"></i>
                    </div>
                    <div class="request-info">
                        <h4>${request.type}</h4>
                        <p>Student: ${request.student}</p>
                        <p>Teacher: ${request.teacher}</p>
                        <p>Date: ${request.date}</p>
                    </div>
                    <div class="request-status">
                        <span class="status-badge ${request.status.toLowerCase()}">${request.status}</span>
                    </div>
                </div>
                <div class="request-actions">
                    ${request.status === 'Pending' ? `
                        <button class="btn btn-success" onclick="adminDashboard.approveRequest(${request.id})">
                            <i class="fas fa-check"></i> Approve
                        </button>
                        <button class="btn btn-danger" onclick="adminDashboard.rejectRequest(${request.id})">
                            <i class="fas fa-times"></i> Reject
                        </button>
                    ` : ''}
                </div>
            `;
            container.appendChild(requestCard);
        });
    }

    getRequestIcon(type) {
        const icons = {
            'Leave Request': 'fas fa-calendar-alt',
            'Grade Appeal': 'fas fa-graduation-cap',
            'Course Change': 'fas fa-exchange-alt'
        };
        return icons[type] || 'fas fa-question';
    }

    updateStats() {
        const stats = {
            totalStudents: adminData.students.length,
            totalTeachers: adminData.teachers.length,
            totalCourses: adminData.courses.length,
            pendingRequests: adminData.requests.filter(r => r.status === 'Pending').length
        };

        document.querySelectorAll('.stat-number').forEach(stat => {
            const statType = stat.getAttribute('data-stat');
            if (stats[statType] !== undefined) {
                stat.textContent = stats[statType];
            }
        });
    }

    filterStudents(searchTerm) {
        const filtered = adminData.students.filter(student => 
            student.name.toLowerCase().includes(searchTerm) ||
            student.email.toLowerCase().includes(searchTerm) ||
            student.subject.toLowerCase().includes(searchTerm)
        );
        this.renderFilteredStudents(filtered);
    }

    filterTeachers(searchTerm) {
        const filtered = adminData.teachers.filter(teacher => 
            teacher.name.toLowerCase().includes(searchTerm) ||
            teacher.email.toLowerCase().includes(searchTerm) ||
            teacher.subject.toLowerCase().includes(searchTerm)
        );
        this.renderFilteredTeachers(filtered);
    }

    filterCourses(searchTerm) {
        const filtered = adminData.courses.filter(course => 
            course.name.toLowerCase().includes(searchTerm) ||
            course.subject.toLowerCase().includes(searchTerm) ||
            course.teacher.toLowerCase().includes(searchTerm)
        );
        this.renderFilteredCourses(filtered);
    }

    filterStudentsByGrade(grade) {
        if (grade === 'all') {
            this.renderStudentsTable();
            return;
        }
        const filtered = adminData.students.filter(student => student.grade === grade);
        this.renderFilteredStudents(filtered);
    }

    filterTeachersBySubject(subject) {
        if (subject === 'all') {
            this.renderTeachersTable();
            return;
        }
        const filtered = adminData.teachers.filter(teacher => teacher.subject === subject);
        this.renderFilteredTeachers(filtered);
    }

    filterRequests(filter) {
        const container = document.querySelector('#requestsContainer');
        if (!container) return;

        let filteredRequests;
        if (filter === 'all') {
            filteredRequests = adminData.requests;
        } else {
            filteredRequests = adminData.requests.filter(request => request.status === filter);
        }

        container.innerHTML = '';
        filteredRequests.forEach(request => {
            const requestCard = document.createElement('div');
            requestCard.className = 'request-card';
            requestCard.innerHTML = `
                <div class="request-header">
                    <div class="request-icon">
                        <i class="${this.getRequestIcon(request.type)}"></i>
                    </div>
                    <div class="request-info">
                        <h4>${request.type}</h4>
                        <p>Student: ${request.student}</p>
                        <p>Teacher: ${request.teacher}</p>
                        <p>Date: ${request.date}</p>
                    </div>
                    <div class="request-status">
                        <span class="status-badge ${request.status.toLowerCase()}">${request.status}</span>
                    </div>
                </div>
                <div class="request-actions">
                    ${request.status === 'Pending' ? `
                        <button class="btn btn-success" onclick="adminDashboard.approveRequest(${request.id})">
                            <i class="fas fa-check"></i> Approve
                        </button>
                        <button class="btn btn-danger" onclick="adminDashboard.rejectRequest(${request.id})">
                            <i class="fas fa-times"></i> Reject
                        </button>
                    ` : ''}
                </div>
            `;
            container.appendChild(requestCard);
        });
    }

    renderFilteredStudents(students) {
        const tbody = document.querySelector('#studentsTable tbody');
        if (!tbody) return;

        tbody.innerHTML = '';
        students.forEach(student => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${student.name}</td>
                <td>${student.email}</td>
                <td>${student.grade}</td>
                <td>${student.subject}</td>
                <td><span class="status-badge ${student.status.toLowerCase()}">${student.status}</span></td>
                <td>
                    <button class="action-btn edit" onclick="adminDashboard.editStudent(${student.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete" onclick="adminDashboard.deleteStudent(${student.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    renderFilteredTeachers(teachers) {
        const tbody = document.querySelector('#teachersTable tbody');
        if (!tbody) return;

        tbody.innerHTML = '';
        teachers.forEach(teacher => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${teacher.name}</td>
                <td>${teacher.email}</td>
                <td>${teacher.subject}</td>
                <td>${teacher.experience}</td>
                <td><span class="status-badge ${teacher.status.toLowerCase()}">${teacher.status}</span></td>
                <td>
                    <button class="action-btn edit" onclick="adminDashboard.editTeacher(${teacher.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete" onclick="adminDashboard.deleteTeacher(${teacher.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    renderFilteredCourses(courses) {
        const tbody = document.querySelector('#coursesTable tbody');
        if (!tbody) return;

        tbody.innerHTML = '';
        courses.forEach(course => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${course.name}</td>
                <td>${course.subject}</td>
                <td>${course.teacher}</td>
                <td>${course.students}</td>
                <td>${course.duration}</td>
                <td>
                    <button class="action-btn edit" onclick="adminDashboard.editCourse(${course.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete" onclick="adminDashboard.deleteCourse(${course.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    addStudent(form) {
        const formData = new FormData(form);
        const newStudent = {
            id: Date.now(),
            name: formData.get('name'),
            email: formData.get('email'),
            grade: formData.get('grade'),
            subject: formData.get('subject'),
            status: 'Active'
        };

        adminData.students.push(newStudent);
        this.saveData();
        this.renderStudentsTable();
        this.updateStats();
        this.closeModal('addStudentModal');
        this.showNotification('Student added successfully!', 'success');
        form.reset();
    }

    addTeacher(form) {
        const formData = new FormData(form);
        const newTeacher = {
            id: Date.now(),
            name: formData.get('name'),
            email: formData.get('email'),
            subject: formData.get('subject'),
            experience: formData.get('experience'),
            status: 'Active'
        };

        adminData.teachers.push(newTeacher);
        this.saveData();
        this.renderTeachersTable();
        this.updateStats();
        this.closeModal('addTeacherModal');
        this.showNotification('Teacher added successfully!', 'success');
        form.reset();
    }

    addCourse(form) {
        const formData = new FormData(form);
        const newCourse = {
            id: Date.now(),
            name: formData.get('name'),
            subject: formData.get('subject'),
            teacher: formData.get('teacher'),
            students: parseInt(formData.get('students')),
            duration: formData.get('duration')
        };

        adminData.courses.push(newCourse);
        this.saveData();
        this.renderCoursesTable();
        this.updateStats();
        this.closeModal('addCourseModal');
        this.showNotification('Course added successfully!', 'success');
        form.reset();
    }

    editStudent(id) {
        const student = adminData.students.find(s => s.id === id);
        if (student) {
            // Populate edit form
            document.getElementById('editStudentName').value = student.name;
            document.getElementById('editStudentEmail').value = student.email;
            document.getElementById('editStudentGrade').value = student.grade;
            document.getElementById('editStudentSubject').value = student.subject;
            
            // Store the student ID for update
            document.getElementById('editStudentForm').setAttribute('data-student-id', id);
            
            this.showModal('editStudentModal');
        }
    }

    editTeacher(id) {
        const teacher = adminData.teachers.find(t => t.id === id);
        if (teacher) {
            // Populate edit form
            document.getElementById('editTeacherName').value = teacher.name;
            document.getElementById('editTeacherEmail').value = teacher.email;
            document.getElementById('editTeacherSubject').value = teacher.subject;
            document.getElementById('editTeacherExperience').value = teacher.experience;
            
            // Store the teacher ID for update
            document.getElementById('editTeacherForm').setAttribute('data-teacher-id', id);
            
            this.showModal('editTeacherModal');
        }
    }

    editCourse(id) {
        const course = adminData.courses.find(c => c.id === id);
        if (course) {
            // Populate edit form
            document.getElementById('editCourseName').value = course.name;
            document.getElementById('editCourseSubject').value = course.subject;
            document.getElementById('editCourseTeacher').value = course.teacher;
            document.getElementById('editCourseStudents').value = course.students;
            document.getElementById('editCourseDuration').value = course.duration;
            
            // Store the course ID for update
            document.getElementById('editCourseForm').setAttribute('data-course-id', id);
            
            this.showModal('editCourseModal');
        }
    }

    deleteStudent(id) {
        if (confirm('Are you sure you want to delete this student?')) {
            adminData.students = adminData.students.filter(s => s.id !== id);
            this.saveData();
            this.renderStudentsTable();
            this.updateStats();
            this.showNotification('Student deleted successfully!', 'success');
        }
    }

    deleteTeacher(id) {
        if (confirm('Are you sure you want to delete this teacher?')) {
            adminData.teachers = adminData.teachers.filter(t => t.id !== id);
            this.saveData();
            this.renderTeachersTable();
            this.updateStats();
            this.showNotification('Teacher deleted successfully!', 'success');
        }
    }

    deleteCourse(id) {
        if (confirm('Are you sure you want to delete this course?')) {
            adminData.courses = adminData.courses.filter(c => c.id !== id);
            this.saveData();
            this.renderCoursesTable();
            this.updateStats();
            this.showNotification('Course deleted successfully!', 'success');
        }
    }

    approveRequest(id) {
        const request = adminData.requests.find(r => r.id === id);
        if (request) {
            request.status = 'Approved';
            this.saveData();
            this.renderRequests();
            this.showNotification('Request approved successfully!', 'success');
        }
    }

    rejectRequest(id) {
        const request = adminData.requests.find(r => r.id === id);
        if (request) {
            request.status = 'Rejected';
            this.saveData();
            this.renderRequests();
            this.showNotification('Request rejected successfully!', 'success');
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="${this.getNotificationIcon(type)}"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(notification);
        
        // Trigger animation
        requestAnimationFrame(() => {
            notification.classList.add('show');
        });
        
        // Auto-remove notification
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 4000);

        // Allow manual dismissal
        notification.addEventListener('click', () => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        });
    }

    getNotificationIcon(type) {
        const icons = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle',
            warning: 'fas fa-exclamation-triangle',
            info: 'fas fa-info-circle'
        };
        return icons[type] || icons.info;
    }

    getNotificationColor(type) {
        const colors = {
            success: '#10b981',
            error: '#ef4444',
            warning: '#f59e0b',
            info: '#3b82f6'
        };
        return colors[type] || colors.info;
    }

    // Chart initialization and rendering
    initializeCharts() {
        this.createEnrollmentChart();
        this.createPerformanceChart();
        this.createWorkloadChart();
    }

    createEnrollmentChart() {
        const ctx = document.getElementById('enrollmentChart');
        if (!ctx) return;

        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const enrollmentData = [120, 135, 142, 158, 165, 172, 180, 188, 195, 202, 210, 218];

        this.enrollmentChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: months,
                datasets: [{
                    label: 'Student Enrollment',
                    data: enrollmentData,
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    }

    createPerformanceChart() {
        const ctx = document.getElementById('performanceChart');
        if (!ctx) return;

        const subjects = ['Physics', 'Chemistry', 'Mathematics', 'Computer Science', 'English'];
        const performanceData = [85, 78, 92, 88, 82];

        this.performanceChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: subjects,
                datasets: [{
                    label: 'Average Grade (%)',
                    data: performanceData,
                    backgroundColor: [
                        '#3b82f6',
                        '#10b981',
                        '#f59e0b',
                        '#ef4444',
                        '#8b5cf6'
                    ],
                    borderWidth: 0,
                    borderRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    }

    createWorkloadChart() {
        const ctx = document.getElementById('workloadChart');
        if (!ctx) return;

        const teachers = ['Dr. Chen', 'Prof. Park', 'Mr. Wilson', 'Ms. Davis', 'Dr. Thompson'];
        const workloadData = [25, 30, 35, 28, 22];

        this.workloadChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: teachers,
                datasets: [{
                    data: workloadData,
                    backgroundColor: [
                        '#3b82f6',
                        '#10b981',
                        '#f59e0b',
                        '#ef4444',
                        '#8b5cf6'
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            usePointStyle: true
                        }
                    }
                }
            }
        });
    }

    updateCharts() {
        // Update charts with fresh data
        if (this.enrollmentChart) {
            this.enrollmentChart.update();
        }
        if (this.performanceChart) {
            this.performanceChart.update();
        }
        if (this.workloadChart) {
            this.workloadChart.update();
        }
    }
}

// Enhanced Modal functions
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'flex';
        requestAnimationFrame(() => {
            modal.classList.add('active');
        });
        
        // Focus management for accessibility
        const firstInput = modal.querySelector('input, select, textarea, button');
        if (firstInput) {
            setTimeout(() => firstInput.focus(), 300);
        }
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('closing');
        modal.classList.remove('active');
        
        setTimeout(() => {
            modal.style.display = 'none';
            modal.classList.remove('closing');
            document.body.style.overflow = '';
        }, 300);
    }
}

// Enhanced stat card animations
function animateStatCards() {
    document.querySelectorAll('.stat-card').forEach((card, index) => {
        const numberElement = card.querySelector('.stat-number');
        const targetNumber = parseInt(numberElement.textContent);
        
        // Animate counting
        let currentNumber = 0;
        const increment = targetNumber / 30;
        const timer = setInterval(() => {
            currentNumber += increment;
            if (currentNumber >= targetNumber) {
                currentNumber = targetNumber;
                clearInterval(timer);
            }
            numberElement.textContent = Math.floor(currentNumber);
        }, 50);
        
        // Add loading class for visual effect
        setTimeout(() => {
            card.classList.add('loading');
            setTimeout(() => card.classList.remove('loading'), 1000);
        }, index * 200);
    });
}

// Mobile menu toggle
function toggleMobileMenu() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('mobile-open');
}

// Add breadcrumb navigation
function addBreadcrumb(section) {
    const breadcrumbContainer = document.querySelector('.breadcrumb');
    if (!breadcrumbContainer) {
        const header = document.querySelector('.header-left');
        const breadcrumb = document.createElement('div');
        breadcrumb.className = 'breadcrumb';
        header.appendChild(breadcrumb);
    }
    
    const breadcrumb = document.querySelector('.breadcrumb');
    const sectionNames = {
        overview: 'Dashboard',
        students: 'Students',
        teachers: 'Teachers',
        courses: 'Courses',
        requests: 'Requests',
        reports: 'Reports',
        settings: 'Settings'
    };
    
    breadcrumb.innerHTML = `
        <span class="breadcrumb-item">
            <i class="fas fa-home"></i>
            Home
        </span>
        <span class="breadcrumb-separator">
            <i class="fas fa-chevron-right"></i>
        </span>
        <span class="breadcrumb-item active">
            ${sectionNames[section] || section}
        </span>
    `;
}

// Initialize admin dashboard
let adminDashboard;
document.addEventListener('DOMContentLoaded', () => {
    adminDashboard = new AdminDashboard();
}); 