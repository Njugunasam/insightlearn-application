import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TaskPage = () => {
  const [tasks, setTasks] = useState([]);
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState('');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setUser(true);
      fetchUserData(token);
      fetchTasks(token);
    } else {
      setUser(false);
    }
  }, []);

  const fetchUserData = async (token) => {
    try {
      const response = await axios.get('http://localhost:5000/user', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setUsername(response.data.username);
      setProfilePicture(response.data.profilePicture);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const handleProfilePictureChange = (e) => {
    setProfilePicture(e.target.files[0]);
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
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
      response.data.id = Math.random().toString(36).substr(2, 9);
      setTasks([...tasks, response.data]);
      setNewTaskTitle('');
      setNewTaskDescription('');
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const fetchTasks = async (token) => {
    try {
      const response = await axios.get('http://localhost:5000/tasks', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  return (
    <div className="task-page-container">
      {user ? (
        <div>
          <h1>Welcome {username ? `${username}!` : ''}</h1>
          <div className="profile-picture-container">
            {profilePicture && (
              <img
                src={URL.createObjectURL(profilePicture)}
                alt="Profile"
                className="profile-picture"
              />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleProfilePictureChange}
              className="profile-picture-input"
            />
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
