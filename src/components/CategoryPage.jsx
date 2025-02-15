import React, { useState, useEffect } from 'react';
import { Grid, Card, CardContent, CardMedia, Typography, Button, CircularProgress, Box } from '@mui/material';
import { useAuth0 } from '@auth0/auth0-react'; // Importing the useAuth0 hook
import nike from '../assets/nike.png';
import adidas from '../assets/adidas.png';
import puma from '../assets/puma.png';
import under from '../assets/under.png';
import reebook from '../assets/reebook.png';
import new2 from '../assets/new2.png';
import converse from '../assets/converse.png';
import vans from '../assets/vans.png';
import asics from '../assets/asics.jpeg';
import lv from '../assets/lv.jpg';

const CategoryPage = () => {
  const { loginWithRedirect, logout, user, isAuthenticated, isLoading, error } = useAuth0(); // Using Auth0's hook
  const [categoriesLoading, setCategoriesLoading] = useState(true); // Loading state for categories

  // Dummy categories with placeholder images
  const categories = [
    { name: 'Nike', image: nike },
    { name: 'Adidas', image: adidas },
    { name: 'Puma', image: puma },
    { name: 'Under Armour', image: under },
    { name: 'Reebok', image: reebook },
    { name: 'New Balance', image: new2 },
    { name: 'Converse', image: converse },
    { name: 'Vans', image: vans },
    { name: 'Asics', image: asics },
    { name: 'Skechers', image: lv },
    { name: 'Reebok', image: reebook },
    { name: 'New Balance', image: new2 },
  ];

  // Simulate loading data (you can replace this with actual async data fetching)
  useEffect(() => {
    setTimeout(() => {
      setCategoriesLoading(false);
    }, 2000); // Simulate a 2 seconds loading time
  }, []);

  const handleLogin = () => {
    loginWithRedirect();
  };

  const handleLogout = () => {
    logout({ returnTo: window.location.origin });
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

  if (error) {
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
        {categories.map((category, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ maxWidth: 345, backgroundColor: '#333', borderRadius: '8px' }}>
              <CardMedia
                component="img"
                alt={category.name}
                height="200"
                image={category.image}
                sx={{ objectFit: 'cover', borderRadius: '8px 8px 0 0' }}
              />
              <CardContent>
                <Typography variant="h6" align="center" color="white">
                  {category.name}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default CategoryPage;
