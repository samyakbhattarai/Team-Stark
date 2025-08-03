<?php
session_start();

// Destroy all session data
session_destroy();

// Clear session cookies
if (isset($_COOKIE[session_name()])) {
    setcookie(session_name(), '', time() - 3600, '/');
}

// Return success response
http_response_code(200);
echo json_encode(['success' => true]);
?> 