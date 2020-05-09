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

  createCard(token, name, card_type, collection_id) {
    return api.post(
      `/cards/`,
      {
        name,
        card_type,
        collection_id
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

  // TODO
  // This HTTP call is no good. TIL REST is not too appropriate for deleting content in batched,
  // therefore I should add/remove cards from collections as these collections are clicked.
  // Sounds simple and much easier to implement. Because it is! 
  removeCollections(token, card_id, removed) {
    console.log(token)
    return api.delete(`/cards/${card_id}/remove_collections`,
      {
        collections: removed
      },
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

export default new CardService();