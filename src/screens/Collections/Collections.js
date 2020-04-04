import React, { Component } from 'react'
import { View, StyleSheet, Text, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native'
import { inject, observer } from 'mobx-react'
import CollectionPreview from '../../components/CollectionPreview'
import { NavigationEvents } from 'react-navigation'
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen'

@inject('collection')
@observer
export default class Collections extends Component {
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
    console.log('render collections')
    if (this.state.loaded) {
      return this.props.collection.collectionList.map((collection, i) => {
        return (
          <TouchableOpacity
            onPress={() => {
              this.props.collection.selectedCollection = collection
              this.props.collection.shouldReloadCollection = true
              this.props.navigation.navigate('ShowCollection', { collection })
            }}
            style={{ marginTop: 8 }} key={i}>
            <CollectionPreview 
            fontSize={heightPercentageToDP(3)}
            height={widthPercentageToDP(60)}
            width={widthPercentageToDP(35)}
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
        <NavigationEvents
          onWillFocus={payload => {
            const shouldReload = this.props.collection.shouldReloadCollections

            console.log(shouldReload)

            if (shouldReload) {
              this.loadCollections()
              this.props.collection.shouldReloadCollections = false
            }
          }} />

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.collectionContaier}>
          {this.renderCollections()}
        </ScrollView>

        <TouchableOpacity
          style={styles.createButton}
          onPress={() => this.props.navigation.navigate('CreateCollection')}>
          <Text style={{ color: '#000', textAlign: 'center' }}>+ Criar nova coleção</Text>
        </TouchableOpacity>
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
    bottom: heightPercentageToDP(2),
    alignSelf: 'center',
    backgroundColor: '#A2A2A2',
    borderRadius: 6,
    paddingLeft: 8,
    paddingRight: 8,
    paddingTop: 4,
    paddingBottom: 4
  }
})