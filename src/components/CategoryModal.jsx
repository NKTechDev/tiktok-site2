import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, Button, TextField, Slider } from '@mui/material';
import ReactCropper from 'react-easy-crop';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify'; // Import ToastContainer and toast
import 'react-toastify/dist/ReactToastify.css'; // Import toast styling

const CategoryModal = ({ open, handleClose }) => {
    const [imageFile, setImageFile] = useState(null);
    const [category, setCategory] = useState('');
    const [subcategory, setSubcategory] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [imageUrl, setImageUrl] = useState(null);
    const [croppedImage, setCroppedImage] = useState(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedArea, setCroppedArea] = useState(null);
    const [imageDimensions, setImageDimensions] = useState({ width: 300, height: 300 });

    // Handle image file selection
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                setErrorMessage('Please select a valid image file.');
                setImageFile(null);
                toast.error('Please select a valid image file.'); // Show toast on error
            } else {
                setErrorMessage('');
                setImageFile(file);
                setImageUrl(URL.createObjectURL(file));
            }
        }
    };

    // Handle category input change
    const handleCategoryChange = (e) => {
        setCategory(e.target.value);
    };

    // Handle subcategory input change
    const handleSubcategoryChange = (e) => {
        setSubcategory(e.target.value);
    };

    // Handle width and height change for cropping
    const handleDimensionChange = (e, newValue) => {
        const { name } = e.target;
        setImageDimensions((prev) => {
            const newDimensions = { ...prev, [name]: newValue };
            const newCropArea = {
                x: crop.x,
                y: crop.y,
                width: newDimensions.width,
                height: newDimensions.height,
            };
            setCroppedArea(newCropArea);
            return newDimensions;
        });
    };

    // Get the cropped image as PNG
    const getCroppedImage = async () => {
        if (!croppedArea || !imageUrl) return;

        const image = new Image();
        image.src = imageUrl;

        image.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const scaleX = image.naturalWidth / image.width;
            const scaleY = image.naturalHeight / image.height;

            const cropX = croppedArea.x * scaleX;
            const cropY = croppedArea.y * scaleY;
            const cropWidth = croppedArea.width * scaleX;
            const cropHeight = croppedArea.height * scaleY;

            canvas.width = cropWidth;
            canvas.height = cropHeight;

            ctx.drawImage(image, cropX, cropY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);

            const croppedImageUrl = canvas.toDataURL('image/png');
            const base64Data = croppedImageUrl.split(',')[1];
            const binaryData = atob(base64Data);
            const arrayBuffer = new ArrayBuffer(binaryData.length);
            const uint8Array = new Uint8Array(arrayBuffer);

            for (let i = 0; i < binaryData.length; i++) {
                uint8Array[i] = binaryData.charCodeAt(i);
            }

            const blob = new Blob([uint8Array], { type: 'image/png' });
            const file = new File([blob], 'cropped-image.png', { type: 'image/png' });

            setCroppedImage(file);
        };
    };

    // Handle the save action
    const handleSave = () => {
        if (!category || !subcategory || !croppedImage) {
            toast.error('Please select an image, crop it, provide a category name, and a subcategory.'); // Show toast error
            return;
        }

        getCroppedImage();
        toast.success('Cropped image saved successfully!'); // Show success toast
    };

    // Handle the image creation and API call
    const handleCreate = async () => {
        if (!category || !subcategory || !croppedImage) {
            toast.error('Please select an image, crop it, and provide both category and subcategory.'); // Show toast error
            return;
        }
    
        setIsUploading(true);
        setErrorMessage('');
    
        const formData = new FormData();
        formData.append('category', category);
        formData.append('subcategory', subcategory);
        formData.append('image', croppedImage);
    
        try {
            const response = await axios.post('http://localhost:5000/api/v1/category/create', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
    
            setIsUploading(false);
    
            // Show success message from backend (assuming response.data.message contains the success message)
            if (response.data && response.data.message) {
                toast.success(response.data.message); // Show backend success message in toast
            } else {
                toast.success('Category created successfully!'); // Default success message
            }
    
            setCroppedImage(null)
            setCategory('');
            setSubcategory('');
            setImageFile(null);
    
        } catch (error) {
            setIsUploading(false);
    
            // Check if error response exists and show the backend error message in toast
            if (error.response && error.response.data && error.response.data.message) {
                toast.error(error.response.data.message); // Show backend error message in toast
            } else {
                toast.error('Error creating the category. Please try again.'); // Default error message
            }
        }
    };
    
    

    useEffect(() => {
        if (imageUrl && croppedArea) {
            getCroppedImage();
        }
    }, [croppedArea, imageUrl]);

    return (
        <>
            <Modal open={open} onClose={handleClose}>
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        backgroundColor: 'white',
                        padding: 4,
                        borderRadius: 2,
                        boxShadow: 24,
                        minWidth: 1200,
                        maxHeight: '80vh',
                        overflowY: 'auto',
                        display: 'flex',
                        flexDirection: 'row',
                        gap: 3,
                    }}
                >
                    {/* Left side - Original Image */}
                    <Box sx={{ flex: 1, padding: 2 }}>
                        <Typography variant="h6" gutterBottom align="center">
                            Original Image
                        </Typography>

                        {/* Image selection input */}
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            style={{ display: 'block', margin: '0 auto 16px auto' }}
                        />

                        {/* Display original selected image */}
                        {imageUrl && (
                            <img
                                src={imageUrl}
                                alt="Original"
                                style={{
                                    width: '100%',
                                    maxHeight: '400px',
                                    objectFit: 'contain',
                                    marginBottom: '16px',
                                }}
                            />
                        )}
                    </Box>

                    {/* Right side - Cropper */}
                    <Box sx={{ flex: 1, padding: 2 }}>
                        <Typography variant="h6" gutterBottom align="center">
                            Edit Image
                        </Typography>

                        {/* React Easy Crop Component */}
                        {imageUrl && (
                            <Box sx={{ position: 'relative', width: '100%', height: '400px' }}>
                                <ReactCropper
                                    image={imageUrl}
                                    crop={crop}
                                    zoom={zoom}
                                    minZoom={1}
                                    maxZoom={3}
                                    aspect={1}
                                    onCropChange={setCrop}
                                    onZoomChange={setZoom}
                                    onCropComplete={(croppedArea, croppedAreaPixels) => {
                                        setCroppedArea(croppedAreaPixels);
                                    }}
                                />
                            </Box>
                        )}

                        {/* Modified Image Preview */}
                        {croppedImage && (
                            <Box sx={{ marginTop: 2, textAlign: 'center' }}>
                                <Typography variant="body2" color="textSecondary" gutterBottom>
                                    Cropped Image Preview
                                </Typography>
                                <img
                                    src={URL.createObjectURL(croppedImage)}
                                    alt="Cropped Preview"
                                    style={{
                                        width: '100%',
                                        maxHeight: '200px',
                                        objectFit: 'contain',
                                        border: '1px solid #ccc',
                                        marginBottom: '16px',
                                    }}
                                />
                            </Box>
                        )}

                        {/* Category and Subcategory Inputs */}
                        <TextField
                            label="Category Name *"
                            fullWidth
                            value={category}
                            onChange={handleCategoryChange}
                            sx={{ marginBottom: 2 }}
                        />
                        <TextField
                            label="Subcategory Names *"
                            fullWidth
                            value={subcategory}
                            onChange={handleSubcategoryChange}
                            sx={{ marginBottom: 2 }}
                        />

                        {/* Error message */}
                        {errorMessage && (
                            <Typography variant="body2" color="error" align="center" sx={{ marginBottom: 2 }}>
                                {errorMessage}
                            </Typography>
                        )}

                        {/* Image Dimensions */}
                        <Box sx={{ marginBottom: 1 }}>
                            <Typography variant="body2" align="center" sx={{ marginBottom: 1 }}>
                                Adjust Image Dimensions
                            </Typography>
                            <Slider
                                value={imageDimensions.width}
                                onChange={handleDimensionChange}
                                valueLabelDisplay="auto"
                                valueLabelFormat={(value) => `Width: ${value}`}
                                name="width"
                                min={100}
                                max={800}
                                step={10}
                                sx={{ marginBottom: 2 }}
                            />
                            <Slider
                                value={imageDimensions.height}
                                onChange={handleDimensionChange}
                                valueLabelDisplay="auto"
                                valueLabelFormat={(value) => `Height: ${value}`}
                                name="height"
                                min={100}
                                max={800}
                                step={10}
                            />
                        </Box>

                        {/* Save and Create Buttons */}
                        <Box sx={{ marginTop: 2, textAlign: 'center' }}>
                            <Button variant="contained" onClick={handleSave} color="secondary" fullWidth>
                                Save
                            </Button>
                        </Box>

                        <Box sx={{ marginTop: 1, textAlign: 'center' }}>
                            {isUploading ? (
                                <Button variant="contained" disabled>
                                    Creating...
                                </Button>
                            ) : (
                                <Button variant="contained" onClick={handleCreate} color="primary" fullWidth>
                                    Create Category
                                </Button>
                            )}
                        </Box>
                    </Box>
                </Box>
            </Modal>

            {/* Toast Container to display toasts */}
        </>
    );
};

export default CategoryModal;
