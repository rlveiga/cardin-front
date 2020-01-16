import { observable, action } from 'mobx';
import RoomService from '../services/roomService';

export default class RoomStore {
    constructor(root) {
        this.root = root
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