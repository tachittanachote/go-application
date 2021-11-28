import axios from 'axios';
import React, { Component } from 'react';
import { TouchableWithoutFeedback, View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Icon } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwt from 'jwt-decode'
import { COLORS, FONTS, SIZES } from '../constants';
import Modal from "react-native-modal";
import { images } from '../constants'

class MenuButton extends Component {

    constructor(props) {
        super(props);
        this.state = {
            modalState: false
        }
    }

    handlePress = (routeName) => {
        if (this.props.to === "DriverScreen") {
            this.checkDriverVerified(routeName)
        }
        else {
            this.props.navigation.navigate(routeName);
        }

    }

    async checkDriverVerified(route) {

        var token = await AsyncStorage.getItem('session_token')

        var decoded = jwt(token)
        console.log(token)
        console.log(decoded.user_id)

        axios.post('/user/driververify/' + decoded.user_id, {}, {
            headers: {
                authorization: 'Bearer ' + token
            }
        }).then((resp) => {
            if (resp.data === "verified") {
                this.props.navigation.navigate(route);
            }
            else {
                this.setState({ modalState: true })
            }
        }).catch((e) => {
            console.log(e)
        })
    }

    render() {
        return (
            <>
            <TouchableWithoutFeedback onPress={() => this.handlePress(this.props.to)}>
                <View style={styles.menuBox}>
                    <Icon
                        name={this.props.iconName ? this.props.iconName : "question"}
                        type='font-awesome-5'
                        color='#C6BDFF'
                        size={SIZES.width * (15 / 100)}
                    />
                    <View style={styles.bottomLabel}>
                        <Text style={styles.bottomLabelFont}>{this.props.buttonLabel}</Text>
                    </View>
                </View>
            </TouchableWithoutFeedback>
                <Modal
                    isVisible={this.state.modalState}
                    animationIn="slideInDown"
                    animationOut="slideOutUp"
                >
                    <View style={{
                        flex: 1,
                        backgroundColor: COLORS.white,
                        borderRadius: SIZES.radius,
                    }}>
                        <View style={{
                            padding: 20,
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            <View style={{
                                marginTop: SIZES.margin
                            }}>
                                <Text style={{
                                    textAlign: 'center',
                                    marginBottom: 10,
                                    ...FONTS.h5
                                }}>โปรดดำเนินการยืนยันข้อมูล</Text>
                            </View>
                        
                            <Image 
                            style={{
                                width: SIZES.height * (20 / 100),
                                height: SIZES.height * (20 / 100)
                            }}
                            source={images.verify_card}></Image>
                            <Text style={{
                                textAlign: 'center',
                                color: COLORS.red,
                            }}>ยืนยันตัวตนการขับขี่และรับส่งผู้โดยสาร</Text>

                        </View>
                        <View style={{
                            position: 'absolute',
                            bottom: 50,
                            alignItems: 'center',
                            width: '100%'
                        }}>
                            <TouchableOpacity style={{
                                marginBottom: 10
                            }} onPress={() => console.log("test")}>
                                <Text style={{
                                    color: COLORS.bluesky,
                                    ...FONTS.h6
                                }}>ส่งข้อมูลเพื่อเปิดใช้งาน</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this.setState({ modalState: false})}>
                                <Text style={{
                                    color: COLORS.lightGray2,
                                    ...FONTS.h6
                                }}>ปิด</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </>
        );
    }
}

const styles = StyleSheet.create({
    menuBox: {
        justifyContent: 'flex-end',
        width: '100%',
        height: SIZES.height * (20 / 100),
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
        justifyContent: 'center',
        alignItems: 'center'
    },
    bottomLabel: {
        margin: 10,
    },
    bottomLabelFont: {
        textAlign: 'center',
        borderRadius: SIZES.radius,
        padding: SIZES.padding,
        backgroundColor: COLORS.white,
        color: COLORS.darkpurple,
        ...FONTS.h4
    }
})

export default MenuButton;