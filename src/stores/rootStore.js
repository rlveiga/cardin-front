import UserStore from "./userStore";
import RoomStore from "./roomStore";

export default class RootStore {
    constructor() {
        this.userStore = new UserStore(this),
        this.roomStore = new RoomStore(this)
    }
}