import { observable, action } from 'mobx';
import RoomService from '../services/roomService';

export default class RoomStore {
    constructor(root) {
        this.root = root
    }

    @observable success = false

    @observable selectedCollection

    @observable currentRoom
    @observable gameData
    @observable hand
    @observable playersList
    @observable lockHand = false
    @observable selectingTimeout

    @observable voterSwiperIndex = 0

    @action
    async createRoom(code, collection_id) {
      this.success = false

      await RoomService.createRoom(
        this.root.userStore.token,
        code,
        collection_id
      ).then(res => {
        console.log(res)
        if(res.status == 200) {
          this.success = true
          this.currentRoom = res.data.data
        }
      }, err => {
        console.log(err)
      })
    }

    @action
    async joinRoom(code) {
        this.success = false;

        await RoomService.joinRoom(
            this.root.userStore.token,
            code
        ).then(res => {
            console.log(res)
            if(res.status == 200) {
              this.success = true
              this.currentRoom = res.data.data
            }
        }, err => {
            console.log(err.response)
        }) 
    }

    @action
    async leaveRoom() {
        this.success = false;

        await RoomService.leaveRoom(
            this.root.userStore.token,
            this.currentRoom.code
        ).then(res => {
            console.log(res)
            
            if(res.status == 200) {
              this.success = true
            }
        }, err => {
            console.log(err.response)
        }) 
    }
}