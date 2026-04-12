import axios from 'axios'

const API = import.meta.env.VITE_API_URL;

const api = axios.create({
 
  baseURL: "https://personal-portfolio-81xi.onrender.com/api/v1",
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
})

// Response interceptor
api.interceptors.response.use(
  (res) => res.data,
  (err) => {
    const message = err.response?.data?.message || 'Something went wrong'
    return Promise.reject(new Error(message))
  }
)

export default api