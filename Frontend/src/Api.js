import axios from 'axios';

// const API = axios.create({baseURL: 'http://localhost:5000/api/auth'})
const API = axios.create({
    baseURL: 'https://otp-auth-app-phi.vercel.app/',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
})

//API.interceptors.request.use((req) => {})
export default API; 