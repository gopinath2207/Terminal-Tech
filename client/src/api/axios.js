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

        // Only redirect to login on 401 if the user is already on an admin page.
        // Public visitors hitting /auth/me with no session return 401 — that's
        // expected and should NOT redirect them away from the public site.
        const onAdminPage = window.location.pathname.startsWith('/admin');
        if (status === 401 && onAdminPage && !window.location.pathname.startsWith('/admin/login')) {
            window.location.href = '/admin/login';
            return Promise.reject(new Error('Session expired. Please log in again.'));
        }

        return Promise.reject(new Error(msg));
    }
);

export default api;
