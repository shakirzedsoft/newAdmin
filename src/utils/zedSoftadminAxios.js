import axios from 'axios';

const BuidBaseURL = 'https://adminbackend-x8mm.onrender.com/';
const LocalyBaseURL = "http://localhost:5000";

const axiosInstanceZedSoft = axios.create({ baseURL: LocalyBaseURL });

// const axiosInstanceZedSoft = axios.create({ baseURL: BuidBaseURL });

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