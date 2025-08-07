
// import React, { useState } from 'react';
// import { registerUser } from './api/api';
// import { NavLink, useNavigate } from 'react-router-dom'; // Import useNavigate

// const Register = () => {
//   const [user, setUser] = useState({ emailId: '', userName: '', password: '' });
//   const navigate = useNavigate(); // Initialize the hook

//   const handleChange = (e) => {
//     setUser({ ...user, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await registerUser(user);
//       alert('Registration successful!');
//       navigate('/'); // Redirect to the login page after a successful registration
//     } catch (error) {
//       console.error('Registration failed:', error);
//       alert('Registration failed. Please try again.'); // Add a user-friendly alert for failure
//     }
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-indigo-400 to-cyan-400">
//       <div className="bg-white p-8 rounded-lg shadow-lg md:w-96 sm:w-3/4">
//         <h2 className="md:text-3xl sm:text-xl font-bold mb-6 text-center text-gray-700">Register</h2>
//         <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
//           <input
//             type="text"
//             name="emailId"
//             placeholder="Email"
//             onChange={handleChange}
//             required
//             className="md:p-3 sm:p-2 sm:text-base md:text-lg w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//           <input
//             type="text"
//             name="userName"
//             placeholder="Username"
//             onChange={handleChange}
//             required
//             className="md:p-3 sm:p-2 sm:text-base md:text-lg w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//           <input
//             type="password"
//             name="password"
//             placeholder="Password"
//             onChange={handleChange}
//             required
//             className="md:p-3 sm:p-2 sm:text-base md:text-lg w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//           <button
//             type="submit"
//             className="md:p-3 sm:p-2 sm:text-base md:text-lg w-full p-3 bg-gradient-to-r from-indigo-400 to-cyan-400 text-white rounded-lg"
//           >
//             Register
//           </button>
//         </form>
//         <p className=" md:text-sm sm:text-xs mt-4 text-center text-gray-600">
//           Already have an account? <NavLink to="/" className="text-blue-500 hover:underline">Login</NavLink>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Register;



import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = 'https://projectmanagement-tyik.onrender.com/api';

const Register = () => {
  const [formData, setFormData] = useState({
    userName: '',
    emailId: '',
    password: '',
  });
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // This is the improved registerUser function that handles errors gracefully.
  const registerUser = async (user) => {
    try {
      // The API call to your backend
      const response = await fetch(`${API_BASE_URL}/register/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });

      // We check if the response status is OK (200-299)
      if (!response.ok) {
        // If the response is not OK, we throw a new Error.
        // This will trigger the 'catch' block in handleSubmit.
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Registration failed with an unknown error.');
      }

      // If the response is OK, we parse the JSON and return it.
      const data = await response.json();
      return data;
    } catch (error) {
      // This catch block handles network errors (e.g., no internet connection)
      // and re-throws the error so it can be handled by handleSubmit's catch block.
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(''); // Clear previous messages
    setIsError(false); // Reset error state

    try {
      // Wait for the registerUser function to complete.
      // If it fails, it will throw an error, which is caught below.
      const response = await registerUser(formData);
      
      setMessage(response.message || 'Registration successful!');
      // Set success status to true
      setIsError(false);
      
      // Navigate after a short delay to let the user read the success message
      setTimeout(() => {
        navigate('/login');
      }, 2000); 

    } catch (error) {
      // The catch block now properly handles errors thrown by registerUser
      console.error('Registration failed:', error);
      setMessage(error.message || 'Registration failed. Please try again.');
      setIsError(true);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Register</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="text"
              name="userName"
              placeholder="Username"
              value={formData.userName}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <input
              type="email"
              name="emailId"
              placeholder="Email"
              value={formData.emailId}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-6">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Register
          </button>
        </form>
        {/* Display messages to the user */}
        {message && (
          <p className={`mt-4 text-center font-bold ${isError ? 'text-red-600' : 'text-green-600'}`}>
            {message}
          </p>
        )}
        <p className="mt-4 text-center text-gray-600">
          Already have an account?{' '}
          <span
            onClick={() => navigate('/login')}
            className="text-blue-600 hover:underline cursor-pointer font-bold"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default Register;
