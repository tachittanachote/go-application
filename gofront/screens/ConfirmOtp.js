import React, { Component } from 'react';
import { SafeAreaView, Text, View, StyleSheet, TextInput, TouchableWithoutFeedback, Alert } from 'react-native';
import { BackButton } from '../components';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS, FONTS, SIZES } from '../constants';
import axios from 'axios';
import { UserContext } from '../context';

class ConfirmOtp extends Component {

  static contextType = UserContext;

  constructor(props) {
    super(props);
    this.state = {
      attempt: 0,
      inputOtp: null
    }
    this.textReference = null
  }

  componentDidMount() {
    
  }

  async requestOtp() {
    axios.post('/otp/request', {
      phone_number: this.props.route.params.phoneNumber
    },
      {
        headers:
          { authorization: "Bearer " + await AsyncStorage.getItem("device_token") }
      }).
      then((e) => {
        console.log(e.data, "Request Again Otp")
        if (e.data.status === "success") {
          AsyncStorage.setItem("referenceCode", e.data.ref)
          alert("Sent")
        } else {
          Alert.alert("ERROR", "ไม่สามารถดำเนินการได้")
        }
      }).catch((e) => {
        console.log(e)
      })
  }

  renderRequest() {
    return (
      <View style={{
        position: 'absolute',
        bottom: 0,
        margin: 20,
      }}>
        <View>
        <Text style={{
          marginBottom: 5,
          ...FONTS.body2,
        }}>ยังไม่ได้รับใช่ไหม</Text>
        <TouchableWithoutFeedback onPress={() => this.requestOtp()}>
        <Text style={{
          color: '#448FFF',
          marginBottom: 5,
          ...FONTS.h4
        }}>ส่งคำขอรหัสใหม่</Text>
        </TouchableWithoutFeedback>
        <Text style={{
          marginBottom: 5,
          ...FONTS.h4
        }}>ส่งคำขอรหัสใหม่ ภายใน 0:17</Text>
        </View>
      </View>
    )
  }

  handleOtp = async (value) => {
    this.setState({ inputOtp: value })
    if (value.length === 6) {
      axios.post('/otp/verify', {
        code: value, reference_code: await AsyncStorage.getItem("referenceCode")
      },
        {
          headers:
            { 
              authorization: "Bearer " + await AsyncStorage.getItem("device_token") 
            }
        })
        .then((e) => {
          if (e.data.status === "success") {
            console.log(e.data, "Access Token!")
            AsyncStorage.setItem("access_token", e.data.access_token)
            if (e.data.isNewUser !== undefined && e.data.isNewUser === true) {
              this.props.navigation.navigate('Register', {
                phoneNumber: this.props.route.params.phoneNumber
              })
            } else {
              this.LoginOTP();
            }
          } else {
            console.log("not success")
            this.textReference.clear()
            this.setState({ attempt: this.state.attempt + 1, inputOtp: null }, () => {
              console.log(this.state.attempt)
              if (this.state.attempt >= 3) {
                Alert.alert("คุณลองยืนยันหลายครั้งมากเกินไป")
                this.props.navigation.navigate('Home')
              }
            })
          }

        }).catch((e) => {
          console.log(e)
        })
    }
  }

  async LoginOTP() {
    this.context.setOffInit()
    console.log("Login !!!!!!")
    axios.post("/auth/login", {}, {
      headers: { 
        authorization: "Bearer " + await AsyncStorage.getItem("access_token") 
      }
    }).then((e) => {
      if(e.data.status === "success") {
        AsyncStorage.setItem("session_token", e.data.session_token)
        AsyncStorage.setItem("refresh_token", e.data.refresh_token)
        this.context.updateContext()
        this.props.navigation.navigate("Lobby")
      } else {
        Alert.alert("ERROR", "เกิดข้อผิดพลาดกรุณาลองใหม่อีกครั้ง")
        this.props.navigation.navigate("Home")
      }
    }).catch((e) => {
      console.log(e)
    })
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        {this.renderRequest()}
        <BackButton navigation={this.props.navigation}></BackButton>
        <View
          style={{
            marginTop: SIZES.margin * 3,
            padding: SIZES.padding - 10,
          }}>
          <Text
            style={{
              ...FONTS.body2,
            }}>
            ใส่รหัส 6 หลักส่งไปยัง
          </Text>
          <Text
            style={{
              ...FONTS.h4,
            }}>
            {this.props.route.params.phoneNumber}
          </Text>
          <TextInput
            style={styles.input}
            value={this.state.inputOtp}
            maxLength={6}
            onChangeText={this.handleOtp}
            placeholder="000000"
            keyboardType="number-pad"
            autoFocus={true}
            ref={input => { this.textReference = input }}
          />

          {this.state.attempt > 0 && this.state.inputOtp === null &&
            <Text style={{
              color: COLORS.red,
              marginTop: SIZES.margin * 2,
              ...FONTS.body2
            }}>รหัสไม่ถูกต้อง คุณสามารถลองได้อีก {this.state.attempt} ครั้ง</Text>
          }

        </View>
      </SafeAreaView>
    );
  }
}

export default ConfirmOtp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: COLORS.white,
  },
  input: {
    marginTop: SIZES.margin * 5,
    ...FONTS.h1
  }
});
