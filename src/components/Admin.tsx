import React from 'react';
import AdminHeader from './AdminHeader';
import { ToastContainer } from 'react-toastify'; // Import ToastContainer
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS for the toast notifications
import AdminPage from './AdminContent';

function Admin() {
  return (
    <div>
        <AdminHeader />

        <AdminPage/>
      
        {/* Add ToastContainer to render toasts */}
        <ToastContainer />
    </div>
  );
}

export default Admin;
