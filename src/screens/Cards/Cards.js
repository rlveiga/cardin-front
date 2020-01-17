import { inject, observer } from 'mobx-react'
import React, { Component } from 'react'
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { NavigationEvents } from 'react-navigation'
import CardPreview from '../../components/CardPreview'

@inject('card')
@observer
export default class Cards extends Component {
    constructor(props) {
        super(props)

        this.state = {
            loaded: false
        }
    }

    componentDidMount() {
        this.loadCards()
    }

    async loadCards() {
        this.setState({loaded: false})

        await this.props.card.getCards()

        this.setState({loaded: true})
    }

    renderCards() {
        if(this.state.loaded) {
            return this.props.card.cardList.map((card, i) => {
                return (
                    <TouchableOpacity key={i}>
                        <CardPreview card={card}/>
                    </TouchableOpacity>
                )
            })
        }
        else {
            return (
                <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                    <ActivityIndicator size='large' color='#FFF'/>
                </View>
            )
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <ScrollView contentContainerStyle={styles.cardsContaier}>
                    {this.renderCards()}
                </ScrollView>

                <TouchableOpacity
                style={styles.createButton}
                onPress={() => this.props.navigation.navigate('CreateCard')}>
                    <Text style={{color: '#000', textAlign: 'center'}}>+ Create new card</Text>
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
    },

    createButton: {
        alignSelf: 'center',
        backgroundColor: '#A2A2A2',
        marginBottom: 32,
        borderRadius: 6,
        paddingLeft: 8,
        paddingRight: 8,
        paddingTop: 4,
        paddingBottom: 4
    }
})