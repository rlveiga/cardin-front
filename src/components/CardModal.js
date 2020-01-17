import React, { Component } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import Modal from 'react-native-modal'
import { TouchableOpacity } from 'react-native-gesture-handler'
export default class CardModal extends Component {
    constructor(props) {
        super(props)

        this.state = {
            modalVisible: false
        }
    }

    showModal = () => {
        this.setState({modalVisible: true});
    };

    hideModal = () => {
        this.setState({modalVisible: false});
    };

    render() {
        const card = this.props.card

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
                marginLeft: 25, 
                marginRight: 25, 
                marginBottom: 180,
                marginTop: 180
            }}>
                <View style={[styles.container, {backgroundColor}]}>
                    <Text
                    style={[styles.cardText, {color: textColor}]}>{this.props.card.name}</Text>
                </View>

                <TouchableOpacity
                onPress={() => this.props.onDelete(card.id)}
                style={styles.deleteButton}>
                    <Text style={{color: '#FFF'}}>
                        Delete card
                    </Text>
                </TouchableOpacity>
            </Modal>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        borderWidth: 2,
        borderColor: '#FFF',
        borderRadius: 18,
        paddingTop: 24,
        paddingBottom: 24,
        paddingLeft: 18,
        paddingRight: 12
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