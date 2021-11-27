import React, { Component } from "react";
import {
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  ScrollView,
  Image,
  TouchableWithoutFeedback,
  TextInput,
} from "react-native";
import { Icon } from "react-native-elements";
import axios from "axios";
import Geolocation from "@react-native-community/geolocation";
import Stars from "react-native-stars";

import { CircleMenu, Slider } from "../components";
import MenuButton from "../components/MenuButton";
import { COLORS, FONTS, SIZES, MAPS, images } from "../constants";
import { UserContext } from "../context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import moment from "moment";

class HistoryInfoScreen extends Component {
  static contextType = UserContext;

  constructor(props) {
    super(props);
    this.state = {
      feedbackInfo: null,
      stars: null,
      commentFeedback: null,
      updateAfterFeedback: true,
      transaction: null,
    };
  }

  componentDidMount = async () => {
    if (this.props.route.params.history.type === "passenger") {
      await this.readFeedback();
    }
    await this.getTransaction();
    console.log(this.state.transaction);
  };

  async getTransaction() {
    return new Promise(async(resolve, reject)=>{
      axios
      .post(
        "/transaction",
        {
          history: {
            id: this.props.route.params.history.history_id,
          },
        },
        {
          headers: {
            authorization:
              "Bearer " + (await AsyncStorage.getItem("session_token")),
          },
        }
      )
      .then(async(res) => {
        //console.log(res.data);

        this.setState({
          transaction: res.data[0],
        },resolve(1));
      })
      .catch((e) => {
        console.log(e);
      });
    })
    
  }

