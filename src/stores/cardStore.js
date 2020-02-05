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
    async createCard(name, type) {
        this.success = false

        await CardService.createCard(
            this.root.userStore.token,
            name,
            type
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
        await CardService.deleteCard(
            this.root.userStore.token,
            card_id,
            collection_id
        ).then(response => {

        }, error => {
            
        })
    }
}