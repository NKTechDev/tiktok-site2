import React, { useState, useEffect } from 'react';
import { Grid, Card, CardContent, CardMedia, Typography, Button, CircularProgress, Box, Modal, IconButton } from '@mui/material';
import { useAuth0 } from '@auth0/auth0-react'; // Importing the useAuth0 hook
import axios from 'axios'; // We will use axios to fetch data from the API
import DeleteIcon from '@mui/icons-material/Delete'; // Delete icon for button
import { toast, ToastContainer } from 'react-toastify'; // Importing react-toastify
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS for react-toastify

const AdminCategoryPage = () => {
  const { loginWithRedirect, logout, user, isAuthenticated, isLoading, error } = useAuth0(); // Using Auth0's hook
  const [categories, setCategories] = useState([]); // To hold the fetched categories
  const [categoriesLoading, setCategoriesLoading] = useState(true); // Loading state for categories
  const [fetchError, setFetchError] = useState(null); // Error state for the fetch call
  const [openModal, setOpenModal] = useState(false); // State for opening the modal
  const [categoryToDelete, setCategoryToDelete] = useState(null); // Category to be deleted

  // Fetch categories from the API
  useEffect(() => {
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

    fetchCategories();
  }, []);

  const handleLogin = () => {
    loginWithRedirect();
  };

  const handleLogout = () => {
    logout({ returnTo: window.location.origin });
  };

  // Open the confirmation modal
  const handleDeleteClick = (category) => {
    setCategoryToDelete(category); // Set the category to be deleted
    setOpenModal(true); // Open the modal
  };

  // Close the confirmation modal
  const handleCloseModal = () => {
    setOpenModal(false); // Close the modal
    setCategoryToDelete(null); // Reset the category to delete
  };

  // Handle the deletion of the category
  const handleConfirmDelete = async () => {
    try {
      const response = await axios.delete(`http://localhost:5000/api/v1/category/delete/${categoryToDelete._id}`);
      toast.success('Category deleted successfully!'); // Success toast message
      // Refresh the categories list after deletion
      setCategories(categories.filter((category) => category._id !== categoryToDelete._id));
      handleCloseModal(); // Close the modal
    } catch (err) {
      console.error('Error deleting category:', err);
      toast.error('Error deleting category.'); // Error toast message
    }
  };

  if (isLoading || categoriesLoading) {
    return (
      <Box
        sx={{
          background: 'linear-gradient(135deg, rgba(0, 0, 0, 1), rgba(34, 34, 34, 1))',
          minHeight: '100vh',
          padding: '20px',
        }}
      >
        <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
          <CircularProgress color="inherit" />
        </Box>
      </Box>
    );
  }

  if (fetchError) {
    return (
      <Box
        sx={{
          background: 'linear-gradient(135deg, rgba(0, 0, 0, 1), rgba(34, 34, 34, 1))',
          minHeight: '100vh',
          padding: '20px',
        }}
      >
        <Box display="flex" justifyContent="center" alignItems="center" flexDirection="column" height="100vh">
          <Typography variant="h6" color="white" gutterBottom>
            Something went wrong! Please try again.
          </Typography>
          <Button variant="contained" color="primary" onClick={handleLogin}>
            Login
          </Button>
        </Box>
      </Box>
    );
  }

  if (!isAuthenticated) {
    return (
      <Box
        sx={{
          background: 'linear-gradient(135deg, rgba(0, 0, 0, 1), rgba(34, 34, 34, 1))',
          minHeight: '100vh',
          padding: '20px',
        }}
      >
        <Box display="flex" justifyContent="center" alignItems="center" flexDirection="column" height="100vh">
          <Typography variant="h5" color="white" gutterBottom>
            Please log in to enjoy the features of the website.
          </Typography>
          <Button variant="contained" color="primary" onClick={handleLogin}>
            Login
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        background: 'linear-gradient(135deg, rgba(0, 0, 0, 1), rgba(34, 34, 34, 1))',
        minHeight: '100vh',
        padding: '20px',
      }}
    >
      <Typography variant="h4" gutterBottom align="center" color="white">
        Fashion Categories
      </Typography>
      <Grid container spacing={2} justifyContent="center">
        {categories.map((category) => (
          <Grid item xs={12} sm={6} md={3} key={category._id}>
            <Card
              sx={{
                maxWidth: 345,
                backgroundColor: '#333',
                borderRadius: '8px',
                boxShadow: '0px 8px 15px rgba(255, 255, 255, 0.3)', // Glow effect on hover

                '&:hover': {
                  transform: 'scale(1.05)', // Slightly scale the card up on hover
                  boxShadow: '0px 8px 15px rgba(144, 4, 4, 0.3)', // Glow effect on hover
                },
                transition: 'transform 0.3s ease, box-shadow 0.3s ease', // Smooth transition
              }}
            >
              <CardMedia
                component="img"
                alt={category.name}
                height="200"
                image={category.image}
                sx={{ objectFit: 'cover', borderRadius: '8px 8px 0 0' }}
              />
              <CardContent
                sx={{
                  background: 'linear-gradient(180deg, rgba(0, 0, 0, 0.8), rgba(34, 34, 34, 0.8))', // Linear gradient effect
                  borderRadius: '0 0 8px 8px',
                }}
              >
                <Typography variant="h6" align="center" color="white">
                  {category.name}
                </Typography>
              </CardContent>
              {/* Delete button */}
              <Box position="absolute" top={10} right={10}>
                <IconButton
                  color="error"
                  onClick={() => handleDeleteClick(category)} // Show confirmation modal
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Confirmation Modal */}
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="confirm-delete-modal"
        aria-describedby="confirm-delete-description"
      >
        <Box
          sx={{
            width: 300,
            padding: 2,
            margin: 'auto',
            backgroundColor: '#333',
            borderRadius: '8px',
            color: 'white',
            textAlign: 'center',
            marginTop: '20%',
          }}
        >
          <Typography variant="h6" color="white" gutterBottom>
            Are you sure you want to delete this category?
          </Typography>
          <Button variant="outlined" color="primary" onClick={handleCloseModal} sx={{ marginRight: 2 }}>
            Cancel
          </Button>
          <Button variant="contained" color="error" onClick={handleConfirmDelete}>
            Confirm
          </Button>
        </Box>
      </Modal>

      {/* React Toastify Container */}
      <ToastContainer />
    </Box>
  );
};

export default AdminCategoryPage;
