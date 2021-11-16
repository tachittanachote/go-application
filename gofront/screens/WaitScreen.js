import axios from 'axios';
import React, { Component } from 'react';
import { SafeAreaView, View, Text, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { HorizontalLine, Note, DriverInformation } from '../components';

import { SIZES, COLORS, FONTS } from '../constants'
import { UserContext } from '../context';

class WaitScreen extends Component {

    static contextType = UserContext;

    constructor(props){
        super(props);
        this.updateCurrentLocationInterval = null
    }

    componentDidMount = () =>{
        this.updateCurrentLocationInterval = setInterval(this.updateCurrentLocation, 5000);
    }

    componentWillUnmount = () =>{
        clearInterval(this.updateCurrentLocationInterval);
    }

    async handleCancelCall() {
        axios.post("/cars/cancelCall", {
            carId: this.props.route.params.driver.carId,
            user: {
                id: this.context.user.user_id,
            }
        }, {
            headers: {
                authorization: 'Bearer ' + await AsyncStorage.getItem('session_token')
            }
        }).then((e) => {
            if(e.data === "success") {
                this.props.navigation.navigate("PassengerScreen")
            }
        }).catch((e) => {
            console.log(e)
        })
    }

    handleConfirm() {
        Geolocation.getCurrentPosition(
            async (position) => {
                axios.post("/cars/confirm", {
                    carId: this.props.route.params.driver.carId,
                    user: {
                        id: this.context.user.user_id,
                        startLat: position.coords.latitude,
                        startLong: position.coords.longitude,
                        name: this.context.user.first_name,
                    }
                }, {
                    headers: {
                        authorization: 'Bearer ' + await AsyncStorage.getItem('session_token')
                    }
                }).then((e) => {
                    if(e.data === "success") {
                        this.props.navigation.navigate("TravelScreen", {
                            driver: this.props.route.params.driver,
                            driverTravelInfo: this.props.route.params.driverTravelInfo
                        })
                    }
                }).catch((e) => {
                    console.log(e)
                })
            },
            (error) => {
                console.log(error.code, error.message);
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
    }
    
    updateCurrentLocation = () =>{
        Geolocation.getCurrentPosition(
            async (position) => {
                axios.post("/location/PassengerCurrentLocation", {
                    passengerId: this.context.user.user_id,
                    currentPosition: {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    }
                }, {
                    headers: {
                        authorization: 'Bearer ' + await AsyncStorage.getItem('session_token')
                    }
                }).then((e) => {
                    if (e.data === "success") {
                        console.log('UPDATE WORKING')
                    }
                }).catch((e) => {
                    console.log(e)
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
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: SIZES.height * (5/100),
                }}>
                    <Text style={{
                        marginBottom: SIZES.margin * 1.5,
                        color: COLORS.darkpurple,
                        ...FONTS.h2,
                    }}>โปรดรอสักครู่คนขับกำลังมารับคุณ!</Text>
                    <Text style={{
                        marginBottom: SIZES.margin * 1.5,
                        color: COLORS.purple,
                        ...FONTS.h1,
                    }}>เวลาประมาณ 5-6 นาที</Text>
                    <Text style={{
                        color: COLORS.lightGray2,
                        ...FONTS.body4,
                    }}>ข้อแนะนำระหว่างการรอโปรดอยู่ภายในตำแหน่งที่กดเรียก</Text>
                    <Text style={{
                        color: COLORS.lightGray2,
                        ...FONTS.body4,
                    }}>เพื่อง่ายต่อการสังเกตุเห็นของคนขับ</Text>
                </View>
                <View style={{
                    width: '100%',
                    position: 'absolute',
                    bottom: 0,
                    padding: SIZES.padding * 2,
                    backgroundColor: "#FFFFFF",
                }}>
                    
                    <DriverInformation driver={this.props.route.params.driver} call></DriverInformation>
                    <HorizontalLine></HorizontalLine>
                    <Note></Note>

                    <TouchableWithoutFeedback onPress={() => this.handleCancelCall()}>
                        <View style={{
                            borderRadius: SIZES.radius - 5,
                            backgroundColor: COLORS.lightRed,
                            padding: SIZES.padding * 1.5,
                            marginTop: SIZES.margin,
                        }}>
                            <Text style={{
                                textAlign: 'center',
                                color: COLORS.red,
                                ...FONTS.h5
                            }}>ยกเลิกการเรียกรถโดยสาร</Text>
                        </View>
                    </TouchableWithoutFeedback>

                    <TouchableWithoutFeedback onPress={() => this.handleConfirm()}>
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
                            }}>ยืนยันขึ้นรถ</Text>
                        </View>
                    </TouchableWithoutFeedback>

                </View>
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFFFFF",
    }
})

export default WaitScreen;