import React, { Component } from 'react';
import { View, Text, SafeAreaView, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import _ from 'lodash';
import Geolocation from '@react-native-community/geolocation';

import { HorizontalLine, Title } from '../components';
import { COLORS, FONTS, SIZES } from '../constants';
import axios from 'axios';
import { UserContext } from '../context';
import AsyncStorage from '@react-native-async-storage/async-storage';

class TravelScreen extends Component {

    static contextType = UserContext;

    constructor(props) {
        super(props);
        this.state = {
            invoice: {},
            place: null,
            remainDistance: null,
        }
        this.invoiceInterval = null
    }

    componentDidMount = () => {

        console.log("SOAkopdSDKAJDAOSDJASD ",this.props.route.params.driver)

        this.getPlaceDestinationName()
        this.invoiceInterval = setInterval( async() => {
            this.getBill()
            
            
            axios.post('/location/driver/current', {
                driverId: this.props.route.params.driver.carId,
            }, {
                headers: {
                    authorization: 'Bearer ' + await AsyncStorage.getItem('session_token')
                }
            }).then((res) => {

                console.log(res.data, "Current")

                var destination = {
                    latitude: res.data.destination.latitude,
                    longitude: res.data.destination.longitude,
                }

                var origin = {
                    latitude: res.data.currentPosition.latitude,
                    longitude: res.data.currentPosition.longitude,
                }

                this.getRemainingDistance(origin, destination);

            }).catch((e) => {
                console.log(e)
            })

        }, 5000);
    }

    componentWillUnmount = () => {
        clearInterval(this.invoiceInterval);
    }

    getBill = async () => {
        console.log("Getting bill from carid", this.props.route.params.driver.carId)
        axios.post("/invoices/check", {
            driver: {
                id: this.props.route.params.driver.carId,
            },
            passenger: {
                id: this.context.user.user_id
            }
        }, {
            headers: {
                authorization: 'Bearer ' + await AsyncStorage.getItem('session_token')
            }
        }).then((e) => {
            console.log(e.data)
            if (e.data !== "empty") {
                this.setState({ invoice: e.data })
            }

        }).catch((e) => {
            console.log(e)
        })
    }

    payInvoice = async () => {
        axios.post("/invoices/confirm", {
            carId: this.props.route.params.driver.carId,
            user: {
                id: this.context.user.user_id,
            }
        }, {
            headers: {
                authorization: 'Bearer ' + await AsyncStorage.getItem('session_token')
            }
        }).then((e) => {
            if (e.data === "success") {
                this.props.navigation.navigate("Lobby")
            }
        }).catch((e) => {
            console.log(e)
        })
    }

    async getRemainingDistance(origin, destination) {
        axios.post('/location/calculate', {
            coordinates: {
                origin: origin,
                destination: destination,
            }
        }, {
            headers: {
                authorization: 'Bearer ' + await AsyncStorage.getItem('session_token')
            }
        }).then((e) => {
            this.setState({ remainDistance: e.data.distance });
        }).catch((e) => {
            console.log(e)
        })
    }

    getPlaceDestinationName = async () => {
        console.log(this.props.route.params.driverTravelInfo)
        axios.post('/location/place', {
            coordinates: this.props.route.params.driverTravelInfo.destination
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
            console.log(e)
        })
    }

    render() {
        return (
            <SafeAreaView style={styles.container}>
                <View style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    padding: SIZES.padding * 3.5
                }}>
                    {this.state.place ?
                        <View>
                            <Text style={{
                                color: COLORS.darkpurple,
                                textAlign: 'center',
                                ...FONTS.h2
                            }}>{this.state.place.name}</Text>
                            <Text style={{
                                color: COLORS.secondary,
                                ...FONTS.body4
                            }}>จุดหมายปลายทางของคุณ</Text>
                        </View>
                        :
                        <Text style={{
                            color: COLORS.secondary,
                            ...FONTS.body4
                        }}>กำลังค้นหาปลายทาง</Text>
                    }
                </View>
                <View style={{
                    marginBottom: SIZES.height * (35 / 100),
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <Text style={{
                        color: COLORS.secondary,
                        marginBottom: SIZES.margin,
                        ...FONTS.body3
                    }}>ถึงจุดหมายของคุณอีกภายใน</Text>
                    {this.state.remainDistance ?
                        <Text style={{
                            textAlign: 'center',
                            color: COLORS.secondary,
                            ...FONTS.subtitle,
                        }}>{this.state.remainDistance} ก.ม.</Text>
                        :
                        <Text style={{
                            textAlign: 'center',
                            color: COLORS.secondary,
                            ...FONTS.subtitle,
                        }}>กำลังประมวลผล</Text>
                    }
                </View>
                <View style={{
                    position: 'absolute',
                    width: '100%',
                    bottom: 0,
                    borderTopLeftRadius: SIZES.radius * 2,
                    borderTopRightRadius: SIZES.radius * 2,
                    maxHeight: SIZES.height * (50 / 100),
                    backgroundColor: COLORS.white,
                    padding: SIZES.padding * 2.5
                }}>
                    <Title title="ข้อมูลการเดินทางในขณะนี้"></Title>
                    <HorizontalLine></HorizontalLine>
                    {/* <DriverInformation driver={this.props.route.params.driver} onCallBack={(e) => console.log(e)}></DriverInformation> */}
                    <View style={{
                        marginTop: 15,
                    }}>
                        <View style={styles.flexRow}>
                            <View style={styles.flex}>
                                <Text style={styles.description}>หมายเลขประจำตัวผู้ขับ 110293</Text>
                            </View>
                        </View>
                        <View style={styles.flexRow}>
                            <View style={styles.flex}>
                                <Text style={styles.description}>ชื่อผู้ขับ นายเตชิตธนโชติ อามาตมนตรี</Text>
                            </View>
                        </View>
                        <HorizontalLine></HorizontalLine>

                        {!_.isEmpty(this.state.invoice) &&
                            <View>
                                <View style={styles.flexRow}>
                                    <View style={styles.flex}>
                                        <Text style={styles.description}>ระยะรวมการเดินทางทั้งหมด</Text>
                                    </View>
                                    <Text style={styles.description}>{this.state.invoice.distance} กิโลเมตร</Text>
                                </View>
                                <View style={styles.flexRow}>
                                    <View style={styles.flex}>
                                        <Text style={styles.description}>ชำระค่าโดยสาร</Text>
                                    </View>
                                    <Text style={styles.description}>{this.state.invoice.price} บาท</Text>
                                </View>
                            </View>
                        }
                    </View>

                    {!_.isEmpty(this.state.invoice) &&
                        <TouchableWithoutFeedback onPress={() => this.payInvoice()}>
                            <View style={{
                                borderRadius: SIZES.radius - 5,
                                backgroundColor: COLORS.primary,
                                padding: SIZES.padding * 1.5,
                                marginTop: SIZES.margin,
                            }}>
                                <Text style={{
                                    textAlign: 'center',
                                    color: COLORS.white,
                                    ...FONTS.h5
                                }}>จ่ายค่าโดยสาร</Text>
                            </View>
                        </TouchableWithoutFeedback>
                    }
                </View>
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.purple,
    },
    flex: {
        flex: 1,
    },
    flexRow: {
        flex: 1,
        flexDirection: 'row'
    },
    description: {
        color: COLORS.lightGray2,
        ...FONTS.h5
    }
})

export default TravelScreen;