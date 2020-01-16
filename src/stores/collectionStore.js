import { observable, action } from 'mobx';
import CollectionService from '../services/collectionService';

export default class CollectionStore {
    constructor(root) {
        this.root = root
    }

    @action
    async getCollections() {
        await CollectionService.getCollections(
            this.root.userStore.token
        ).then(response => {

        }, error => {
            
        })
    }
}