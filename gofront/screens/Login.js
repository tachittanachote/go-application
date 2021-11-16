import React, { Component } from 'react';
import {
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';
import { Icon } from 'react-native-elements';
import { AppHeader } from '../components';

import { COLORS, SIZES, FONTS } from '../constants';

class Login extends Component {
  renderBackButton() {
    return (
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          paddingTop: SIZES.padding * 2,
          paddingLeft: SIZES.padding,
        }}>
        <Icon
          onPress={() => this.props.navigation.goBack()}
          name="chevron-back-outline"
          type="ionicon"
          size={30}
          color={COLORS.white}
        />
      </View>
    );
  }

  renderMobileSignButton() {
    return (
      <View
        style={{
          flex: 1,
          width: '100%',
          position: 'absolute',
          bottom: 0,
          padding: SIZES.padding * 2,
        }}>
        <TouchableWithoutFeedback
          onPress={() => this.props.navigation.navigate('RequestOtp')}>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              width: '100%',
              padding: SIZES.padding * 1.75,
              borderRadius: SIZES.radius,
              backgroundColor: COLORS.white,
            }}>
            <Icon name="call-outline" type="ionicon" color={COLORS.lightGray} />
            <Text
              style={{
                flex: 1,
                textAlign: 'center',
                ...FONTS.body3,
              }}>
              ดำเนินการต่อด้วยเบอร์โทรศัพท์
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
        {this.renderBackButton()}
        {this.renderMobileSignButton()}
      </SafeAreaView>
    );
  }
}

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.purple,
  },
});
