import { inject, observer } from 'mobx-react'
import React, { Component } from 'react'
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View, TouchableWithoutFeedback, Alert } from 'react-native'
import { NavigationEvents } from 'react-navigation'
import CardPreview from '../../components/CardPreview'
import CardModal from '../../components/CardModal'
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen'
import Modal from 'react-native-modal';
import AsyncLoader from '../../components/AsyncLoader'
import Icon from 'react-native-vector-icons/FontAwesome';

@inject('user')
@inject('card')
@inject('collection')
@observer
export default class ShowCollection extends Component {
  constructor(props) {
    super(props)

    this.state = {
      loaded: false,
      loading: false,
      editModeOn: false,
      selectedCard: null,
      editCardList: [],
      manageCollectionsModalVisible: false
    }

    this.cardModal = null
    this.manageCollectionsModal = null
    this.loadCards = this.loadCards.bind(this)
    this.delete = this.delete.bind(this)
  }

  componentDidMount() {
    this.props.navigation.setParams({ toggleEdit: this.toggleEdit, editModeOn: false })
  }

  toggleEdit = () => {
    const editModeOn = this.props.navigation.getParam('editModeOn')

    this.props.navigation.setParams({ editModeOn: !editModeOn })
    console.log(this.props.navigation.getParam('editModeOn'))
  }

  async loadCards() {
    await this.props.collection.getCardsFromCollection(
      this.props.collection.selectedCollection.id
    )

    if (this.props.collection.success) {
      this.setState({ loaded: true })
    }
  }

  async delete(id) {
    this.setState({ loaded: false })

    await this.props.card.deleteCard(id)

    if (this.props.card.success) {
      this.cardModal.hideModal()

      this.loadCards()
      await this.props.collection.getCollections()
    }

    this.setState({ loaded: true })
  }

  async addCardsToCollection(id) {
    this.setState({ loading: true })

    for (const card of this.state.editCardList) {
      await this.props.collection.addCard(
        id,
        card.id
      )
    }

    this.props.collection.shouldReloadCollections = true
    this.setState({ loading: false, manageCollectionsModalVisible: false })
  }

  async removeCardsFromCollectionConfirm() {
    this.setState({ loading: true })

    for (const card of this.state.editCardList) {
      await this.props.collection.removeCard(
        this.props.collection.selectedCollection.id,
        card.id
      )
    }

    this.props.collection.shouldReloadCollections = true
    this.setState({ loading: false, manageCollectionsModalVisible: false })

    this.loadCards()
  }

  removeCardsFromCollection() {
    Alert.alert(
      'Tem certeza que deseja remover as cartas selecionadas da coleção?',
      'Se você for o criador da carta removida, ela continuará disponível em "Minhas cartas"',
      [
        { text: 'Remover', style: 'destructive', onPress: () => this.removeCardsFromCollectionConfirm() },
        { text: 'Cancelar', style: 'cancel' }
      ]
    )
  }

  async deleteCardsConfirm() {
    this.setState({ loading: true })

    for (const card of this.state.editCardList) {
      await this.props.card.deleteCard(
        card.id
      )
    }

    this.props.collection.shouldReloadCollections = true
    this.setState({ loading: false, manageCollectionsModalVisible: false })

    this.loadCards()
  }

  deleteCards() {
    Alert.alert(
      'Tem certeza que deseja deletar as cartas selecionadas?',
      'Esta ação não pode ser desfeita',
      [
        { text: 'Deletar', style: 'destructive', onPress: () => this.deleteCardsConfirm() },
        { text: 'Cancelar', style: 'cancel' }
      ]
    )
  }

  renderCards() {
    if (this.state.loaded) {
      if (this.props.collection.selectedCollection.cards.length == 0) {
        return (
          <View style={{ flex: 1, justifyContent: 'center', paddingLeft: 25, paddingRight: 25 }}>
            <Text style={{ textAlign: 'center', color: '#FFF' }}>
              Não existem cartas nesta coleção.
              </Text>
            <TouchableOpacity
              style={styles.createButton}
              onPress={() => this.props.navigation.navigate('CreateCards')}>
              <Text style={{ color: '#FFF', textAlign: 'center' }}>+ Criar novas cartas</Text>
            </TouchableOpacity>
          </View>
        )
      }

      else {
        return (
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{ alignSelf: 'center' }}
            contentContainerStyle={styles.cardsContaier}>
            {
              this.props.collection.selectedCollection.cards.map((card, i) => {
                return (
                  <CardPreview
                    key={i}
                    onPress={() => {
                      this.props.card.selectedCard = card
                      this.cardModal.showModal(card)
                    }}
                    addCardToSelectedList={() => {
                      const newList = this.state.editCardList.concat([card])
                      console.log(newList)
                      this.setState({ editCardList: newList })
                    }}
                    removeCardFromSelectedList={() => {
                      const newList = this.state.editCardList.filter((e) => {
                        return e.id != card.id
                      })

                      this.setState({ editCardList: newList })
                    }}
                    card={card}
                    editModeOn={this.props.navigation.getParam('editModeOn')} />
                )
              })
            }
          </ScrollView>
        )
      }
    }

