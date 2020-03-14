import { inject, observer } from 'mobx-react'
import React, { Component } from 'react'
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { NavigationEvents } from 'react-navigation'
import CardPreview from '../../components/CardPreview'
import CardModal from '../../components/CardModal'

@inject('card')
@inject('collection')
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
        this.loadCards = this.loadCards.bind(this)
        this.delete = this.delete.bind(this)
    }

    async loadCards() {
      await this.props.collection.getCardsFromCollection(
        this.props.collection.selectedCollection.id
      )

      if(this.props.collection.success) {
          this.setState({loaded: true})
      }
  }

    async delete(id) {
        this.setState({loaded: false})

        await this.props.card.deleteCard(id)

        if(this.props.card.success) {
            this.modal.hideModal()

            this.loadCards()
            await this.props.collection.getCollections()
        }

        this.setState({loaded: true})
    }

    renderCards() {   
      if(this.state.loaded) {
        if(this.props.collection.selectedCollection.cards.length == 0) {
          return (
            <View style={{flex: 1, justifyContent: 'center', paddingLeft: 25, paddingRight: 25}}>
              <Text style={{textAlign: 'center', color: '#FFF'}}>
                  Não existem cartas nesta coleção.{`\n`}Que tal criar uma agora mesmo?
              </Text>
              <TouchableOpacity
              style={styles.createButton}
              onPress={() => this.props.navigation.navigate('CreateCard')}>
                  <Text style={{color: '#000', textAlign: 'center'}}>+ Criar nova carta</Text>
              </TouchableOpacity>
            </View>
          )
        }  
        
        else {
          return (
            <ScrollView contentContainerStyle={styles.cardsContaier}>
              {
                this.props.collection.selectedCollection.cards.map((card, i) => {
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
            </ScrollView>
          )
        }
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
            <NavigationEvents
              onWillFocus={payload => {
                const shouldReload = this.props.collection.shouldReloadCollection

                console.log(shouldReload)

                if(shouldReload) {
                    this.loadCards()
                    this.props.collection.shouldReloadCollection = false
                }
            }}/>

              {this.renderCards()}

              <CardModal
              ref={e => this.modal = e}
              navigation={this.props.navigation}
              onDelete={this.delete}
              loadCards={this.loadCards}/>
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