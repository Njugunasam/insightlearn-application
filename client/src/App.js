// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './Navbar';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import TaskPage from './TaskPage'; // Import TaskPage component
import Home from './Home';
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
          {/* Use TaskForm directly without accessing it through TaskPage */}
          <Route path="/add-task" element={<TaskPage.TaskForm />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
