import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa'; // Import social media icons
import './App.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container">
                <p>&copy; 2024. All rights reserved.</p>
                <p className="phone">Phone :<span>+254714562157</span></p>
                <p className="email">Email :<span><a href="mailto:info@taskmanagement.co.ke">info@taskmanagement.co.ke</a></span></p>
                <div className="social-media-container">
                <p className="join-text">Join us on social media:</p>
                    <div className="social-media-icons">
                        <a href="https://www.facebook.com/yourpage" target="_blank" rel="noopener noreferrer"><FaFacebook /></a>
                        <a href="https://twitter.com/yourhandle" target="_blank" rel="noopener noreferrer"><FaTwitter /></a>
                        <a href="https://www.instagram.com/youraccount" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
                        <a href="https://www.linkedin.com/in/yourprofile" target="_blank" rel="noopener noreferrer"><FaLinkedin /></a>
                    </div>
                    
                </div>
            </div>
        </footer>
    );
}

export default Footer;
