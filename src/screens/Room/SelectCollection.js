import { inject, observer } from 'mobx-react'
import React, { Component } from 'react'
import { ActivityIndicator, Alert, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen'
import CollectionPreview from '../../components/CollectionPreview'

@inject('collection')
@inject('room')
@observer
export default class SellectCollections extends Component {
  constructor(props) {
    super(props)

    this.state = {
      loaded: false
    }
  }

  componentDidMount() {
    this.loadCollections()
  }

  async loadCollections() {
    this.setState({ loaded: false })

    await this.props.collection.getCollections()

    if (this.props.collection.success) {
      this.setState({ loaded: true })
    }
  }

  renderCollections() {
    if (this.state.loaded) {
      return this.props.collection.collectionList.map((collection, i) => {
        return (
          <TouchableOpacity
            onPress={async () => {
              if(collection.white_card_count <= 30 && collection.black_card_count <= 10) {
                Alert.alert('Coleções jogáveis devem conter pelo menos 10 cartas pretas e 30 cartas brancas!')
                return
              }

              this.props.room.selectedCollection = collection

              this.props.navigation.navigate('CreateRoom')
            }}
            style={{ marginTop: 8 }} key={i}>
            <CollectionPreview
            fontSize={heightPercentageToDP(3)}
            height={widthPercentageToDP(60)}
            width={widthPercentageToDP(35)}
            disabled={collection.white_card_count <= 30 && collection.black_card_count <= 10}
            collection={collection} />
          </TouchableOpacity>
        )
      })
    }

    else {
      return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size='large' color='#FFF' />
        </View>
      )
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.collectionContaier}>
          {this.renderCollections()}
        </ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },

  collectionContaier: {
    flexGrow: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: widthPercentageToDP(10),
    flexWrap: 'wrap',
    paddingBottom: heightPercentageToDP(6)
  },

  createButton: {
    position: 'absolute',
    bottom: heightPercentageToDP("2%"),
    alignSelf: 'center',
    backgroundColor: '#A2A2A2',
    borderRadius: 6,
    paddingLeft: 8,
    paddingRight: 8,
    paddingTop: 4,
    paddingBottom: 4
  }
})