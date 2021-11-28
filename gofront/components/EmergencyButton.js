import React, { Component } from "react";
import { View, Text } from "react-native";
import { Icon } from "react-native-elements";
import { COLORS, SIZES } from "../constants";
import Geolocation from "@react-native-community/geolocation";
import { requestGeolocationPermission } from "../utils";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

class EmergencyButton extends Component {
  constructor(props) {
    super(props);
    this.interval = null;
    this.state = {
      sendMessageState: false,
      secretCode: null,
    };
  }

  handleEmergency = async () => {
    console.log("handleEmergency", this.props.user.emergency_phone_number);
    var user = this.props.user;
    this.setState({ sendMessageState: true });
    var driverId;
    var license_plate;
    var brand;
    var model;
    var color;
    var count = 0;
    console.log("driver Id:" + this.props.driverId);
    if (this.props.driverId !== null) {
      console.log("this case");
      axios
        .post(
          "/profile",
          {
            user: { user_id: this.props.driverId },
          },
          {
            headers: {
              authorization:
                "Bearer " + (await AsyncStorage.getItem("session_token")),
            },
          }
        )
        .then((e) => {
          console.log(e.data);
          var driverProfile = e.data;
          license_plate = driverProfile.license_plate;
          brand = driverProfile.brand;
          model = driverProfile.model;
          color = driverProfile.color;
        })
        .catch((e) => {
          console.log(e);
        });
    } else {
      license_plate = user.license_plate;
      brand = user.brand;
      model = user.model;
      color = user.color;
    }

    requestGeolocationPermission().then((e) => {
      if (this.state.sendMessageState === true) {
        this.interval = setInterval(function () {
          Geolocation.getCurrentPosition(
            (position) => {
              var location = {
                lat: position.coords.latitude,
                long: position.coords.longitude,
              };
              console.log(location);
              axios.post("/emergency", {
                emergencyPacket: {
                  emergency_phone_number: user.emergency_phone_number,
                  message: location,
                  phone_number: user.phone_number,
                  first_name: user.first_name,
                  last_name: user.last_name,
                  license_plate: license_plate,
                  brand: brand,
                  model: model,
                  color: color,
                  license_plate: license_plate,
                },
              });
            },
            (error) => {
              console.log(error.code, error.message);
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
          );
          count++;
          console.log("message " + count + " sent");
        }, 20000);
      }
    });
  };

  stop = () => {
    console.log("stop");
    clearInterval(this.interval);
    this.setState({ sendMessageState: false });
    console.log(this.state.sendMessageState);
  };

  render() {
    return (
      <>
        {this.state.sendMessageState === false ? (
          <View>
            <Icon
              onPress={() => this.handleEmergency()}
              name="alert-outline"
              type="ionicon"
              size={30}
              color={COLORS.black}
            />
            <Text>ขอความช่วยเหลือ</Text>
          </View>
        ) : (
          <View>
            <Icon
              onPress={() => this.stop()}
              name="alert-outline"
              type="ionicon"
              size={30}
              color={COLORS.red}
            />
            <Text>กำลังขอความช่วยเหลือ</Text>
          </View>
        )}
      </>
    );
  }
}
export default EmergencyButton;
