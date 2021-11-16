import React, { Component } from 'react';
import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

import { AppHeader } from '../components';
import { COLORS, SIZES, FONTS, images } from '../constants';

class Home extends Component {
  renderBottomButton() {
    return (
      <View
        style={{
          width: '100%',
          position: 'absolute',
          bottom: 0,
          padding: SIZES.padding * 2,
        }}>
        <TouchableWithoutFeedback
          onPress={() => this.props.navigation.navigate('Login')}>
          <View
            style={{
              width: '100%',
              borderRadius: SIZES.radius,
              padding: SIZES.padding * 2,
              marginBottom: SIZES.margin,
              backgroundColor: COLORS.primary,
            }}>
            <Text
              style={{
                textAlign: 'center',
                color: COLORS.white,
                ...FONTS.h4,
              }}>
              เข้าสู่ระบบ
            </Text>
          </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback
          onPress={() => this.props.navigation.navigate('RequestOtp')}>
          <View
            style={{
              width: '100%',
              borderWidth: 1,
              borderColor: COLORS.lightGray,
              borderRadius: SIZES.radius,
              padding: SIZES.padding * 2,
            }}>
            <Text
              style={{
                textAlign: 'center',
                color: COLORS.lightGray,
                ...FONTS.h4,
              }}>
              ยังไม่เคยใช้ Go? ลงทะเบียนเลย!
            </Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <AppHeader></AppHeader>
        <View
          style={{
            height: SIZES.height * (30 / 100),
            width: '100%',
            position: 'absolute',
            marginTop: SIZES.height * (30 / 100),
            zIndex: -1,
          }}>
          <Image
            source={images.park_car}
            resizeMode="cover"
            style={styles.parkCar}></Image>
        </View>
        {this.renderBottomButton()}
        <View
          style={{
            height: SIZES.height * (30 / 100),
            width: '100%',
            position: 'absolute',
            bottom: 0,
            zIndex: -1,
          }}>
          <Image
            source={images.fancy_bottom}
            resizeMode="cover"
            style={styles.fancyBottom}></Image>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.purple,
  },
  fancyBottom: {
    width: '100%',
    height: '100%'
  },
  parkCar: {
    width: '100%',
    height: '100%'
  },
});

export default Home;
