import React, { Component } from 'react';
import { Text, View, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { Icon } from 'react-native-elements';

import { COLORS, SIZES, FONTS } from '../constants';

class Balance extends Component {

    navigate() {
        this.props.navigation.navigate("WalletScreen");
    }

    render() {
        return (
            <TouchableWithoutFeedback onPress={() => this.navigate()}>
            <View style={{
                marginLeft: 5,
                marginRight: 5,
                marginTop: 55,
                marginBottom: 8,
                padding: SIZES.padding,
                flexDirection: 'row',
                alignItems: 'center',
                borderRadius: SIZES.radius,
                backgroundColor: COLORS.white,
                shadowColor: "#000",
                shadowOffset: {
                    width: 3,
                    height: 3,
                },
                shadowOpacity: 0.20,
                shadowRadius: 1.41,

                elevation: 5,
            }}>
                <View>
                    <Icon
                        type='ionicon'
                        name='wallet-outline'
                        size={42}
                        color={COLORS.purple}
                    />

                </View>
                <View style={{
                    marginLeft: 5,
                }}>
                        <Text>$ {this.props.balance}</Text>
                </View>
                <View style={{
                    alignItems: 'flex-end',
                    flex: 2,
                    marginRight: 20,
                }}>
                    <TouchableOpacity>
                        <View>
                            <Text style={{
                                fontWeight: 'bold',
                                color: COLORS.bluesky
                            }}>เติมเงิน</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
            </TouchableWithoutFeedback>
        );
    }
}

export default Balance;