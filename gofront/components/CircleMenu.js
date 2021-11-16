import React, { Component } from 'react';
import { View } from 'react-native';
import { Icon } from 'react-native-elements';

import { SIZES, COLORS } from '../constants'

class CircleMenu extends Component {
    render() {
        return (
            <View
                style={{
                    padding: SIZES.padding,
                }}>
                <View style={{
                    position: 'absolute',
                    right: 10,
                    top: 20,
                }}>
                    <Icon
                        style={{
                            shadowColor: "#000",
                            shadowOffset: {
                                width: 5,
                                height: 5,
                            },
                            shadowOpacity: 10,
                            shadowRadius: 10,

                            elevation: 4,
                        }}
                        reverse
                        type='ionicon'
                        name={this.props.iconName}
                        size={24}
                        color={COLORS.white}
                        iconStyle={{
                            color: COLORS.purple,
                            fontSize: 32,
                        }}
                        onPress={() => this.props.navigation.navigate(this.props.to)}
                    />
                </View>
            </View>

        );
    }
}

export default CircleMenu;
