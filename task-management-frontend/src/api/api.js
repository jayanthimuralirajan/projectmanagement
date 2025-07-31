import axios from 'axios';

const API_URL = 'https://projectmanagement-tyik.onrender.com'; // Adjust based on your Django backend URL

export const registerUser = (userData) => axios.post(`${API_URL}register/`, userData);
export const loginUser = (credentials) => axios.post(`${API_URL}userlogins/`, credentials);

