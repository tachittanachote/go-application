import React, { Component } from 'react';
import {
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { BackButton } from '../components';
import { COLORS, SIZES, FONTS } from '../constants';

class RequestOtp extends Component {

  constructor(props) {
    super(props);
    this.state = {
      errorMessage: [
        "เบอร์โทรศัพท์ไม่ถูกต้อง",
        "ใส่หมายเลขโทรศัพท์มือถือของคุณ"
      ],
      errorText: null,
      inputPhoneNumber: '',
    }
  }

  checkTextInput = () => {
    if(this.state.inputPhoneNumber.length === 0 || this.state.inputPhoneNumber.length !== 10 ) {
     this.setState({ errorText: this.state.errorMessage[0] })
     return false;
    }
    if(this.state.inputPhoneNumber.charAt(0) !== "0" || this.state.inputPhoneNumber.charAt(1) === "0") {
      this.setState({ errorText: this.state.errorMessage[0] })
      return false;
    }
    return true;
  }

  async requestOtp() {
    if(!this.checkTextInput()) return false;
    console.log("get in request otp", this.state.inputPhoneNumber, await AsyncStorage.getItem("device_token"))

    axios.post('/otp/request', {
      phone_number: this.state.inputPhoneNumber
    },
      {
        headers:
          { authorization: "Bearer " + await AsyncStorage.getItem("device_token") }
      }).
      then((e) => {
        console.log(e.data, "request OTP using device token")
        if (e.data.status === "success") {
          AsyncStorage.setItem("referenceCode", e.data.ref)
          this.props.navigation.navigate('ConfirmOtp',{
            phoneNumber: this.state.inputPhoneNumber,
          })
        } else {
          Alert.alert("ERROR", "ไม่สามารถดำเนินการได้")
        }
      }).catch((e) => {
        console.log(e)
      })


  }

  onChangeText(text) {
    if (text.length === 0) {
      return this.setState({ errorText: this.state.errorMessage[1] })
    }
    else {
      this.setState({ errorText: null })
    }
    this.setState({ inputPhoneNumber: text })
  }

  renderConfirmButton() {
    return (
      <View
        style={{
          width: '100%',
          position: 'absolute',
          bottom: 0,
          padding: SIZES.padding * 2,
        }}>
        <TouchableWithoutFeedback
          onPress={() => this.requestOtp()}
        >
          <View
            style={{
              flex: 1,
              width: '100%',
              padding: SIZES.padding * 1.75,
              borderRadius: SIZES.radius,
              backgroundColor: COLORS.primary,
            }}>
            <Text
              style={{
                flex: 1,
                textAlign: 'center',
                color: COLORS.white,
                ...FONTS.h4,
              }}>
              ยืนยัน
            </Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <BackButton navigation={this.props.navigation}></BackButton>
        <View
          style={{
            marginTop: SIZES.top,
            padding: SIZES.padding * 2,
          }}>
          <Text
            style={{
              marginBottom: SIZES.margin,
              ...FONTS.h3,
            }}>
            ยินดีตอนรับ! เบอร์โทรศัพท์ของคุณเบอร์อะไร?
          </Text>
          <Text
            style={{
              ...FONTS.body3,
            }}>
            คุณจำเป็นต้องมีเบอร์โทรศัพท์ เพื่อเข้าถึงการเดินทางและบริการอื่นๆ
            ของเรา
          </Text>
          <TextInput
            style={styles.input}
            placeholder="098 888 8888"
            keyboardType="number-pad"
            maxLength={10}
            autoFocus={true}
            onChangeText={(value) => this.onChangeText(value)
            }
          />
          <Text style={{
            color: COLORS.red,
            marginTop: SIZES.margin - 10,
            ...FONTS.body2
          }}>{this.state.errorText}</Text>
        </View>
        {this.renderConfirmButton()}
      </SafeAreaView>
    );
  }
}

export default RequestOtp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  input: {
    borderWidth: 1,
    borderRadius: SIZES.radius2,
    borderColor: COLORS.lightGray2,
    marginTop: SIZES.margin * 1.5,
    padding: 10,
    ...FONTS.h1,
  },
});
