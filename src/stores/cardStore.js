import { observable, action } from 'mobx';
import CardService from '../services/cardService';

export default class CardStore {
    constructor(root) {
        this.root = root
    }

    @observable cardList

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
    async createCard(name, type) {
        await CardService.createCard(
            this.root.userStore.token,
            name,
            type
        ).then(response => {
            console.log(response)
        }, error => {
            console.log(error.response)
        })
    }

    @action
    async deleteCard(id) {
        await CardService.deleteCard(
            this.root.userStore.token,
            id
        ).then(response => {

        }, error => {
            
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