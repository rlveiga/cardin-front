import React, { Component } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import {widthPercentageToDP} from 'react-native-responsive-screen';

export default class CardPreview extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        const textColor = (this.props.card.card_type == 'black' ? 'white' : 'black')
        const borderColor = (this.props.card.card_type == 'black' ? 'white' : null)
        const backgroundColor = this.props.card.card_type
        
        return (
            <View style={[styles.cardContainer, {borderColor: borderColor, borderWidth: this.props.card.card_type == 'black' ? 2 : null, backgroundColor: backgroundColor}]}>
                <Text style={{color: textColor}}>
                    {this.props.card.name}
                </Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    cardContainer: {
        margin: 6,
        paddingTop: 12,
        paddingLeft: 8,
        paddingRight: 4,
        borderRadius: 6,
        width: widthPercentageToDP("30%"),
        height: 180
    }
})
