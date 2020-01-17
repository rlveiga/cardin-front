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
                    <TouchableOpacity style={{marginTop: 8}} key={i}>
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
                <NavigationEvents
                onWillFocus={payload => {
                    const shouldReload = this.props.navigation.getParam('shouldReload')

                    if(shouldReload) {
                        this.loadCollections()
                        this.props.navigation.setParams({shouldReload: false})
                    }
                }}/>

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.collectionContaier}>
                    <View style={{marginLeft: 25, marginRight: 25, justifyContent: 'space-between', flexDirection: 'row', flexWrap: 'wrap'}}>
                        {this.renderCollections()}
                    </View>
                </ScrollView>

                <TouchableOpacity
                style={styles.createButton}
                onPress={() => this.props.navigation.navigate('CreateCollection')}>
                    <Text style={{color: '#000', textAlign: 'center'}}>+ Create new collection</Text>
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
        alignItems: 'center',
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