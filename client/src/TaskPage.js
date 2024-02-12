import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TaskPage = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get('http://localhost:5000/tasks');
        setTasks(response.data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchTasks();
  }, []);

  const handleTaskAdded = async (newTask) => {
    try {
      const response = await axios.post('http://localhost:5000/tasks', newTask);
      setTasks([...tasks, response.data]);
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  // TaskList component definition
  const TaskList = ({ tasks }) => {
    if (!tasks || tasks.length === 0) {
      return <div>No tasks available</div>;
    }

    return (
      <div className="task-list">
        <h2>Task List</h2>
        <ul>
          {tasks.map(task => (
            <li key={task.id}>
              <h3>{task.title}</h3>
              <p>{task.description}</p>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  // TaskForm component definition
  const TaskForm = ({ onTaskAdded }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const response = await axios.post('http://localhost:5000/tasks', { title, description });
        onTaskAdded(response.data);
        setTitle('');
        setDescription('');
      } catch (error) {
        console.error('Error adding task:', error);
      }
    };

    return (
      <div className="task-form-container">
        <h2>Add Task</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
          <button type="submit">Add Task</button>
        </form>
      </div>
    );
  };

  return (
    <div className="task-page-container">
      <h1>My Tasks</h1>
      <div className="task-content">
        <TaskList tasks={tasks} />
        <TaskForm onTaskAdded={handleTaskAdded} />
      </div>
    </div>
  );
};

export default TaskPage;
