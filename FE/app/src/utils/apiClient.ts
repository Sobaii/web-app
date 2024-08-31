import axios, { AxiosInstance } from 'axios';

const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000',
  timeout: 10000, // Set a timeout for requests
  withCredentials: true, // Include cookies with requests
});

export default apiClient;
