import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import Link and useNavigate
import axios from 'axios'; // Import axios
//import { jwtDecode } from 'jwt-decode'; // Still optional

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const { email, password } = formData;

  const navigate = useNavigate(); // Hook for navigation

  // Optional: Check if user is already logged in (same logic as SignupPage)
  // If a token exists, redirect to dashboard
   useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
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

    try {
      // Make POST request to backend login endpoint
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const { data } = await axios.post(
        '/api/auth/login', // Your backend login endpoint
        { email, password }, // Only send email and password
        config
      );

      console.log(data); // Log the response (should include user info and token)

      // Store user info (including token) in localStorage
      localStorage.setItem('userInfo', JSON.stringify(data));

      // Redirect to the dashboard
      navigate('/'); // Navigate to the root path, which is the dashboard

    } catch (error) {
      console.error(error.response?.data?.message || error.message); // Log backend error message
      // Handle errors (e.g., display "Invalid email or password" message)
      // You might want to update state to show an error message on the page
    }
  };

  return (
  <div>
    <h2>Login</h2>
    {/* ... error message area */}
    <form onSubmit={onSubmit} className="form"> {/* Add className="form" */}
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
      <button type="submit">Login</button>
    </form>
    <p>
      New Customer? <Link to="/signup">Register</Link>
    </p>
  </div>
);
};

export default LoginPage;