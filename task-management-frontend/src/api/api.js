import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/'; // Adjust based on your Django backend URL

export const registerUser = (userData) => axios.post(`${API_URL}register/`, userData);
export const loginUser = (credentials) => axios.post(`${API_URL}userlogins/`, credentials);

