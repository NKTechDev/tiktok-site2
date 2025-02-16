import React, { useState, useEffect } from 'react';
import { Grid, CircularProgress } from '@mui/material';
import axios from 'axios';
import VideoCard from './VideoCard'; // Import VideoCard component
import { ToastContainer } from 'react-toastify';


const VideoList = () => {
  const [videos, setVideos] = useState([]); // To store the fetched videos
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    // Fetch pending videos from API
    const fetchVideos = async () => {
      try {
        // Replace with the correct endpoint to fetch pending videos
        const response = await axios.get('http://localhost:5000/api/v1/video/videos?status=pending'); 
        setVideos(response.data); // Store the fetched videos
        setLoading(false); // Set loading to false after data is fetched
      } catch (error) {
        console.error('Error fetching videos:', error);
         setLoading(false);
      }
    };

    fetchVideos(); // Call fetchVideos function when component mounts
  }, []);

  const handleStatusUpdate = (videoId, status) => {
    setVideos((prevVideos) =>
      prevVideos.map((video) =>
        video._id === videoId ? { ...video, status: status } : video
      )
    );
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress /> {/* Display loading spinner while data is being fetched */}
      </div>
    );
  }

  return (
    <Grid container spacing={2} justifyContent="center">
      {videos.length > 0 ? (
        videos.map((video) => (
          <Grid item xs={12} sm={6} md={3} key={video._id}>
            <VideoCard video={video} onStatusUpdate={handleStatusUpdate} />
          </Grid>
        ))
      ) : (
        <div style={{ color: 'white', textAlign: 'center' }}>
          <h4>No pending videos found.</h4>
        </div>
      )}

<ToastContainer position="top-center" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />

    </Grid>
  );
};

export default VideoList;
