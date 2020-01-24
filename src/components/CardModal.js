import React, { Component } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import Modal from 'react-native-modal'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { widthPercentageToDP } from 'react-native-responsive-screen'
import Icon from 'react-native-vector-icons/FontAwesome';
import ModalDropdown from 'react-native-modal-dropdown';
import { inject, observer } from 'mobx-react'

@inject('collection')
@observer
export default class CardModal extends Component {
    constructor(props) {
        super(props)

        this.state = {
            modalVisible: false,
            collectionMenuHidden: true
        }
    }

    showModal = () => {
        this.setState({modalVisible: true});
    };

    hideModal = () => {
        this.setState({modalVisible: false});
    };

    renderCollections() {
        return this.props.collection.collectionList.map((col, i) => {
            let inCollection = false

            if(this.props.card.collections.find((c) => c.name == col.collection.name)) {
                inCollection = true
            }

            console.log(inCollection)

            return (
                <View key={i} style={styles.collectionItem}>
                    <Text style={{flex: 1}} key={i}>{col.collection.name}</Text>

                    <View style={{height: 8, width: 8, borderRadius: 4, backgroundColor: inCollection ? '#000' : '#FFF', borderWidth: 1, borderColor: '#000'}}/>
                </View>
            )
        })
    }

    render() {
        if(this.props.card) {
            const card = this.props.card.data

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
                                onPress={() => this.setState({collectionMenuHidden: !this.state.collectionMenuHidden})}
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