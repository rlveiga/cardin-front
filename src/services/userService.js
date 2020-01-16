import api from '../../axios';

class UserService {
    login(username, password) {
         return api.post('/auth/login', {
             username,
             password
         })
         .then(res => {
             return res;
         })
         .catch(err => {
            throw err;
         });
    }
}

export default new UserService();