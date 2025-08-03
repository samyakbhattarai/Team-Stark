// Add click event listeners to all profile cards
document.addEventListener('DOMContentLoaded', function() {
    const profileCards = document.querySelectorAll('.profile-card');
    
    profileCards.forEach(card => {
        card.addEventListener('click', function() {
            // Get the profile type from the data-profile attribute
            const profileType = this.getAttribute('data-profile');
            
            // Redirect to specific login page based on profile type
            switch(profileType) {
                case 'Student':
                    window.location.href = '../login/student-login.html';
                    break;
                case 'Teacher':
                    window.location.href = '../login/teacher-login.html';
                    break;
                case 'Parent':
                    window.location.href = '../login/parent-login.html';
                    break;
                case 'Admin':
                    window.location.href = '../admin/index.html';
                    break;
                default:
                    window.location.href = '../login/index.html';
            }
        });
        
        // Add hover effect for better UX
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.2)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.1)';
        });
    });
});
