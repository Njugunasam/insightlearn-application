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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Username format validation regex (alphanumeric with underscores allowed)
    const usernameRegex = /^[a-zA-Z0-9_]+$/;

    // Password strength validation regex (at least one digit and one letter)
    const passwordRegex = /^(?=.*\d)(?=.*[a-zA-Z]).{8,}$/;

    // Email format validation regex with specific domain (gmail.com)
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
      const response = await axios.post('http://localhost:5000/signup', { username, email, password });
      console.log(response.data); // Log response for debugging
      navigate('/tasks'); // Redirect to the task page after successful signup
    } catch (error) {
      if (error.response && error.response.status === 400 && error.response.data.message === 'Username or email already exists!') {
        setError('Account already exists!');
      } else {
        console.error('Signup error:', error);
      }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="form-container">
      {/* Notification with icon */}
      <div className="notification">
        <FontAwesomeIcon icon={faBell} />
        <p>You must login to continue</p>
      </div>

      {/* Signup form */}
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
