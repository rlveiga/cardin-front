import React, { Component } from 'react'
import { View, StyleSheet, Text, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native'
import { inject, observer } from 'mobx-react'
import CollectionPreview from '../../components/CollectionPreview'
import { NavigationEvents } from 'react-navigation'

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
        this.setState({loaded: false})

        await this.props.collection.getCollections()

        if(this.props.collection.success) {
            this.setState({loaded: true})
        }
    }

    renderCollections() {
        if(this.state.loaded) {
            return this.props.collection.collectionList.map((collection, i) => {
                return (
                    <TouchableOpacity key={i}>
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

                <ScrollView contentContainerStyle={styles.collectionContaier}>
                    {this.renderCollections()}
                </ScrollView>

                <TouchableOpacity
                style={styles.createButton}
                onPress={() => this.props.navigation.navigate('CreateCard')}>
                    <Text style={{color: '#000', textAlign: 'center'}}>+ Create new collection</Text>
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

    collectionContaier: {
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