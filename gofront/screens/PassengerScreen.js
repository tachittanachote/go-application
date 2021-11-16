import React, { PureComponent } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableWithoutFeedback, View, Image, Alert } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import Geolocation from '@react-native-community/geolocation';

import { getDeltaCoordinates, requestGeolocationPermission } from '../utils';
import { BackButton, HorizontalLine, Note, Preload, DriverInformation, Title, PassengerFilter } from '../components';
import { COLORS, FONTS, GOOGLE_API_KEY, images, MAPS, SIZES } from '../constants';
import axios from 'axios';
import { UserContext } from '../context';
import AsyncStorage from '@react-native-async-storage/async-storage';


class PassengerScreen extends PureComponent {

    static contextType = UserContext;

    constructor(props) {
        super(props);
        this.state = {
            coordinates: null,
            drivers: [],
            driverInformation: null,
            marker: null,
            mapRef: null,
            carLocations: [],
            carList: null,
            mapViewDirection: null,
            travelInfo: null,
            selectedCarId: null,
            filterOptions: {
                seats: 4,
                gender: 'none'
            }
            
        }
        //this.fetchCarInterval = null;
        this.getDriverInformation = this.getDriverInformation.bind(this);
        this.getNote = this.getNote.bind(this);
        this.onFilterCallback = this.onFilterCallback.bind(this);
    }