  async readFeedback() {
    //console.log(this.props.route.params.history.history_id)
    axios
      .post(
        "/feedback",
        {
          history: {
            id: this.props.route.params.history.history_id,
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
        //console.log(e.status)
        if (e.data !== []) {
          //console.log(e.data[0].star_number)
          this.setState(
            {
              feedbackInfo: e.data[0],
            },
            () => {
              //console.log(this.state.feedbackInfo);
            }
          );
        } else {
          console.log("dont have feedback");
        }
      })
      .catch((e) => {
        console.log(e);
      });
  }

  async updateFeedback() {
    //console.log(this.props.route.params.history.history_id)
    axios
      .post(
        "/feedback/update",
        {
          history: {
            id: this.props.route.params.history.history_id,
          },
          feedback: {
            id: this.state.feedbackInfo.feedback_id,
            stars: this.state.stars,
            comment: this.state.commentFeedback,
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
        //console.log(e.status)
        if (e.data === "success") {
          this.setState({
            updateAfterFeedback: false,
          });
        }
      })
      .catch((e) => {
        console.log(e);
      });
  }

  undoneFeedback = () => {
    return (
      <View
        style={{
          //top: SIZES.height * (20 / 100) - 5,

          backgroundColor: COLORS.white,
          //height: "50%",
          width: "100%",
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
        <Text
          style={{
            color: COLORS.lightGray2,
            ...FONTS.h4,
          }}
        >
          ระดับความพึงพอใจ
        </Text>
        <View style={{ alignItems: "center" }}>
          <View style={{ alignItems: "center" }}>
            <Stars
              default={0}
              update={(val) => {
                this.setState({ stars: val });
              }}
              spacing={4}
              starSize={40}
              count={5}
              half={false}
              fullStar={images.star_icon}
              emptyStar={images.empty_star_icon}
              disabled={this.state.updateAfterFeedback ? false : true}
            />
          </View>
        </View>
        <TextInput
          style={styles.input}
          multiline={true}
          numberOfLines={4}
          maxLength={250}
          scrollEnabled={true}
          placeholder="ความคิดเห็น"
          textAlignVertical="top"
          onChangeText={(commentFeedback) => {
            this.setState(
              {
                commentFeedback: commentFeedback,
              }
              //console.log(this.state.commentFeedback)
            );
          }}
          editable={this.state.updateAfterFeedback}
          selectTextOnFocus={this.state.updateAfterFeedback}
        />
        {this.state.updateAfterFeedback ? (
          <TouchableWithoutFeedback onPress={() => this.updateFeedback()}>
            <View
              style={{
                borderRadius: SIZES.radius - 5,
                backgroundColor: COLORS.primary,
                padding: SIZES.padding * 1.5,
                marginTop: SIZES.margin,
              }}
            >
              <Text
                style={{
                  textAlign: "center",
                  color: COLORS.white,
                  ...FONTS.h5,
                }}
              >
                ประเมินความพึงพอใจ
              </Text>
            </View>
          </TouchableWithoutFeedback>
        ) : (
          <></>
        )}
      </View>
    );
  };

  doneFeedback = () => {
    return (
      <View
        style={{
          //top: SIZES.height * (20 / 100) - 5,

          backgroundColor: COLORS.white,
          //height: "100%",
          width: "100%",
          zIndex: 10,
          shadowColor: "#000",
          elevation: 4,
          alignSelf: "center",
          borderRadius: 8,
          //justifyContent: "center",
          padding: 10,
          margin: 5,
        }}
      >
        <Text
          style={{
            color: COLORS.lightGray2,
            ...FONTS.h4,
          }}
        >
          ระดับความพึงพอใจ
        </Text>
        <View style={{ alignItems: "center" }}>
          {
            <Stars
              display={this.state.feedbackInfo.star_number}
              spacing={8}
              count={5}
              starSize={40}
              fullStar={images.star_icon}
              emptyStar={images.empty_star_icon}
              disabled={true}
            />
          }
        </View>
        <TextInput
          style={styles.input}
          multiline={true}
          numberOfLines={4}
          value={this.state.feedbackInfo.comment}
          editable={false}
          selectTextOnFocus={false}
          textAlignVertical="top"
        />
      </View>
    );
  };

  feedbackPage = () => {
    if (this.state.feedbackInfo.status === "pending") {
      return this.undoneFeedback();
    } else {
      return this.doneFeedback();
    }
  };

  paidInfo = () => {
    return (
      <View style={styles.block}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Text
            style={{
              color: COLORS.lightGray2,
              ...FONTS.h4,
            }}
          >
            ค่าโดยสารทั้งหมด
          </Text>
          <Text>{this.state.transaction===null? 0 :this.state.transaction.money_amount} บาท</Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Text
            style={{
              color: COLORS.lightGray2,
              ...FONTS.h4,
            }}
          >
            รูปแบบการชำระเงิน
          </Text>
          {this.state.transaction===null? <Text>เงินสด</Text> :(this.state.transaction.type === 'cash'?<Text>เงินสด</Text>:<Text>wallet</Text>)}
          
        </View>
      </View>
    );
  };

  infoPage = () => {
    return (
      <View style={styles.block}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Text
            style={{
              color: COLORS.lightGray2,
              ...FONTS.h4,
            }}
          >
            จำนวนผู้โดยสาร
          </Text>
          <Text>4 คน</Text>
        </View>
      </View>
    );
  };

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <View>
          <View style={styles.block}>
            <Text
              style={{
                color: COLORS.lightGray,
                ...FONTS.body2,
                justifyContent: "center",
                alignSelf: "center",
              }}
            >
              {moment(this.props.route.params.history.created_at).format(
                "DD/MM/YYYY"
              )}
            </Text>
          </View>
          <View style={styles.block}>
            <View
              style={{
                justifyContent: "center",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
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
                  {this.props.route.params.history.originName.name}
                </Text>
                <Text
                  style={{
                    color: COLORS.lightGray,
                    ...FONTS.body4,
                  }}
                >
                  {moment(this.props.route.params.history.created_at).format(
                    "HH:mm A"
                  )}
                </Text>
              </View>
              <Text
                style={{
                  color: COLORS.lightGray,
                  ...FONTS.body4,
                  paddingLeft: "5%",
                }}
              >
                {this.props.route.params.history.originName.address[0]},{" "}
                {this.props.route.params.history.originName.address[1]}
              </Text>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
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
                  {this.props.route.params.history.destinationName.name}
                </Text>
                <Text
                  style={{
                    color: COLORS.lightGray,
                    ...FONTS.body4,
                  }}
                >
                  {moment(this.props.route.params.history.updated_at).format(
                    "HH:mm A"
                  )}
                </Text>
              </View>

              <Text
                style={{
                  color: COLORS.lightGray,
                  ...FONTS.body4,
                  paddingLeft: "5%",
                  marginBottom: "3%",
                }}
              >
                {this.props.route.params.history.destinationName.address[0]},{" "}
                {this.props.route.params.history.destinationName.address[1]}
              </Text>

              <View
                style={{
                  justifyContent: "space-between",
                  flexDirection: "row",

                  borderTopColor: "black",
                  borderTopWidth: 1,
                }}
              >
                <Text
                  style={{
                    color: COLORS.lightGray,
                    ...FONTS.body3,
                    marginLeft: "5%",
                  }}
                >
                  ระยะทาง
                </Text>
                <Text
                  style={{
                    color: COLORS.lightGray,
                    ...FONTS.body4,
                    //alignSelf: "flex-end",
                  }}
                >
                  {this.props.route.params.history.distance} ก.ม.
                </Text>
              </View>
            </View>
          </View>
        </View>
        {this.state.feedbackInfo ? (
          <>
            {this.feedbackPage()}
            {this.paidInfo()}
          </>
        ) : (
          this.infoPage()
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
  input: {
    //height: "50%",
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  block: {
    backgroundColor: COLORS.white,
    width: "97%",
    zIndex: 10,
    shadowColor: "#000",
    elevation: 4,
    alignSelf: "center",
    borderRadius: 8,
    justifyContent: "center",
    padding: 10,
    margin: 5,
  },
});

export default HistoryInfoScreen;
