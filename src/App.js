import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './Navbar';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import TaskPage from './TaskPage'; // Import TaskPage component
import Home from './Home';
import ResetPasswordForm from './ResetPasswordForm'; // Import ResetPasswordForm component
import './App.css';

const App = () => {
  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/signup" element={<SignupForm />} />
          <Route path="/tasks" element={<TaskPage />} />
          <Route path="/reset-password" element={<ResetPasswordForm />} /> {/* Add route for ResetPasswordForm */}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
ghhy