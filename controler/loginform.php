<?php

// Include the database connection
require_once 'db.php';
session_start();  // Start the session to store user information

// Check if the form is submitted
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // Retrieve form data
    $email = trim($_POST['email']);
    $password = trim($_POST['password']);

    // Validate the input data
    if (empty($email) || empty($password)) {
        die("Email and password are required.");
    }

    // Fetch the user data by email
    $sql = "SELECT * FROM users WHERE email = :email";
    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(':email', $email);
    $stmt->execute();
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    // Check if the user exists and verify the password
    if ($user && password_verify($password, $user['password'])) {
        // Successful login, store user data in session
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['username'] = $user['username'];
        echo "Login successful! Welcome " . $user['username'];
    } else {
        die("Invalid email or password.");
    }
}
?>
