import api from '../../axios';

class CardService {
    getCards(token) {
        return api.get(`/cards`, {
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

    getCardById(token, id) {
      return api.get(`/cards/${id}`, {
          headers: {
              'access-token': token
          }
      })
      .then(res => {
          return res;
      })
      .catch(err => {
          throw err.response;
      });
  }

    createCard(token, name, card_type) {
        return api.post(
                `/cards`,
                {
                    name,
                    card_type
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

    deleteCard(token, card_id) {
        return api.delete(`/cards/${card_id}`, {
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

    addToCollection(token, card_id, collection_id) {
        return api.put(`/cards/${card_id}/add_collection/${collection_id}`, {
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

export default new CardService();