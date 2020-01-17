import api from '../../axios';

class CollectionService {
    getCollections(token) {
        return api.get(`/collections`, {
            headers: {
                'access-token': token
            }
        })
        .then(res => {
            return res;
        })
        .catch(err => {
            return err;
        });
    }  
}

export default new CollectionService();