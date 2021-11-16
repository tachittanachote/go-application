import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../constants';

class Preload extends Component {
    render() {
        return (
            <View style={styles.container}>
            <Text>Loading</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.secondary,
    }
})

export default Preload;
