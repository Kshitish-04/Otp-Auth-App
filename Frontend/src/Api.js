import axios from 'axios';

// const API = axios.create({baseURL: 'http://localhost:5000/api/auth'})
const API = axios.create({baseURL: 'https://authentication-app-sage.vercel.app/api/auth'})

//API.interceptors.request.use((req) => {})
export default API; 