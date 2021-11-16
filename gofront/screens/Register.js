import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { Component } from 'react';
import { SafeAreaView, Text, View, StyleSheet, TextInput, TouchableOpacity } from 'react-native';

import { BackButton } from '../components';
import { COLORS, SIZES, FONTS } from '../constants';
import { UserContext } from '../context';

class Register extends Component {

  static contextType = UserContext;

  constructor(props) {
    super(props);
    this.state = {
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '0954790710',
      isNameError: false,
      isEmailError: false
      //phoneNumber: this.props.route.params.phoneNumber
    }
  }

  componentDidMount() {
    console.log(this.props.route.params.phoneNumber)
  }

  handleFirstName = (text) => {
    if (text.length === 0) {
      this.setState({ isNameError: true })
    }
    this.setState({ firstName: text }, () => {
      if (this.state.firstName.length > 0 && this.state.lastName.length > 0) {
        this.setState({ isNameError: false })
      }
    })
  }

  handleLastName = (text) => {
    if (text.length === 0) {
      this.setState({ isNameError: true })
    }
    this.setState({ lastName: text }, () => {
      if (this.state.firstName.length > 0 && this.state.lastName.length > 0) {
        this.setState({ isNameError: false })
      }
    })
  }

  handleEmail = (text) => {
    if (text.length === 0) {
      this.setState({ isEmailError: true })
    } else {
      this.setState({ isEmailError: false })
    }
    this.setState({ email: text })
  }

  async confirmRegister() {

    console.log(await AsyncStorage.getItem('access_token'))

    if (this.state.firstName.length <= 0 || this.state.lastName.length <= 0) {
      this.setState({ isNameError: true })
    }
    if (this.state.email.length <= 0) {
      this.setState({ isEmailError: true })
    }
    
    if(this.state.firstName.length > 0 && this.state.lastName.length > 0 && this.state.email.length > 0) {
      var user = {
        email: this.state.email,
        first_name: this.state.firstName,
        last_name: this.state.lastName,
        phone_number: this.props.route.params.phoneNumber,
        device_id: await AsyncStorage.getItem("device_id"),
      }
      
      axios.post('/auth/register', {
        user: user
      }, {
        headers: {
          authorization: 'Bearer ' + await AsyncStorage.getItem('access_token')
        }
    }).then((e) => {
        if(e.status === 200 && e.data.status === "success") {
          AsyncStorage.setItem("session_token", e.data.session_token)
          AsyncStorage.setItem("refresh_token", e.data.refresh_token)
          this.context.newRegisterInit().then((e) => {
            console.log("REGISTER DONEEEEEEEE")
            this.props.navigation.navigate("Lobby")
          })
          
        }
      }).catch((e) => {
        console.log(e)
      })

    }
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <BackButton navigation={this.props.navigation}></BackButton>
        <View
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            paddingTop: SIZES.padding * 2,
            paddingRight: SIZES.padding * 2,
          }}>
          <TouchableOpacity onPress={() => this.confirmRegister()}>
            <Text style={{
              color: COLORS.primary,
              ...FONTS.h5
            }}>
              ถัดไป
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{
          marginTop: SIZES.top - 10
        }}>
          <Text style={{
            ...FONTS.h4
          }}>ชื่อ - นานสกุล</Text>
          <View style={{
            flexDirection: 'row',
          }}>
            <TextInput
              style={styles.inputFirstName}
              onChangeText={(text) => this.handleFirstName(text)}
              placeholder="Helen"
              keyboardType="default"
              autoFocus={true}
              maxLength={42}
            />
            <TextInput
              style={styles.inputLastName}
              onChangeText={(text) => this.handleLastName(text)}
              placeholder="Hex"
              keyboardType="default"
              autoFocus={true}
              maxLength={42}
            />
          </View>

          {this.state.isNameError &&
            <Text style={{
              color: COLORS.red,
              ...FONTS.body2
            }}>โปรดใส่ข้อมูลในช่องนี้</Text>
          }

          <Text style={{
            marginTop: SIZES.margin * 3,
            ...FONTS.h4
          }}>ที่อยู่อีเมล</Text>
          <Text style={{
            color: COLORS.lightGray,
            ...FONTS.body3
          }}>เราจะส่งอีเมลสำหรับยืนยันบัญชีให้คุณ</Text>
          <TextInput
            style={styles.inputEmail}
            onChangeText={(text) => this.handleEmail(text)}
            placeholder="example@email.com"
            keyboardType="email-address"
            maxLength={64}
          />
        </View>

        {this.state.isEmailError &&
          <Text style={{
            color: COLORS.red,
            ...FONTS.body2
          }}>โปรดใส่ข้อมูลในช่องนี้</Text>
        }

      </SafeAreaView>
    );
  }
}

export default Register;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: COLORS.white,
  },
  inputFirstName: {
    width: '50%',
    ...FONTS.h1
  },
  inputLastName: {
    width: '50%',
    ...FONTS.h1
  },
  inputEmail: {
    marginTop: SIZES.margin * 6,
    ...FONTS.h1
  }
});
