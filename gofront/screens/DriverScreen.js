import React, { PureComponent } from 'react';
import { SafeAreaView, StyleSheet, Text, View, TouchableWithoutFeedback, Image, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import { Icon } from 'react-native-elements';
import MapViewDirections from 'react-native-maps-directions'

import { getDeltaCoordinates, requestGeolocationPermission } from '../utils';
import { Preload, BackButton, Title, SuggestionPlace, HorizontalLine, DriverFilter, EmergencyButton } from '../components';
import { COLORS, FONTS, GOOGLE_API_KEY, images, MAPS, SIZES } from '../constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import UserContext from '../context/UserProvider';
import Modal from "react-native-modal";
import { SwipeablePanel } from "rn-swipeable-panel";

class DriverScreen extends PureComponent {

    static contextType = UserContext;

    constructor(props) {
        super(props);
        this.state = {
            viewFavr: false,
            coordinates: null,
            destination: null,
            marker: null,
            mapRef: null,
            mapViewDirection: null,
            nearbyPlace: [],
            favorites: [],
            filterOptions: {
                gender: 'none'
            },
            availableSeat: 3,
            popupState: false,
            seatError: false,
            panelProps: {
                fullWidth: true,
                openLarge: true,
                refreshing: false,
                onClose: () => this.closePanel(),
                onPressCloseButton: () => this.closePanel(),
            },
            isPanelActive: false,
            favoName: '',
        }
    }

    closePanel = () => {
        this.setState({ isPanelActive: false });
    };

    componentDidMount = () => {
        this.fetchFavorites()
        requestGeolocationPermission().then((e) => {
            Geolocation.getCurrentPosition(
                (position) => {
                    this.getNearbyPlace(position.coords.latitude, position.coords.longitude);
                    this.setState({ coordinates: getDeltaCoordinates(position.coords.latitude, position.coords.longitude, position.coords.accuracy) });
                },
                (error) => {
                    console.log(error.code, error.message);
                },
                { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
            );
        })
    }

    handleDestination(state) {
        this.setState({ destination: state }, async () => {
            if (this.state.destination !== true && this.state.destination !== null) {

                var coordinate = {
                    latitude: state.geometry.location.lat,
                    longitude: state.geometry.location.lng,
                }

                this.setState({ marker: coordinate });

                setTimeout(() => {
                    this.state.mapRef.fitToCoordinates([coordinate, this.state.coordinates], {
                        animated: true,
                    });
                }, 100)

                this.setState({
                    mapViewDirection:
                        <MapViewDirections
                            origin={this.state.coordinates}
                            destination={coordinate}
                            apikey={GOOGLE_API_KEY}
                            strokeWidth={10}
                            strokeColor="#669df6"
                            optimizeWaypoints={true}
                            mode="DRIVING"
                            avoidHighways={true}
                        />
                })
            }
            if (this.state.destination === true) {

                axios.post('/location/place', {
                    coordinates: this.state.marker
                }, {
                    headers: {
                        authorization: 'Bearer ' + await AsyncStorage.getItem('session_token')
                    }
                }).then((e) => {

                    console.log("assgining")

                    var coordinate = {
                        latitude: this.state.marker.latitude,
                        longitude: this.state.marker.longitude
                    }

                    Object.assign(coordinate, e.data);

                    this.setState({ destination: coordinate })

                }).catch((e) => {
                    console.log(e)
                })
            }
        })

        if (!state) {
            this.setState({ mapViewDirection: null, marker: null, destination: null })
        }
    }

    handleMarker = (region) => {

        this.setState({ marker: region.coordinate }, () => {

            this.handleDestination(true);

            this.state.mapRef.fitToCoordinates([region.coordinate, this.state.coordinates], {
                edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
                animated: true,
            });
            this.setState({
                mapViewDirection:
                    <MapViewDirections
                        origin={this.state.coordinates}
                        destination={this.state.marker}
                        apikey={GOOGLE_API_KEY}
                        strokeWidth={10}
                        strokeColor="#669df6"
                        optimizeWaypoints={true}
                        mode="DRIVING"
                        avoidHighways={true}
                    />
            })
        })
    }

    getNearbyPlace = async (latitude, longitude) => {
        axios.post("/location/nearby", {
            radius: 50000,
            coordinates: {
                latitude: latitude,
                longitude: longitude
            }
        }, {
            headers: {
                authorization: 'Bearer ' + await AsyncStorage.getItem('session_token')
            }
        }).then((e) => {

            var nearby = [
                e.data[e.data.length - 1],
                e.data[e.data.length - 2],
                e.data[e.data.length - 3]
            ]

            nearby.forEach(async (place) => {
                axios.post('/location/place', {
                    coordinates: {
                        latitude: place.geometry.location.lat,
                        longitude: place.geometry.location.lng
                    }
                }, {
                    headers: {
                        authorization: 'Bearer ' + await AsyncStorage.getItem('session_token')
                    }
                }).then((e) => {

                    var placeAddress = Object.assign(place, e.data)
                    var nearbyPlace = this.state.nearbyPlace.concat(placeAddress);
                    this.setState({ nearbyPlace: nearbyPlace });

                }).catch((e) => {
                    console.log(e)
                })
            })

        }).catch((e) => {
            console.log(e)
        })
    }

    renderMapViewDirection() {
        return this.state.mapViewDirection;
    }

    handleStart = async () => {
        console.log("starting driver context", this.context.user)
        console.log("Start!!!", this.state.availableSeat)

        axios.post("/cars/start", {
            driver: {
                id: this.context.user.user_id,
                name: this.context.user.first_name,
                currentLat: this.state.coordinates.latitude,
                currentLong: this.state.coordinates.longitude,
                destinationLat: this.state.destination?.latitude ? this.state.destination?.latitude : this.state.destination.geometry.location.lat,
                destinationLong: this.state.destination?.longitude ? this.state.destination.longitude : this.state.destination.geometry.location.lng,
                carInfo: {
                    registration: this.context.user.license_plate, //Database
                    color: this.context.user.color,     //Database
                    model: this.context.user.model, //Database
                    seat: this.state.availableSeat
                }
            },
            filters: {
                gender: this.state.filterOptions.gender
            }
        }, {
            headers: {
                authorization: 'Bearer ' + await AsyncStorage.getItem('session_token')
            }
        }).then(async (e) => {
            console.log(e.data)
            if (e.data === "success") {
                await this.recordHistory(this.state.coordinates.latitude, this.state.coordinates.longitude);
                this.props.navigation.navigate("DrivingScreen")
            }
        }).catch((e) => {
            console.log(e)
        })
    }

    async recordHistory(lat, long) {
        console.log('function record had called!')
        axios.post("/history/create", {
            carId: this.context.user.user_id,
            user: {
                id: this.context.user.user_id,
                type: 'driver',
            },
            info: {
                origin: {
                    lat: lat,
                    long: long
                }
            }
        }, {
            headers: {
                authorization: 'Bearer ' + await AsyncStorage.getItem('session_token')
            }
        }).then((e) => {
            //console.log(e.data)
            if (e.data.status === "success") {
                console.log('history record had created!')
            } else {
                console.log('history errorrrrr')
            }
        }).catch((e) => {
            console.log(e)
        })
    }


    onFilterCallback(data) {
        this.setState({ filterOptions: data }, () => {
            console.log(data)
        });

    }

    toggleFavrPopup = () => {
        if (this.state.viewFavr) {
            this.setState({ viewFavr: false });
        } else {
            this.setState({ viewFavr: true });
        }
    }

    toggleStartPopup() {
        if (this.state.popupState) {
            this.setState({ popupState: false });
        } else {
            this.setState({ popupState: true });
        }
    }

    handleAvailableSeat(text) {
        if (text.length === 0) {
            this.setState({ seatError: true })
        } else {
            this.setState({ availableSeat: parseInt(text), seatError: false })
        }
    }

    toggleAddFavorite = () => {
        this.setState({ isPanelActive: true })
    }

    async addFavorite() {
        
        var data = null; 

        if (this.state.destination["geometry"] === undefined) {
            console.log("ass")
            
            data = {
                lat: this.state.destination.latitude,
                lng: this.state.destination.longitude,
            }
        } else {
            data = this.state.destination.geometry.location
            console.log("v")
        }

        if (this.state.favoName.length <= 0) {
            alert("โปรดระบุชื่อตำแหน่ง")
            return;
        }

        axios.post('/favorite/add', {
            name: this.state.favoName,
            destination: data
        }, {
            headers: {
                authorization: 'Bearer ' + await AsyncStorage.getItem('session_token')
            }
        }).then((resp) => {
            console.log(resp.data)
            this.setState({ isPanelActive: false }, () => {
                this.fetchFavorites()
            })
        }).catch((e) => {
            console.log("Favorite", e)
        })
    }

    async fetchFavorites() {
        axios.post('/favorite', {}, {
            headers: {
                authorization: 'Bearer ' + await AsyncStorage.getItem('session_token')
            }
        }).then((resp) => {
            console.log(resp.data)
            this.setState({ favorites: resp.data })
        }).catch((e) => {
            console.log("Favorite", e)
        })
    }

    renderFavoriteList() {
        return (
            <Modal
                isVisible={this.state.viewFavr}
                animationIn="slideInDown"
                animationOut="slideOutUp"
            >
                <View style={{
                    flex: 1,
                    backgroundColor: COLORS.white,
                    padding: SIZES.padding,
                }}>
                    <Text style={{
                        margin: 10,
                        ...FONTS.h4
                    }}>Favorite</Text>
                    <ScrollView>
                        {this.state.favorites.length > 0 && this.state.favorites.map((item, index) => (
                            <TouchableWithoutFeedback key={index} onPress={() => this.useFavr(item)}>
                                <View style={{ 
                                    borderRadius: SIZES.radius,
                                    padding: 10,
                                    backgroundColor: COLORS.lightGray3,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    flex: 1,
                                    marginBottom: 10,
                                }}>
                                     <View>
                                    <Icon
                                        style={{
                                            marginRight: 15,
                                        }}
                                        name='map-marker-alt'
                                        type='font-awesome-5'
                                        color='#ED2026'
                                        size={28}
                                    />
                                    </View>
                                    <Text>{item.name}</Text>
                                    <View style={{
                                        flex: 1,
                                        alignItems: 'flex-end'
                                    }}>
                                    <TouchableOpacity onPress={() => this.removeFavr(item.favorite_path_id)}>
                                        <Icon
                                            reverse
                                            name='close-outline'
                                            type='ionicon'
                                            color={COLORS.red}
                                            size={12}
                                        />
                                    </TouchableOpacity>
                                    </View>
                                </View>
                            </TouchableWithoutFeedback>
                        ))}

                        {this.state.favorites.length === 0 &&
                            <View style={{
                                flex: 1,
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}>
                            <Text style={{
                                color: COLORS.lightGray2,
                                ...FONTS.h6
                            }}>ไม่พบรายการ</Text>
                            </View>
                        }

                    </ScrollView>

                    <View style={{
                        position: 'absolute',
                        bottom: 50,
                        alignItems: 'center',
                        width: '100%'
                    }}>
                        <TouchableOpacity onPress={() => this.toggleFavrPopup()}>
                            <Text style={{
                                color: COLORS.lightGray2,
                                ...FONTS.h6
                            }}>ปิด</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        )
    }

    async useFavr(data) {

        var coordinates = data.destination.split(",")
        var coordinate = {
            latitude: parseFloat(coordinates[0]),
            longitude: parseFloat(coordinates[1])
        }

        var data = {
            geometry: {
                location: {
                    lat: parseFloat(coordinates[0]),
                    lng: parseFloat(coordinates[1])
                },
            }
        }

        axios.post('/location/place', {
            coordinates: coordinate
        }, {
            headers: {
                authorization: 'Bearer ' + await AsyncStorage.getItem('session_token')
            }
        }).then((e) => {

            console.log("assgining")

            Object.assign(data, e.data);

            console.log()

            this.setState({ destination: data, viewFavr: false }, () => {

                this.handleDestination(data)
            })


        }).catch((e) => {
            console.log(e)
        })
        
    }

    async removeFavr(id) {
        axios.post('/favorite/remove', { id: id}, {
            headers: {
                authorization: 'Bearer ' + await AsyncStorage.getItem('session_token')
            }
        }).then((resp) => {
            this.fetchFavorites()
        }).catch((e) => {
            console.log("Favorite", e)
        })
    }

    renderContent() {

        return (
            <View
                style={{
                    padding: SIZES.padding,
                }}
            >
                <View>
                    <Text
                        style={{
                            ...FONTS.h5,
                        }}
                    >
                        Add to favorite
                    </Text>
                </View>
                <View
                    style={{
                        margin: SIZES.margin

                    }}>
                    <Text>ตั้งชื่อจุดหมาย</Text>
                    <TextInput placeholder="" keyboardType='numeric' style={styles.inputBank} onChangeText={(value) => this.setState({ favoName: value })}></TextInput>

                    <TouchableWithoutFeedback onPress={() => this.addFavorite()}>
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
                            }}>เพิ่ม</Text>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </View>
        );
    }

    render() {
        return (
            <SafeAreaView style={{ flex: 1 }}>
                {this.renderFavoriteList()}
                <BackButton navigation={this.props.navigation}></BackButton>
                <DriverFilter onFilterCallback={(filterData) => this.onFilterCallback(filterData)}></DriverFilter>

                <View style={{
                    position: 'absolute',
                    zIndex: 100,
                    right: 0,
                    top: 50,
                    margin: 20,
                }}>

                    <TouchableWithoutFeedback onPress={this.toggleFavrPopup}>
                        <View style={{
                            padding: 10,
                            width: SIZES.width * (40 / 100),
                            flex: 1,
                            borderRadius: 20,
                            backgroundColor: COLORS.purple,
                        }}>
                            <Text style={{
                                color: '#ffffff',
                                textAlign: 'center',
                                ...FONTS.h5
                            }}>
                                รายการโปรด
                            </Text>
                        </View>
                    </TouchableWithoutFeedback>
                </View>

                <Modal
                    isVisible={this.state.popupState}
                    animationIn="slideInDown"
                    animationOut="slideOutUp"
                >
                    <View style={{
                        flex: 1,
                        margin: '0.5%',
                        backgroundColor: COLORS.white,
                        padding: 20,
                        borderRadius: SIZES.radius,
                    }}>

                        <View style={{
                            flex: 1,
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>

                            <Text style={{
                                color: COLORS.darkpurple,
                                ...FONTS.h3
                            }}>จำนวนที่ว่างที่จะรับ</Text>
                            <TextInput
                                autoFocus={true}
                                maxLength={1}
                                keyboardType="number-pad"
                                defaultValue={String(this.state.availableSeat)}
                                onChangeText={(text) => this.handleAvailableSeat(text)}
                                style={{
                                    ...FONTS.h2
                                }}
                            >
                            </TextInput>

                            {this.state.seatError &&
                                <Text style={{
                                    color: COLORS.red,
                                    ...FONTS.body3
                                }}>โปรดระบุจำนวนที่ต้องการรับ</Text>
                            }

                        </View>

                        <View style={{
                            flex: 1,
                            justifyContent: 'flex-end'
                        }}>
                            <TouchableWithoutFeedback onPress={() => this.handleStart()}>
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
                                    }}>เริ่มการเดินทาง</Text>
                                </View>
                            </TouchableWithoutFeedback>
                            <TouchableWithoutFeedback onPress={() => this.toggleStartPopup()}>
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
                        </View>

                    </View>
                </Modal>

                {this.state.coordinates === null ?
                    <Preload></Preload>
                    :
                    <View style={{
                        flex: 1,
                    }}>
                        <MapView
                            style={{ flex: 2 }}
                            provider={PROVIDER_GOOGLE}
                            showsUserLocation={true}
                            initialRegion={this.state.coordinates}
                            region={!this.state.marker ? this.state.coordinates : this.state.marker.coodinates}
                            onPress={(e) => this.handleMarker(e.nativeEvent)}
                            onPoiClick={(e) => this.handleMarker(e.nativeEvent)}
                            ref={(ref) => { this.state.mapRef = ref }}
                            followsUserLocation={true}

                        >

                            {this.state.marker &&
                                <View>
                                    <Marker
                                        coordinate={this.state.marker}
                                        identifier={'marker'}
                                    >
                                        <Image source={images.marker_icon} style={{ ...MAPS.markerSize }}></Image>
                                    </Marker>
                                </View>
                            }

                            {this.renderMapViewDirection()}

                        </MapView>

                        {!this.state.destination ?

                            <View style={{
                                flex: 1,
                                width: '100%',
                                bottom: 0,
                                maxHeight: SIZES.height * (50 / 100),
                                backgroundColor: COLORS.white,
                                padding: SIZES.padding * 2.5
                            }}>

                                <Title title="เลือกจุดหมายปลายทาง"></Title>
                                <View style={{
                                    flexDirection: "row",
                                    width: '100%',
                                    paddingLeft: SIZES.padding * 1.5,
                                    paddingRight: SIZES.padding * 1.5,
                                    backgroundColor: COLORS.lightGray3,
                                    borderRadius: SIZES.radius,
                                    alignItems: 'center',
                                    marginBottom: 20,
                                }}>
                                    <Icon
                                        style={{
                                            marginRight: 15,
                                        }}
                                        name='map-marker-alt'
                                        type='font-awesome-5'
                                        color='#ED2026'
                                        size={28}
                                    />
                                    <TextInput
                                        style={{
                                            ...FONTS.h2
                                        }}
                                        placeholder="ค้นหาเส้นทาง "
                                    >
                                    </TextInput>
                                </View>

                                <ScrollView>
                                    {this.state.nearbyPlace.length !== 0 ?
                                        <View>
                                            {this.state.nearbyPlace.map((place, index) => (
                                                <TouchableWithoutFeedback onPress={() => this.handleDestination(place)} key={index}>
                                                <View>
                                                    
                                                        <View style={styles.tocuhable}>
                                                            <SuggestionPlace placeLocation={place.name} placeAddress={place.formatted_address.split(",")[0]}></SuggestionPlace>
                                                        </View>
                                                        <HorizontalLine></HorizontalLine>
                                                    
                                                </View>
                                                </TouchableWithoutFeedback>
                                            ))}

                                        </View>
                                        :
                                        <View style={{
                                            flex: 1,
                                            height: 150,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            alignSelf: 'center',
                                        }}>
                                            <Text>กำลังค้นหาจุดหมาย</Text>
                                        </View>
                                    }
                                </ScrollView>
                            </View>

                            :

                            <View style={{
                                flex: 1,
                                width: '100%',
                                bottom: 0,
                                maxHeight: SIZES.height * (50 / 100),
                                backgroundColor: COLORS.white,
                                padding: SIZES.padding * 2.5,
                            }}>
                                <View style={{
                                    flexDirection: 'row',
                                }}>
                                    <View style={{
                                        flex: 1,
                                    }}>
                                        <Title title="จุดหมายปลายทาง"></Title>
                                    </View>
                                    <View style={{
                                        flex: 1,
                                        alignItems: 'flex-end'
                                    }}>
                                        <TouchableOpacity onPress={() => this.toggleAddFavorite()}>
                                            <Icon
                                                name='heart-outline'
                                                type='ionicon'
                                                color={COLORS.red}
                                                size={22}
                                            />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <View style={{
                                    flex: 1,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    backgroundColor: COLORS.lightGray3,
                                    padding: SIZES.padding * 2,
                                    borderRadius: SIZES.radius
                                }}>
                                    <Icon
                                        style={{
                                            marginRight: 8,
                                        }}
                                        name='radio-button-on-outline'
                                        type='ionicon'
                                        color='#1296DB'
                                        size={28}
                                    />
                                    <View style={{
                                        flex: 1,
                                        flexDirection: 'column'
                                    }}>
                                        <ScrollView>
                                            <Text style={{
                                                ...FONTS.h4
                                            }}>{this.state.destination.name}</Text>
                                            <Text style={{
                                                color: COLORS.lightGray2,
                                                ...FONTS.body4
                                            }}>{this.state.destination.formatted_address}</Text>
                                        </ScrollView>
                                    </View>
                                </View>
                                <TouchableWithoutFeedback onPress={() => this.handleDestination(null)}>
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
                                        }}>ยกเลิก</Text>
                                    </View>
                                </TouchableWithoutFeedback>
                                <TouchableWithoutFeedback onPress={() => this.toggleStartPopup()}>
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
                                        }}>เริ่มเดินทาง</Text>
                                    </View>
                                </TouchableWithoutFeedback>
                            </View>
                        }
                    </View>
                }

                <SwipeablePanel
                    {...this.state.panelProps}
                    isActive={this.state.isPanelActive}
                >
                    {this.renderContent()}
                </SwipeablePanel>

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
    },
    tocuhable: {
        flex: 1,
        backgroundColor: "transparent",
    },
    inputBank: {
        backgroundColor: COLORS.lightGray3,
        padding: SIZES.margin,
        marginTop: 10,
        borderRadius: SIZES.radius2
    }
})

export default DriverScreen;
