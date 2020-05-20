import axios from 'axios';

const api = axios.create({
    baseURL: 'https://cardin-prod.herokuapp.com/'
});

export default api;