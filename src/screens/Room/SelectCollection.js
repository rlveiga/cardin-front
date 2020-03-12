import React, { Component } from 'react'
import { View, StyleSheet, Text, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native'
import { inject, observer } from 'mobx-react'
import CollectionPreview from '../../components/CollectionPreview'
import { NavigationEvents } from 'react-navigation'
import { heightPercentageToDP } from 'react-native-responsive-screen'

@inject('collection')
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
        this.setState({loaded: false})

        await this.props.collection.getCollections()

        if(this.props.collection.success) {
            this.setState({loaded: true})
        }
    }

    renderCollections() {
      console.log('render collections')
      if(this.state.loaded) {
        return this.props.collection.collectionList.map((collection, i) => {
          return (
              <TouchableOpacity 
              onPress={async () => {
                  this.props.collection.selectedCollection = collection
                  this.props.navigation.navigate('CreateRoom')
              }}
              style={{marginTop: 8}} key={i}>
                  <CollectionPreview collection={collection}/>
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
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.collectionContaier}>
                <View style={{flex: 1, marginLeft: 25, marginRight: 25, justifyContent: 'space-between', flexDirection: 'row', flexWrap: 'wrap'}}>
                    {this.renderCollections()}
                </View>
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
        alignItems: 'center',
        paddingBottom: heightPercentageToDP("6%")
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