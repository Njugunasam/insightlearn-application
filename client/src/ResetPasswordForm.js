import React, { useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const ResetPasswordForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            if (password !== confirmPassword) {
                setError('Passwords do not match');
                setLoading(false);
                return;
            }

            const response = await axios.post('http://localhost:5000/reset-password', {
                email,
                password,
            });

            // Log response data
            console.log('Response:', response);

            if (response.status === 200) {
                setSuccessMessage('Password reset successfully!');
                setEmail('');
                setPassword('');
                setConfirmPassword('');
            } else if (response.status === 404) {
                setError('User not found. Please check your email and try again.');
            } else {
                setError('An error occurred. Please try again later.');
            }
            setLoading(false);
        } catch (error) {
            // Log error response data
            console.error('Error:', error.response);
            setError(error.response.data.message);
            setLoading(false);
        }
    };

    return (
        <div className="form-container">
            <h2>Reset Password</h2>
            {error && <div className="error-message">{error}</div>}
            {successMessage && <div className="success-message">{successMessage}</div>}
            <form onSubmit={handleSubmit}>
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
                    <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} onClick={() => setShowPassword(!showPassword)} />
                    <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="New Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="input-box">
                    <FontAwesomeIcon icon={showConfirmPassword ? faEye : faEyeSlash} onClick={() => setShowConfirmPassword(!showConfirmPassword)} />
                    <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" disabled={loading}>{loading ? 'Resetting Password...' : 'Reset Password'}</button>
            </form>
        </div>
    );
};

export default ResetPasswordForm;
