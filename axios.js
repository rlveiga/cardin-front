import axios from 'axios';
import { Platform } from 'react-native'

//android url: http://10.0.2.2:5000

const api = axios.create({
    baseURL: Platform.OS == 'ios' ?
            'http://localhost:5000' :
            'http://10.0.2.2:5000'
});

export default api;
