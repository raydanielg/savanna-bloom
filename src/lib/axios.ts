import axios from 'axios';

// Function to get cookie value by name
function getCookie(name: string): string | null {
    const match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
    return match ? decodeURIComponent(match[3]) : null;
}

// Determine base URL based on environment
const getBaseURL = () => {
    // In production, use the backend API URL directly
    if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
        return 'https://app.godeepafricasafari.com';
    }
    // In development, use Vite proxy (empty string)
    return '';
};

const lib = axios.create({
    baseURL: getBaseURL(),
    withCredentials: true,
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    },
});

// Add XSRF-TOKEN to every request
lib.interceptors.request.use((config) => {
    const xsrfToken = getCookie('XSRF-TOKEN');
    if (xsrfToken) {
        config.headers['X-XSRF-TOKEN'] = xsrfToken;
    }
    config.withCredentials = true; // Force withCredentials for every request
    return config;
});

// Handle 401 errors - redirect to login if not already there
lib.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Only redirect if not on login page and not making a login/user request
            const isLoginPage = window.location.pathname === '/login';
            const isLoginRequest = error.config?.url?.includes('/login');
            
            if (!isLoginPage && !isLoginRequest) {
                // Clear any stale session data
                document.cookie = 'laravel_session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
                document.cookie = 'XSRF-TOKEN=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default lib;
