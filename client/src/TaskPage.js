import React, { useState, useEffect } from 'react';
import axios from 'axios';
import defaultProfilePicture from './default-profile-picture.png'; // Import a default profile picture image

const TaskPage = () => {
  const [tasks, setTasks] = useState([]);
  const [user, setUser] = useState(null);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [username, setUsername] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);

  useEffect(() => {
    const fetchUserData = async (token) => {
      try {
        const response = await axios.get('http://localhost:5000/user', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        console.log('Fetched user data:', response.data); // Log the fetched user data
        setUsername(response.data.username); // Set the username in the state
        setProfilePicture(response.data.profilePicture); // Set the profile picture in the state
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    const fetchTasks = async (token) => {
      try {
        const response = await axios.get('http://localhost:5000/tasks', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        console.log('Fetched tasks:', response.data); // Log the fetched tasks
        setTasks(response.data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    const token = localStorage.getItem('token');
    if (token) {
      setUser(true);
      console.log('User is authenticated');
      fetchUserData(token); // Fetch user data if user is authenticated
      fetchTasks(token); // Fetch tasks if user is authenticated
    } else {
      setUser(false);
      console.log('User is not authenticated');
    }
  }, []);

  const handleAddTask = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      console.log('Adding new task with token:', token);
      const response = await axios.post(
        'http://localhost:5000/tasks/add',
        {
          title: newTaskTitle,
          description: newTaskDescription
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      console.log('Added task:', response.data); // Log the added task
      // Ensure the added task has a unique ID
      response.data.id = Math.random().toString(36).substr(2, 9);
      setTasks(prevTasks => [...prevTasks, response.data]); // Update tasks state with the new task
      setNewTaskTitle('');
      setNewTaskDescription('');
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  return (
    <div className="task-page-container">
      {user ? (
        <div>
          <div className="user-profile-section">
            <div className="profile-picture">
              <img src={profilePicture || defaultProfilePicture} alt="Profile" />
            </div>
            <div className="username">
              <h2>Welcome {username ? `${username}!` : ''}</h2>
            </div>
          </div>
          <div className="task-content">
            <div className="task-form">
              <h2>Add New Task</h2>
              <form onSubmit={handleAddTask}>
                <input
                  type="text"
                  placeholder="Title"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  required
                />
                <textarea
                  placeholder="Description"
                  value={newTaskDescription}
                  onChange={(e) => setNewTaskDescription(e.target.value)}
                  required
                />
                <button type="submit">Add Task</button>
              </form>
            </div>
            <div className="task-list">
              <h2>Tasks</h2>
              <table>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.map(task => (
                    <tr key={task.id}>
                      <td>{task.title}</td>
                      <td>{task.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default TaskPage;
