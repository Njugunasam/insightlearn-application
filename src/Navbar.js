import React from 'react';
import { Link } from 'react-router-dom';
import './App.css'; // Import your CSS file for styling

const Navbar = () => {
    return (
        <nav className="navbar">
            <ul className="navbar-nav">
                <li className="nav-item">
                    <Link to="/" className="nav-link">Home</Link>
                </li>
                <li className="nav-item">
                    <Link to="/login" className="nav-link">Login</Link>
                </li>
                <li className="nav-item">
                    <Link to="/signup" className="nav-link">Sign Up</Link>
                </li>
            </ul>
        </nav>
    );
}

export default Navbar;
