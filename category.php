<?php

// Include the database connection
require_once 'db.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // Get category data from the form
    $categoryName = trim($_POST['name']);
    $categoryDescription = isset($_POST['description']) ? trim($_POST['description']) : '';

    // Validate the category name (make sure it's not empty)
    if (empty($categoryName)) {
        die('Category name is required.');
    }

    // Prepare SQL to insert the new category
    $sql = "INSERT INTO categories (name, description) VALUES (:name, :description)";

    // Prepare the statement
    $stmt = $pdo->prepare($sql);

    // Bind parameters
    $stmt->bindParam(':name', $categoryName);
    $stmt->bindParam(':description', $categoryDescription);

    try {
        // Execute the statement
        $stmt->execute();

        // Check if the insertion was successful
        echo 'Category created successfully!';
    } catch (PDOException $e) {
        die('Error creating category: ' . $e->getMessage());
    }
}
?>
