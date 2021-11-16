import React, { Component } from 'react';
import { View } from 'react-native';

class HorizontalLine extends Component {
    render() {
        return (
            <View style={{ 
                marginTop: 10,
                marginBottom: 10,
                width: '100%',
                borderWidth: 0.8,
                borderColor: "#EDEDED",
            }}>
            </View>
        )
    }
}

export default HorizontalLine;