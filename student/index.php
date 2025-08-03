<?php
session_start();

// Check if user is logged in
if (!isset($_SESSION['logged_in']) || $_SESSION['logged_in'] !== true || $_SESSION['user_type'] !== 'student') {
    header('Location: ../login/student-login.php');
    exit();
}

$full_name = $_SESSION['full_name'] ?? $_SESSION['username'] ?? 'Student';
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Student Dashboard</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            background-color: #f8fafc;
            color: #334155;
            line-height: 1.6;
        }

        /* Header Styles */
        .header {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            height: 70px;
            background: white;
            border-bottom: 1px solid #e2e8f0;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 24px;
            z-index: 1000;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .header-left {
            display: flex;
            align-items: center;
            gap: 16px;
        }

        .menu-toggle {
            background: none;
            border: none;
            font-size: 20px;
            color: #64748b;
            cursor: pointer;
            padding: 8px;
            border-radius: 8px;
            transition: all 0.2s ease;
        }

        .menu-toggle:hover {
            background-color: #f1f5f9;
            color: #3b82f5;
        }

        .header-title {
            font-size: 24px;
            font-weight: 600;
            color: #1e293b;
        }

        .header-right {
            display: flex;
            align-items: center;
        }

        .profile-section {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 6px 12px;
            border-radius: 12px;
            transition: background-color 0.2s ease;
            cursor: pointer;
        }

        .profile-section:hover {
            background-color: #f1f5f9;
        }

        .profile-avatar {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            object-fit: cover;
            border: 2px solid #e2e8f0;
        }

        .profile-info {
            display: flex;
            flex-direction: column;
            text-align: left;
        }

        .profile-name {
            font-weight: 600;
            font-size: 14px;
            color: #1e293b;
        }

        .profile-role {
            font-size: 12px;
            color: #64748b;
        }

        /* Sidebar Styles */
        .sidebar {
            position: fixed;
            top: 70px;
            left: 0;
            width: 280px;
            height: calc(100vh - 70px);
            background: white;
            border-right: 1px solid #e2e8f0;
            z-index: 999;
            transition: transform 0.3s ease, width 0.3s ease;
            overflow: hidden;
        }

        .sidebar.collapsed {
            width: 80px;
        }

        .sidebar-content {
            padding: 24px 0;
            height: 100%;
        }

        .nav-menu {
            list-style: none;
            padding: 0 12px;
        }

        .nav-item {
            margin-bottom: 4px;
        }

        .nav-link {
            display: flex;
            align-items: center;
            gap: 16px;
            padding: 12px 16px;
            color: #64748b;
            text-decoration: none;
            border-radius: 12px;
            transition: all 0.2s ease;
            font-weight: 500;
            position: relative;
            white-space: nowrap;
        }

        .nav-link:hover {
            background-color: #f1f5f9;
            color: #3b82f5;
        }

        .nav-item.active .nav-link {
            background-color: #3b82f5;
            color: white;
        }

        .nav-item.active .nav-link:hover {
            background-color: #2563eb;
        }

        .nav-icon {
            font-size: 20px;
            width: 20px;
            text-align: center;
            flex-shrink: 0;
        }

        .nav-text {
            transition: opacity 0.2s ease;
        }

        .sidebar.collapsed .nav-text {
            opacity: 0;
            width: 0;
            overflow: hidden;
        }

        .sidebar.collapsed .nav-link {
            justify-content: center;
            padding: 12px;
        }

        /* Main Content */
        .main-content {
            margin-left: 280px;
            margin-top: 70px;
            min-height: calc(100vh - 70px);
            transition: margin-left 0.3s ease;
            padding: 32px;
            background-color: #f8fafc;
        }

        .main-content.collapsed {
            margin-left: 80px;
        }

        .content-wrapper {
            max-width: 1200px;
            margin: 0 auto;
        }

        .welcome-section {
            background: white;
            padding: 32px;
            border-radius: 16px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            margin-bottom: 32px;
        }

        .welcome-section h2 {
            font-size: 32px;
            font-weight: 700;
            color: #1e293b;
            margin-bottom: 8px;
        }

        .welcome-section p {
            color: #64748b;
            font-size: 18px;
            margin-bottom: 32px;
        }

        .feature-cards {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 24px;
        }

        .feature-card {
            background: white;
            padding: 24px;
            border-radius: 12px;
            border: 1px solid #e2e8f0;
            text-align: center;
            transition: all 0.2s ease;
        }

        .feature-card:hover {
            border-color: #3b82f5;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(59, 130, 245, 0.15);
        }

        .feature-card i {
            font-size: 32px;
            color: #3b82f5;
            margin-bottom: 16px;
        }

        .feature-card h3 {
            font-size: 20px;
            font-weight: 600;
            color: #1e293b;
            margin-bottom: 8px;
        }

        .feature-card p {
            color: #64748b;
            font-size: 14px;
        }

        /* Logout Button */
        .logout-btn {
            background: #dc2626;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 14px;
            transition: background-color 0.2s ease;
        }

        .logout-btn:hover {
            background: #b91c1c;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
            .header {
                padding: 0 16px;
            }
            
            .header-title {
                font-size: 20px;
            }
            
            .profile-info {
                display: none;
            }
            
            .sidebar {
                transform: translateX(-100%);
                width: 280px;
            }
            
            .sidebar.mobile-open {
                transform: translateX(0);
            }
            
            .sidebar.collapsed {
                width: 280px;
                transform: translateX(-100%);
            }
            
            .sidebar.collapsed.mobile-open {
                transform: translateX(0);
            }
            
            .main-content {
                margin-left: 0;
                padding: 20px 16px;
            }
            
            .main-content.collapsed {
                margin-left: 0;
            }
            
            .welcome-section {
                padding: 24px 20px;
            }
            
            .welcome-section h2 {
                font-size: 24px;
            }
            
            .welcome-section p {
                font-size: 16px;
                margin-bottom: 24px;
            }
            
            .feature-cards {
                grid-template-columns: 1fr;
                gap: 16px;
            }
            
            .feature-card {
                padding: 20px;
            }
        }
    </style>
</head>
<body>
    <!-- Header with Profile -->
    <header class="header">
        <div class="header-left">
            <button class="menu-toggle" id="menuToggle">
                <i class="fas fa-bars"></i>
            </button>
            <h1 class="header-title">Student Dashboard</h1>
        </div>
        <div class="header-right">
            <div class="profile-section">
                <img src="https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1" alt="Profile" class="profile-avatar">
                <div class="profile-info">
                    <span class="profile-name"><?php echo htmlspecialchars($full_name); ?></span>
                    <span class="profile-role">Student</span>
                </div>
            </div>
            <button class="logout-btn" onclick="logout()">Logout</button>
        </div>
    </header>

    <!-- Sidebar Navigation -->
    <nav class="sidebar" id="sidebar">
        <div class="sidebar-content">
            <ul class="nav-menu">
                <li class="nav-item active">
                    <a href="#" class="nav-link">
                        <i class="fas fa-home nav-icon"></i>
                        <span class="nav-text">Home</span>
                    </a>
                </li>
                <li class="nav-item">
                    <a href="#" class="nav-link">
                        <i class="fas fa-tachometer-alt nav-icon"></i>
                        <span class="nav-text">Dashboard</span>
                    </a>
                </li>
                <li class="nav-item">
                    <a href="#" class="nav-link">
                        <i class="fas fa-tasks nav-icon"></i>
                        <span class="nav-text">Assignments</span>
                    </a>
                </li>
                <li class="nav-item">
                    <a href="#" class="nav-link">
                        <i class="fas fa-robot nav-icon"></i>
                        <span class="nav-text">AI Assistant</span>
                    </a>
                </li>
                <li class="nav-item">
                    <a href="#" class="nav-link">
                        <i class="fas fa-chart-bar nav-icon"></i>
                        <span class="nav-text">Results</span>
                    </a>
                </li>
                <li class="nav-item">
                    <a href="#" class="nav-link">
                        <i class="fas fa-ellipsis-h nav-icon"></i>
                        <span class="nav-text">More</span>
                    </a>
                </li>
            </ul>
        </div>
    </nav>

    <!-- Main Content Area -->
    <main class="main-content" id="mainContent">
        <div class="content-wrapper">
            <div class="welcome-section">
                <h2>Welcome back, <?php echo htmlspecialchars($full_name); ?>!</h2>
                <p>Here's what's happening with your studies today.</p>
            </div>
            
            <div class="feature-cards">
                <div class="feature-card">
                    <i class="fas fa-book"></i>
                    <h3>Current Courses</h3>
                    <p>View your enrolled courses and track your progress</p>
                </div>
                <div class="feature-card">
                    <i class="fas fa-calendar"></i>
                    <h3>Upcoming Deadlines</h3>
                    <p>Stay on top of your assignments and exams</p>
                </div>
                <div class="feature-card">
                    <i class="fas fa-chart-line"></i>
                    <h3>Performance</h3>
                    <p>Monitor your grades and academic progress</p>
                </div>
                <div class="feature-card">
                    <i class="fas fa-users"></i>
                    <h3>Classmates</h3>
                    <p>Connect with your peers and study groups</p>
                </div>
            </div>
        </div>
    </main>

    <script>
        function logout() {
            // Clear session and redirect to login
            fetch('../logout.php')
                .then(() => {
                    window.location.href = '../login/student-login.php';
                })
                .catch(() => {
                    window.location.href = '../login/student-login.php';
                });
        }

        // Sidebar toggle functionality
        document.getElementById('menuToggle').addEventListener('click', function() {
            const sidebar = document.getElementById('sidebar');
            const mainContent = document.getElementById('mainContent');
            
            sidebar.classList.toggle('collapsed');
            mainContent.classList.toggle('collapsed');
        });

        // Navigation functionality
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Remove active class from all nav items
                document.querySelectorAll('.nav-item').forEach(item => {
                    item.classList.remove('active');
                });
                
                // Add active class to clicked item
                this.closest('.nav-item').classList.add('active');
                
                // Update header title
                const linkText = this.querySelector('.nav-text').textContent;
                document.querySelector('.header-title').textContent = linkText;
            });
        });
    </script>
</body>
</html> 