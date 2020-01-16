import RootStore from './rootStore';

const root = new RootStore()

export default {
	user: root.userStore,
	room: root.roomStore,
	card: root.cardStore,
	collection: root.collectionStore
}