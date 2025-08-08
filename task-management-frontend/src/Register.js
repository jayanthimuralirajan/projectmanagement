
import React, { useState } from 'react';
import { registerUser } from './api/api';
import { NavLink, useNavigate } from 'react-router-dom'; // Import useNavigate

const Register = () => {
  const [user, setUser] = useState({ emailId: '', userName: '', password: '' });
  const navigate = useNavigate(); // Initialize the hook

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerUser(user);
      alert('Registration successful!');
      navigate('/'); // Redirect to the login page after a successful registration
    } catch (error) {
      console.error('Registration failed:', error);
      alert('Registration failed. Please try again.'); // Add a user-friendly alert for failure
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-indigo-400 to-cyan-400">
      <div className="bg-white p-8 rounded-lg shadow-lg md:w-96 sm:w-3/4">
        <h2 className="md:text-3xl sm:text-xl font-bold mb-6 text-center text-gray-700">Register</h2>
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <input
            type="text"
            name="emailId"
            placeholder="Email"
            onChange={handleChange}
            required
            className="md:p-3 sm:p-2 sm:text-base md:text-lg w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            name="userName"
            placeholder="Username"
            onChange={handleChange}
            required
            className="md:p-3 sm:p-2 sm:text-base md:text-lg w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
            className="md:p-3 sm:p-2 sm:text-base md:text-lg w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="md:p-3 sm:p-2 sm:text-base md:text-lg w-full p-3 bg-gradient-to-r from-indigo-400 to-cyan-400 text-white rounded-lg"
          >
            Register
          </button>
        </form>
        <p className=" md:text-sm sm:text-xs mt-4 text-center text-gray-600">
          Already have an account? <NavLink to="/" className="text-blue-500 hover:underline">Login</NavLink>
        </p>
      </div>
    </div>
  );
};

export default Register;
