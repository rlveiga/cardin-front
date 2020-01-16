import UserStore from "./userStore";
import RoomStore from "./roomStore";
import CollectionStore from "./collectionStore";
import CardStore from "./cardStore";

export default class RootStore {
    constructor() {
        this.userStore = new UserStore(this),
        this.roomStore = new RoomStore(this)
        this.cardStore = new CardStore(this),
        this.collectionStore = new CollectionStore(this)
    }
}