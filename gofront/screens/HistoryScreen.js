import React, { Component } from "react";
import {
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  ScrollView,
  Image,
  TouchableWithoutFeedback,
} from "react-native";
import { Icon } from "react-native-elements";
import axios from "axios";
import Geolocation from "@react-native-community/geolocation";
import moment from "moment";

import { CircleMenu, Slider } from "../components";
import MenuButton from "../components/MenuButton";
import { COLORS, FONTS, SIZES, MAPS, images } from "../constants";
import { UserContext } from "../context";
import AsyncStorage from "@react-native-async-storage/async-storage";

class HistoryScreen extends Component {
  static contextType = UserContext;

  constructor(props) {
    super(props);
    this.state = {
      history: null,
    };
  }

  componentDidMount = () => {
    this.checkHistory();
  };

  showInfo = (history) => {
    console.log("button");
    this.props.navigation.navigate("HistoryInfoScreen", {
      history: history,
    });
  };

  checkPlace = async (latlong) => {
    return new Promise(async (resolve, reject) => {
      let coordinates = latlong.split(", ");
      axios
        .post(
          "/location/place",
          {
            coordinates: {
              latitude: coordinates[0],
              longitude: coordinates[1],
            },
          },
          {
            headers: {
              authorization:
                "Bearer " + (await AsyncStorage.getItem("session_token")),
            },
          }
        )
        .then((e) => {
          console.log(e.data.name);
          if (e.data.name == undefined) {
            resolve("unamed road");
          }
          resolve(e.data.name);
        })
        .catch((e) => {
          console.log(e);
        });
    });
  };

  checkHistory = async () => {
    let allData = null;
    axios
      .post(
        "/history",
        {
          user: {
            id: this.context.user.user_id,
          },
        },
        {
          headers: {
            authorization:
              "Bearer " + (await AsyncStorage.getItem("session_token")),
          },
        }
      )
      .then(async (e) => {
        //console.log(e.data);
        //console.log(e.status);
        if (e.status === 200) {
          for (let i = 0; i < e.data.length; i++) {
            if (e.data[i].status === "done") {
              e.data[i].originName = await this.checkPlace(e.data[i].origin);
              e.data[i].destinationName = await this.checkPlace(
                e.data[i].destination
              );
            }
          }
          ////////////
          allData = e.data;
        }
        //console.log(this.state.history)
      })
      .then(async () => {
        //console.log(allData)
        this.setState({
          history: allData,
        });
      })
      .catch((e) => {
        console.log(e);
      });
  };

  checkType = (type) => {
    let usertype;
    if (type === "passenger") {
      usertype = "ผู้โดยสาร";
    } else {
      usertype = "ผู้ขับขี่";
    }
    return (
      <Text
        style={{
          color: COLORS.lightGray,
          ...FONTS.body4,
        }}
      >
        {usertype}
      </Text>
    );
  };

  checkStatusColor = (status) => {
    if (status === "progress") {
      return (
        <Text
          style={{
            backgroundColor: "#f008",
            color: COLORS.lightGray,
            ...FONTS.body4,
          }}
        >
          {status}
        </Text>
      );
    } else {
      return (
        <Text
          style={{
            backgroundColor: "#b6d7a8",
            color: COLORS.lightGray,
            ...FONTS.body4,
          }}
        >
          {status}
        </Text>
      );
    }
  };

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <Text
          style={{
            color: COLORS.lightGray2,
            ...FONTS.h2,
            padding: 5,
          }}
        >
          ประวัติการเดินทาง
        </Text>
        {this.state.history ? (
          <ScrollView>
            {this.state.history !== null &&
              this.state.history
                .filter((history) => history.status !== "progress")
                .map((history, index) => (
                  <TouchableWithoutFeedback
                    key={index}
                    onPress={() => this.showInfo(history)}
                  >
                    <View
                      style={{
                        //top: SIZES.height * (20 / 100) - 5,

                        backgroundColor: COLORS.white,
                        //height: 85,
                        width: "97%",
                        zIndex: 10,
                        shadowColor: "#000",
                        elevation: 4,
                        alignSelf: "center",
                        borderRadius: 8,
                        justifyContent: "center",
                        padding: 10,
                        margin: 5,
                      }}
                    >
                      <View
                        style={{
                          flex: 1,
                          flexDirection: "row",
                        }}
                      >
                        <View
                          style={{
                            justifyContent: "center",
                          }}
                        >
                          <Text
                            style={{
                              color: COLORS.lightGray,
                              ...FONTS.body4,
                            }}
                          >
                            {this.checkStatusColor(history.status)}
                            {moment(history.created_at).format(
                              "DD/MM/YYYY HH:mm"
                            )}
                          </Text>
                          <Text
                            style={{
                              color: COLORS.lightGray,
                              ...FONTS.body4,
                            }}
                          >
                            สถานะ : {this.checkType(history.type)}
                          </Text>

                          <Text
                            style={{
                              color: COLORS.lightGray2,
                              ...FONTS.h4,
                            }}
                          >
                            <Image
                              source={images.origin_icon}
                              style={{ height: 20, width: 20 }}
                            ></Image>
                            {history.originName}
                          </Text>
                          <Text
                            style={{
                              color: COLORS.lightGray2,
                              ...FONTS.h4,
                            }}
                          >
                            <Image
                              source={images.destination_icon}
                              style={{ height: 20, width: 20 }}
                            ></Image>
                            {history.destinationName}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </TouchableWithoutFeedback>
                ))}
          </ScrollView>
        ) : (
          <View>
            <Text style={{ justifyContent: "center", alignSelf: "center"}}>
              กำลังค้นหา
            </Text>
          </View>
        )}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  headerBackground: {
    height: SIZES.height * (25 / 100),
    backgroundColor: COLORS.primary,
    paddingBottom: SIZES.padding * 3,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 1,
  },
});

export default HistoryScreen;
