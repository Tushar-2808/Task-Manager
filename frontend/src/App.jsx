// frontend/src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Import the page components
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage'; // Import DashboardPage

function App() {
  return (
    <>
      {/* <Header /> */}
      <main className="container"> {/* Add className="container" */}
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/" element={<DashboardPage />} />
        </Routes>
      </main>
      {/* <Footer /> */}
    </>
  );
}

export default App;