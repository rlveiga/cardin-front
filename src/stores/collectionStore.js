import { observable, action } from 'mobx';
import CollectionService from '../services/collectionService';

export default class CollectionStore {
    constructor(root) {
        this.root = root
    }

    @observable shouldReloadCollection
    @observable shouldReloadCollections

    @observable success
    @observable collectionList
    @observable selectedCollection

    @action
    async getCollections() {
        this.success = false

        await CollectionService.getCollections(
            this.root.userStore.token
        ).then(response => {
            console.log(response)
            if(response.status == 200) {
                this.success = true
                this.collectionList = response.data.collections.sort((a, b) => {
                    return a.id - b.id
                })
            }
        }, error => {
            console.log(error.response)
        })
    }

    @action
    async getCardsFromCollection(collection_id) {
        this.success = false

        await CollectionService.getCardsFromCollection(
            this.root.userStore.token,
            collection_id
        ).then(response => {
            console.log(response)
            if(response.status == 200) {
              this.success = true
              this.selectedCollection.cards = response.data.collection.cards
            }
        }, error => {
            console.log(error.response)
        })
    }

    @action
    async createCollection(name) {
        this.success = false

        await CollectionService.createCollection(
            this.root.userStore.token,
            name
        ).then(response => {
            console.log(response)
            if(response.status == 201) {
                this.success = true
            }
        }, error => {
            console.log(error.response)
        })
    }
}