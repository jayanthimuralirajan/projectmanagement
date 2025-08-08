import axios from 'axios';

const API_URL = 'https://projectmanagement-ty1k.onrender.com/api/'; // <-- Note the addition of '/api/'
export const registerUser = (userData) => axios.post(`${API_URL}register/`, userData);
export const loginUser = (credentials) => axios.post(`${API_URL}userlogins/`, credentials);


