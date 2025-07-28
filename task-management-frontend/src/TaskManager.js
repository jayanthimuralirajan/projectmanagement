import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { UserContext } from "./UserContext";
import { FaTrash, FaEdit, FaPlus } from "react-icons/fa";

// Import Chart components from react-chartjs-2
import { Doughnut, Bar } from 'react-chartjs-2';
// Import and register Chart.js components
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
} from 'chart.js';

// Register Chart.js components globally for use in your app
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);


const API_URL = "http://localhost:8000/tasks/";
const EMPLOYEE_API_URL = "http://localhost:8000/employees/";

const TaskManager = () => {
  const [tasks, setTasks] = useState([]);
  const [employees, setEmployees] = useState([]);
  const { user } = useContext(UserContext);
  const [showAddTask, setShowAddTask] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  // FIX: These lines were incorrect. They should be useState calls.
  const [currentTask, setCurrentTask] = useState(null); // Corrected
  // ...

  const [taskData, setTaskData] = useState({
    assignedTo: user?.id || null,
    title: "",
    description: "",
    priority: "Medium",
    dueDate: "",
    taskCompleted: "PENDING",
  });
  const [selectedFilter, setSelectedFilter] = useState("All"); // For non-admin view

  // New states for Employee Management
  const [showAddEmployeeModal, setShowAddEmployeeModal] = useState(false);
  const [showUpdateEmployeeModal, setShowUpdateEmployeeModal] = useState(false);

  // FIX: This line was incorrect. It should be a useState call.
  const [currentEmployee, setCurrentEmployee] = useState(null); // Corrected
  const [employeeData, setEmployeeData] = useState({
    userName: "",
    emailId: "",
    password: "", // Added password for new employee creation
  });

  // --- MODIFIED STATE FOR ADMIN SEARCH FILTERS ---
  const [selectedEmployeeFilterId, setSelectedEmployeeFilterId] = useState(''); // Changed from searchTerm to selected ID
  const [selectedTaskStatusFilter, setSelectedTaskStatusFilter] = useState(''); // For admin task status filter
 
  // --- END MODIFIED STATE ---

  useEffect(() => {
    if (user && user.userName === "admin") {
      fetchAllTasks();
      fetchEmployees();
    } else if (user) {
      fetchTasks();
    }
  }, [user]);

  const fetchTasks = async () => {
    if (!user) return;

    try {
      const response = await axios.get(`${API_URL}?assignedTo=${user.id}`);
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const fetchAllTasks = async () => {
    try {
      const response = await axios.get(API_URL);
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching all tasks:", error);
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await axios.get(EMPLOYEE_API_URL);
      console.log("Employees fetched:", response.data);
      setEmployees(response.data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  const handleInputChange = (e) => {
    setTaskData({ ...taskData, [e.target.name]: e.target.value });
  };

  const handleEmployeeInputChange = (e) => {
    setEmployeeData({ ...employeeData, [e.target.name]: e.target.value });
  };

  const addTask = async () => {
    if (!user) {
      alert("User not logged in!");
      return;
    }

    const taskPayload = {
      ...taskData,
      assignedTo: taskData.assignedTo || user.id,
      priority: taskData.priority.toUpperCase(),
    };

    try {
      await axios.post(API_URL, taskPayload);
      if (user.userName === "admin") {
        fetchAllTasks();
      } else {
        fetchTasks();
      }
      setShowAddTask(false);
      setTaskData({
        // Reset taskData after adding
        assignedTo: user?.id || null,
        title: "",
        description: "",
        priority: "Medium",
        dueDate: "",
        taskCompleted: "PENDING",
      });
      // No need for selectedEmployeeId state, taskData.assignedTo handles it
    } catch (error) {
      console.error(
        "Error adding task:",
        error.response ? error.response.data : error.message
      );
    }
  };

  const addEmployee = async () => {
    try {
      await axios.post(EMPLOYEE_API_URL, employeeData);
      fetchEmployees(); // Refresh employee list
      setShowAddEmployeeModal(false);
      setEmployeeData({ userName: "", emailId: "", password: "" }); // Clear form
    } catch (error) {
      console.error(
        "Error adding employee:",
        error.response ? error.response.data : error.message
      );
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await axios.delete(`${API_URL}${taskId}/`);
      if (user.userName === "admin") {
        fetchAllTasks();
      } else {
        fetchTasks();
      }
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const deleteEmployee = async (employeeId) => {
    try {
      await axios.delete(`${EMPLOYEE_API_URL}${employeeId}/`);
      fetchEmployees(); // Refresh employee list
      fetchAllTasks(); // Refresh tasks as well, in case tasks were assigned to deleted employee
    } catch (error) {
      console.error("Error deleting employee:", error);
    }
  };

  const openUpdateModal = (task) => {
    setCurrentTask(task);
    setShowUpdateModal(true);
  };

  const openUpdateEmployeeModal = (employee) => {
    setCurrentEmployee(employee);
    setEmployeeData({ // Pre-fill the form with current employee data
      userName: employee.userName,
      emailId: employee.emailId,
      password: "", // Don't pre-fill password for security
    });
    setShowUpdateEmployeeModal(true);
  };

  const handleUpdateInputChange = (e) => {
    setCurrentTask({ ...currentTask, [e.target.name]: e.target.value });
  };

  const handleUpdateEmployeeInputChange = (e) => {
    setCurrentEmployee({ ...currentEmployee, [e.target.name]: e.target.value });
  };

  const updateTask = async () => {
    try {
      await axios.put(`${API_URL}${currentTask.id}/`, currentTask);
      if (user.userName === "admin") {
        fetchAllTasks();
      } else {
        fetchTasks();
      }
      setShowUpdateModal(false);
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const updateEmployee = async () => {
    try {
      // Create a payload that only includes fields that should be updated
      const payload = {
        userName: currentEmployee.userName,
        emailId: currentEmployee.emailId,
      };
      // Only include password if it's not empty, to avoid clearing existing password
      if (employeeData.password) { // Use employeeData state for password input
        payload.password = employeeData.password;
      }

      await axios.put(`${EMPLOYEE_API_URL}${currentEmployee.id}/`, payload);
      fetchEmployees(); // Refresh employee list
      setShowUpdateEmployeeModal(false);
    } catch (error) {
      console.error("Error updating employee:", error);
    }
  };

  // --- MODIFIED calculateStatus for more accurate pending/overdue ---
  const calculateStatus = (dueDate, taskCompleted) => {
    const due = new Date(dueDate);
    // Set current date to start of day for accurate comparison with due date
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    due.setHours(0, 0, 0, 0); // Also set due date to start of day

    const daysLeft = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (taskCompleted === "COMPLETED") {
      return { text: "✅ Completed", color: "text-green-600", statusType: "completed" };
    } else if (daysLeft > 0) {
      return { text: `⏳ ${daysLeft} days left`, color: "text-blue-500", statusType: "pending" };
    } else if (daysLeft === 0) { // Due today
        return { text: `⏰ Due Today!`, color: "text-orange-500", statusType: "due today" };
    }
    else { // daysLeft is negative, meaning overdue
      return { text: `⚠️ Overdue by ${Math.abs(daysLeft)} days!`, color: "text-red-500", statusType: "overdue" };
    }
  };
  // --- END MODIFIED calculateStatus ---

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "HIGH":
        return "bg-red-400 text-white";
      case "MEDIUM":
        return "bg-yellow-400 text-white";
      case "LOW":
        return "bg-green-400 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const handleFilterChange = (event) => {
    setSelectedFilter(event.target.value);
  };

  // --- MODIFIED FILTERED TASKS LOGIC ---
  const filteredTasks = tasks.filter((task) => {
    // Get a fresh current date for each filter evaluation
    const now = new Date();
    now.setHours(0, 0, 0, 0); // Compare dates without time

    const taskDueDate = new Date(task.dueDate);
    taskDueDate.setHours(0, 0, 0, 0); // Compare dates without time

    // Basic filter (priority/status for non-admin)
    let basicFilterMatch = true;
    if (user.userName !== "admin") { // Apply this filter only for non-admin users
        if (selectedFilter === "All") basicFilterMatch = true;
        else if (selectedFilter === "Completed") basicFilterMatch = task.taskCompleted === "COMPLETED";
        else if (selectedFilter === "Pending") {
            // A task is pending if it's not completed AND its due date is today or in the future
            basicFilterMatch = task.taskCompleted === "PENDING" && taskDueDate >= now;
        }
        else if (selectedFilter === "Overdue") {
            // A task is overdue if it's not completed AND its due date is in the past
            basicFilterMatch = task.taskCompleted === "PENDING" && taskDueDate < now;
        }
        else if (selectedFilter === "Due Today") { // New filter option
            basicFilterMatch = task.taskCompleted === "PENDING" && taskDueDate.getTime() === now.getTime();
        }
        else basicFilterMatch = task.priority === selectedFilter;
    }

    // Employee selection filter (only for admin)
    // Check if a specific employee is selected, otherwise match all
    const employeeMatch = user.userName === "admin" && selectedEmployeeFilterId
      ? task.assignedTo === parseInt(selectedEmployeeFilterId) // Convert to number for comparison
      : true; // If not admin, or no employee selected, this filter always passes

    // Task status search filter (only for admin)
    const taskStatus = calculateStatus(task.dueDate, task.taskCompleted).statusType; // Get the specific status type
    const statusSearchMatch = user.userName === "admin" && selectedTaskStatusFilter
      ? taskStatus === selectedTaskStatusFilter // Direct comparison with status type
      : true; // If not admin, or no status selected, this filter always passes

    return basicFilterMatch && employeeMatch && statusSearchMatch;
  });
  // --- END MODIFIED FILTERED TASKS LOGIC ---


  const getTaskStats = (employeeId, tasks) => {
    const now = new Date();
    now.setHours(0,0,0,0); // For consistent date comparison

    const employeeTasks = tasks.filter((task) => task.assignedTo === employeeId);
    const total = employeeTasks.length;
    const pending = employeeTasks.filter((task) => {
        const taskDueDate = new Date(task.dueDate);
        taskDueDate.setHours(0,0,0,0);
        return task.taskCompleted === "PENDING" && taskDueDate >= now;
    }).length;
    const completed = employeeTasks.filter((task) => task.taskCompleted === "COMPLETED").length;
    const overdue = employeeTasks.filter((task) => {
        const taskDueDate = new Date(task.dueDate);
        taskDueDate.setHours(0,0,0,0);
        return task.taskCompleted === "PENDING" && taskDueDate < now;
    }).length;
    return { total, pending, completed, overdue };
  };

  // --- Chart Data Preparation ---
  // Ensure these also use the consistent date comparison
  const completedTasksCount = tasks.filter(task => task.taskCompleted === "COMPLETED").length;
  const nowForCharts = new Date();
  nowForCharts.setHours(0,0,0,0);
  const pendingTasksCount = tasks.filter(task => {
      const taskDueDate = new Date(task.dueDate);
      taskDueDate.setHours(0,0,0,0);
      return task.taskCompleted === "PENDING" && taskDueDate >= nowForCharts;
  }).length;
  const overdueTasksCount = tasks.filter(task => {
      const taskDueDate = new Date(task.dueDate);
      taskDueDate.setHours(0,0,0,0);
      return task.taskCompleted === "PENDING" && taskDueDate < nowForCharts;
  }).length;


  const doughnutData = {
    labels: ['Completed', 'Pending', 'Overdue'],
    datasets: [
      {
        label: '# of Tasks',
        data: [completedTasksCount, pendingTasksCount, overdueTasksCount],
        backgroundColor: [
          'rgba(75, 192, 192, 0.7)', // Green for Completed
          'rgba(255, 206, 86, 0.7)', // Yellow for pending
          'rgba(255, 99, 132, 0.7)', // Red for Overdue
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(255, 99, 132, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // NEW: Data for Employee Task Report Bar Chart
  const employeeLabels = employees
    .filter((employee) => employee.userName.toLowerCase() !== "admin")
    .map((employee) => employee.userName);

  const employeeTotalTasks = employees
    .filter((employee) => employee.userName.toLowerCase() !== "admin")
    .map((employee) => getTaskStats(employee.id, tasks).total);

  const employeeCompletedTasks = employees
    .filter((employee) => employee.userName.toLowerCase() !== "admin")
    .map((employee) => getTaskStats(employee.id, tasks).completed);

  const employeePendingTasks = employees
    .filter((employee) => employee.userName.toLowerCase() !== "admin")
    .map((employee) => getTaskStats(employee.id, tasks).pending);

  const employeeOverdueTasks = employees
    .filter((employee) => employee.userName.toLowerCase() !== "admin")
    .map((employee) => getTaskStats(employee.id, tasks).overdue);


  const employeeReportBarData = {
    labels: employeeLabels,
    datasets: [
      {
        label: 'Total Tasks',
        data: employeeTotalTasks,
        backgroundColor: 'rgba(54, 162, 235, 0.7)', // Blue
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
      {
        label: 'Completed Tasks',
        data: employeeCompletedTasks,
        backgroundColor: 'rgba(75, 192, 192, 0.7)', // Green
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
      {
        label: 'Pending Tasks',
        data: employeePendingTasks,
        backgroundColor: 'rgba(255, 206, 86, 0.7)', // Yellow
        borderColor: 'rgba(255, 206, 86, 1)',
        borderWidth: 1,
      },
      {
        label: 'Overdue Tasks',
        data: employeeOverdueTasks,
        backgroundColor: 'rgba(255, 99, 132, 0.7)', // Red
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = { // Common options for both charts, can be overridden
    responsive: true,
    maintainAspectRatio: false, // Allows charts to take up designated space
    plugins: {
        legend: {
            labels: {
                color: 'white', // Legend text color
            }
        },
        title: {
            display: true,
            color: 'white', // Title color
            font: {
                size: 16
            }
        }
    },
    scales: {
        x: {
            ticks: {
                color: 'white' // X-axis label color
            },
            grid: {
                color: 'rgba(255, 255, 255, 0.1)' // X-axis grid line color
            }
        },
        y: {
            ticks: {
                color: 'white', // Y-axis label color
                beginAtZero: true // Ensure Y-axis starts from zero for counts
            },
            grid: {
                color: 'rgba(255, 255, 255, 0.1)' // Y-axis grid line color
            }
        }
    }
  };

  const employeeReportChartOptions = { // Specific options for employee report chart
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            labels: {
                color: 'white',
            },
            position: 'bottom', // Place legend at the bottom for stacked bars
        },
        title: {
            display: true,
            color: 'white',
            font: {
                size: 16
            },
            text: 'Employee Task Report' // Chart title
        }
    },
    scales: {
        x: {
            stacked: true, // Stack bars for each employee
            ticks: {
                color: 'white'
            },
            grid: {
                color: 'rgba(255, 255, 255, 0.1)'
            }
        },
        y: {
            stacked: true, // Stack bars for each employee
            ticks: {
                color: 'white',
                beginAtZero: true
            },
            grid: {
                color: 'rgba(255, 255, 255, 0.1)'
            }
        }
    }
  };


  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-r from-indigo-400 to-cyan-400 p-4 sm:p-6 overflow-hidden">
      <div className="flex justify-between items-center px-2 sm:px-5 py-3">
        <h1 className="text-xl sm:text-2xl font-bold text-white">
          Welcome, {user ? user.userName : "Guest"}! 👋
        </h1>
      </div>

      {user && user.userName === "admin" ? (
        <div className="flex flex-col lg:flex-row gap-6 p-2 sm:p-6 overflow-auto">
          {/* Left Column – Employee List & Add Employee */}
          <div className="flex flex-col lg:w-1/2 min-w-0">
            <div className="bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg border border-gray-300 mb-6">
              <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-white mb-2 sm:mb-0">Employee List</h2>
                <button
                  className="bg-green-500 text-white text-sm px-3 py-1 sm:px-4 sm:py-2 rounded-lg transition-transform transform hover:scale-105 flex items-center gap-1 sm:gap-2"
                  onClick={() => setShowAddEmployeeModal(true)}
                >
                  <FaPlus /> Add Employee
                </button>
              </div>
              <div className="overflow-x-auto max-h-96 custom-scrollbar">
                <table className="min-w-full text-white border border-gray-600 rounded-lg overflow-hidden text-sm">
                  <thead className="bg-gray-700 sticky top-0 z-10">
                    <tr>
                      <th className="py-2 px-3 sm:px-4 text-left">Name</th>
                      <th className="py-2 px-3 sm:px-4 text-left">Email</th>
                      <th className="py-2 px-3 sm:px-4 text-center">Total Tasks</th>
                      <th className="py-2 px-3 sm:px-4 text-center">Pending</th>
                      <th className="py-2 px-3 sm:px-4 text-center">Overdue</th>
                      <th className="py-2 px-3 sm:px-4 text-center">Completed</th>
                      <th className="py-2 px-3 sm:px-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-gray-900">
                    {employees
                      .filter((employee) => employee.userName.toLowerCase() !== "admin")
                      .map((employee) => {
                        const { total, pending, overdue , completed} = getTaskStats(
                          employee.id,
                          tasks
                        );
                        return (
                          <tr key={employee.id} className="border-t border-gray-700">
                            <td className="py-2 px-3 sm:px-4">{employee.userName}</td>
                            <td className="py-2 px-3 sm:px-4">{employee.emailId}</td>
                            <td className="py-2 px-3 sm:px-4 text-center">{total}</td>
                            <td className="py-2 px-3 sm:px-4 text-center">{pending}</td>
                            <td className="py-2 px-3 sm:px-4 text-center">{overdue}</td>
                            <td className="py-2 px-3 sm:px-4 text-center">{completed}</td>
                            <td className="py-2 px-3 sm:px-4 text-center">
                              <div className="flex flex-col sm:flex-row gap-1 justify-center items-center">
                                <button
                                  className="bg-blue-500 text-white px-2 py-1 text-xs rounded hover:bg-blue-600 w-full sm:w-auto"
                                  onClick={() => {
                                    setTaskData((prev) => ({ ...prev, assignedTo: employee.id }));
                                    setShowAddTask(true);
                                  }}
                                >
                                  Add Task
                                </button>
                                <FaEdit
                                  onClick={() => openUpdateEmployeeModal(employee)}
                                  className="text-yellow-500 cursor-pointer hover:text-yellow-600 transition text-base sm:text-lg"
                                  title="Update Employee"
                                />
                                <FaTrash
                                  onClick={() => deleteEmployee(employee.id)}
                                  className="text-red-500 cursor-pointer hover:text-red-600 transition text-base sm:text-lg"
                                  title="Delete Employee"
                                />
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>

                </table>
              </div>
            </div>

            {/* Overall Task Report Chart Section */}
            <div className="bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg border border-gray-300 flex-grow">
              <h2 className="text-xl font-bold text-white mb-4 text-center">Overall Task Report</h2>
              <div className="flex flex-col md:flex-row justify-around items-center h-full">
                {/* Doughnut Chart (Task Status Breakdown) */}
                <div className="w-full md:w-1/2 h-64 md:h-80 flex justify-center items-center">
                  <Doughnut data={doughnutData} options={{ ...chartOptions, plugins: { ...chartOptions.plugins, title: { ...chartOptions.plugins.title, text: 'Task Status Breakdown' } } }} />
                </div>
                {/* Bar Chart (Employee Task Report) - UPDATED */}
                <div className="w-full md:w-1/2 h-64 md:h-80 flex justify-center items-center mt-6 md:mt-0">
                  <Bar data={employeeReportBarData} options={employeeReportChartOptions} />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column – All Tasks List */}
          <div className="lg:w-1/2 bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg border border-gray-300 min-w-0">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white mb-2 sm:mb-0">All Tasks</h2>
              <button
                className="bg-gradient-to-r from-indigo-400 to-cyan-400 text-white text-sm px-3 py-1 sm:px-4 sm:py-2 rounded-lg transition-transform transform hover:scale-105"
                onClick={() => setShowAddTask(true)}
              >
                ADD NEW TASK
              </button>
            </div>

            {/* --- MODIFIED SEARCH INPUTS (ADMIN VIEW) --- */}
            <div className="mb-4 flex flex-col sm:flex-row gap-3">
              <select
                className="p-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-indigo-400 flex-grow"
                value={selectedEmployeeFilterId}
                onChange={(e) => setSelectedEmployeeFilterId(e.target.value)}
              >
                <option value="">All Employees</option>
                {employees
                  .filter((emp) => emp.userName.toLowerCase() !== "admin")
                  .map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.userName}
                    </option>
                  ))}
              </select>
              <select
                className="p-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-cyan-400 flex-grow"
                value={selectedTaskStatusFilter}
                onChange={(e) => setSelectedTaskStatusFilter(e.target.value)}
              >
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="overdue">Overdue</option>
                <option value="due today">Due Today</option>
              </select>
            </div>
            {/* --- END MODIFIED SEARCH INPUTS --- */}

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 overflow-y-auto max-h-[calc(100vh-250px)] custom-scrollbar">
              {filteredTasks.length > 0 ? (
                filteredTasks.map((task) => (
                  <div
                    key={task.id}
                    className="relative bg-white bg-opacity-10 p-4 sm:p-5 rounded-lg shadow-lg text-white hover:scale-105 transition-transform"
                  >
                    <h3 className="font-bold text-base sm:text-lg text-center mb-2">{task.title}</h3>
                    <p className="text-xs sm:text-sm">Task: {task.description}</p>
                    <p className="text-xs sm:text-sm">Due Date: {task.dueDate}</p>
                    {user.userName === "admin" && task.assignedTo && (
                      <p className="text-xs sm:text-sm">
                        Assigned To:{" "}
                        {employees.find((emp) => emp.id === task.assignedTo)?.userName ||
                          "N/A"}
                      </p>
                    )}
                    <span
                      className={`absolute top-2 right-2 px-2 py-1 text-xs font-bold rounded ${getPriorityColor(
                        task.priority
                      )}`}
                    >
                      {task.priority}
                    </span>
                    <div className="flex justify-between items-center mt-4">
                      <p
                        className={`text-xs font-bold ${
                          calculateStatus(task.dueDate, task.taskCompleted).color
                        }`}
                      >
                        {calculateStatus(task.dueDate, task.taskCompleted).text}
                      </p>
                      <div className="flex gap-2 sm:gap-3">
                        <FaEdit
                          onClick={() => openUpdateModal(task)}
                          className="text-yellow-500 cursor-pointer hover:text-yellow-600 transition text-base sm:text-lg"
                          title="Update"
                        />
                        <FaTrash
                          onClick={() => deleteTask(task.id)}
                          className="text-red-500 cursor-pointer hover:text-red-600 transition text-base sm:text-lg"
                          title="Delete"
                        />
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-white text-center col-span-full">No tasks found matching your criteria.</p>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row h-full w-full justify-between p-2 sm:p-3 overflow-auto">
          <div className="lg:w-2/3 w-full p-4 sm:p-6 rounded-lg shadow-lg border border-gray-300 mb-6 lg:mb-0">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
              <h2 className="text-lg sm:text-xl font-bold mb-2 sm:mb-0 text-white">Your Tasks</h2>
              {/* This is the original filter for non-admin users based on priority/status */}
              <div className="mb-4 sm:mb-0 flex justify-center">
                <select
                  className="px-2 py-1 text-sm sm:text-base border border-white rounded-lg bg-indigo-400 text-white cursor-pointer"
                  value={selectedFilter}
                  onChange={handleFilterChange}
                >
                  <option value="All">All</option>
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="Completed">Completed</option>
                  <option value="Pending">Pending</option>
                  <option value="Overdue">Overdue</option>
                  <option value="Due Today">Due Today</option> {/* Added Due Today */}
                </select>
              </div>
              <button
                className="bg-gradient-to-r from-indigo-400 to-cyan-400 text-sm sm:text-base text-white px-3 py-1 sm:px-4 sm:py-2 rounded-lg transition-transform transform hover:scale-105"
                onClick={() => setShowAddTask(true)}
              >
                ADD NEW TASK
              </button>
            </div>
            <div className="flex flex-wrap gap-4 sm:gap-10 justify-center m-2 sm:m-3 overflow-y-auto max-h-[calc(100vh-200px)] custom-scrollbar">
              {filteredTasks.length > 0 ? (
                filteredTasks.map((task) => (
                  <div
                    key={task.id}
                    className="relative w-full sm:w-64 bg-white bg-opacity-20 p-5 sm:p-7 rounded-xl shadow-lg transition-transform transform hover:scale-105"
                  >
                    <h3 className="font-bold text-lg sm:text-xl text-white text-center mb-2 md:m-2">
                      {task.title}
                    </h3>
                    <p className="text-sm sm:text-base text-white">Task: {task.description}</p>
                    <p className="text-sm sm:text-base text-white">Due Date: {task.dueDate}</p>
                    <span
                      className={`absolute top-2 right-2 p-1 rounded-lg text-xs sm:text-sm font-bold ${getPriorityColor(
                        task.priority
                      )}`}
                    >
                      {task.priority}
                    </span>
                    <div className="flex justify-between gap-3 mt-6 sm:mt-8">
                      <div>
                        <p
                          className={`text-xs sm:text-sm font-bold ${calculateStatus(task.dueDate, task.taskCompleted).color}`}
                        >
                          {calculateStatus(task.dueDate, task.taskCompleted).text}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <div className="relative group">
                          <FaEdit
                            onClick={() => openUpdateModal(task)}
                            className="text-yellow-500 cursor-pointer hover:text-yellow-600 transition text-base sm:text-lg"
                          />
                          <span className="absolute bottom-full mb-1 w-max text-xs text-white rounded opacity-0 group-hover:opacity-100 transition">
                            Update
                          </span>
                        </div>
                        <div className="relative group">
                          <FaTrash
                            onClick={() => deleteTask(task.id)}
                            className="text-red-500 cursor-pointer hover:text-red-600 transition text-base sm:text-lg"
                          />
                          <span className="absolute bottom-full mb-1 w-max text-xs text-white rounded opacity-0 group-hover:opacity-100 transition">
                            Delete
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-white text-center col-span-full">No tasks found matching your criteria.</p>
              )}
            </div>
          </div>
          <div className="lg:w-1/3 w-full h-full text-white p-4 sm:p-6 rounded-lg shadow-lg border border-gray-300 self-start">
            <h2 className="text-lg sm:text-xl font-bold mb-4">Task Overview</h2>
            <div className="flex flex-wrap pb-3 justify-center gap-4 sm:gap-6 bg-white bg-opacity-20 rounded-lg">
              <div className="w-2/5 mt-4 pt-3 bg-white bg-opacity-20 rounded-lg">
                <p className="text-xs sm:text-sm mb-2 text-center font-semibold">Total Tasks</p>
                <p className="text-center mb-2 text-3xl sm:text-4xl"> {tasks.length}</p>
              </div>
              <div className="w-2/5 mt-4 pt-3 bg-white bg-opacity-20 rounded-lg">
                <p className="text-xs sm:text-sm mb-2 text-center font-semibold">Completed</p>
                <p className="text-center mb-2 text-3xl sm:text-4xl">
                  {" "}
                  {tasks.filter((t) => t.taskCompleted === "COMPLETED").length}
                </p>
              </div>
              <div className="w-2/5 mt-4 pt-3 bg-white bg-opacity-20 rounded-lg">
                <p className="text-xs sm:text-sm mb-2 font-semibold text-center">Pending Tasks</p>
                <p className="text-center mb-2 text-3xl sm:text-4xl">
                  {" "}
                  {/* Updated pending tasks count logic */}
                  {
                    tasks.filter(
                      (t) => {
                          const taskDueDate = new Date(t.dueDate);
                          taskDueDate.setHours(0,0,0,0);
                          const nowForCount = new Date();
                          nowForCount.setHours(0,0,0,0);
                          return t.taskCompleted === "PENDING" && taskDueDate >= nowForCount;
                      }
                    ).length
                  }
                </p>
              </div>
              <div className="bg-white bg-opacity-20 rounded-lg w-2/5 mt-4 pt-3">
                <p className="text-xs sm:text-sm mb-2 font-semibold text-center">Overdue Tasks</p>
                <p className="text-center mb-2 text-3xl sm:text-4xl">
                  {" "}
                  {/* Updated overdue tasks count logic */}
                  {
                    tasks.filter(
                      (t) => {
                        const taskDueDate = new Date(t.dueDate);
                        taskDueDate.setHours(0,0,0,0);
                        const nowForCount = new Date();
                        nowForCount.setHours(0,0,0,0);
                        return t.taskCompleted === "PENDING" && taskDueDate < nowForCount;
                      }
                    ).length
                  }
                </p>
              </div>
            </div>
            <div className="mt-6 p-4 bg-white bg-opacity-20 rounded-lg">
              <h3 className="text-lg sm:text-xl font-semibold text-center">Progress</h3>
              <div className="w-full bg-gray-300 rounded-full h-6 overflow-hidden mt-2 relative">
                <div
                  className="bg-green-400 h-6 rounded-full transition-all"
                  style={{
                    width: `${
                      tasks.length > 0
                        ? (tasks.filter((t) => t.taskCompleted === "COMPLETED").length /
                            tasks.length) *
                          100
                        : 0
                    }%`,
                  }}
                ></div>
                <p className="absolute text-xs sm:text-sm inset-0 flex justify-center items-center text-white font-bold">
                  {tasks.length > 0
                    ? `${Math.round(
                        (tasks.filter((t) => t.taskCompleted === "COMPLETED").length /
                          tasks.length) *
                          100
                      )}% Completed`
                    : "0% Completed"}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Task Modal */}
      {showAddTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md max-h-[90vh] overflow-y-auto custom-scrollbar">
            <h2 className="text-xl font-semibold mb-4">Create a New Task</h2>
            <div className="grid gap-4">
              <input
                type="text"
                name="title"
                placeholder="Task Title"
                value={taskData.title}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <textarea
                name="description"
                placeholder="Task Description"
                value={taskData.description}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[80px]"
              ></textarea>
              <select
                name="priority"
                value={taskData.priority}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
              <input
                type="date"
                name="dueDate"
                value={taskData.dueDate}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {user.userName === "admin" && (
                <select
                  name="assignedTo"
                  value={taskData.assignedTo || ""}
                  onChange={(e) =>
                    setTaskData({ ...taskData, assignedTo: parseInt(e.target.value) || null }) // Convert to number
                  }
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Employee</option>
                  {employees
                    .filter((emp) => emp.userName.toLowerCase() !== "admin") // Keeps current logic: prevent assigning to 'admin'
                    .map((emp) => (
                      <option key={emp.id} value={emp.id}>
                        {emp.userName}
                      </option>
                    ))}
                </select>
              )}
              <select
                name="taskCompleted"
                value={taskData.taskCompleted}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="PENDING">Pending</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowAddTask(false)}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={addTask}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
              >
                Add Task
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Update Task Modal */}
      {showUpdateModal && currentTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md max-h-[90vh] overflow-y-auto custom-scrollbar">
            <h2 className="text-xl font-semibold mb-4">Update Task</h2>
            <div className="grid gap-4">
              <input
                type="text"
                name="title"
                value={currentTask.title}
                onChange={handleUpdateInputChange}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <textarea
                name="description"
                value={currentTask.description}
                onChange={handleUpdateInputChange}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[80px]"
              ></textarea>
              <select
                name="priority"
                value={currentTask.priority}
                onChange={handleUpdateInputChange}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
              <input
                type="date"
                name="dueDate"
                value={currentTask.dueDate}
                onChange={handleUpdateInputChange}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {user.userName === "admin" && (
                <select
                  name="assignedTo"
                  value={currentTask.assignedTo || ""}
                  onChange={(e) =>
                    setCurrentTask({ ...currentTask, assignedTo: parseInt(e.target.value) || null }) // Convert to number
                  }
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Employee</option>
                  {employees
                    .filter((emp) => emp.userName.toLowerCase() !== "admin") // Keeps current logic: prevent assigning to 'admin'
                    .map((emp) => (
                      <option key={emp.id} value={emp.id}>
                        {emp.userName}
                      </option>
                    ))}
                </select>
              )}
              <select
                name="taskCompleted"
                value={currentTask.taskCompleted}
                onChange={handleUpdateInputChange}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="PENDING">Pending</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowUpdateModal(false)}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={updateTask}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
              >
                Update Task
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Employee Modal */}
      {showAddEmployeeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md max-h-[90vh] overflow-y-auto custom-scrollbar">
            <h2 className="text-xl font-semibold mb-4">Add New Employee</h2>
            <div className="grid gap-4">
              <input
                type="text"
                name="userName"
                placeholder="Employee Name"
                value={employeeData.userName}
                onChange={handleEmployeeInputChange}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="email"
                name="emailId"
                placeholder="Email Address"
                value={employeeData.emailId}
                onChange={handleEmployeeInputChange}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={employeeData.password}
                onChange={handleEmployeeInputChange}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowAddEmployeeModal(false)}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={addEmployee}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
              >
                Add Employee
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Update Employee Modal */}
      {showUpdateEmployeeModal && currentEmployee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md max-h-[90vh] overflow-y-auto custom-scrollbar">
            <h2 className="text-xl font-semibold mb-4">Update Employee</h2>
            <div className="grid gap-4">
              <input
                type="text"
                name="userName"
                placeholder="Employee Name"
                value={currentEmployee.userName}
                onChange={handleUpdateEmployeeInputChange}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="email"
                name="emailId"
                placeholder="Email Address"
                value={currentEmployee.emailId}
                onChange={handleUpdateEmployeeInputChange}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="password"
                name="password"
                placeholder="Leave blank to keep current password"
                value={employeeData.password} // Use employeeData state for this input
                onChange={(e) => setEmployeeData({...employeeData, password: e.target.value})} // Update employeeData for password
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowUpdateEmployeeModal(false)}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={updateEmployee}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
              >
                Update Employee
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskManager;