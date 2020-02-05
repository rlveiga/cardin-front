import { inject, observer } from 'mobx-react'
import React, { Component } from 'react'
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { NavigationEvents } from 'react-navigation'
import CardPreview from '../../components/CardPreview'
import CardModal from '../../components/CardModal'

@inject('card')
@observer
export default class ShowCollection extends Component {
    static navigationOptions = ({navigation}) => {
        return {
            title: navigation.getParam('collection').name
        }
    }

    constructor(props) {
        super(props)

        this.state = {
            selectedCard: null
        }

        this.modal = null
        this.delete = this.delete.bind(this)
    }

    async delete(id) {
        this.setState({loaded: false})

        await this.props.card.deleteCard(id)

        if(this.props.card.success) {
            this.modal.hideModal()
        }
    }

    renderCards() {        
        return this.props.navigation.getParam('collection').cards.map((card, i) => {
            return (
                <TouchableOpacity 
                onPress={() => {
                    this.props.card.selectedCard = card
                    this.modal.showModal(card)
                }}
                key={i}>
                    <CardPreview card={card}/>
                </TouchableOpacity>
            )
        })
    }

    render() {
        return (
            <View style={styles.container}>
                {
                    this.props.navigation.getParam('collection').cards.length == 0 ?
                    <View style={{flex: 1, justifyContent: 'center', paddingLeft: 25, paddingRight: 25}}>
                        <Text style={{textAlign: 'center', color: '#FFF'}}>
                            There are no cards in this collection.{`\n`}How about adding one right now?
                        </Text>
                        <TouchableOpacity
                        style={styles.createButton}
                        onPress={() => this.props.navigation.navigate('CreateCard')}>
                            <Text style={{color: '#000', textAlign: 'center'}}>+ Create new card</Text>
                        </TouchableOpacity>
                    </View>
                    :
                    <ScrollView contentContainerStyle={styles.cardsContaier}>
                        {this.renderCards()}
                    </ScrollView>
                }

                <CardModal
                ref={e => this.modal = e}
                onDelete={this.delete}/>
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
        flexGrow: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        flexWrap: 'wrap',
    },

    createButton: {
        alignSelf: 'center',
        backgroundColor: '#A2A2A2',
        marginTop: 16,
        marginBottom: 32,
        borderRadius: 6,
        paddingLeft: 8,
        paddingRight: 8,
        paddingTop: 4,
        paddingBottom: 4
    }
})