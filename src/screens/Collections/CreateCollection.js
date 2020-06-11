import React, { Component } from 'react'
import { View, StyleSheet, Text, TouchableOpacity, Switch, Alert, ScrollView, Platform } from 'react-native'
import { TextInput } from 'react-native-gesture-handler'
import { inject, observer } from 'mobx-react'
import { widthPercentageToDP, heightPercentageToDP } from 'react-native-responsive-screen'
import AsyncLoader from '../../components/AsyncLoader';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
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

  addCardCreator() {
    let cardCreators = this.state.cardCreators

    cardCreators.push({
      switch: true,
      text: '',
      slots: 0
    })

    this.setState({ cardCreators })
  }

  renderCardCreators() {
    return this.state.cardCreators.map((creator, i) => {
      return (
        <View
          key={i}
          style={styles.cardCreator}>
          <TextInput
            maxLength={256}
            ref={`card_input_${i}`}
            returnKeyType='next'
            onSubmitEditing={() => {
              if (this.refs[`card_input_${i + 1}`])
                this.refs[`card_input_${i + 1}`].focus()
            }}
            autoCorrect={false}
            value={creator.text}
            onChangeText={val => this.updateCardCreatorText(val, i)}
            placeholderTextColor='#A2A2A2'
            placeholder='nome da carta'
            style={[styles.cardCreatorInput, {
              backgroundColor: creator.switch ? '#FFF' : '#000',
              color: creator.switch ? '#000' : '#FFF',
              borderColor: '#FFF',
              borderWidth: 2
            }]} />


          <Switch
            value={creator.switch}
            onValueChange={() => this.updateCardCreatorSwitch(i)}
            thumbColor={
              creator.switch ?
                Platform.OS == 'ios' ?
                  "#000" :
                  '#E4E4E4' :
                "#FFF"
            }
            trackColor={{
              false: '#000',
              true: '#FFF',
            }} />
        </View>
      )
    })
  }

  updateCardCreatorText(val, i) {
    let cardCreators = this.state.cardCreators

    // Add new slot, check for length to allow backspace
    if (val[val.length - 1] == '_' && val.length > cardCreators[i].text.length) {
      console.log(cardCreators[i])

      if (cardCreators[i].switch)
        return

      if (cardCreators[i].slots == 2) {
        Alert.alert('Máximo de 2 espaços em branco por carta preta')
        return
      }

      val = `${val}___ `
      cardCreators[i].slots++
    }

    // Remove slot
    if (cardCreators[i].text[cardCreators[i].text.length - 1] == '_' && val.length < cardCreators[i].text.length) {
      cardCreators[i].text = cardCreators[i].text.substring(0, cardCreators[i].text.length - 4)
      cardCreators[i].slots--
    }

    else {
      cardCreators[i].text = val
    }

    this.setState({ cardCreators })
  }

  updateCardCreatorSwitch(i) {
    let cardCreators = this.state.cardCreators

    cardCreators[i].switch = !cardCreators[i].switch

    this.setState({ cardCreators })
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
  },

  cardCreatorContainer: {
    flexGrow: 1
  },

  cardCreator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12
  },

  cardCreatorInput: {
    flex: 1,
    borderRadius: 15,
    backgroundColor: 'red',
    padding: 12,
    marginRight: 25,
    fontSize: 16
  },

  addCardButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
    opacity: 0.9,
    alignSelf: 'center',
    marginBottom: 25
  }
})
