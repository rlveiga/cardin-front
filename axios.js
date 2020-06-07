import axios from 'axios';
import { API_ENDPOINT } from 'react-native-dotenv';

const api = axios.create({
    baseURL: 'https://cardin-staging.herokuapp.com'
});

export default api;