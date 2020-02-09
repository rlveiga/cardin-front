import { observable, action } from 'mobx';
import CardService from '../services/cardService';

export default class CardStore {
    constructor(root) {
        this.root = root
    }

    @observable success
    @observable cardList

    @observable card

    @action
    async getCards() {
        await CardService.getCards(
            this.root.userStore.token
        ).then(response => {
            console.log(response)
            if(response.status == 200) {
                this.cardList = response.data.cards
            }
        }, error => {
            console.log(error)
        })
    }

    @action
    async getCardById(id) {
      await CardService.getCardById(
        this.root.userStore.token,
        id
      ).then(response => {
        this.success = true
        this.card = response.data
      }, error => {
        console.log(error)
      })
    }

    @action
    async createCard(name, type, collection_id) {
        this.success = false

        await CardService.createCard(
            this.root.userStore.token,
            name,
            type,
            collection_id
        ).then(response => {
            console.log(response)
            if(response.status == 200) {
                this.success = true
            }
        }, error => {
            console.log(error.response)
        })
    }

    @action
    async deleteCard(id) {
        this.success = false

        await CardService.deleteCard(
            this.root.userStore.token,
            id
        ).then(response => {
            console.log(response)

            if(response.status == 200) {
                this.success = true
            }
        }, error => {
            console.log(error.response)
        })
    }

    @action
    async addToCollection(card_id, collection_id) {
        await CardService.addToCollection(
            this.root.userStore.token,
            card_id,
            collection_id
        ).then(response => {
          console.log(response)

          if(response.status == 200) {
              this.success = true
          }
        }, error => {
            console.log(error)
        })
    }

    @action
    async removeFromCollection(card_id, collection_id) {
        await CardService.removeFromCollection(
            this.root.userStore.token,
            card_id,
            collection_id
        ).then(response => {
          console.log(response)

          if(response.status == 200) {
              this.success = true
          }
        }, error => {
            console.log(error)
        })
    }

    // @action
    // async updateCollections(card_id, alterations) {
    //   console.log(alterations)
      
    //   this.success = false

    //   const addedResponse = await CardService.addCollections(
    //     this.root.userStore.token,
    //     card_id,
    //     alterations.added
    //   )
      
    //   console.log(addedResponse)
      
    //   if(addedResponse.status == 200) {
    //     const removedResponse = await CardService.removeCollections(
    //       this.root.userStore.token,
    //       card_id,
    //       alterations.deleted
    //     )

    //     console.log(removedResponse)
        
    //     if(removedResponse.status == 200) {
    //       this.success = true
    //     }
    //   }
    // }
}