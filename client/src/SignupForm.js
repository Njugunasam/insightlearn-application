import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faBell, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const SignupForm = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const getToken = () => {
    return localStorage.getItem('token');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    console.log('Form submitted:', { username, email, password }); // Log form data before sending the request

    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    const passwordRegex = /^(?=.*\d)(?=.*[a-zA-Z]).{8,}$/;
    const emailRegex = /^[^\s@]+@gmail\.com$/;

    if (!usernameRegex.test(username)) {
      setError('Username can only contain letters, numbers, and underscores.');
      return;
    }

    if (!emailRegex.test(email)) {
      setError('Please enter a valid Gmail address.');
      return;
    }

    if (!passwordRegex.test(password)) {
      setError('Password must contain at least 8 characters with at least one digit and one letter.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:8000/signup', { username, email, password });
      console.log('Signup response:', response.data);

      if (response.status === 201) {
        const token = response.data.token;
        localStorage.setItem('token', token);
        console.log('Account created successfully!');
        navigate('/tasks');
      }
    } catch (error) {
      if (error.response && error.response.status === 400 && error.response.data.error === 'Username or email already exists!') {
        setError('Account already exists! Please login instead.');
      } else if (error.response && error.response.status === 400 && error.response.data.error) {
        setError(error.response.data.error); // Display other validation errors
      } else {
        console.error('Signup error:', error);
      }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Check if token exists in local storage and set it as default authorization header
  const token = getToken();
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }

  return (
    <div className="form-container">
      <div className="notification">
        <FontAwesomeIcon icon={faBell} />
        <p>You must login to continue</p>
      </div>

      <h2>Sign Up</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="input-box">
          <FontAwesomeIcon icon={faUser} />
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="input-box">
          <FontAwesomeIcon icon={faEnvelope} />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="input-box">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} onClick={togglePasswordVisibility} className="eye-icon" />
        </div>
        <button type="submit" className="btn">Sign Up</button>
      </form>
      <p>Already have an account? <Link to="/login">Login</Link></p>
    </div>
  );
};

export default SignupForm;
