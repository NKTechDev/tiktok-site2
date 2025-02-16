<?php
// Path to the video file
$videoPath = 'path/to/your/video.mp4';

// Check if the video file exists
if (!file_exists($videoPath)) {
    die('Video file not found.');
}

// Get the video file size
$fileSize = filesize($videoPath);

// Set the appropriate headers for video streaming
header('Content-Type: video/mp4');  // Change this depending on your video type (e.g., video/webm, video/avi, etc.)
header('Content-Length: ' . $fileSize);
header('Content-Disposition: inline; filename="' . basename($videoPath) . '"');
header('Accept-Ranges: bytes');

// Open the video file for reading
$video = fopen($videoPath, 'rb');

// Read and output the video file in chunks to the browser
while (!feof($video)) {
    echo fread($video, 1024 * 8); // Read in 8KB chunks
    flush();  // Send output to the browser
}

// Close the file after streaming
fclose($video);
?>
