import React, { Component } from 'react'
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native'
import { TextInput } from 'react-native-gesture-handler'
import { inject, observer } from 'mobx-react'

@inject('collection')
@observer
export default class CreateCollection extends Component {
    constructor(props) {
        super(props)

        this.state = {
            collectionName: ''
        }
    }

    async createCollection() {
        await this.props.collection.createCollection(
            this.state.collectionName
        )

        if(this.props.collection.success) {
            this.props.navigation.navigate('Collections', {shouldReload: true})
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <TextInput
                value={this.state.collectionName}
                onChangeText={val => this.setState({collectionName: val})}
                placeholderTextColor='#A2A2A2'
                placeholder='collection name'
                style={styles.textInput}/>

                <TouchableOpacity
                style={{marginTop: 32}}
                onPress={() => this.createCollection()}>
                    <Text style={{color: '#FFF', textAlign: 'center'}}>Create</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        justifyContent: 'center',
        paddingLeft: 25,
        paddingRight: 25
    },

    textInput: {
        fontSize: 24,
        fontWeight: 'bold',
        borderBottomWidth: 1,
        borderColor: '#A2A2A2',
        color: '#FFF',
        paddingBottom: 8,
        paddingLeft: 8,
        paddingRight: 4
    }
})
