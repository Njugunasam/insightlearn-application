import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import defaultProfilePicture from './default-profile-picture.png';

const ProfileDropdown = ({ username, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    setIsOpen(false); // Close the dropdown when logout is clicked
    onLogout(); // Invoke the onLogout function passed from TaskPage
  };

  return (
    <div className="profile-dropdown">
      <div className="profile-info" onClick={handleToggleDropdown}>
        <div className="profile-picture-container">
          <img className="profile-picture" src={defaultProfilePicture} alt="Profile" />
        </div>
        <div className="welcome-message">Welcome, {username}!</div>
      </div>
      {isOpen && (
        <div className="dropdown-content">
          <Link to="/signup" className="dropdown-item">+ Add</Link> {/* Redirect to signup form */}
          <div className="dropdown-item" onClick={handleLogout}>Logout</div> {/* Invoke handleLogout */}
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
