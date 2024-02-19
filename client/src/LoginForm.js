import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const LoginForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState(null); // State to track login error
    const [loading, setLoading] = useState(false); // State to track loading state
    const navigate = useNavigate();

    const getToken = () => {
        return localStorage.getItem('token');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); // Set loading state to true while sending request
        try {
            const response = await axios.post('http://localhost:8000/login', { username, password });
            const { token } = response.data; // Destructure only 'token' from response.data
            localStorage.setItem('token', token); // Store token in localStorage
            console.log('Token:', token); // Log token for debugging
            setError(null); // Reset any previous errors
            setLoading(false); // Reset loading state after request is complete
            navigate('/tasks'); // Redirect to the TaskPage after successful login
        } catch (error) {
            setError('Invalid username or password.'); // Set error message
            setLoading(false); // Reset loading state after request is complete
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
            <h2>Login</h2>
            {error && <div className="error-message">{error}</div>} {/* Display error message if login fails */}
            <form onSubmit={handleSubmit}>
                <div className="input-box">
                    <FontAwesomeIcon icon={faUser} color="black" />
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="input-box">
                    <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <FontAwesomeIcon
                        icon={showPassword ? faEyeSlash : faEye}
                        onClick={togglePasswordVisibility}
                        className="eye-icon"
                    />
                </div>
                <div className="forgot-password-link">
                    <Link to="/reset-password">Forgot password?</Link>
                </div>
                <button type="submit" className="btn" disabled={loading}>{loading ? 'Logging In...' : 'Login'}</button> {/* Disable button and change text when loading */}
            </form>
        </div>
    );
};

export default LoginForm;
