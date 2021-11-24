import React, { Component } from 'react';
import { SafeAreaView, View, StyleSheet, Text, TextInput, TouchableOpacity, Alert, TouchableWithoutFeedback, Image } from 'react-native'
import CheckBox from '@react-native-community/checkbox'

import Omise from 'omise-react-native';
import { BackButton } from '../../components';
import { COLORS, FONTS, SIZES } from '../../constants';
import axios from 'axios'
import { ScrollView } from 'react-native-gesture-handler';
import moment from 'moment';

Omise.config('pkey_test_5pwlho38cug2ym4yiao', '2017-11-02');

class PromptPayScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            qrState: 0,
            amount: null,
            confirmAmount: false,
            confirmUsage: false,
            confirmTransferTime: false,
            confirmBtnColor: COLORS.lightGray2,
            accepted: false,
            isLoadQRCode: false,
            QRCode: null,
            sourceId: null,
            expires_at: null,
        }
    }

    componentDidMount() {
        this.checkPendingTransaction()
    }

    checkPendingTransaction() {
        axios.post('/omise/check').then((resp) => {
            
        }).catch((e) => {
            console.log(e)
        })
    }

    createPromptPaySource = async () => {
        const omiseResponse = await Omise.createSource({
            'type': 'promptpay',
            "amount": this.state.amount * 100,
            "currency": "thb"
        });


        axios.post('/omise/create', {
            amount: omiseResponse.amount,
            source_id: omiseResponse.id,
            currency: omiseResponse.currency
        }).then((res) => {
            if (res.data.status === 'success') {
                this.setState({
                    isLoadQRCode: true,
                    sourceId: res.data.qr_id,
                    expires_at: res.data.expires_at
                }, () => {
                    this.setState({ QRCode: res.data.image_uri });
                })
            }
        }).catch((e) => {
            console.log("C", e)
        })
    }

    handleCheckbox(value, checkboxId) {
        switch (checkboxId) {
            case 1: {
                this.setState({ confirmAmount: value }, () => {
                    this.acceptedAll()
                });
                break;
            }
            case 2: {
                this.setState({ confirmUsage: value }, () => {
                    this.acceptedAll()
                });
                break;
            }
            case 3: {
                this.setState({ confirmTransferTime: value }, () => {
                    this.acceptedAll()
                });
                break;
            }
        }
    }

    acceptedAll() {
        if (this.state.confirmAmount && this.state.confirmTransferTime && this.state.confirmUsage && this.state.amount && this.state.amount >= 20) {
            this.setState({ confirmBtnColor: COLORS.purple, accepted: true })
        } else {
            this.setState({ confirmBtnColor: COLORS.lightGray2, accepted: false })
        }
    }

    toggleCheckbox(checkboxId) {
        switch (checkboxId) {
            case 1: {
                if (this.state.confirmAmount) {
                    this.setState({ confirmAmount: false }, () => {
                        this.acceptedAll()
                    });
                } else {
                    this.setState({ confirmAmount: true }, () => {
                        this.acceptedAll()
                    });
                }
                break;
            }
            case 2: {
                if (this.state.confirmUsage) {
                    this.setState({ confirmUsage: false }, () => {
                        this.acceptedAll()
                    });
                } else {
                    this.setState({ confirmUsage: true }, () => {
                        this.acceptedAll()
                    });
                }
                break;
            }
            case 3: {
                if (this.state.confirmTransferTime) {
                    this.setState({ confirmTransferTime: false }, () => {
                        this.acceptedAll()
                    });
                } else {
                    this.setState({ confirmTransferTime: true }, () => {
                        this.acceptedAll()
                    });
                }
                break;
            }
        }
    }

    confirmPayment() {
        if (this.state.accepted) {
            Alert.alert(
                'ยืนยันการฝากเงิน',
                `ยืนยันการฝากเงินจำนวน ${this.state.amount} บาท ?`,
                [
                    {
                        text: 'Cancel'
                    },
                    {
                        text: 'Yes', onPress: () =>
                            this.createPromptPaySource()
                    },
                ],
                { cancelable: false }
            );

        }
    }

    renderRequireAmount() {
        return (
            <View style={styles.bg}>

                <View>
                    <Text>ระบุจำนวนเงินที่ต้องการเติม (ขั้นต่ำ 20 บาท)</Text>
                    <TextInput
                        onChangeText={(e) => this.setState({ amount: e }, () => {
                            this.acceptedAll()
                        })}
                        keyboardType='numeric'
                        style={{
                            padding: SIZES.margin,
                            borderRadius: SIZES.margin,
                            marginTop: SIZES.margin,
                            backgroundColor: COLORS.lightGray3
                        }}></TextInput>
                </View>

                <View style={{
                    marginTop: SIZES.margin
                }}>
                    <Text style={{
                        ...FONTS.h5
                    }}>โปรดอ่านและยอมรับเงื่อนไขการเติมเงินทั้งหมด</Text>
                    <TouchableOpacity style={styles.checkbox} onPress={() => this.toggleCheckbox(1)}>
                        <CheckBox
                            value={this.state.confirmAmount}
                            onValueChange={(e) => this.handleCheckbox(e, 1)}
                        />
                        <Text style={styles.label}>โอนเงินตรงตามยอดที่ระบุ</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.checkbox} onPress={() => this.toggleCheckbox(2)}>
                        <CheckBox
                            value={this.state.confirmUsage}
                            onValueChange={(e) => this.handleCheckbox(e, 2)}
                        />
                        <Text style={styles.label}>QR Code นี้ใช้งานได้ 1 ครั้งเท่านั้น (ห้ามใช้ซ้ำ)</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.checkbox} onPress={() => this.toggleCheckbox(3)}>
                        <CheckBox
                            value={this.state.confirmTransferTime}
                            onValueChange={(e) => this.handleCheckbox(e, 3)}
                        />
                        <Text style={styles.label}>งดโอนช่วงเวลา 23:30 - 00:00 น.</Text>
                    </TouchableOpacity>
                </View>

                <View style={{
                    borderRadius: SIZES.radius2,
                    marginTop: 20,
                    width: '100%',
                    backgroundColor: this.state.confirmBtnColor,
                    padding: SIZES.padding * 1.5,
                }}>
                    <TouchableWithoutFeedback onPress={() => this.confirmPayment()}>
                        <View style={{
                            alignItems: 'center'
                        }}>
                            <Text style={{
                                color: COLORS.white,
                            }}>ยืนยันการเติมเงิน</Text>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </View>
        )
    }

    renderQRCode(image_url, amount, source_id, expires) {

        return (
            <View style={styles.bgQR}>
                <View style={{
                    backgroundColor: COLORS.lightRed,
                    position: 'absolute',
                    top: 20,
                    padding: SIZES.padding,
                    alignItems: 'center',
                    right: 0,
                    width: '100%',
                }}>
                    <Text style={{
                        color: COLORS.red
                    }}>การฝากเงินจะถูกปฎิเสธ หากไม่ฝากตามเงื่อนไข</Text>
                </View>

                <View style={{
                    marginTop: 70,
                    alignItems: 'center',
                }}>
                    <Image source={{
                        width: SIZES.height * (40 / 100),
                        height: SIZES.height * (60 / 100),
                        resizeMode: 'contain',
                        uri: image_url
                    }}

                        style={{
                            marginBottom: SIZES.margin
                        }}
                    />

                    <Text style={{ marginBottom: 20, color: COLORS.red }}>รายการฝากนี้ใช้ได้ถึง {moment(this.state.expires_at).format('DD/MM/YYYY HH:mm')}</Text>

                    <View style={styles.textDetail}>
                        <Text style={{
                            flex: 1,
                        }}>จำนวนเงิน</Text>
                        <Text style={{
                            flex: 1,
                            textAlign: 'right'
                        }}>{amount} บาท</Text>
                    </View>
                    <View style={styles.textDetail}>
                        <Text style={{
                            flex: 1,
                        }}>หมายเลขที่อ้างอิง</Text>
                        <Text style={{
                            flex: 1,
                            textAlign: 'right'
                        }}>{source_id}</Text>
                    </View>
                </View>

                <View style={styles.buttonContainer}>
                    <TouchableWithoutFeedback
                    onPress={() => console.log("OK")}>

                        <View style={{
                            alignItems: 'center',
                            borderRadius: SIZES.radius2,
                            width: '100%',
                            backgroundColor: COLORS.green,
                            padding: SIZES.padding * 1.5,
                        }}>
                            <Text style={{
                                color: COLORS.white,
                                ...FONTS.h5
                            }}>ดาวน์โหลด QR Code</Text>
                        </View>
                    </TouchableWithoutFeedback>

                    <TouchableWithoutFeedback
                        onPress={() => this.handleCancelDeposit()}>

                        <View style={{
                            alignItems: 'center',
                            borderRadius: SIZES.radius2,
                            width: '100%',
                            backgroundColor: COLORS.lightRed,
                            padding: SIZES.padding * 1.5,
                            marginTop: SIZES.margin - 5
                        }}>
                            <Text style={{
                                color: COLORS.red,
                                ...FONTS.h5
                            }}>ยกเลิกรายการ</Text>
                        </View>
                    </TouchableWithoutFeedback>

                </View>
            </View>
        )
    }

    handleCancelDeposit() {
        console.log("cancel")
    }

    render() {
        return (
            <SafeAreaView style={styles.container}>
                <BackButton navigation={this.props.navigation}></BackButton>
                <View style={{
                    marginTop: 10,
                    alignItems: 'center',
                    backgroundColor: COLORS.lightGray3,
                    width: '100%',
                    height: 40,
                }}>
                    <Text style={{
                        ...FONTS.h6
                    }}>เติมเงิน</Text>
                </View>

                <ScrollView>
                    {this.state.isLoadQRCode ? this.renderQRCode(this.state.QRCode, this.state.amount, this.state.sourceId, this.state.expires_at) : this.renderRequireAmount()}
                </ScrollView>

            </SafeAreaView>
        )
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: COLORS.lightGray3,
    },
    bg: {
        position: 'relative',
        padding: 10,
        marginTop: 5,
        flex: 1,
        backgroundColor: COLORS.white,
        borderRadius: 10,
    },
    bgQR: {
        position: 'relative',
        marginTop: 5,
        flex: 1,
        backgroundColor: COLORS.white,
        borderRadius: 10,
        paddingBottom: 20
    },
    checkbox: {
        marginTop: 10,
        flexDirection: 'row',
        alignItems: 'center'
    },
    label: {
        ...FONTS.h6,
        color: COLORS.red
    },
    textDetail: {
        flexDirection: 'row',
        paddingLeft: SIZES.padding * 2,
        paddingRight: SIZES.padding * 2,
    },
    buttonContainer: {
        marginTop: SIZES.margin * 2,
        paddingLeft: SIZES.padding * 2,
        paddingRight: SIZES.padding * 2,
    }
});


export default PromptPayScreen
