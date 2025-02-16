import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Switch, Modal, Box, CircularProgress, Avatar, Button, Grid } from '@mui/material';
import { toast } from 'react-toastify'; // React Toastify for notifications
import axios from 'axios';

const VideoCard = ({ video, onStatusUpdate }) => {
    const [openModal, setOpenModal] = useState(false); // State for modal visibility
    const [loading, setLoading] = useState(false); // Loading state for status update
    const [user, setUser] = useState(null); // State for storing user info

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/v1/user/${video.sub}`);
                setUser(response.data); // Set user info
            } catch (error) {
                console.error('Error fetching user:', error);
            }
        };

        fetchUser();
    }, [video.sub]);

    // Handle Switch toggle
    const handleSwitchChange = async (event) => {
        if (event.target.checked) {
            // Show confirmation modal before updating status to 'published'
            setOpenModal(true);
        }
    };

    const handlePublishConfirm = async () => {
        setLoading(true);

        try {
            // Make API request to update video status to 'published'
            await axios.put(`http://localhost:5000/api/v1/video/${video._id}/publish`);
            toast.success('Video published successfully!');

            // Update status in parent component
            onStatusUpdate(video._id, 'published');
        } catch (error) {
            toast.error('Failed to publish the video.');
        }

        setLoading(false);
        setOpenModal(false); // Close modal after publishing
    };

    const handleModalClose = () => {
        setOpenModal(false); // Close modal if the user cancels
    };

    return (
        <Card sx={{ maxWidth: 345, margin: 3, backgroundColor: '#1e1e1e', borderRadius: '8px', boxShadow: '0px 8px 15px rgba(255, 255, 255, 0.2)', transition: 'transform 0.3s ease, box-shadow 0.3s ease', '&:hover': { transform: 'scale(1.05)', boxShadow: '0px 8px 20px rgba(255, 255, 255, 0.4)' } }}>
            <CardContent>
                {/* User's Nickname and Picture */}
                {user && (
                    <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
                        <Avatar src={user.picture} alt={user.nickname} sx={{ width: 40, height: 40, marginRight: 1 }} />
                        <Typography variant="body2" color="white" sx={{ fontWeight: 'bold' }}>
                            {user.nickname}
                        </Typography>
                    </Box>
                )}

                <Typography variant="h6" color="white" align="center" sx={{ fontWeight: 'bold' }}>
                    {video.title}
                </Typography>
                <Typography variant="body2" color="white" align="center" sx={{ marginTop: 1, fontSize: '0.75rem', opacity: 0.8 }}>
                    {video.description}
                </Typography>

                {/* Video Element */}
                <Box sx={{ marginTop: 2 }}>
                    <video width="100%" height="200" controls>
                        <source src={video.videoUrl} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                </Box>

                {/* Switch to toggle published state */}
                <Grid container spacing={2} sx={{ marginTop: 2 }} justifyContent="space-between">
                    <Grid item>
                        <Typography variant="body2" color="white">
                            Published
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Switch
                            checked={video.status === 'published'}
                            onChange={handleSwitchChange}
                            color="default"
                        />
                    </Grid>
                </Grid>
            </CardContent>

            {/* Modal for Confirmation */}
            <Modal open={openModal} onClose={handleModalClose}>
                <Box sx={modalStyle}>
                    <Typography variant="h6" color="white" gutterBottom>
                        Are you sure you want to publish this video?
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Button
                            onClick={handlePublishConfirm}
                            variant="contained"
                            color="primary"
                            disabled={loading}
                            sx={{ flex: 1, marginRight: 1 }}
                        >
                            {loading ? <CircularProgress size={24} color="inherit" /> : ' Publish'}
                        </Button>
                        <Button
                            onClick={handleModalClose}
                            variant="outlined"
                            color="secondary"
                            sx={{ flex: 1 }}
                        >
                            Cancel
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </Card>
    );
};

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'black',
    padding: '20px',
    borderRadius: '8px',
    color: 'white',
    width: '300px',
    maxWidth: '80%',
    boxShadow: '0px 8px 15px rgba(255, 255, 255, 0.5)',
};

export default VideoCard;
