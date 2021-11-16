import React, { Component } from 'react';
import { SafeAreaView, Text, View, StyleSheet, ScrollView, Image} from 'react-native';
import { Icon } from 'react-native-elements';
import axios from 'axios';
import Geolocation from '@react-native-community/geolocation';

import { CircleMenu, Slider } from '../components';
import MenuButton from '../components/MenuButton';
import { COLORS, FONTS, SIZES } from '../constants';
import { UserContext } from '../context';
import AsyncStorage from '@react-native-async-storage/async-storage';

class Lobby extends Component {

    static contextType = UserContext

    constructor(props) {
        super(props);
        this.state = {
            place: null
        }
    }

    componentDidMount = () => {
        this.checkTravelState();
        this.getCurrentPlaceName();
    }

    checkTravelState = async () => {

        //check user is traveling
        axios.post('/user/state', {}, {
            headers: {
                authorization: 'Bearer ' + await AsyncStorage.getItem('session_token')
            }
        }).then((e) => {
            console.log(e.data, "Lobby")
            switch (e.data[0].state) {
                case "WAIT": {
                    this.props.navigation.navigate("WaitScreen", {
                        driver: e.data[0].driver,
                        driverTravelInfo: e.data[0].driver.coordinates,
                    })
                    break;
                }
                case "TRAVEL": {
                    this.props.navigation.navigate("TravelScreen", {
                        driver: e.data[0].driver,
                        driverTravelInfo: e.data[0].driver.coordinates,
                    })
                    break;
                }
                default: {

                }
            }
        }).catch((e) => {
            console.log("State",e)
        })
    }

    getCurrentPlaceName = () => {
        Geolocation.getCurrentPosition(
           async (position) => {
                var coordinates = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                }
                axios.post('/location/place', {
                    coordinates: coordinates
                }, {
                    headers: {
                        authorization: 'Bearer ' + await AsyncStorage.getItem('session_token')
                    }
                }).then((e) => {

                    var address = e.data.formatted_address.split(",")

                    var placeInfo = {
                        name: e.data.name.trim(),
                        address: address[0].trim(),
                        state: address[2].trim()
                    }

                    this.setState({ place: placeInfo });
                }).catch((e) => {
                    console.log("Place",e)
                })
            },
            (error) => {
                console.log(error.code, error.message);
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
    }

    render() {
        return (
            <SafeAreaView style={styles.container}>

                <View style={{
                    top: 0,
                    height: SIZES.height * (25 / 100),
                    position: 'absolute',
                    width: '100%',
                    elevation: 5,
                    paddingLeft: 20,
                }}>
                    <View style={{
                        flex: 1,
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginBottom: 35,
                    }}>
                        <View style={{
                            marginRight: 15,
                        }}>
                            <Icon
                                name="map-marker-alt"
                                type='font-awesome-5'
                                color='#C6BDFF'
                                size={SIZES.width * (15 / 100)}
                            />
                        </View>
                        <View style={{
                            justifyContent: 'center'
                        }}>
                            <Text style={{
                                color: COLORS.secondary,
                                ...FONTS.h3
                            }}>ตำแหน่งปัจจุบัน</Text>
                            {this.state.place ?
                                <View>
                                    <Text style={{
                                        color: COLORS.secondary,
                                        ...FONTS.body3
                                    }}>{this.state.place.name}</Text>
                                    <Text style={{
                                        color: COLORS.secondary,
                                        ...FONTS.body3
                                    }}>{this.state.place.address}</Text>
                                    <Text style={{
                                        color: COLORS.secondary,
                                        ...FONTS.body3
                                    }}>{this.state.place.state}</Text>
                                </View>
                                :
                                <Text style={{
                                    color: COLORS.secondary,
                                    marginBottom: '10%',
                                    ...FONTS.body3
                                }}>กำลังค้นหาที่อยู่</Text>
                            }
                        </View>
                    </View>
                </View>

                <View style={{
                    top: SIZES.height * (20 / 100) - 5,
                    position: 'absolute',
                    backgroundColor: COLORS.white,
                    height: 85,
                    width: '97%',
                    zIndex: 10,
                    shadowColor: "#000",
                    elevation: 4,
                    alignSelf: 'center',
                    borderRadius: 8,
                    justifyContent: 'center',
                    padding: 10,
                }}>
                    <View style={{
                        flex: 1,
                        flexDirection: 'row'
                    }}>
                        <View>
                            <Icon
                                type='ionicon'
                                name='person-circle-outline'
                                size={64}
                                color={COLORS.purple}
                                iconStyle={{
                                    left: -5,
                                }}
                                onPress={() => this.props.navigation.navigate("Profile")}
                            />
                        </View>
                        <View style={{
                            justifyContent: 'center',
                        }}>
                            <Text
                                style={{
                                    color: COLORS.lightGray,
                                    ...FONTS.body4,
                                }}>
                                ยินดีตอนรับเข้าสู่ Go Together!
                            </Text>
                            <Text
                                style={{
                                    color: COLORS.lightGray2,
                                    ...FONTS.h4,
                                }}>
                                สวัสดีคุณ {this.context.user.first_name}
                            </Text>
                        </View>
                    </View>

                </View>

                <View style={styles.headerBackground}>
                    <CircleMenu navigation={this.props.navigation} iconName="menu-outline" to="Profile"></CircleMenu>
                </View>

                <View style={{
                    marginTop: 60,
                    flexDirection: 'row',
                    padding: SIZES.padding,
                }}>
                    <View style={{
                        flex: 1,
                        marginRight: 5,
                    }}>
                        <MenuButton navigation={this.props.navigation} buttonLabel="เริ่มโดยสาร" to="PassengerScreen" iconName="street-view" ></MenuButton>
                    </View>
                    <View style={{
                        flex: 1,
                        marginLeft: 5,
                    }}>
                        <MenuButton navigation={this.props.navigation} buttonLabel="เริ่มเดินทาง" to="DriverScreen" iconName="route"></MenuButton>
                    </View>
                </View>

                <View style={{
                    marginTop: 20,
                    padding: SIZES.padding
                }}>
                    <Text style={{
                        ...FONTS.body2
                    }}>
                        What's news?
                    </Text>
                </View>

                <Slider></Slider>

            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.white
    },
    headerBackground: {
        height: SIZES.height * (25 / 100),
        backgroundColor: COLORS.primary,
        paddingBottom: SIZES.padding * 3,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        elevation: 1,
    }
})

export default Lobby;