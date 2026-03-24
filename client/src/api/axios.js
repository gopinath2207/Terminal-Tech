import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || '/api',
    withCredentials: true, // send HttpOnly cookies automatically
    headers: { 'Content-Type': 'application/json' },
    timeout: 15000, // 15s timeout — prevents requests hanging forever
});

// Response interceptor: unwrap data and handle auth errors globally
api.interceptors.response.use(
    (response) => response.data,
    (error) => {
        const status = error.response?.status;
        const msg = error.response?.data?.message || error.message || 'Request failed';

        // Auto-redirect to login on 401 (expired session)
        if (status === 401 && !window.location.pathname.startsWith('/admin/login')) {
            window.location.href = '/admin/login';
            return Promise.reject(new Error('Session expired. Please log in again.'));
        }

        return Promise.reject(new Error(msg));
    }
);

export default api;
