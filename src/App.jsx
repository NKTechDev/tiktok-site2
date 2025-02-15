import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';  // Import necessary Router components
import HomePage from './components/HomePage';
import Admin from './components/Admin';
function App() {
  return (
    <Router> {/* Wrap your components in BrowserRouter */}
      <Routes> {/* Define all your route paths here */}
        <Route path="/" element={<HomePage />} /> {/* Define a route for HomePage */}
        <Route path="/admin" element={< Admin/>} /> {/* Define a route for HomePage */}

      </Routes>
    </Router>
  );
}

export default App;
