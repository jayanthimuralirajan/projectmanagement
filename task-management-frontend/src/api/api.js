
import axios from 'axios';

const API_URL = 'https://projectmanagement-tyik.onrender.com/'; // <-- Added a trailing slash here

export const registerUser = (userData) => axios.post(`${API_URL}register/`, userData);
export const loginUser = (credentials) => axios.post(`${API_URL}login/`, credentials); // <-- Assumed login endpoint