import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_BASE,
  timeout: 60000,
});

export const uploadImage = (formData) => API.post('/upload', formData);
