import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, Button, TextField, CircularProgress, Autocomplete } from '@mui/material';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify styles

const VideoUploadModal = ({ open, handleClose }) => {
    const [videoFile, setVideoFile] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [category, setCategory] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [videoDuration, setVideoDuration] = useState(0);
    const [durationError, setDurationError] = useState('');
    const { user } = useAuth0();

    // State for categories and loading/error state
    const [categories, setCategories] = useState([]);
    const [categoriesLoading, setCategoriesLoading] = useState(true);
    const [fetchError, setFetchError] = useState('');

    useEffect(() => {
        fetchCategories();
    }, []);

    // Fetch categories from API
    const fetchCategories = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/v1/category'); // Replace with your API URL
            setCategories(response.data.categories); // Set the fetched categories
            setCategoriesLoading(false); // Set loading to false once categories are fetched
        } catch (err) {
            console.error('Error fetching categories:', err);
            setFetchError('Error fetching categories.');
            setCategoriesLoading(false); // Set loading to false if there's an error
        }
    };

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
    const handleCategoryChange = (event, newCategory) => {
        setCategory(newCategory);
    };

    // Handle upload video logic
    const handleUpload = () => {
        if (!category || !videoFile || !title) {
            toast.error('Please fill in all required fields: Title, Category, and Video.');
            return;
        }

        setIsUploading(true);
        toast.dismiss(); // Dismiss any previous toasts

        const formData = new FormData();
        formData.append('video', videoFile);
        formData.append('category', category._id); // Assuming category is an object with _id
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
            toast.success('Video uploaded successfully!'); // Success toast
            setVideoFile(null);
            setTitle('');
            setCategory('');
            setDescription('');
        })
        .catch(error => {
            setIsUploading(false);
            toast.error('Error uploading video. Please try again.'); // Error toast
            console.error('Error uploading video:', error);
        });
    };

    return (
        <>
            {/* Toastify Container */}
            <ToastContainer position="top-center" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />

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
                            Please select a video file (Max size: 25 MB Max duration: 60 seconds)
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
                            <video width="100%" height="auto" style={{ maxHeight: '300px', objectFit: 'cover' }} controls>
                                <source src={URL.createObjectURL(videoFile)} type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                        </Box>
                    )}

                    {/* Category Dropdown with Autocomplete */}
                    <Autocomplete
                        value={category}
                        onChange={handleCategoryChange}
                        options={categories}
                        getOptionLabel={(option) => option.name}  // Assuming the category object has a `name` field
                        isOptionEqualToValue={(option, value) => option._id === value._id}  // Assuming category has `_id`
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Category"
                                fullWidth
                                variant="outlined"
                                sx={{ marginBottom: 2 }}
                            />
                        )}
                    />

                    {/* Description Field */}
                    <TextField
                        label="Description (Optional)"
                        fullWidth
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        sx={{ marginBottom: 2 }}
                        multiline
                        rows={4}
                    />

                    {/* Duration Error */}
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
                </Box>
            </Modal>
        </>
    );
};

export default VideoUploadModal;