    else {
      return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size='large' color='#FFF' />
        </View>
      )
    }
  }

  renderCollectionList() {
    const collectionList = this.props.collection.collectionList.filter((collection, i) => {
      if (
        collection.id != this.props.collection.selectedCollection.id &&
        collection.editable == true
      ) {
        return collection
      }
    })

    if (collectionList.length == 0) {
      return <Text style={{ textAlign: 'center' }}>Não há coleções disponíveis</Text>
    }

    else {
      return collectionList.map((collection, i) => {
        return (
          <TouchableOpacity
            onPress={() => this.addCardsToCollection(collection.id)}
            style={styles.collectionItemContainer}>
            <Text style={{ fontSize: widthPercentageToDP(4), color: '#FFF' }}>{collection.name}</Text>
          </TouchableOpacity>
        )
      })
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <NavigationEvents
          onWillFocus={payload => {
            const shouldReload = this.props.collection.shouldReloadCollection

            console.log(shouldReload)

            if (shouldReload) {
              this.loadCards()
              this.props.collection.shouldReloadCollection = false
            }
          }}
          onWillBlur={payload => {
            this.forceUpdate()
          }} />

        {this.renderCards()}

        {
          this.props.collection.selectedCollection.created_by == this.props.user.id && this.state.loaded ?
            <TouchableOpacity
              style={styles.createButton}
              onPress={() => this.props.navigation.navigate('CreateCards')}>
              <Icon name='plus' color='#FFF' size={24} />
            </TouchableOpacity> :
            null
        }

        {
          this.props.navigation.getParam('editModeOn') ?
            <View
              style={styles.editOptions}>
              {/* <Text>{this.state.editCardList.length} cards selected</Text> */}
              <TouchableOpacity
                onPress={() => this.setState({ manageCollectionsModalVisible: true })}
                style={[styles.editOptionsButton, { backgroundColor: '#1C7FF5' }]}>
                <Text style={{ color: '#FFF' }}>Copiar para...</Text>
              </TouchableOpacity>

              {
                this.props.collection.selectedCollection.editable ?
                  <TouchableOpacity
                    onPress={() => this.removeCardsFromCollection()}
                    style={[styles.editOptionsButton, { backgroundColor: '#1C7FF5' }]}>
                    <Text style={{ color: '#FFF' }}>Remover</Text>
                  </TouchableOpacity> :
                  null
              }

              {
                (
                  (this.props.collection.selectedCollection.created_by == this.props.user.id) &&
                  this.props.collection.selectedCollection.editable == false
                ) ?
                  <TouchableOpacity
                    onPress={() => this.deleteCards()}
                    style={[styles.editOptionsButton, { backgroundColor: 'red' }]}>
                    <Text style={{ color: '#FFF' }}>Deletar</Text>
                  </TouchableOpacity> :
                  null
              }
            </View> :
            null
        }

        <CardModal
          ref={e => this.cardModal = e}
          navigation={this.props.navigation}
          onDelete={this.delete}
          loadCards={this.loadCards} />

        <Modal
          ref={ref => this.manageCollectionsModal = ref}
          propagateSwipe
          swipeDirection='down'
          onSwipeMove={pct => {
            if (pct < 0.55) {
              this.setState({ manageCollectionsModalVisible: false })
            }
          }}
          isVisible={this.state.manageCollectionsModalVisible}
          style={{
            margin: 0,
            paddingLeft: 25,
            paddingRight: 25,
          }}>
          <TouchableWithoutFeedback>
            <ScrollView
              style={styles.manageCollectionsModal}>
              <Text style={{ textAlign: 'center', fontSize: widthPercentageToDP(6) }}>
                Enviar {this.state.editCardList.length} cartas para:
              </Text>

              <View
                style={{ marginTop: 25 }}>
                {this.renderCollectionList()}
              </View>
            </ScrollView>
          </TouchableWithoutFeedback>
        </Modal>

        <AsyncLoader
          active={this.state.loading} />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000'
  },

  cardsContaier: {
    flexGrow: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    paddingBottom: heightPercentageToDP(6),
    width: widthPercentageToDP(100),
    paddingLeft: widthPercentageToDP(2)
  },

  createButton: {
    position: 'absolute',
    bottom: widthPercentageToDP(7),
    right: widthPercentageToDP(7),
    alignSelf: 'center',
    backgroundColor: '#000',
    opacity: 0.85,
    width: widthPercentageToDP(15),
    height: widthPercentageToDP(15),
    borderRadius: widthPercentageToDP(7.5),
    borderWidth: 5,
    borderColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center'
  },

  editOptions: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    height: heightPercentageToDP(10),
    width: widthPercentageToDP(100),
    backgroundColor: '#FFF',
  },

  editOptionsButton: {
    opacity: 1,
    paddingHorizontal: widthPercentageToDP(5),
    paddingVertical: heightPercentageToDP(1),
    borderRadius: 8,
    marginHorizontal: widthPercentageToDP(4)
  },

  manageCollectionsModal: {
    flexGrow: 0.5,
    backgroundColor: '#FFF',
    borderRadius: 12,
    paddingHorizontal: 25,
    paddingVertical: 12
  },

  collectionItemContainer: {
    marginVertical: 8,
    backgroundColor: '#000',
    borderRadius: 6,
    alignSelf: 'center',
    paddingHorizontal: widthPercentageToDP(2),
    paddingVertical: heightPercentageToDP(1)
  }
})