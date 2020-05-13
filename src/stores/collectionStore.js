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
  @observable createdCollection

  @observable errorMsg

  @action
  async getCollections() {
    this.success = false

    await CollectionService.getCollections(
      this.root.userStore.token
    ).then(response => {
      console.log(response)
      if (response.status == 200) {
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
      if (response.status == 200) {
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
      if (response.status == 201) {
        this.success = true
        this.createdCollection = response.data.collection
      }
    }, error => {
      console.log(error.response)
    })
  }

  @action
  async acquireCollection(collection_id) {
    this.success = false

    await CollectionService.acquireCollection(
      this.root.userStore.token,
      collection_id
    ).then(response => {
      console.log(response)
      if (response.status == 201) {
        this.success = true
      }

      else if (response.status == 422) {
        this.errorMsg = 'Você já possui esta coleção'
      }
    }, error => {
      console.log(error.response)
      this.errorMsg = error.response.data.message
    })
  }

  @action
  async disownCollection(collection_id) {
    this.success = false

    await CollectionService.disownCollection(
      this.root.userStore.token,
      collection_id
    ).then(response => {
      console.log(response)

      if (response.status == 200) {
        this.success = true
      }
    }, error => {
      console.log(error)
    })
  }

  @action
  async addCard(collection_id, card_id) {
    this.success = false
    
    await CollectionService.addCard(
      this.root.userStore.token,
      collection_id,
      card_id
    ).then(response => {
      console.log(response)

      if (response.status == 200) {
        this.success = true
      }
    }, error => {
      console.log(error)
    })
  }

  @action
  async removeCard(collection_id, card_id) {
    this.success = false

    await CollectionService.removeCard(
      this.root.userStore.token,
      collection_id,
      card_id
    ).then(response => {
      console.log(response)

      if (response.status == 200) {
        this.success = true
      }
    }, error => {
      console.log(error)
    })
  }

  @action
  async deleteCollection(collection_id) {
    this.success = false
    
    await CollectionService.deleteCollection(
      this.root.userStore.token,
      collection_id
    ).then(response => {
      console.log(response)

      if(response.status == 200) {
        this.success = true
      }

      else {
        this.errorMsg = response.data.message
      }
    }, error => {
      console.log(error)
    })
  }
}