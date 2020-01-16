import axios from 'axios';

//android url: http://10.0.2.2:5000

const api = axios.create({
    baseURL: 'http://localhost:5000'
});

export default api;
