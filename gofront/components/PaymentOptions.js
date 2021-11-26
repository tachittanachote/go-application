import React, { Component } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Modal from "react-native-modal";
import { COLORS, FONTS, SIZES } from '../constants';
import { RadioButton } from 'react-native-paper';

class PaymentOptions extends Component {

    constructor(props) {
        super(props);
        this.state = {
            toggleState: false,
            paymentOption: 'cash',
        }
        this.toggleModal = this.toggleModal.bind(this);
    }

    toggleModal(state) {
        console.log(state)
        this.setState({ toggleState: state })
    }

    paymentOptionFormatter(paymentOption) {
        switch (paymentOption) {
            case 'cash': {
                this.props.onPaymentOptionCallback(paymentOption)
                return 'ชำระด้วยเงินสด'
            }
            case 'wallet': {
                this.props.onPaymentOptionCallback(paymentOption)
                return 'ขำระด้วยกระเป๋าตัง Go Wallet'
            }
        }
    }

    render() {
        return (
            <>
                <View>
                    <View style={{
                        flexDirection: 'row'
                    }}>
                        <View style={{
                            flex: 1,
                        }}>
                            <Text style={{
                                ...FONTS.body4
                            }}>{this.paymentOptionFormatter(this.state.paymentOption)}</Text>
                        </View>
                        <View>
                            <TouchableOpacity onPress={() => this.toggleModal(true)}>
                                <Text style={{
                                    color: COLORS.bluesky,
                                    ...FONTS.h6
                                }}>เปลี่ยน</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                <Modal
                    isVisible={this.state.toggleState}
                    animationIn="slideInDown"
                    animationOut="slideOutUp"
                >
                    <View style={{
                        flex: 1,
                        backgroundColor: COLORS.white,
                        borderRadius: SIZES.radius,
                    }}>
                        <View style={{
                            padding: 20
                        }}>
                            <View style={{
                                marginTop: SIZES.margin
                            }}>
                                <Text style={{
                                    marginBottom: 10,
                                    ...FONTS.h5
                                }}>เลือกช่องทางการชำระเงิน</Text>
                                <RadioButton.Group onValueChange={(value) => this.setState({ paymentOption: value })} value={this.state.paymentOption}>
                                    <TouchableOpacity onPress={() => this.setState({ paymentOption: 'cash' })}>
                                    <View style={{
                                            alignItems: 'center',
                                        flexDirection: 'row'
                                    }}>
                                        <RadioButton value="cash" />
                                        <Text>เงินสด</Text>
                                        
                                    </View>
                                    </TouchableOpacity>
                                    {this.props.balance > this.props.estPrice  ?
                                    <TouchableOpacity onPress={() => this.setState({ paymentOption: 'wallet' })}>
                                    <View style={{
                                        alignItems: 'center',
                                        flexDirection: 'row'
                                    }}>
                                        <RadioButton value="wallet" />
                                        <Text>Go Wallet</Text>
                                        <Text> (คงเหลือ: {this.props.balance} บาท)</Text>
                                        
                                    </View>
                                    </TouchableOpacity>
                                    :
                                        <View style={{
                                            alignItems: 'center',
                                            flexDirection: 'row'
                                        }}>
                                            <RadioButton disabled={true} />
                                            <Text>Go Wallet</Text>
                                            <Text style={{
                                                color: COLORS.red,
                                            }}> ยอดเงินไม่เพียงพอ ({this.props.balance} บาท)</Text>

                                        </View>
                                    }
                                </RadioButton.Group>
                            </View>
                        </View>
                        <View style={{
                            position: 'absolute',
                            bottom: 20,
                            alignItems: 'center',
                            width: '100%'
                        }}>
                            <TouchableOpacity onPress={() => this.toggleModal(false)}>
                                <Text style={{
                                    color: COLORS.bluesky,
                                    ...FONTS.h6
                                }}>ตกลง</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </>
        )
    }
}

export default PaymentOptions;