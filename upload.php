<?php

// Set the upload directory
$uploadDir = "uploads/videos/";

// Define allowed video formats
$allowedTypes = ['video/mp4', 'video/avi', 'video/mov', 'video/mkv', 'video/webm', 'video/flv'];
$maxSize = 500 * 1024 * 1024; // 500MB (max file size)

if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_FILES['video'])) {

    // Get video file info
    $file = $_FILES['video'];
    $fileName = basename($file['name']);
    $fileTmpName = $file['tmp_name'];
    $fileSize = $file['size'];
    $fileError = $file['error'];
    $fileType = $file['type'];

    // Check if there was an error during the file upload
    if ($fileError !== UPLOAD_ERR_OK) {
        die('Error during file upload. Please try again.');
    }

    // Check the file type
    if (!in_array($fileType, $allowedTypes)) {
        die('Invalid video format. Only MP4, AVI, MOV, MKV, WebM, and FLV are allowed.');
    }

    // Check file size
    if ($fileSize > $maxSize) {
        die('File is too large. Maximum allowed size is 500MB.');
    }

    // Generate a unique file name to avoid name conflicts
    $fileExtension = pathinfo($fileName, PATHINFO_EXTENSION);
    $newFileName = uniqid('video_', true) . '.' . $fileExtension;

    // Define the full path where the file will be uploaded
    $uploadPath = $uploadDir . $newFileName;

    // Check if the upload directory exists, if not create it
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0777, true);
    }

    // Move the uploaded file to the target directory
    if (move_uploaded_file($fileTmpName, $uploadPath)) {
        echo "Video uploaded successfully: " . $uploadPath;
    } else {
        die('Failed to upload the video.');
    }
} else {
    die('No video file received.');
}

?>
