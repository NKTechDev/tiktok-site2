import React, { useState } from 'react';
import { Button, Box, Typography, Tab, Tabs } from '@mui/material';
import CategoryList from './CategoryList'; // Import your CategoryList component
import PendingVideos from './PendingVideos'; // Import your PendingVideos component
import AdminCategoryPage from './AdminCategorylist';
import VideoList from './VideoList';

const AdminPage = () => {
  const [selectedTab, setSelectedTab] = useState('categories'); // Tab control

  const handleTabChange = (event, newTab) => {
    setSelectedTab(newTab);
  };

  return (
    <Box sx={{ padding: 2, backgroundColor: 'black', minHeight: '100vh' }}>
      {/* Title */}
      <Typography variant="h4" gutterBottom align="center" sx={{ color: 'white' }}>
        Admin Panel
      </Typography>

      {/* Tab Buttons */}
      <Tabs value={selectedTab} onChange={handleTabChange} centered sx={{ borderBottom: '1px solid white' }}>
        <Tab label="Category List" value="categories" sx={{ color: 'white' }} />
        <Tab label="Pending Videos" value="pendingVideos" sx={{ color: 'white' }} />
      </Tabs>

      {/* Render CategoryList or PendingVideos based on selected tab */}
      {selectedTab === 'categories' && (
        <AdminCategoryPage />
      )}
      {selectedTab === 'pendingVideos' && (
        <VideoList />
      )}
    </Box>
  );
};

export default AdminPage;
