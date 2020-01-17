import { observable, action } from 'mobx';
import CollectionService from '../services/collectionService';

export default class CollectionStore {
    constructor(root) {
        this.root = root
    }

    @observable success
    @observable collectionList

    @action
    async getCollections() {
        this.success = false

        await CollectionService.getCollections(
            this.root.userStore.token
        ).then(response => {
            console.log(response)
            if(response.status == 200) {
                this.success = true
                this.collectionList = response.data.collections
            }
        }, error => {
            console.log(error.response)
        })
    }
}