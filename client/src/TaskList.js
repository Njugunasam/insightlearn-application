import React from 'react';

const TaskList = ({ tasks }) => {
  if (!tasks) {
    return <div>Loading...</div>;
  }
  if (tasks.length === 0) {
    return <div>No tasks available.</div>;
  }
  return (
    <div>
      <h2>Task List</h2>
      <ul>
        {tasks.map(task => (
          <li key={task.id}>
            <strong>{task.title}</strong> - {task.description}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskList;
