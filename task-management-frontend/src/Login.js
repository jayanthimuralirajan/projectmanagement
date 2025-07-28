
import React, { useState,useContext } from 'react';
import { loginUser } from './api/api';
import { NavLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { UserContext } from "./UserContext"; 


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email || !password) {
      alert("Email ID and Password cannot be empty");
      return;
    }

    const data = { emailId: email, password: password };

    try {
      const response = await loginUser(data);
      if (response.data.message === 'Login successful') {
        alert('Login successful');
           setUser(response.data.user); 
        navigate('/Task');

      } else {
        alert(response.data.error || 'Email ID or Password is incorrect');
      }
    } catch (err) {
      console.error(err);
      alert('Login failed');
    }
  }

  return (
    
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-indigo-400 to-cyan-400">
      <div className="bg-white p-8 rounded-lg shadow-lg md:w-96 sm:w-3/4">
        <h2 className="md:text-3xl  font-bold mb-6 text-center text-gray-700 sm:text-xl">Login</h2>
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <input
            type="text"
            placeholder="Email ID"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="md:p-3 sm:p-2 sm:text-base md:text-lg w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full md:p-3 sm:p-2 sm:text-base md:text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="w-full sm:text-base md:text-lg md:p-3 sm:p-2 bg-gradient-to-r from-indigo-400 to-cyan-400 text-white rounded-lg hover:bg-blue-600 transition duration-200"
          >
            <NavLink to="/Task">Login</NavLink> 
          </button>
        </form>
        <div className="text-center mt-4">
          <span className="md:text-sm sm:text-xs text-blue-500 hover:underline cursor-pointer">Forgot password?</span>
        </div>
        <p className="mt-4 text-center md:text-sm sm:text-xs text-gray-600">
          Don't have an account? <NavLink to="/register" className="text-blue-500 hover:underline">Signup</NavLink>
        </p>
      </div>
    </div>
  );
};

export default Login;



