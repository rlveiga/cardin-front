import axios from 'axios';
import { Platform } from 'react-native'

//android url: http://10.0.2.2:5000

const api = axios.create({
    baseURL: 'https://cardin-app.herokuapp.com/'
});

export default api;
