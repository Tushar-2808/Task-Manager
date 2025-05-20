import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const { email, password } = formData;
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      try {
        const { token } = JSON.parse(userInfo);
        if (token) {
          navigate('/');
        }
      } catch (e) {
        console.error("Failed to parse userInfo from localStorage", e);
        localStorage.removeItem('userInfo');
      }
    }
  }, [navigate]);

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const backendURL = import.meta.env.VITE_BACKEND_URL;
      if (!backendURL) {
        setError('Backend URL not configured in environment variables.');
        return;
      }

      const { data } = await axios.post(
        `${backendURL}/api/auth/login`,
        { email, password },
        config
      );

      console.log(data);
      localStorage.setItem('userInfo', JSON.stringify(data));
      navigate('/');

    } catch (error) {
      setError(error.response?.data?.message || error.message || 'Login failed');
      console.error(error.response?.data?.message || error.message);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={onSubmit} className="form">
        <div className="form-group">
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
        <div className="form-group">
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