import axios from 'axios';

const axiosInstanceZedSoft = axios.create({ baseURL: "http://localhost:5000" });

axiosInstanceZedSoft.interceptors.request.use(
    config => {
        const token = localStorage.getItem('access_token');

        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    error => Promise.reject(error)
);

export default axiosInstanceZedSoft;