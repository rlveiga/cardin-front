import { inject, observer } from 'mobx-react';
import React, { Component } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Modal from 'react-native-modal';
import { widthPercentageToDP } from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/FontAwesome';

@inject('user')
@inject('card')
@inject('collection')
@observer
export default class CardModal extends Component {
  constructor(props) {
    super(props)

    this.state = {
      modalVisible: false,
      collectionsLoaded: false,
      collectionMenuHidden: true,
      initialList: [],
      editedList: [],
    }
  }

  showModal = (card) => {
    this.setState({
      modalVisible: true
    });

    this.getCollections()
  };

  hideModal = async () => {
    if (this.state.initialList != this.state.editedList) {
      this.props.loadCards()
      this.props.collection.shouldReloadCollection = true
      this.props.collection.shouldReloadCollections = true
    }

    this.setState({
      initialList: [],
      editedList: [],
      modalVisible: false
    });
  };

  async getCollections() {
    await this.props.card.getCardById(this.props.card.selectedCard.id)

    if (this.props.card.success) {
      this.setState({
        collectionsLoaded: true,
        initialList: this.props.card.card.collections,
        editedList: this.props.card.card.collections
      })

      console.log('Updated lists with ', this.props.card.card.collections)
    }
  }

  async onCollectionPress(collection, inCollection) {
    // Remove element from editedList
    if (inCollection) {
      await this.props.collection.removeCard(
        collection.id,
        this.props.card.selectedCard.id,
      )

      if (this.props.collection.success) {
        const newList = this.state.editedList.filter((e) => {
          return e.id != collection.id
        })

        this.setState({ editedList: newList })
      }

      else {
        console.log('Error removing')
      }
    }

    // Add element to editedList
    else {
      await this.props.collection.addCard(
        collection.id,
        this.props.card.selectedCard.id
      )

      if (this.props.collection.success) {
        const newList = this.state.editedList.concat([collection])

        this.setState({ editedList: newList })
      }

      else {
        console.log('Error adding')
      }
    }
  }

  renderCollections() {
    console.log(this.state.editedList)

    return this.props.collection.collectionList.map((col, i) => {
      if (col.editable) {
        let inCollection = false

        if (this.state.editedList.find((c) => c.name == col.name)) {
          inCollection = true
        }

        return (
          <TouchableOpacity
            onPress={() => this.onCollectionPress(col, inCollection)}
            key={i}
            style={styles.collectionItem}>
            <Text style={{ flex: 1 }} key={i}>{col.name}</Text>

            <View style={{ height: 8, width: 8, borderRadius: 4, backgroundColor: inCollection ? '#000' : '#FFF', borderWidth: 1, borderColor: '#000' }} />
          </TouchableOpacity>
        )
      }
    })
  }

  render() {
    if (this.props.card.selectedCard) {
      const card = this.props.card.selectedCard

      const backgroundColor = card.card_type == 'black' ? '#000' : '#FFF'
      const textColor = card.card_type == 'black' ? '#FFF' : '#000'

      return (
        <Modal
          propagateSwipe
          swipeDirection='down'
          onSwipeMove={pct => {
            if (pct < 0.55) {
              this.hideModal()
            }
          }}
          isVisible={this.state.modalVisible}
          style={{
            margin: 0,
            paddingLeft: 25,
            paddingRight: 25,
          }}>

          <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
            <TouchableOpacity
              onPress={() => this.hideModal()}
              style={styles.closeButton}>
              <Icon name='times' color='#000' size={24} />
            </TouchableOpacity>
          </View>

          <View style={[styles.container, { backgroundColor }]}>
            <Text
              style={[styles.cardText, { color: textColor }]}>{card.name}</Text>
          </View>

          {
            (this.props.collection.selectedCollection.editable || this.props.collection.selectedCollection.created_by == this.props.user.id) ?
              <TouchableOpacity
                onPress={() => this.props.onDelete(card.id)}
                style={styles.deleteButton}>
                <Text style={{ color: '#FFF' }}>
                  Deletar carta
                </Text>
              </TouchableOpacity> :
              null
          }

          {/* <View style={{ position: 'absolute', top: 100 }}>
            <View style={{ alignItems: 'center', width: widthPercentageToDP("100%") }}>
              <View style={styles.collectionMenu}>
                {
                  this.props.collection.selectedCollection.editable || this.props.collection.selectedCollection.created_by == this.props.user.id ?
                    <TouchableOpacity
                      onPress={() => this.setState({ collectionMenuHidden: !this.state.collectionMenuHidden })}
                      style={{ paddingBottom: 6, paddingTop: 6 }}>
                      <Text style={{ textAlign: 'center' }}>Gerenciar coleções</Text>
                    </TouchableOpacity> :
                    null
                }

                {
                  this.state.collectionMenuHidden ?
                    null :
                    <View>
                      {this.renderCollections()}
                    </View>
                }
              </View>
            </View>
          </View> */}
        </Modal>
      )
    }

    else return null
  }
}

const styles = StyleSheet.create({
  collectionMenu: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    width: widthPercentageToDP("45%"),
    borderRadius: 6
  },

  menuText: {
    textAlign: 'center',
    color: '#000'
  },

  dropdown: {
    width: widthPercentageToDP("45%"),
    alignItems: 'center'
  },

  closeButton: {
    bottom: 15,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    width: widthPercentageToDP(10),
    height: widthPercentageToDP(10),
    borderRadius: widthPercentageToDP(5),
    backgroundColor: '#FFF'
  },

  container: {
    flex: 0.65,
    borderWidth: 2,
    borderColor: '#FFF',
    borderRadius: 18,
    paddingTop: 24,
    paddingBottom: 24,
    paddingLeft: 18,
    paddingRight: 12
  },

  collectionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 4,
    paddingBottom: 4,
    paddingLeft: 6,
    paddingRight: 6
  },

  deleteButton: {
    backgroundColor: 'red',
    opacity: 0.6,
    marginTop: 12,
    alignSelf: 'center',
    paddingLeft: 18,
    paddingRight: 18,
    paddingTop: 6,
    paddingBottom: 6,
    borderRadius: 4
  },

  cardText: {
    flexWrap: 'wrap',
    fontSize: 32,
    fontWeight: 'bold'
  }
})