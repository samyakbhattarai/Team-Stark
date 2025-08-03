<?php
session_start();

// Parent credentials
$parent_credentials = [
    'parent1' => 'parent123',
    'parent2' => 'parent456',
    'parent3' => 'parent789',
    'john_doe' => 'john123',
    'sarah_smith' => 'sarah456',
    'mike_wilson' => 'mike789',
    'emma_davis' => 'emma123',
    'alex_brown' => 'alex456',
    'lisa_johnson' => 'lisa123',
    'david_miller' => 'david456',
    'anna_garcia' => 'anna789',
    'robert_taylor' => 'robert123'
];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = $_POST['username'] ?? '';
    $password = $_POST['password'] ?? '';
    
    // Check if credentials are valid
    if (isset($parent_credentials[$username]) && $parent_credentials[$username] === $password) {
        $_SESSION['user_type'] = 'parent';
        $_SESSION['username'] = $username;
        $_SESSION['logged_in'] = true;
        
        // Redirect to student dashboard
        header('Location: ../student/index.html');
        exit();
    } else {
        $error = 'Invalid username or password';
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="https://cdn.tailwindcss.com"></script>
    <title>Parent Login</title>
</head>
<body>
    <section class="bg-gray-50 min-h-screen flex items-center justify-center p-4 relative">
        
        <!-- Back Button -->
        <button onclick="window.location.href='../profile-select/index.html'" class="absolute top-4 left-4 bg-[#18008f] text-white px-4 py-2 rounded-lg hover:bg-[#14006f] transition-colors duration-200 flex items-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
            </svg>
            Back
        </button>
        
        <div class="bg-gray-100 flex flex-col lg:flex-row rounded-2xl shadow-lg max-w-5xl w-full p-5 items-center">
            
            <!-- Login Form -->
            <div class="w-full lg:w-1/2 px-4 lg:px-8 py-8 lg:py-0">
                <h1 class="font-bold text-2xl lg:text-3xl text-[#18008f] text-center lg:text-left">PARENTS PANEL</h1>
                <h2 class="font-bold text-lg lg:text-xl text-[#b0a7df] text-center lg:text-left mb-6">LOGIN</h2>

                <?php if (isset($error)): ?>
                    <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        <?php echo htmlspecialchars($error); ?>
                    </div>
                <?php endif; ?>

                <form method="POST" class="flex flex-col gap-4">
                    <input
                        class="p-3 lg:p-2 mt-4 lg:mt-8 rounded-xl border w-full"
                        type="text"
                        name="username"
                        placeholder="Username"
                        required
                    />
                    <input
                        class="p-3 lg:p-2 rounded-xl border w-full"
                        type="password"
                        name="password"
                        placeholder="Password"
                        required
                    />
                    <button type="submit" class="bg-[#18008f] rounded-xl text-white py-3 lg:py-4 w-full">LOGIN</button>
                    <div class="text-center">
                        <a href="#" class="text-[#18008f] text-sm hover:underline">Forgot Password? Contact admin</a>
                    </div>
                </form>
            </div>

            <!-- Image -->
            <div class="w-full lg:w-1/2 hidden sm:block">
                <img class="rounded-2xl w-full h-auto" src="login.jpg" alt="Login illustration" />
            </div>
        </div>
    </section>
</body>
</html> 