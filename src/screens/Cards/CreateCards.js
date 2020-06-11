import { inject, observer } from 'mobx-react'
import React, { Component } from 'react'
import { Alert, StyleSheet, View } from 'react-native'
import { widthPercentageToDP } from 'react-native-responsive-screen'
import AsyncLoader from '../../components/AsyncLoader'
import CardCreator from '../../components/CardCreator'

@inject('collection')
@inject('card')
@observer
export default class CreateCards extends Component {
  constructor(props) {
    super(props)

    this.state = {
      collectionName: '',
      cardCreatorCount: 1,
      cardCreators: [
        {
          switch: true,
          text: '',
          slots: 0
        }
      ],
      loading: false
    }

    this.cardCreator = null
  }

  componentDidMount() {
    this.props.navigation.setParams({ createCards: this.createCards })
  }

  createCards = async () => {
    this.setState({ loading: true })

    for (const card of this.cardCreator.getCardCreators()) {
      if (card.text != '') {
        await this.props.card.createCard(
          card.text,
          card.switch ? 'white' : 'black',
          this.props.collection.selectedCollection.id
        )

        if (!this.props.card.success) {
          Alert.alert(
            'Erro ao criar uma ou mais cartas',
          )
          break
        }
      }
    }

    this.setState({ loading: false })

    this.props.collection.shouldReloadCollections = true
    this.props.navigation.navigate('Collections')
  }

  render() {
    return (
      <View style={styles.container}>
        <CardCreator
          ref={ref => this.cardCreator = ref} />

        <AsyncLoader
          active={this.state.loading} />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingHorizontal: 25,
    paddingTop: 25
  },

  textInput: {
    fontSize: widthPercentageToDP(6),
    fontWeight: 'bold',
    borderBottomWidth: 1,
    borderColor: '#A2A2A2',
    color: '#FFF',
    paddingBottom: 8,
    paddingLeft: 8,
    paddingRight: 4
  },
})
