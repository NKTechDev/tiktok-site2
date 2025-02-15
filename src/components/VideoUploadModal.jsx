import React, { useState } from 'react';
import { Modal, Box, Typography, Button, TextField, MenuItem, Select, InputLabel, FormControl, FormHelperText, InputAdornment, CircularProgress } from '@mui/material';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';


// Initialize Toastify
const VideoUploadModal = ({ open, handleClose }) => {
    const [videoFile, setVideoFile] = useState(null); 
    const [errorMessage, setErrorMessage] = useState(''); 
    const [category, setCategory] = useState('');
    const [isUploading, setIsUploading] = useState(false); 
    const [searchTerm, setSearchTerm] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [videoDuration, setVideoDuration] = useState(0);
    const [durationError, setDurationError] = useState('');
    const [uploadMessage, setUploadMessage] = useState(''); // New state for upload message
    const {  user , isLoading } = useAuth0();


    // Dummy categories (these would ideally come from an API)
    const categories = [
        'Education', 'Entertainment', 'Music', 'Sports', 'Technology', 
        'Lifestyle', 'Health', 'Gaming', 'News', 'Cooking', 'Science', 
        'Art', 'Travel', 'Business', 'Comedy', 'Documentary'
    ];

    // Handle file selection and validation
    const handleFileChange = (event) => {
        const file = event.target.files[0];

        if (file) {
            const validTypes = ['video/mp4', 'image/jpeg', 'image/png', 'image/jpg'];
            if (!validTypes.includes(file.type)) {
                setErrorMessage('Invalid file type. Please select a valid video or image.');
                setVideoFile(null);
            } else if (file.size > 25 * 1024 * 1024) {
                setErrorMessage('File size exceeds 25 MB. Please select a smaller file.');
                setVideoFile(null);
            } else {
                setErrorMessage('');
                setVideoFile(file);
                if (file.type.startsWith('video/')) {
                    const videoElement = document.createElement('video');
                    videoElement.src = URL.createObjectURL(file);
                    videoElement.onloadedmetadata = () => {
                        const duration = videoElement.duration;
                        if (duration > 60) {
                            setDurationError('Video duration should not exceed 1 minute.');
                        } else {
                            setVideoDuration(duration);
                            setDurationError('');
                        }
                    };
                }
            }
        }
    };

    // Handle category change
    const handleCategoryChange = (event) => {
        setCategory(event.target.value);
    };

    // Handle search term change
    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    // Handle upload video logic
    const handleUpload = () => {
        if (!category || !videoFile || !title) {
            setUploadMessage('Please fill in all required fields: Title, Category, and Video.');
            return;
        }

        setIsUploading(true);
        setUploadMessage(''); // Clear previous message if any

        const formData = new FormData();
        formData.append('video', videoFile);
        formData.append('category', category);
        formData.append('title', title);
        formData.append('description', description);
        formData.append('sub', user.sub);  // Add user.sub to the formData


        // Upload video with axios
        axios.post('http://localhost:5000/api/v1/video/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
        .then(response => {
            setIsUploading(false);
            setUploadMessage('Video uploaded successfully!'); // Set success message
            setVideoFile(null)
            setTitle('');
            setCategory('');
            setDescription('')
            setUploadMessage('')
        })
        .catch(error => {
            setIsUploading(false);
            setUploadMessage('Error uploading video. Please try again.'); // Set error message
            console.error('Error uploading video:', error);
        });
    };

    // Filter categories based on the search term
    const filteredCategories = categories.filter((cat) =>
        cat.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Modal open={open} onClose={handleClose}>
            <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                backgroundColor: 'white',
                padding: 4,
                borderRadius: 2,
                boxShadow: 24,
                minWidth: 400,
                maxWidth: 600,
                maxHeight: '100vh',
                overflowY: 'auto',
                width: '90%',
            }}>
                <Typography variant="h6" gutterBottom align="center">Upload a Video</Typography>

                {/* Video Title */}
                <TextField
                    label="Title"
                    fullWidth
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    sx={{ marginBottom: 2 }}
                />

                {/* File Input for Video */}
                <Box sx={{ marginBottom: 2 }}>
                    <Typography variant="body2" color="textSecondary" align="center">
                        Please select a video file (Max size: 25 MB)
                    </Typography>
                    <input
                        type="file"
                        accept="video/*,image/*"
                        onChange={handleFileChange}
                        style={{ marginBottom: '16px', width: '100%' }}
                    />
                </Box>

                {/* Error message if file is too large or invalid */}
                {errorMessage && (
                    <Typography variant="body2" color="error" align="center" sx={{ marginBottom: 2 }}>
                        {errorMessage}
                    </Typography>
                )}

                {/* Display video preview */}
                {videoFile && (
                    <Box sx={{ marginBottom: 2 }}>
                        <video width="100%" controls>
                            <source src={URL.createObjectURL(videoFile)} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                    </Box>
                )}

                {/* Category Search */}
                <Box sx={{ marginBottom: 2 }}>
                    <TextField
                        fullWidth
                        placeholder="Search categories..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        InputProps={{
                            startAdornment: <InputAdornment position="start">🔍</InputAdornment>,
                        }}
                    />
                </Box>

                {/* Category Dropdown with Scroll */}
                <FormControl fullWidth sx={{ marginBottom: 2 }}>
                    <InputLabel>Category</InputLabel>
                    <Select
                        value={category}
                        onChange={handleCategoryChange}
                        label="Category"
                        displayEmpty
                        MenuProps={{
                            PaperProps: {
                                style: {
                                    maxHeight: 200,
                                    overflowY: 'auto',
                                },
                            },
                        }}
                    >
                        {filteredCategories.map((category, index) => (
                            <MenuItem key={index} value={category}>
                                {category}
                            </MenuItem>
                        ))}
                    </Select>
                    <FormHelperText>Select a category for your video</FormHelperText>
                </FormControl>

                {/* Description Field (Optional) */}
                <TextField
                    label="Description (Optional)"
                    fullWidth
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    sx={{ marginBottom: 2 }}
                    multiline
                    rows={4}
                />

                {/* Duration Error (Optional) */}
                {durationError && (
                    <Typography variant="body2" color="error" align="center" sx={{ marginBottom: 2 }}>
                        {durationError}
                    </Typography>
                )}

                {/* Upload Button */}
                <Box sx={{ marginTop: 2, textAlign: 'center' }}>
                    {isUploading ? (
                        <CircularProgress />
                    ) : (
                        <Button variant="contained" onClick={handleUpload} color="primary" fullWidth>
                            Upload Video
                        </Button>
                    )}
                </Box>

                {/* Display upload message */}
                {uploadMessage && (
                    <Typography variant="body2" color={uploadMessage.includes('Error') ? 'error' : 'success'} align="center" sx={{ marginTop: 2 }}>
                        {uploadMessage}
                    </Typography>
                )}
            </Box>
        </Modal>
    );
};

export default VideoUploadModal;
