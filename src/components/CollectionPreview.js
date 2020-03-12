import React, { Component } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import {widthPercentageToDP} from 'react-native-responsive-screen';

export default class CollectionPreview extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        
        return (
            <View style={[styles.collectionContainer, {opacity: this.props.disabled ? 0.3 : 1}]}>
                <Text numberOfLines={2} style={{fontSize: 28, fontWeight: 'bold', color: '#FFF'}}>
                    {this.props.collection.name}
                </Text>

                <View style={{flex: 1}}/>

                <Text style={{marginBottom: 8, color: '#FFF'}}>
                    {`${this.props.collection.card_count} ${this.props.collection.card_count == 1 ? 'carta' : 'cartas'}`}
                </Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    collectionContainer: {
        margin: 6,
        backgroundColor: '#000',
        borderWidth: 2,
        borderColor: '#FFF',
        opacity: 0.8,
        paddingTop: 12,
        paddingLeft: 8,
        paddingRight: 12,
        borderRadius: 6,
        width: widthPercentageToDP("35%"),
        height: 245
    }
})
