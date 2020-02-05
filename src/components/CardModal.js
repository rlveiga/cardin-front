import { inject, observer } from 'mobx-react';
import React, { Component } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Modal from 'react-native-modal';
import { widthPercentageToDP } from 'react-native-responsive-screen';

@inject('card')
@inject('collection')
@observer
export default class CardModal extends Component {
    constructor(props) {
        super(props)

        this.state = {
            modalVisible: false,
            collectionMenuHidden: true,
            initialList: [],
            editedList: [],
        }

        this.getCollections = this.getCollections.bind(this)
    }

    showModal = (card) => {
      console.log(card)
        this.setState({
            modalVisible: true
        });
    };

    hideModal = () => {
        this.setState({
            initialList: [],
            editedList: [],
            modalVisible: false
        });

        console.log('Cleared lists')
    };

    async getCollections() {
      await this.props.card.getCardById(this.props.card.selectedCard.id)

      if(this.props.card.success) {
        this.setState({
          collectionMenuHidden: false, 
          initialList: this.props.card.card.collections, 
          editedList: this.props.card.card.collections
        })

        console.log('Updated lists with ', this.props.card.card.collections)
      }
    }

    renderCollections() {
        console.log(this.state.editedList)

        return this.props.collection.collectionList.map((col, i) => {
            let inCollection = false

            console.log('Edited list: ', this.state.editedList)
            if(this.state.editedList.find((c) => c.name == col.name)) {
                inCollection = true
            }

            console.log(inCollection)

            return (
                <TouchableOpacity
                onPress={() => {
                    // Remove element from editedList
                    if(inCollection) {
                        const newList = this.state.editedList.filter((e) => {
                            return e.name != col.name
                        })

                        this.setState({editedList: newList})
                    }

                    // Add element to editedList
                    else {
                        const newList = this.state.editedList.concat([col])

                        this.setState({editedList: newList})
                    }
                }}
                key={i}
                style={styles.collectionItem}>
                    <Text style={{flex: 1}} key={i}>{col.name}</Text>

                    <View style={{height: 8, width: 8, borderRadius: 4, backgroundColor: inCollection ? '#000' : '#FFF', borderWidth: 1, borderColor: '#000'}}/>
                </TouchableOpacity>
            )
        })
    }

    render() {
        if(this.props.card.selectedCard) {
            const card = this.props.card.selectedCard

            const backgroundColor = card.card_type == 'black' ? '#000' : '#FFF'
            const textColor = card.card_type == 'black' ? '#FFF' : '#000'

            return (
                <Modal
                propagateSwipe
                swipeDirection='down'
                onSwipeMove={pct => {
                    if (pct < 0.55) {
                        this.hideModal();
                    }
                }}
                isVisible={this.state.modalVisible}
                style={{
                    margin: 0,
                    paddingLeft: 25,
                    paddingRight: 25,
                }}>
                    <View style={[styles.container, {backgroundColor}]}>
                        <Text
                        style={[styles.cardText, {color: textColor}]}>{card.name}</Text>
                    </View>

                    <TouchableOpacity
                    onPress={() => this.props.onDelete(card.id)}
                    style={styles.deleteButton}>
                        <Text style={{color: '#FFF'}}>
                            Delete card
                        </Text>
                    </TouchableOpacity>

                    <View style={{position: 'absolute', top: 100}}>
                        <View style={{alignItems: 'center', width: widthPercentageToDP("100%")}}>
                            <View style={styles.collectionMenu}>
                                <TouchableOpacity
                                onPress={() => {
                                  if(this.state.collectionMenuHidden) {
                                    this.getCollections()
                                  }

                                  else {
                                    this.setState({collectionMenuHidden: true})
                                  }
                                }}
                                style={{paddingBottom: 6, paddingTop: 6}}>
                                    <Text style={{textAlign: 'center'}}>Gerenciar coleções</Text>
                                </TouchableOpacity>

                                {
                                    this.state.collectionMenuHidden ?
                                    null :
                                    <View>
                                        {this.renderCollections()}
                                    </View>
                                }
                            </View>
                        </View>
                    </View>
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