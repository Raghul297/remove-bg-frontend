import axios from 'axios';

const API = axios.create({
  baseURL: 'http://13.60.221.0:8080',
  timeout: 60000,
});

export const uploadImage = (formData) => API.post('/upload', formData);
