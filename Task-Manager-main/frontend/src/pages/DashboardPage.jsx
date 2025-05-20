import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const DashboardPage = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for the new task form
  const [newTaskFormData, setNewTaskFormData] = useState({
    title: "",
    description: "",
    status: "pending",
    dueDate: "",
  });
  const { title, description, status, dueDate } = newTaskFormData;

  // State for Editing
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    title: "",
    description: "",
    status: "",
    dueDate: "",
  });

  // State for Filtering
  const [filterStatus, setFilterStatus] = useState("");
  const [filterDueDate, setFilterDueDate] = useState("");

  // Moved fetchTasks outside and wrapped with useCallback
  const fetchTasks = useCallback(
    async (token) => {
      try {
        setLoading(true);
        setError(null); // Clear any previous errors before fetching

        const backendURL = import.meta.env.VITE_BACKEND_URL;
        if (!backendURL) {
          throw new Error(
            "Backend URL not configured in environment variables."
          );
        }

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            status: filterStatus,
            dueDate: filterDueDate,
          },
        };
        // Corrected: Use backendURL for API call
        const { data } = await axios.get(`${backendURL}/api/tasks`, config);
        setTasks(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching tasks:", error);
        setError(
          error.response?.data?.message ||
            error.message ||
            "Failed to fetch tasks"
        );
        setLoading(false);
        if (error.response && error.response.status === 401) {
          localStorage.removeItem("userInfo");
          navigate("/login");
        }
      }
    },
    [navigate, filterStatus, filterDueDate]
  );

  useEffect(() => {
    const userInfo = localStorage.getItem("userInfo");
    if (!userInfo) {
      navigate("/login");
    } else {
      const { token } = JSON.parse(userInfo);
      fetchTasks(token);
    }
  }, [navigate, fetchTasks]);

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    navigate("/login");
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
      setError("Task title is required");
      return;
    }

    const userInfo = localStorage.getItem("userInfo");
    if (!userInfo) {
      navigate("/login");
      return;
    }
    const { token } = JSON.parse(userInfo);

    try {
      const backendURL = import.meta.env.VITE_BACKEND_URL;
      if (!backendURL) {
        setError("Backend URL not configured in environment variables.");
        return;
      }

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const taskData = {
        title,
        description,
        status,
        dueDate: dueDate ? new Date(dueDate) : undefined,
      };

      // Corrected: Use backendURL for API call
      await axios.post(`${backendURL}/api/tasks`, taskData, config);

      console.log("Task created successfully.");
      setNewTaskFormData({
        title: "",
        description: "",
        status: "pending",
        dueDate: "",
      });
      setError(null); // Clear error on success
      fetchTasks(token); // Re-fetch tasks (now with current filters applied)
    } catch (error) {
      setError(
        error.response?.data?.message || error.message || "Error creating task"
      );
      console.error(
        "Error creating task:",
        error.response?.data?.message || error.message
      );
    }
  };

  const handleDeleteTask = async (taskId) => {
    const userInfo = localStorage.getItem("userInfo");
    if (!userInfo) {
      navigate("/login");
      return;
    }
    const { token } = JSON.parse(userInfo);

    try {
      const backendURL = import.meta.env.VITE_BACKEND_URL;
      if (!backendURL) {
        setError("Backend URL not configured in environment variables.");
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      // Corrected: Use backendURL for API call
      await axios.delete(`${backendURL}/api/tasks/${taskId}`, config);

      console.log(`Task ${taskId} deleted successfully.`);
      setError(null); // Clear error on success
      fetchTasks(token); // Re-fetch tasks (now with current filters applied)
    } catch (error) {
      setError(
        error.response?.data?.message || error.message || "Error deleting task"
      );
      console.error(
        "Error deleting task:",
        error.response?.data?.message || error.message
      );
    }
  };

  const handleEditClick = (task) => {
    setEditingTaskId(task._id);
    setEditFormData({
      title: task.title,
      description: task.description,
      status: task.status,
      dueDate: task.dueDate
        ? new Date(task.dueDate).toISOString().split("T")[0]
        : "",
    });
  };

  const handleCancelEdit = () => {
    setEditingTaskId(null);
    setEditFormData({
      title: "",
      description: "",
      status: "",
      dueDate: "",
    });
  };

  const onEditFormChange = (e) => {
    setEditFormData({
      ...editFormData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdateTask = async (taskId) => {
    const userInfo = localStorage.getItem("userInfo");
    if (!userInfo) {
      navigate("/login");
      return;
    }
    const { token } = JSON.parse(userInfo);

    if (!editFormData.title) {
      setError("Task title is required for update");
      return;
    }

    try {
      const backendURL = import.meta.env.VITE_BACKEND_URL;
      if (!backendURL) {
        setError("Backend URL not configured in environment variables.");
        return;
      }

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const updatedTaskData = {
        title: editFormData.title,
        description: editFormData.description,
        status: editFormData.status,
        dueDate: editFormData.dueDate
          ? new Date(editFormData.dueDate)
          : undefined,
      };

      // Corrected: Use backendURL for API call
      await axios.put(
        `${backendURL}/api/tasks/${taskId}`,
        updatedTaskData,
        config
      );

      console.log(`Task ${taskId} updated successfully.`);
      setError(null); // Clear error on success
      fetchTasks(token); // Re-fetch tasks (now with current filters applied)
      handleCancelEdit();
    } catch (error) {
      setError(
        error.response?.data?.message || error.message || "Error updating task"
      );
      console.error(
        "Error updating task:",
        error.response?.data?.message || error.message
      );
    }
  };

  const onFilterChange = (e) => {
    if (e.target.name === "filterStatus") {
      setFilterStatus(e.target.value);
    } else if (e.target.name === "filterDueDate") {
      setFilterDueDate(e.target.value);
    }
  };

  if (loading) return <div>Loading tasks...</div>;
  // Render error message from state
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Your Tasks</h2>
      <button onClick={handleLogout} className="logout-button">
        Logout
      </button>

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
            onChange={onNewTaskFormChange}></textarea>
        </div>
        <div className="form-group">
          <label htmlFor="status">Status:</label>
          <select
            id="status"
            name="status"
            value={status}
            onChange={onNewTaskFormChange}>
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
      <div className="filter-controls">
        <div className="form-group">
          <label htmlFor="filterStatus">Status:</label>
          <select
            id="filterStatus"
            name="filterStatus"
            value={filterStatus}
            onChange={onFilterChange}>
            <option value="">All</option>
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
      {tasks.length === 0 && !loading && !error ? ( // Display this only if no tasks, not loading, and no error
        <p>
          No tasks found matching criteria. Add a new task or clear filters!
        </p>
      ) : (
        <ul className="tasks-list">
          {tasks.map((task) => (
            <li key={task._id} className="task-item">
              {editingTaskId === task._id ? (
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
                    <label htmlFor={`edit-description-${task._id}`}>
                      Description:
                    </label>
                    <textarea
                      id={`edit-description-${task._id}`}
                      name="description"
                      value={editFormData.description}
                      onChange={onEditFormChange}></textarea>
                  </div>
                  <div className="form-group">
                    <label htmlFor={`edit-status-${task._id}`}>Status:</label>
                    <select
                      id={`edit-status-${task._id}`}
                      name="status"
                      value={editFormData.status}
                      onChange={onEditFormChange}>
                      <option value="pending">Pending</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor={`edit-dueDate-${task._id}`}>
                      Due Date:
                    </label>
                    <input
                      type="date"
                      id={`edit-dueDate-${task._id}`}
                      name="dueDate"
                      value={editFormData.dueDate}
                      onChange={onEditFormChange}
                    />
                  </div>
                  <div className="task-actions">
                    <button onClick={() => handleUpdateTask(task._id)}>
                      Update
                    </button>
                    <button onClick={handleCancelEdit}>Cancel</button>
                  </div>
                </div>
              ) : (
                <>
                  <div>
                    <h4>{task.title}</h4>
                    <p>{task.description}</p>
                    <p>Status: {task.status}</p>
                    {task.dueDate && (
                      <p>Due: {new Date(task.dueDate).toLocaleDateString()}</p>
                    )}
                  </div>
                  <div className="task-actions">
                    <button onClick={() => handleEditClick(task)}>Edit</button>
                    <button
                      onClick={() => handleDeleteTask(task._id)}
                      className="delete-button">
                      Delete
                    </button>
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
