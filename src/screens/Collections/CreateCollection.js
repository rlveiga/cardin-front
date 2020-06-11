import { inject, observer } from 'mobx-react'
import React, { Component } from 'react'
import { Alert, Platform, StyleSheet, Switch, View } from 'react-native'
import { TextInput } from 'react-native-gesture-handler'
import { widthPercentageToDP } from 'react-native-responsive-screen'
import AsyncLoader from '../../components/AsyncLoader'
import CardCreator from '../../components/CardCreator'

@inject('collection')
@inject('card')
@observer
export default class CreateCollection extends Component {
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
    this.props.navigation.setParams({ createCollection: this.createCollection })
  }

  createCollection = async () => {
    if (this.state.collectionName == '') {
      Alert.alert(
        'Insira um nome para a coleção'
      )

      return
    }

    this.setState({ loading: true })

    await this.props.collection.createCollection(
      this.state.collectionName
    )

    if (this.props.collection.success) {
      for (const card of this.cardCreator.getCardCreators()) {
        if (card.text != '') {
          await this.props.card.createCard(
            card.text,
            card.switch ? 'white' : 'black',
            this.props.collection.createdCollection.data.id
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

    else {
      Alert.alert(
        'Erro ao criar a coleção',
        null,
        [
          { text: 'Ok', onPress: () => this.setState({ loading: false }) }
        ]
      )
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <TextInput
          returnKeyType='done'
          autoCorrect={false}
          value={this.state.collectionName}
          onChangeText={val => this.setState({ collectionName: val })}
          placeholderTextColor='#A2A2A2'
          placeholder='nome da coleção'
          style={styles.textInput} />

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
  }
})
