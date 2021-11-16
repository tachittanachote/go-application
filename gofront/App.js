import React, { Component } from 'react';
import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  Home,
  Login,
  Register,
  RequestOtp,
  ConfirmOtp,
  Lobby,
  Profile,
  DriverScreen,
  PassengerScreen,
  WaitScreen,
  TravelScreen,
  DrivingScreen,
} from './screens';
import { UserContext } from './context';
import axios from 'axios';
import { requireAuth } from './middleware';

const Stack = createStackNavigator();

class App extends Component {

  static contextType = UserContext

  componentDidMount() {

    console.log(this.context)

    axios.post('/device/check'
    ).then((e) => {
      console.log(e.data.device_id, "get from device check")
      AsyncStorage.setItem("device_id", e.data.device_id);
      AsyncStorage.setItem("device_token", e.data.device_token);
    }).catch((e) => {
      console.log(e)
    })
  }

  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS
          }}
          initialRouteName={this.context.initPage}
          //initialRouteName="Home"
          >
          <Stack.Screen name="Home" component={requireAuth(Home)} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Register" component={Register} />
          <Stack.Screen name="RequestOtp" component={RequestOtp} />
          <Stack.Screen name="ConfirmOtp" component={ConfirmOtp} />
          <Stack.Screen name="Lobby" component={Lobby} />
          <Stack.Screen name="Profile" component={Profile} />
          <Stack.Screen name="DriverScreen" component={DriverScreen} />
          <Stack.Screen name="PassengerScreen" component={PassengerScreen} />
          <Stack.Screen name="WaitScreen" component={WaitScreen} />
          <Stack.Screen name="TravelScreen" component={TravelScreen} />
          <Stack.Screen name="DrivingScreen" component={DrivingScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}

export default App;
