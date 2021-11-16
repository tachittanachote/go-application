import axios from 'axios';
import React, { Component } from 'react';
import { View, TouchableWithoutFeedback, Text, Alert } from 'react-native';
import { Icon } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { SIZES, COLORS, FONTS } from '../constants';

class DriverInformation extends Component {

    constructor(props) {
        super(props);
        this.state = {
            driver: this.props.driver.carInfo,
            availableSeat: null,
        }
    }

    componentDidMount() {
        if (this.props.availableSeat) {
            this.getAvaliableSeat(this.props.driver.carId)
        }
    }

    fetchDriverInformation() {
        return this.props.driver;
    }

    getAvaliableSeat = async (carId) => {
        axios.post("/cars/availableSeat/" + carId, {}, {
            headers: {
                authorization: 'Bearer ' + await AsyncStorage.getItem('session_token')
            }
        }).then((e) => {
            if(e.data !== -1) {
                this.setState({ availableSeat: e.data })
            }
        }).catch((e) => {
            console.log(e)
        })
    }

    render() {
        return (
            <>
                <TouchableWithoutFeedback
                    onPress={() => {
                        this.props.onCallBack(this.fetchDriverInformation())
                    }}
                >
                    <View style={{
                        flexDirection: 'row',
                        backgroundColor: COLORS.secondary,
                        paddingLeft: SIZES.padding,
                        borderRadius: SIZES.radius,
                        marginBottom: SIZES.margin - 5,
                    }}>
                        <View style={{
                            flexDirection: 'row',
                        }}>
                            <View style={{
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginLeft: 5,
                            }}>
                                <Icon
                                    name='torso-business'
                                    type='foundation'
                                    color={COLORS.darkpurple}
                                    size={52}
                                />
                            </View>
                            <View style={{
                                alignSelf: 'center',
                                padding: SIZES.padding,
                                paddingLeft: SIZES.padding * 1.5
                            }}>
                                <Text style={{
                                    ...FONTS.body3
                                }}>หมายเลข {this.state.driver.registration}</Text>
                                <Text style={{
                                    ...FONTS.body3
                                }}>{this.state.driver.model} ({this.state.driver.color})</Text>
                            </View>
                        </View>

                        {this.props.availableSeat === true &&
                            <View style={{
                                flex: 1,
                                flexDirection: 'row',
                                justifyContent: 'flex-end',
                                alignItems: 'center',
                                marginRight: SIZES.margin
                            }}>
                                <Text style={{
                                    ...FONTS.h5
                                }}>จำนวนที่นั่งว่าง {this.state.availableSeat}</Text>
                            </View>
                        }

                        {/* {this.props.distance === true &&
                            <View style={{
                                flex: 1,
                                flexDirection: 'row',
                                justifyContent: 'flex-end',
                                alignItems: 'center',
                                marginRight: SIZES.margin
                            }}>
                                <Text style={{
                                    ...FONTS.h5
                                }}>30 km</Text>
                            </View>
                        } */}

                        {this.props.call === true &&

                            <View style={{
                                flex: 1,
                                flexDirection: 'row',
                                justifyContent: 'flex-end',
                                alignItems: 'center',
                                marginRight: SIZES.margin - 10
                            }}>
                                <Icon
                                    reverse
                                    name='call-outline'
                                    type='ionicon'
                                    reverseColor={COLORS.purple}
                                    color={COLORS.white}
                                    size={24}
                                    onPress={() => Alert.alert("Call")}
                                />
                            </View>

                        }


                    </View>
                </TouchableWithoutFeedback>
            </>
        )
    }
}

export default DriverInformation;