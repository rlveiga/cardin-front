import api from '../../axios';

class UserService {
  login(fb_access_token) {
    return api.post('/auth/', {
      fb_access_token
    })
      .then(res => {
        return res;
      })
      .catch(err => {
        return err.response;
      });
  }
}

export default new UserService();