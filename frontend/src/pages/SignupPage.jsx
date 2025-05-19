import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import Link and useNavigate
import axios from 'axios'; // Import axios
//import { jwtDecode } from 'jwt-decode'; // Will use this later if needed, good to have

const SignupPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '', // Add confirm password field for validation
  });
  const { name, email, password, confirmPassword } = formData;

  const navigate = useNavigate(); // Hook for navigation

  // Optional: Check if user is already logged in (e.g., by checking localStorage)
  // If a token exists, maybe redirect to dashboard
  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      // Assuming userInfo is stored as a JSON string containing user and token
      // Or you might just check for the token directly
      try {
         const { token } = JSON.parse(userInfo);
         if (token) {
            // You could optionally verify the token expiry here
            navigate('/'); // Redirect to dashboard if logged in
         }
      } catch (e) {
         console.error("Failed to parse userInfo from localStorage", e);
         localStorage.removeItem('userInfo'); // Clear invalid data
      }
    }
  }, [navigate]); // Add navigate to dependency array

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    // Basic frontend validation
    if (password !== confirmPassword) {
      console.log('Passwords do not match'); // Replace with better error handling later
      // You might want to display an alert or message to the user
      return;
    }

    try {
      // Make POST request to backend signup endpoint
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const { data } = await axios.post(
        '/api/auth/signup', // Your backend signup endpoint
        { name, email, password },
        config
      );

      console.log(data); // Log the response (should include user info and token)

      // Store user info (including token) in localStorage
      localStorage.setItem('userInfo', JSON.stringify(data));

      // Redirect to the dashboard (we'll create this route later)
      navigate('/'); // Navigate to the root path, which we'll make the dashboard

    } catch (error) {
      console.error(error.response?.data?.message || error.message); // Log backend error message
      // Handle errors (e.g., display "User already exists" message)
      // You might want to update state to show an error message on the page
    }
  };

  return (
  <div>
    <h2>Sign Up</h2>
    {/* ... error message area */}
    <form onSubmit={onSubmit} className="form"> {/* Add className="form" */}
      <div className="form-group"> {/* Add className="form-group" */}
        <label htmlFor="name">Name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={name}
          onChange={onChange}
          required
        />
      </div>
      <div className="form-group"> {/* Add className="form-group" */}
        <label htmlFor="email">Email Address</label>
        <input
          type="email"
          id="email"
          name="email"
          value={email}
          onChange={onChange}
          required
        />
      </div>
      <div className="form-group"> {/* Add className="form-group" */}
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          value={password}
          onChange={onChange}
          required
        />
      </div>
      <div className="form-group"> {/* Add className="form-group" */}
        <label htmlFor="confirmPassword">Confirm Password</label>
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          value={confirmPassword}
          onChange={onChange}
          required
        />
      </div>
      <button type="submit">Sign Up</button>
    </form>
    <p>
      Already have an account? <Link to="/login">Login</Link>
    </p>
  </div>
);
};

export default SignupPage;