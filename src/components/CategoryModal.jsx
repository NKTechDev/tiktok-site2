import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, Button, TextField, Slider } from '@mui/material';
import ReactCropper from 'react-easy-crop';
import axios from 'axios';

const CategoryModal = ({ open, handleClose }) => {
    const [imageFile, setImageFile] = useState(null);
    const [category, setCategory] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [imageUrl, setImageUrl] = useState(null);
    const [croppedImage, setCroppedImage] = useState(null); // State to store the cropped image
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedArea, setCroppedArea] = useState(null);
    const [imageDimensions, setImageDimensions] = useState({ width: 300, height: 300 }); // Default dimensions

    // Handle image file selection
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                setErrorMessage('Please select a valid image file.');
                setImageFile(null);
            } else {
                setErrorMessage('');
                setImageFile(file);
                setImageUrl(URL.createObjectURL(file)); // Create a URL for the selected image
            }
        }
    };

    // Handle category input change
    const handleCategoryChange = (e) => {
        setCategory(e.target.value);
    };

    // Handle width and height change for cropping and update the crop area
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
            setCroppedArea(newCropArea); // Update cropped area
            return newDimensions;
        });
    };

    // Get the cropped image as PNG and save it as a File object
    const getCroppedImage = async () => {
        if (!croppedArea || !imageUrl) return;

        const image = new Image();
        image.src = imageUrl;

        // Ensure the image is fully loaded before creating the canvas
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

            // Draw the cropped area to the canvas
            ctx.drawImage(image, cropX, cropY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);

            // Convert canvas to PNG data URL
            const croppedImageUrl = canvas.toDataURL('image/png');

            // Convert the PNG data URL to a File object
            const base64Data = croppedImageUrl.split(',')[1];
            const binaryData = atob(base64Data);
            const arrayBuffer = new ArrayBuffer(binaryData.length);
            const uint8Array = new Uint8Array(arrayBuffer);

            for (let i = 0; i < binaryData.length; i++) {
                uint8Array[i] = binaryData.charCodeAt(i);
            }

            // Create a new Blob and convert it to a File
            const blob = new Blob([uint8Array], { type: 'image/png' });
            const file = new File([blob], 'cropped-image.png', { type: 'image/png' });

            // Set the cropped image file state
            setCroppedImage(file); // Save the cropped image as a File
        };
    };

    // Handle the save action
    const handleSave = () => {
        if (!category || !croppedImage) {
            setErrorMessage('Please select an image, crop it, and provide a category name.');
            return;
        }

        // Save the cropped image
        getCroppedImage(); // Ensure the cropped image is saved

        // Now the croppedImage state contains the File object of the cropped image
        alert('Cropped image saved successfully!');
    };

    // Handle the image creation and API call
    const handleCreate = async () => {
        if (!category || !croppedImage) {
            setErrorMessage('Please select an image, crop it, and provide a category name.');
            return;
        }

        setIsUploading(true);
        setErrorMessage('');

        const formData = new FormData();
        formData.append('category', category);
        formData.append('image', croppedImage); // Send the cropped image file

        try {
            const response = await axios.post('http://localhost:5000/api/v1/create', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            setIsUploading(false);
            alert('Image created successfully');
            handleClose();
        } catch (error) {
            setIsUploading(false);
            setErrorMessage('Error creating the image. Please try again.');
        }
    };

    // Use effect to trigger the cropped image update when the crop area changes
    useEffect(() => {
        if (imageUrl && croppedArea) {
            getCroppedImage(); // Regenerate the cropped image when the crop changes
        }
    }, [croppedArea, imageUrl]);

    return (
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

                    {/* Category Input */}
                    <TextField
                        label="Category"
                        fullWidth
                        value={category}
                        onChange={handleCategoryChange}
                        sx={{ marginBottom: 2 }}
                    />

                    {/* Error message */}
                    {errorMessage && (
                        <Typography variant="body2" color="error" align="center" sx={{ marginBottom: 2 }}>
                            {errorMessage}
                        </Typography>
                    )}

                    {/* Image Dimensions */}
                    <Box sx={{ marginBottom: 2 }}>
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

                    {/* Save Button */}
                    <Box sx={{ marginTop: 2, textAlign: 'center' }}>
                        <Button variant="contained" onClick={handleSave} color="secondary" fullWidth>
                            Save
                        </Button>
                    </Box>

                    {/* Upload Button */}
                    <Box sx={{ marginTop: 2, textAlign: 'center' }}>
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
    );
};

export default CategoryModal;
