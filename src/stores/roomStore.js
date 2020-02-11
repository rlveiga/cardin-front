import { observable, action } from 'mobx';
import RoomService from '../services/roomService';

export default class RoomStore {
    constructor(root) {
        this.root = root
    }

    @observable success = false

    @observable currentRoom

    @action
    async createRoom(code) {
      this.success = false

      await RoomService.createRoom(
        this.root.userStore.token,
        code
      ).then(res => {
        console.log(res)
        this.success = true
        this.currentRoom = res.data.room
      }, err => {
        console.log(err)
      })
    }

    @action
    async joinRoom(name) {
        this.success = false;

        await RoomService.joinRoom(
            name,
            this.root.userStore.token
        ).then(res => {
            console.log(res)
        }, err => {
            console.log(err.response)
        }) 
    }
}