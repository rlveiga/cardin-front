import api from '../../axios';

class UserService {
  register(username, password) {
    return api.post('/auth/register', {
      username,
      password
    })
      .then(res => {
        return res;
      })
      .catch(err => {
        return err.response;
      });
  }

  login(username, password) {
    return api.post('/auth/login', {
      username,
      password
    })
      .then(res => {
        return res;
      })
      .catch(err => {
        return err.response;
      });
  }

  fbLogin(fb_access_token) {
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