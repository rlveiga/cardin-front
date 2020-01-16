import React, { Component } from 'react'
import { View, StyleSheet, Text, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native'
import { inject, observer } from 'mobx-react'
import CardPreview from '../../components/CardPreview'
import { NavigationEvents } from 'react-navigation'

@inject('card')
@observer
export default class Collections extends Component {
    constructor(props) {
        super(props)

        this.state = {
            loaded: false
        }
    }

    // async loadCards() {
    //     this.setState({loaded: false})

    //     await this.props.card.getCards()

    //     this.setState({loaded: true})
    // }

    // renderCards() {
    //     if(this.state.loaded) {
    //         return this.props.card.cardList.map((card, i) => {
    //             console.log(card)
    //             return (
    //                 <TouchableOpacity>
    //                     <CardPreview card={card}/>
    //                 </TouchableOpacity>
    //             )
    //         })
    //     }
    //     else {
    //         return (
    //             <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
    //                 <ActivityIndicator size='large' color='#FFF'/>
    //             </View>
    //         )
    //     }
    // }

    render() {
        return (
            <View style={styles.container}>
                {/* <NavigationEvents
                onWillFocus={payload => {
                    this.loadCards()
                }}/> */}

                <ScrollView contentContainerStyle={styles.cardsContaier}>
                    {/* {this.renderCards()} */}
                </ScrollView>

                <TouchableOpacity
                onPress={() => this.props.navigation.navigate('CreateCard')}>
                    <Text style={{color: '#FFF', marginBottom: 32, textAlign: 'center'}}>+ Create new collection</Text>
                </TouchableOpacity>
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
        flex: 1,
        flexDirection: 'row',
        paddingTop: 12,
        flexWrap: 'wrap',
    }
})