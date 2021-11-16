import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { Icon } from 'react-native-elements';

import { COLORS, FONTS } from '../constants';

class SuggestionPlace extends Component {
    render() {
        return (
            <View style={{
                flex: 1,
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 5,
                marginLeft: 13,
            }}>
                <Icon
                    style={{
                        marginRight: 18,
                    }}
                    name='map-marker-alt'
                    type='font-awesome-5'
                    color='#ED2026'
                    size={28}
                />
                <View>
                    <Text style={{
                        ...FONTS.h3
                    }}>{this.props.placeLocation}</Text>
                    <Text style={{
                        color: COLORS.lightGray2,
                    }}>{this.props.placeAddress}</Text>
                </View>
                <View style={{
                    flex: 1,
                    alignItems: 'flex-end',
                    marginRight: '5%'
                }}>
                    <Icon
                        name='chevron-forward-outline'
                        type='ionicon'
                    />
                </View>
            </View>
        );
    }
}

export default SuggestionPlace;
