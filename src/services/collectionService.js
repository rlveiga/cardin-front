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

    getCardsFromCollection(token, collection_id) {
      return api.get(`/collections/${collection_id}`, {
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

    createCollection(token, name) {
        return api.post(
                `/collections`,
                {
                    name
                }, 
                {
                    headers: {
                        'access-token': token
                    }
                }
        ).then(res => {
            return res;
        })
        .catch(err => {
            return err.response;
        });
    }
}

export default new CollectionService();