import api from '../../axios';

class UserService {
    login(email, password) {
         return api.post('/auth/login', {
             email,
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