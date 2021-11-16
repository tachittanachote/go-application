import React, { Component } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableWithoutFeedback, Alert, Image, ScrollView } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import { Preload } from '../components';
import { COLORS, SIZES, FONTS, images, MAPS } from '../constants';
import { getDeltaCoordinates, requestGeolocationPermission } from '../utils';
import { SwipeablePanel } from 'rn-swipeable-panel';
import axios from 'axios';
import UserContext from '../context/UserProvider';
import Modal from "react-native-modal";
import AsyncStorage from '@react-native-async-storage/async-storage';

class DrivingScreen extends Component {

    static contextType = UserContext;

    constructor(props) {
        super(props);
        this.state = {
            dashboardDisplay: "flex",
            coordinates: null,
            isPanelActive: false,
            panelProps: {
                fullWidth: true,
                onlySmall: true,
                onClose: () => this.closePanel(),
                onPressCloseButton: () => this.closePanel(),
            },
            passengers: [],
            bookingPassengers: []
        }
        this.checkPassengerInterval = null;
        this.pullInterval = null;
        this.updateCurrentLocationInterval = null;
        this.dropPassenger = this.dropPassenger.bind(this);
    }

    componentDidMount = () => {

        this.checkPassengerInterval = setInterval(this.getPassengers, 5000);
        this.pullInterval = setInterval(this.pull, 5000);
        this.updateCurrentLocationInterval = setInterval(this.updateCurrentLocation, 5000);

        requestGeolocationPermission().then((e) => {
            Geolocation.getCurrentPosition(
                (position) => {
                    this.setState({ coordinates: getDeltaCoordinates(position.coords.latitude, position.coords.longitude, position.coords.accuracy) });
                },
                (error) => {
                    console.log(error.code, error.message);
                },
                { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
            );
        })
    }

    openPanel = () => {
        this.setState({ isPanelActive: true, dashboardDisplay: "none" });
    };

    closePanel = () => {
        this.setState({ isPanelActive: false, dashboardDisplay: "flex" });
    };

    reachDestination = async () => {
        axios.post("/cars/done", {
            carId: this.context.user.user_id
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


    updateCurrentLocation = () => {
        Geolocation.getCurrentPosition(
            async (position) => {
                this.setState({ coordinates: getDeltaCoordinates(position.coords.latitude, position.coords.longitude, position.coords.accuracy) });
                axios.post("/location/DriverCurrentLocation", {
                    carId: this.context.user.user_id,
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



    dropPassenger = async (passengerId) => {

        console.log("Clicked Drop ID", passengerId)

        var user = await axios.post("/user/" + passengerId, {}, {
            headers: {
                authorization: 'Bearer ' + await AsyncStorage.getItem('session_token')
            }
        });

        console.log("DropUserID", user.data),

            Geolocation.getCurrentPosition(
                async (position) => {
                    axios.post("/cars/dropPassenger", {
                        carId: this.context.user.user_id,
                        passenger: {
                            id: passengerId,
                            passengerName: user.data.first_name,
                            endLat: position.coords.latitude,
                            endLong: position.coords.longitude
                        }
                    }, {
                        headers: {
                            authorization: 'Bearer ' + await AsyncStorage.getItem('session_token')
                        }
                    }).then((e) => {
                        if (e.data === "success") {
                            Alert.alert("สำเร็จ")
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

    renderContent() {

        console.log("render!")

        return (
            <View style={{
                padding: SIZES.padding
            }}>
                <ScrollView>
                    {this.state.passengers.length > 0 && this.state.passengers.map((passenger, index) => (
                        <TouchableWithoutFeedback key={index} onPress={() => this.dropPassenger(passenger.passengerInfo.passengerId)}>
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
                                }}>{passenger.passengerInfo.passengerName}</Text>
                            </View>
                        </TouchableWithoutFeedback>
                    ))
                    }
                    <TouchableWithoutFeedback onPress={() => this.reachDestination()}>
                        <View style={{
                            borderRadius: SIZES.radius - 5,
                            backgroundColor: COLORS.lightRed,
                            padding: SIZES.padding * 1.5,
                            marginTop: SIZES.margin,
                            marginBottom: SIZES.margin - 5,
                        }}>
                            <Text style={{
                                textAlign: 'center',
                                color: COLORS.red,
                                ...FONTS.h5
                            }}>สิ้นสุดการเดืนทาง</Text>
                        </View>
                    </TouchableWithoutFeedback>
                </ScrollView>
            </View>
        )
    }

    pull = async () => {
        axios.post("/cars/pull", {
            carId: this.context.user.user_id
        }, {
            headers: {
                authorization: 'Bearer ' + await AsyncStorage.getItem('session_token')
            }
        }).then((e) => {
            if (e.status !== 200) {
                this.setState({
                    bookingPassengers: []
                })
            } else {
                console.log("pulled", e.data)
                //this.state.bookingPassengers = e.data;
                this.setState({
                    bookingPassengers: e.data
                })
                //console.log("log show state ---------------------- " + this.state.bookingPassengers);
            }

        }).catch((e) => {
            console.log("pulled", e)
        })
    }

    getPassengers = async () => {
        axios.post('/cars/checkPassengersInfo', {
            driver: {
                id: this.context.user.user_id
            }
        }, {
            headers: {
                authorization: 'Bearer ' + await AsyncStorage.getItem('session_token')
            }
        }).then((e) => {
            console.log(e.data, "P IN C")
            //this.state.passengers = e.data;
            this.setState({ passengers: e.data, })
        }).catch((e) => {
            console.log(e)
        })
    }

    componentWillUnmount = () => {
        clearInterval(this.checkPassengerInterval);
        clearInterval(this.pullInterval);
        clearInterval(this.updateCurrentLocationInterval);
    }

    render() {
        return (
            <SafeAreaView style={styles.container}>
                {this.state.coordinates === null ?
                    <Preload></Preload>
                    :
                    <View style={{
                        flex: 1,
                    }}>

                        <Modal
                            isVisible={false}
                            animationIn="slideInDown"
                            animationOut="slideOutUp"
                        >

                            <View style={{
                                height: 300,
                                margin: '0.5%',
                                backgroundColor: COLORS.white,
                                padding: 20,
                                borderRadius: SIZES.radius,
                            }}>

                                <Text style={{
                                    textAlign: 'center',
                                    color: COLORS.darkpurple,
                                    flex: 1,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    ...FONTS.h3
                                }}>รายละเอียด</Text>


                                <View style={{
                                    flex: 1,
                                }}>
                                    <Text style={{
                                        textAlign: 'center',
                                        color: COLORS.lightGray2,
                                        marginBottom: 10,
                                        ...FONTS.h4
                                    }}>คุณเตชิตธนโชติ (ID: 11192020)</Text>

                                    <Text style={{
                                        textAlign: 'center',
                                        marginBottom: 10,
                                        color: COLORS.lightGray2,
                                        ...FONTS.h4
                                    }}>ระยะการเดินทางทั้งหมด 50 กม.</Text>

                                    <Text style={{
                                        textAlign: 'center',
                                        marginBottom: 10,
                                        color: COLORS.lightGray2,
                                        ...FONTS.h4
                                    }}>ชำระค่าบริการ 250 บาท</Text>

                                </View>

                                <View style={{
                                    flex: 1,
                                    justifyContent: 'flex-end'
                                }}>
                                    <TouchableWithoutFeedback onPress={() => this.updateFilter()}>
                                        <View style={{
                                            borderRadius: SIZES.radius - 5,
                                            backgroundColor: COLORS.primary,
                                            padding: SIZES.padding * 1.5,
                                            marginBottom: SIZES.margin - 20,
                                        }}>
                                            <Text style={{
                                                textAlign: 'center',
                                                color: COLORS.white,
                                                ...FONTS.h5
                                            }}>ยืนยัน</Text>
                                        </View>
                                    </TouchableWithoutFeedback>
                                </View>

                            </View>

                        </Modal>


                        <MapView
                            style={{ flex: 1 }}
                            provider={PROVIDER_GOOGLE}
                            showsUserLocation={true}
                            initialRegion={this.state.coordinates}
                        //region={this.state.coordinates}
                        >



                            {//this.state.bookingPassengers.length>0 &&
                                this.state.bookingPassengers !== null &&
                                this.state?.bookingPassengers
                                    .filter(bookingPassengers => bookingPassengers.id !== undefined)
                                    .map(
                                        (passenger, index) => (
                                            <Marker
                                                key={index}
                                                coordinate={
                                                    {
                                                        latitude: passenger.latitude,
                                                        longitude: passenger.longitude,
                                                    }}>
                                                <Image source={images.passenger_icon} style={{ ...MAPS.markerSize }}></Image>
                                            </Marker>
                                        ))}

                        </MapView>

                        <View
                            onStartShouldSetResponder={() => this.openPanel()}
                            style={{
                                position: 'absolute',
                                bottom: 0,
                                width: '100%',
                                height: SIZES.height * (7.5 / 100),
                                backgroundColor: COLORS.white,
                                borderTopLeftRadius: SIZES.radius,
                                borderTopRightRadius: SIZES.radius,
                                padding: SIZES.padding,
                                alignItems: 'center',
                                display: this.state.dashboardDisplay,
                            }}>
                            <View style={{
                                width: SIZES.width * (10 / 100),
                                height: 5,
                                backgroundColor: COLORS.lightGray3,
                                borderRadius: SIZES.radius,
                            }}>
                            </View>
                            <Text style={{
                                padding: SIZES.padding,
                                color: COLORS.lightGray2,
                                textAlignVertical: 'center',
                                ...FONTS.h4
                            }}>
                                ข้อมูลการเดินทาง
                            </Text>
                        </View>
                        <SwipeablePanel {...this.state.panelProps} isActive={this.state.isPanelActive}>
                            {this.renderContent()}
                        </SwipeablePanel>
                    </View>
                }
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
})

export default DrivingScreen;