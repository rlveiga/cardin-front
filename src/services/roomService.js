import api from '../../axios';

class RoomService {
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
}

export default new RoomService();