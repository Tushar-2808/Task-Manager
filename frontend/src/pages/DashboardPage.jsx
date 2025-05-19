import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Import Link if needed later, navigate is used
import axios from 'axios';

const DashboardPage = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for the new task form
  const [newTaskFormData, setNewTaskFormData] = useState({
    title: '',
    description: '',
    status: 'pending',
    dueDate: '',
  });
  const { title, description, status, dueDate } = newTaskFormData;

  // State for Editing
  const [editingTaskId, setEditingTaskId] = useState(null); // Stores the ID of the task being edited, null if none
  const [editFormData, setEditFormData] = useState({ // Stores the data for the task currently being edited
    title: '',
    description: '',
    status: '',
    dueDate: '', // String format from input date
  });

  // State for Filtering
  const [filterStatus, setFilterStatus] = useState(''); // State for status filter (empty string for all)
  const [filterDueDate, setFilterDueDate] = useState(''); // State for due date filter (string format)


   // Moved fetchTasks outside and wrapped with useCallback
   // useCallback memoizes the function so it doesn't recreate on every render
   // Only recreate if navigate or the filter states change
   const fetchTasks = useCallback(async (token) => {
        try {
          setLoading(true);
          const config = {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            // Add params for filtering
            params: {
              status: filterStatus, // Include filterStatus in query params
              dueDate: filterDueDate, // Include filterDueDate in query params
            },
          };
          const { data } = await axios.get('/api/tasks', config);
          setTasks(data);
          setLoading(false);
          setError(null); // Clear any previous errors on successful fetch
        } catch (error) {
          console.error('Error fetching tasks:', error);
          setError(error.response?.data?.message || 'Failed to fetch tasks');
          setLoading(false);
          if (error.response && error.response.status === 401) {
             localStorage.removeItem('userInfo');
             navigate('/login');
          }
           // If fetch fails but not 401, keep existing tasks but show error?
           // For simplicity, we just show the error message for now.
        }
    }, [navigate, filterStatus, filterDueDate]); // Dependencies for useCallback


  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    if (!userInfo) {
      navigate('/login');
    } else {
      const { token } = JSON.parse(userInfo);
      fetchTasks(token); // Call fetchTasks
    }
  }, [navigate, fetchTasks]); // Add fetchTasks to useEffect dependency


  const handleLogout = () => {
     localStorage.removeItem('userInfo');
     navigate('/login');
  };

  const onNewTaskFormChange = (e) => {
      setNewTaskFormData({
          ...newTaskFormData,
          [e.target.name]: e.target.value,
      });
  };

  const onNewTaskSubmit = async (e) => {
      e.preventDefault();

      if (!title) {
          console.log('Task title is required');
          // Display error to user
          return;
      }

      const userInfo = localStorage.getItem('userInfo');
      if (!userInfo) {
          navigate('/login');
          return;
      }
      const { token } = JSON.parse(userInfo);

      try {
          const config = {
              headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${token}`,
              },
          };

          const taskData = {
              title,
              description,
              status,
              dueDate: dueDate ? new Date(dueDate) : undefined,
          };

          await axios.post('/api/tasks', taskData, config);

          console.log('Task created successfully.');
          fetchTasks(token); // Re-fetch tasks (now with current filters applied)

          setNewTaskFormData({
              title: '',
              description: '',
              status: 'pending',
              dueDate: '',
          });

      } catch (error) {
          console.error('Error creating task:', error.response?.data?.message || error.message);
          // Display error to user
      }
  };

  const handleDeleteTask = async (taskId) => {
       const userInfo = localStorage.getItem('userInfo');
       if (!userInfo) {
           navigate('/login');
           return;
       }
       const { token } = JSON.parse(userInfo);

       try {
           const config = {
               headers: {
                   Authorization: `Bearer ${token}`,
               },
           };

           await axios.delete(`/api/tasks/${taskId}`, config);

           console.log(`Task ${taskId} deleted successfully.`);
           fetchTasks(token); // Re-fetch tasks (now with current filters applied)

       } catch (error) {
           console.error('Error deleting task:', error.response?.data?.message || error.message);
           // Display error to user
       }
  };

  const handleEditClick = (task) => {
      setEditingTaskId(task._id);
      setEditFormData({
          title: task.title,
          description: task.description,
          status: task.status,
          // Format dueDate for the input type="date" (YYYY-MM-DD)
          dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
      });
  };

  const handleCancelEdit = () => {
      setEditingTaskId(null);
      setEditFormData({
          title: '',
          description: '',
          status: '',
          dueDate: '',
      });
  };

  const onEditFormChange = (e) => {
      setEditFormData({
          ...editFormData,
          [e.target.name]: e.target.value,
      });
  };

  const handleUpdateTask = async (taskId) => {
      const userInfo = localStorage.getItem('userInfo');
       if (!userInfo) {
           navigate('/login');
           return;
       }
       const { token } = JSON.parse(userInfo);

       if (!editFormData.title) {
            console.log('Task title is required for update');
            // Display error
            return;
       }

       try {
           const config = {
               headers: {
                   'Content-Type': 'application/json',
                   Authorization: `Bearer ${token}`,
               },
           };

            const updatedTaskData = {
                title: editFormData.title,
                description: editFormData.description,
                status: editFormData.status,
                dueDate: editFormData.dueDate ? new Date(editFormData.dueDate) : undefined,
            };

           await axios.put(`/api/tasks/${taskId}`, updatedTaskData, config);

           console.log(`Task ${taskId} updated successfully.`);
           fetchTasks(token); // Re-fetch tasks (now with current filters applied)
           handleCancelEdit();

       } catch (error) {
           console.error('Error updating task:', error.response?.data?.message || error.message);
           // Display error to user
       }
  };

  // Handlers for Filter form changes
  const onFilterChange = (e) => {
      // Update the relevant filter state based on the input name
      if (e.target.name === 'filterStatus') {
          setFilterStatus(e.target.value);
      } else if (e.target.name === 'filterDueDate') {
           setFilterDueDate(e.target.value);
      }
      // Note: Fetching happens automatically when filter state changes (due to useEffect dependencies)
  };


  if (loading) return <div>Loading tasks...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Your Tasks</h2>
      <button onClick={handleLogout} className="logout-button">Logout</button>

      <h3>Add New Task</h3>
      <form onSubmit={onNewTaskSubmit} className="form">
          <div className="form-group">
              <label htmlFor="title">Title:</label>
              <input
                  type="text"
                  id="title"
                  name="title"
                  value={title}
                  onChange={onNewTaskFormChange}
                  required
              />
          </div>
          <div className="form-group">
              <label htmlFor="description">Description:</label>
              <textarea
                  id="description"
                  name="description"
                  value={description}
                  onChange={onNewTaskFormChange}
              ></textarea>
          </div>
          <div className="form-group">
              <label htmlFor="status">Status:</label>
              <select
                  id="status"
                  name="status"
                  value={status}
                  onChange={onNewTaskFormChange}
              >
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
              </select>
          </div>
           <div className="form-group">
              <label htmlFor="dueDate">Due Date:</label>
              <input
                  type="date"
                  id="dueDate"
                  name="dueDate"
                  value={dueDate}
                  onChange={onNewTaskFormChange}
              />
          </div>
          <button type="submit">Create Task</button>
      </form>


      <h3>Filter Tasks</h3>
      <div className="filter-controls"> {/* Optional wrapper */}
          <div className="form-group">
              <label htmlFor="filterStatus">Status:</label>
              <select
                  id="filterStatus"
                  name="filterStatus"
                  value={filterStatus}
                  onChange={onFilterChange}
              >
                  <option value="">All</option> {/* Option to show all */}
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
              </select>
          </div>
           <div className="form-group">
              <label htmlFor="filterDueDate">Due Date (on or before):</label>
              <input
                  type="date"
                  id="filterDueDate"
                  name="filterDueDate"
                  value={filterDueDate}
                  onChange={onFilterChange}
              />
          </div>
      </div>


      <h3>Tasks List</h3>
       {tasks.length === 0 ? (
         <p>No tasks found matching criteria. Add a new task or clear filters!</p>
       ) : (
        <ul className="tasks-list">
          {tasks.map(task => (
            <li key={task._id} className="task-item">
              {editingTaskId === task._id ? (
                // Render Edit Form if this task is being edited
                <div className="edit-task-form">
                    <h4>Edit Task</h4>
                    <div className="form-group">
                        <label htmlFor={`edit-title-${task._id}`}>Title:</label>
                        <input
                            type="text"
                            id={`edit-title-${task._id}`}
                            name="title"
                            value={editFormData.title}
                            onChange={onEditFormChange}
                            required
                        />
                    </div>
                     <div className="form-group">
                        <label htmlFor={`edit-description-${task._id}`}>Description:</label>
                        <textarea
                            id={`edit-description-${task._id}`}
                            name="description"
                            value={editFormData.description}
                            onChange={onEditFormChange}
                        ></textarea>
                    </div>
                     <div className="form-group">
                        <label htmlFor={`edit-status-${task._id}`}>Status:</label>
                         <select
                            id={`edit-status-${task._id}`}
                            name="status"
                            value={editFormData.status}
                            onChange={onEditFormChange}
                        >
                            <option value="pending">Pending</option>
                            <option value="completed">Completed</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor={`edit-dueDate-${task._id}`}>Due Date:</label>
                        <input
                            type="date"
                             id={`edit-dueDate-${task._id}`}
                            name="dueDate"
                            value={editFormData.dueDate}
                            onChange={onEditFormChange}
                        />
                    </div>
                    <div className="task-actions">
                         <button onClick={() => handleUpdateTask(task._id)}>Update</button>
                         <button onClick={handleCancelEdit}>Cancel</button>
                    </div>
                </div>
              ) : (
                // Render Task Details if not being edited
                <>
                  <div> {/* Wrap details for flex alignment */}
                    <h4>{task.title}</h4>
                    <p>{task.description}</p>
                    <p>Status: {task.status}</p>
                    {task.dueDate && <p>Due: {new Date(task.dueDate).toLocaleDateString()}</p>}
                  </div>
                  <div className="task-actions">
                    <button onClick={() => handleEditClick(task)}>Edit</button>
                    <button onClick={() => handleDeleteTask(task._id)} className="delete-button">Delete</button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
       )}
    </div>
  );
};

export default DashboardPage;