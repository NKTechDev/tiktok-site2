<?php

class PendingVideosController {

    // Database connection settings
    private $host = 'localhost';
    private $username = 'root'; // Update with your MySQL username
    private $password = '';     // Update with your MySQL password
    private $dbname = 'video_db'; // Update with your database name
    private $conn;

    public function __construct() {
        // Create a connection to the database
        $this->conn = new mysqli($this->host, $this->username, $this->password, $this->dbname);
        
        // Check for connection error
        if ($this->conn->connect_error) {
            die("Connection failed: " . $this->conn->connect_error);
        }
    }

    // Fetch pending videos from the database
    public function getPendingVideos() {
        $sql = "SELECT id, title, description, upload_date FROM videos WHERE status = 'pending' ORDER BY upload_date DESC";
        $result = $this->conn->query($sql);

        if ($result->num_rows > 0) {
            $videos = [];
            while ($row = $result->fetch_assoc()) {
                $videos[] = $row;
            }
            return $videos;
        } else {
            return [];
        }
    }

    // Render videos in HTML format
    public function renderPendingVideos() {
        $pendingVideos = $this->getPendingVideos();

        if (!empty($pendingVideos)) {
            echo "<h2>Pending Videos</h2>";
            echo "<table border='1'>";
            echo "<tr><th>Title</th><th>Description</th><th>Upload Date</th><th>Actions</th></tr>";
            foreach ($pendingVideos as $video) {
                echo "<tr>";
                echo "<td>" . htmlspecialchars($video['title']) . "</td>";
                echo "<td>" . htmlspecialchars($video['description']) . "</td>";
                echo "<td>" . htmlspecialchars($video['upload_date']) . "</td>";
                echo "<td>
                        <a href='approve_video.php?id=" . $video['id'] . "'>Approve</a> |
                        <a href='reject_video.php?id=" . $video['id'] . "'>Reject</a>
                      </td>";
                echo "</tr>";
            }
            echo "</table>";
        } else {
            echo "<p>No pending videos found.</p>";
        }
    }
}

// Instantiate the controller and render the pending videos
$controller = new PendingVideosController();
$controller->renderPendingVideos();

?>