    componentDidMount = async () => {

        //this.fetchCarInterval = setInterval(this.fetchAvailableCars, 5000);
        this.fetchAvailableCars()
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

    fetchAvailableCars = async () => {

        console.log("Fetch!!!!")

        var options = {
            gender: this.state.filterOptions.gender, 
            seats: this.state.filterOptions.seats
        }

        this.setState({ drivers: [], carLocations: [] });

        axios.post('/cars', {
            options
        }
        ,{
            headers: {
                authorization: 'Bearer ' + await AsyncStorage.getItem('session_token')
            }
        }).then((e) => {

            console.log("Fetched Cars", e.data)

            this.setState({ carList: e.data });

            e.data.map((car, index) => {

                console.log(car)

                var carInfo = {
                    carId: car.car.carId
                }

                var driver = this.state.drivers.concat(car.car);
                var location = this.state.carLocations.concat(Object.assign(car.coordinates, carInfo));

                this.setState({ drivers: driver, carLocations: location });
            })
        }).catch((e) => {
            console.log(e)
        })
    }

    handleCarMarkerClick = (carId) => {
        var driver = this.findCarInfo(carId);
        this.getDriverInformation(driver.car);
    }

    getDriverInformation = (e) => {
        
        var driver = this.findCarInfo(e.carId);
        this.setState({ driverInformation: e, selectedCarId: e.carId });

        Geolocation.getCurrentPosition(
            (position) => {
                var origin = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                }
                var destination = {
                    latitude: driver.coordinates.destination.latitude,
                    longitude: driver.coordinates.destination.longitude,
                }
                this.getTravelInfo(origin, destination);
            },
            (error) => {
                console.log(error.code, error.message);
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
    }

    getNote = (e) => {
        console.log(e)
    }

    handleMarker = (region) => {
        this.setState({ marker: region.coordinate }, () => {
            console.log([region])
            this.state.mapRef.fitToCoordinates([region.coordinate], {
                animated: true,
            });
        })
    }

    handleCancel = () => {
        this.setState({ driverInformation: null, mapViewDirection: null, selectedCarId: null });
    }

    handleCarCall = (carId) => {

        console.log("Starting call", carId)

        var driver = this.findCarInfo(carId);

        Geolocation.getCurrentPosition(
            async (position) => {
                axios.post('/cars/call', {
                    user: {
                        id: this.context.user.user_id,
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    },
                    carId: carId
                }, {
                    headers: {
                        authorization: 'Bearer ' + await AsyncStorage.getItem('session_token')
                    }
                }).then((e) => {
                    console.log("Call", e.data)
                    if (e.data === "success") {
                        this.props.navigation.navigate("WaitScreen", {
                            driver: this.state.driverInformation,
                            driverTravelInfo: driver.coordinates,
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

    async getTravelInfo(origin, destination) {
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
            var driver = this.findCarInfo(this.state.selectedCarId);
            this.setState({ travelInfo: e.data, marker: driver.coordinates.destination,
                mapViewDirection:
                    <MapViewDirections
                        origin={driver.coordinates.currentPosition}
                        destination={driver.coordinates.destination}
                        apikey={GOOGLE_API_KEY}
                        strokeWidth={10}
                        strokeColor="#669df6"
                        optimizeWaypoints={true}
                        mode="DRIVING"
                        avoidHighways={true}
                    />
            }, () => {
                setTimeout(() => {
                    this.state.mapRef.fitToCoordinates([driver.coordinates.currentPosition, driver.coordinates.destination], {
                        edgePadding: { top: 100, right: 100, bottom: 400, left: 100 },
                        animated: true,
                    });
                }, 100)
            })
            
        }).catch((e) => {
            console.log("Location", e)
        })
    }

    findCarInfo(carId) {
        return this.state.carList.find(e => e.car.carId === carId);
    }

    renderMapViewDirection() {
        return this.state.mapViewDirection;
    }

    onFilterCallback = (data) => {
        this.setState({ filterOptions: data }, () => {
            this.fetchAvailableCars()
        })
    }

    componentWillUnmount() {
        //clearInterval(this.fetchCarInterval);
    }

    render() {
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <BackButton navigation={this.props.navigation}></BackButton>
                <PassengerFilter onFilterCallback={(filteredData) => this.onFilterCallback(filteredData)}></PassengerFilter>
                {this.state.coordinates === null ?
                    <Preload></Preload>
                    :
                    <View style={{ flex: 1 }}>

                        <MapView
                            style={{ flex: 1 }}
                            provider={PROVIDER_GOOGLE}
                            showsUserLocation={true}
                            initialRegion={this.state.coordinates}
                            region={this.state.coordinates}
                            ref={(ref) => { this.state.mapRef = ref }}
                            followsUserLocation={true}
                        /*onPress={(e) => this.handleMarker(e.nativeEvent)}
                        onPoiClick={(e) => this.handleMarker(e.nativeEvent)} 
                         */
                        >

                            {this.state.marker &&
                            <Marker 
                                coordinate={this.state.marker}
                                identifier={'marker'}
                            >
                                <Image source={images.marker_icon} style={{...MAPS.markerSize}}></Image>    
                            </Marker>
                            }

                            {this.state.mapViewDirection && this.renderMapViewDirection()}

                            {this.state.carLocations.length > 0 && this.state.carLocations.map((car, index) =>
                                <Marker
                                    key={index}
                                    coordinate={car.currentPosition}
                                    onSelect={(e) => this.handleCarMarkerClick(car.carId)}
                                    onPress={(e) => this.handleCarMarkerClick(car.carId)}
                                >
                                    <Image source={images.car_icon} style={{ ...MAPS.carImageSize }}></Image>
                                </Marker>
                            )
                            }

                        </MapView>

                        {this.state.driverInformation === null ?
                            <View style={{
                                position: 'absolute',
                                width: '100%',
                                bottom: 0,
                                borderTopLeftRadius: SIZES.radius * 2,
                                borderTopRightRadius: SIZES.radius * 2,
                                maxHeight: SIZES.height * (25 / 100),
                                backgroundColor: COLORS.white,
                                padding: SIZES.padding * 2.5
                            }}>

                                <Title title="เส้นทางที่สามารถเดินทางได้"></Title>
                                <ScrollView>
                                    {this.state.drivers.length > 0 && this.state.drivers.map((driver, index) => (
                                        <DriverInformation key={index} driver={driver} onCallBack={(e) => this.getDriverInformation(e)} availableSeat></DriverInformation>
                                    ))}
                                    {this.state.drivers.length === 0 && 
                                    <View style={{
                                        flex: 1,
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    }}>
                                        <Text>ไม่พบผู้ขับขี่ในขณะนี้</Text>
                                    </View>
                                    }
                                </ScrollView>
                            </View>

                            : this.state.travelInfo ?

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

                                    <DriverInformation driver={this.state.driverInformation} onCallBack={(e) => this.getDriverInformation(e)}></DriverInformation>
                                    <HorizontalLine></HorizontalLine>

                                    <Text style={{
                                        color: COLORS.darkpurple,
                                        ...FONTS.h5
                                    }}>รายละเอียดการเดินทาง</Text>
                                    {/* <Text style={{
                                    color: COLORS.lightGray2,
                                    ...FONTS.h5
                                }}>จุดหมาย {this.state.driverInformation.travelInfo.destination}</Text> */}
                                    <Text style={{
                                        color: COLORS.lightGray2,
                                        ...FONTS.h5
                                    }}>ระยะทางโดยประมาณ {this.state.travelInfo.distance} km</Text>
                                    <Text style={{
                                        color: COLORS.lightGray2,
                                        ...FONTS.h5
                                    }}>ค่าโดยสารโดยประมาณ {this.state.travelInfo.price} บาท</Text>

                                    <HorizontalLine></HorizontalLine>
                                    <Note onCallBack={(e) => this.getNote(e)}></Note>

                                    <TouchableWithoutFeedback onPress={() => this.handleCancel()}>
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
                                            }}>ยกเลิก</Text>
                                        </View>
                                    </TouchableWithoutFeedback>
                                    <TouchableWithoutFeedback onPress={() => this.handleCarCall(this.state.selectedCarId)}>
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
                                            }}>ยืนยันการเรียกรถโดยสาร</Text>
                                        </View>
                                    </TouchableWithoutFeedback>

                                </View>

                                :
                                <Text>Loading</Text>
                        }

                    </View>
                }
            </SafeAreaView>
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

export default PassengerScreen;
