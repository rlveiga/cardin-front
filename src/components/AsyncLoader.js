import React, { Component } from 'react'
import { ActivityIndicator, View, StyleSheet } from 'react-native'
import Modal from 'react-native-modal'

export default class AsyncLoader extends Component {
    render() {
        if(this.props.active) {
            return (
                <Modal
                isVisible={true}
                style={styles.modalContainer}>
                    <View
                    style={styles.content}>
                        <ActivityIndicator size='large' color='#FFF'/>
                    </View>
                </Modal>
            )
        }
        else return null
    }
}

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        margin: 0
    },

    content: {
        flex: 1,
        backgroundColor: '#00000059',
        opacity: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})