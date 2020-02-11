import api from '../../axios';

class RoomService {
  createRoom(token, code) {
    return api.post(
      '/rooms/',
      {
        code
      },
      {
      headers: {
        'access-token': token
      }
    })
    .then(res => {
      return res
    })
    .catch(err => {
      return err.response
    })
  }

  joinRoom(name, token) {
    return api.post(`/rooms/${name}.json`, null, {
      headers: {
          'access-token': token
      }
    })
    .then(res => {
      return res;
    })
    .catch(err => {
      throw err;
    });
  }

  leaveRoom(token, code) {
    return api.delete(`/rooms/${code}`, {
      headers: {
          'access-token': token
      }
    })
    .then(res => {
      return res;
    })
    .catch(err => {
      throw err;
    });
  }
}

export default new RoomService();