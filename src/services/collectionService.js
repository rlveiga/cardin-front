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
        return err.response;
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

  acquireCollection(token, collection_id) {
    return api
      .post(
        `/owned_collections/${collection_id}`,
        null,
        {
          headers: {
            'access-token': token
          }
        }
      )
      .then(res => {
        return res;
      })
      .catch(err => {
        return err.response;
      });
  }

  addCard(token, collection_id, card_id) {
    return api.post(`/collections/${collection_id}/add_card/${card_id}`,
      null,
      {
        headers: {
          'access-token': token
        }
      }
    )
      .then(res => {
        return res;
      })
      .catch(err => {
        return err.response;
      });
  }

  removeCard(token, collection_id, card_id) {
    return api.delete(`/collections/${collection_id}/remove_card/${card_id}`,
      {
        headers: {
          'access-token': token
        }
      }
    )
      .then(res => {
        return res;
      })
      .catch(err => {
        return err.response;
      });
  }
}

export default new CollectionService();