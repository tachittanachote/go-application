import React, { Component } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView,
  RefreshControl,
  TextInput,
} from "react-native";
import { SwipeablePanel } from "rn-swipeable-panel";
import { Icon } from "react-native-elements";
import { BackButton } from "../components";

import { COLORS, SIZES, FONTS } from "../constants";

import { Picker } from '@react-native-community/picker'

import _ from "lodash";
import { UserContext } from "../context";
import moment from 'moment'
import jwt from 'jwt-decode'

class WalletScreen extends Component {
  static contextType = UserContext;

  constructor(props) {
    super(props);
    this.state = {
      withdrawAmount: 0,
      addedAccount: false,
      isPanelActive: false,
      isAddBankPanelActive: false,
      panelAddBankProps: {
        fullWidth: true,
        openLarge: true,
        refreshing: false,
        onClose: () => this.closePanelAddBank(),
        onPressCloseButton: () => this.closePanelAddBank(),
      },
      panelProps: {
        fullWidth: true,
        onlySmall: true,
        refreshing: false,
        onClose: () => this.closePanel(),
        onPressCloseButton: () => this.closePanel(),
      },
      bankNumber: '',
      holderName: '',
      bankBrand: 'bbl',
      transaction: null,
      bankList: [{
        shortName: 'baac',
        fullName: 'Bank for Agriculture and Agricultural Cooperatives',
      },
      {
        shortName: 'bay',
        fullName: 'Bank of Ayudhya(Krungsri)',
      },
      {
        shortName: 'bbl',
        fullName: 'Bangkok Bank',
      },
      {
        shortName: 'bnp',
        fullName: 'BNP Paribas',
      },
      {
        shortName: 'boa',
        fullName: 'Bank of America',
      },
      {
        shortName: 'cacib',
        fullName: 'CrÃ©dit Agricole',
      },
      {
        shortName: 'cimb',
        fullName: 'CIMB Thai Bank',
      },
      {
        shortName: 'citi',
        fullName: 'Citibank',
      },
      {
        shortName: 'db',
        fullName: 'Deutsche Bank',
      },
      {
        shortName: 'ghb',
        fullName: 'Government Housing Bank',
      },
      {
        shortName: 'gsb',
        fullName: 'Government Savings Bank',
      },
      {
        shortName: 'hsbc',
        fullName: 'Hongkong and Shanghai Banking Corporation',
      },
      {
        shortName: 'ibank',
        fullName: 'Islamic Bank of Thailand',
      },
      {
        shortName: 'icbc',
        fullName: 'Industrial and Commercial Bank of China(Thai)',
      },
      {
        shortName: 'jpm',
        fullName: 'J.P.Morgan',
      },
      {
        shortName: 'kbank',
        fullName: 'Kasikornbank',
      },
      {
        shortName: 'kk',
        fullName: 'Kiatnakin Bank',
      },
      {
        shortName: 'ktb',
        fullName: 'Krungthai Bank',
      },
      {
        shortName: 'lhb',
        fullName: 'Land and Houses Bank',
      },
      {
        shortName: 'mb',
        fullName: 'Mizuho Bank',
      },
      {
        shortName: 'mega',
        fullName: 'Mega International Commercial Bank',
      },
      {
        shortName: 'mufg',
        fullName: 'Bank of Tokyo - Mitsubishi UFJ',
      },
      {
        shortName: 'rbs',
        fullName: 'Royal Bank of Scotland',
      },
      {
        shortName: 'sc',
        fullName: 'Standard Chartered(Thai)',
      },
      {
        shortName: 'scb',
        fullName: 'Siam Commercial Bank',
      },
      {
        shortName: 'smbc',
        fullName: 'Sumitomo Mitsui Banking Corporation',
      },
      {
        shortName: 'tcrb',
        fullName: 'Thai Credit Retail Bank',
      },
      {
        shortName: 'tisco',
        fullName: 'Tisco Bank',
      },
      {
        shortName: 'ttb',
        fullName: 'TMBThanachart Bank',
      },
      {
        shortName: 'uob',
        fullName: 'United Overseas Bank(Thai)',
      },
      ]
    };
  }

  componentDidMount = async () => {
    await this.checkWalletTransaction();
    this.checkAccount()
  };

  onRefresh = () => {
    this.setState({ refreshing: true });
    this.context.refreshUser((e) => {
      this.setState({ refreshing: false });
    });
  };

  navigate(screen) {
    return this.props.navigation.navigate(screen);
  }

  renderContent() {
    console.log("render!");

    return (
      <View
        style={{
          padding: SIZES.padding,
        }}
      >
        <View>
          <Text
            style={{
              ...FONTS.h5,
            }}
          >
            All top-up methods
          </Text>
        </View>
        <View
          style={{
            marginTop: SIZES.margin,
          }}
        >
          <TouchableWithoutFeedback
            onPress={() => this.navigate("PromptPayScreen")}
          >
            <View style={styles.paymentMethod}>
              <View>
                <Icon
                  reverse
                  type="ionicon"
                  name="qr-code-outline"
                  size={18}
                  color="#E3FCFF"
                  reverseColor="#00DF5F"
                />
              </View>
              <View style={styles.paymentLabel}>
                <View>
                  <Text>Prompt Pay </Text>
                </View>
                <View style={{ flex: 2, alignItems: "flex-end" }}>
                  <Icon
                    type="ionicon"
                    name="chevron-forward-outline"
                    size={14}
                    color={COLORS.lightGray2}
                  />
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </View>
    );
  }

  renderWithdraw() {
    return (

      <View
        style={{
          padding: SIZES.padding,
        }}
      >
        <Text style={{
          ...FONTS.h5
        }}>แจ้งถอนเงิน</Text>

        <View style={{
          padding: SIZES.padding * 2
        }}>

          <View style={{
            marginBottom: SIZES.margin,
            backgroundColor: COLORS.secondary,
            padding: SIZES.padding,
            borderRadius: SIZES.radius
          }}>
            <View style={{
              position: "absolute",
              right: 0,
              zIndex: 2000,
            }}>
              <TouchableOpacity onPress={() => this.removeBankAccount()}>
                <Icon
                  reverse
                  name='close-outline'
                  type='ionicon'
                  color={COLORS.red}
                  size={12}
                />
              </TouchableOpacity>
            </View>
            <Text>บัญชีปลายทางของคุณ</Text>
            <Text>ชื่อธนาคาร:  {this.state.addedAccount[0]?.bank_name}</Text>
            <Text>ชื่อบัญชี:  {this.state.addedAccount[0]?.bank_holder}</Text>
            <Text>หมายเลขบัญชี:  {this.state.addedAccount[0]?.bank_account_number}</Text>
          </View>

          <View
            style={{
              marginBottom: SIZES.margin
            }}>
            <Text>จำนวนเงิน</Text>
            <TextInput placeholder="ขั้นตำ 30 บาท" keyboardType='numeric' style={styles.inputBank} onChangeText={(value) => this.setState({ withdrawAmount: value })}></TextInput>
          </View>

          <TouchableWithoutFeedback onPress={() => this.confirmWithdraw()}>
            <View style={{
              borderRadius: SIZES.radius - 5,
              backgroundColor: COLORS.primary,
              padding: SIZES.padding * 1.5,
              marginTop: SIZES.margin,
            }}>
              <Text style={{
                textAlign: 'center',
                color: COLORS.white,
                ...FONTS.h5
              }}>ถอนเงิน</Text>
            </View>
          </TouchableWithoutFeedback>

        </View>
      </View>

    );
  }

  async confirmWithdraw() {
    if (this.state.withdrawAmount < 30 || this.context.user.wallet_balance < this.state.withdrawAmount ) {
      alert('โปรดระบุยอดเงินให้ถูกต้อง')
      return;
    }

    axios.post("/omise/withdraw",
      {
        info: {
          amount: this.state.withdrawAmount,
        }
      },
      {
        headers: {
          authorization:
            "Bearer " + await AsyncStorage.getItem("session_token"),
        },
      }
    )
      .then((e) => {
        if (e.data === "success") {
          this.context.refreshUser(async(e) => {
            alert("ดำเนินการสำเร็จ")
            await this.checkWalletTransaction();
          });
          this.setState({ isAddBankPanelActive: false })
        }
      })
      .catch((e) => {
        console.log(e);
      });

  }

  async removeBankAccount() {
    axios.post("/omise/removeBank", {},
      {
        headers: {
          authorization:
            "Bearer " + await AsyncStorage.getItem("session_token"),
        },
      }
    )
      .then((e) => {
        if(e.data === "success") {
          this.setState({ isAddBankPanelActive: false, holderName: '', bankNumber: '', bankBrand: '' }, () => {
            alert("ดำเนินการสำเร็จ")
            this.checkAccount()
          });
        } else {
          alert("ไม่สามารถดำเนินการได้")
        }
      })
      .catch((e) => {
        console.log(e);
      });
  }

  renderAddBankContent() {
    console.log("render!");

    return (
      
      <View
        style={{
          padding: SIZES.padding,
        }}
      >
        <Text style={{
          ...FONTS.h5
        }}>เพิ่มบัญชีธนาคาร</Text>

        <View style={{
          padding: SIZES.padding * 2
        }}>
          <Text>ธนาคาร</Text>
          <Picker
            selectedValue={this.state.bankBrand}
            style={{ height: 50, width: '100%' }}
            onValueChange={(itemValue, itemIndex) => this.setState({ bankBrand: itemValue })}
          >
            {this.state.bankList.map((item, index) => (
              <Picker.Item key={index} label={item.fullName} value={item.shortName} />
            ))}
          </Picker>

          <View style={{
            marginBottom: SIZES.margin
          }}>
            <Text>เลขบัญชีธนาคาร</Text>
            <TextInput keyboardType='numeric' placeholder="" style={styles.inputBank} onChangeText={(value) => this.setState({ bankNumber: value })} />
          </View>

          <View
            style={{
              marginBottom: SIZES.margin
            }}>
            <Text>ชื่อบัญชี</Text>
            <TextInput placeholder="" style={styles.inputBank} onChangeText={(value) => this.setState({ holderName: value })} />
          </View>

          <TouchableWithoutFeedback onPress={() => this.addBankAccount()}>
            <View style={{
              borderRadius: SIZES.radius - 5,
              backgroundColor: COLORS.primary,
              padding: SIZES.padding * 1.5,
              marginTop: SIZES.margin,
            }}>
              <Text style={{
                textAlign: 'center',
                color: COLORS.white,
                ...FONTS.h5
              }}>เพิ่มบัญชี</Text>
            </View>
          </TouchableWithoutFeedback>

        </View>
      </View>
      
    );
  }

  async addBankAccount() {
    if (!this.state.holderName || !this.state.bankNumber || !this.state.bankBrand) {
      alert("โปรดระบุข้อมูลให้ครบถ้วน")
      return;
    }

    axios.post("/omise/addBank",
        {
          bankInfo:{
            brand: this.state.bankBrand,
            number: this.state.bankNumber,
            name: this.state.holderName,
          }
        },
        {
          headers: {
            authorization:
              "Bearer " + await AsyncStorage.getItem("session_token"),
          },
        }
      )
      .then((e) => {
        this.setState({ isAddBankPanelActive: false, holderName: '', bankNumber: '', bankBrand: '' }, () => {
          alert("ดำเนินการสำเร็จ")
          this.checkAccount()
        });
      })
      .catch((e) => {
        console.log(e);
      });

  }

  async checkAccount() {
    var token = await AsyncStorage.getItem('session_token')

    var decoded = jwt(token)
    console.log(token)
    console.log(decoded.user_id)
    axios.post('/user/bankcheck/' + decoded.user_id, {},
      {
        headers: {
          authorization:
            "Bearer " + await AsyncStorage.getItem("session_token"),
        },
      }).then((resp) => {
      if(resp.data !== 'error') {
        this.setState({ addedAccount: resp.data })
      }else {
        this.setState({ addedAccount: false })
      }
    }).catch((res) => {
      console.log(res)
    })
  }

  closePanel = () => {
    this.setState({ isPanelActive: false });
  };

  closePanelAddBank = () => {
    this.setState({ isAddBankPanelActive: false });
  };

  checkWalletTransaction = async () => {
    return new Promise(async (resolve, reject) => {
      axios
        .post(
          "/wallet",
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
        .then((e) => {
          console.log(e.data);
          this.setState(
            {
              transaction: e.data,
            },
            resolve(1)
          );
        })
        .catch((e) => {
          console.log(e);
          resolve(0);
        });
    });
  };

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <BackButton navigation={this.props.navigation}></BackButton>
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.onRefresh}
              title="Pull to refresh"
            />
          }
        >
          <View
            style={{
              position: "absolute",
              width: "100%",
              alignItems: "center",
              marginTop: SIZES.margin * 1.35,
            }}
          >
            <Text
              style={{
                fontWeight: "bold",
                fontSize: SIZES.body3,
              }}
            >
              วิธีการชำระเงิน
            </Text>
          </View>

          <View
            style={{
              margin: SIZES.margin,
              backgroundColor: COLORS.white,
              borderRadius: SIZES.radius,
              backgroundColor: COLORS.white,
              shadowColor: "#000",
              shadowOffset: {
                width: 3,
                height: 3,
              },
              shadowOpacity: 0.2,
              shadowRadius: 1.41,

              elevation: 5,
              position: "relative",
              height: SIZES.height * (22 / 100),
            }}
          >
            <View>
              <Text
                style={{
                  fontSize: SIZES.h3,
                  color: COLORS.purple,
                  paddingLeft: SIZES.padding,
                  paddingTop: SIZES.padding,
                  fontWeight: "bold",
                }}
              >
                GoPay Wallet
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                paddingLeft: SIZES.padding,
              }}
            >
              <Icon
                type="foundation"
                name="dollar"
                size={22}
                color={COLORS.lightGray2}
              />
              <Text
                style={{
                  paddingLeft: SIZES.padding,
                  ...FONTS.h1,
                }}
              >
                {this.context.user.wallet_balance}
              </Text>
            </View>

            <View
              style={{
                position: "absolute",
                bottom: 0,
                padding: SIZES.padding * 2.5,
                borderTopWidth: 1,
                borderTopColor: COLORS.lightGray3,
                flex: 2,
                width: "100%",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                }}
                onPress={() => this.setState({ isPanelActive: true })}
              >
                <View>
                  <Text
                    style={{
                      fontWeight: "bold",
                      color: COLORS.bluesky,
                      fontSize: SIZES.body4,
                    }}
                  >
                    เติมเงินเพื่อใช้การชำระโดยไม่ใช้เงินสด!
                  </Text>
                </View>
                <View
                  style={{
                    flex: 1,
                    alignItems: "flex-end",
                  }}
                >
                  <Icon
                    type="ionicon"
                    name="chevron-forward-outline"
                    size={22}
                    color={COLORS.lightGray2}
                  />
                </View>
              </TouchableOpacity>
            </View>
          </View>

          <View
            style={{
              flex: 1,
              backgroundColor: COLORS.white,
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 12,
              },
              shadowOpacity: 0.58,
              shadowRadius: 16.0,

              elevation: 24,
            }}
          >
            <View>
              <ScrollView
                horizontal={true}
                style={{
                  marginLeft: SIZES.margin,
                  marginRight: SIZES.margin,
                  borderBottomWidth: 1,
                  borderBottomColor: COLORS.lightGray3,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    margin: SIZES.margin,
                  }}
                >
                  <View style={styles.suggestionMenu}>
                    <TouchableOpacity
                      style={{
                        flexDirection: "row",
                      }}
                      onPress={() => this.setState({ isPanelActive: true })}
                    >
                      <Icon
                        type="ionicon"
                        name="add-outline"
                        size={22}
                        color={COLORS.purple}
                      />
                      <Text style={styles.menuText}>เติมเงิน</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.suggestionMenu}>
                    <TouchableOpacity
                      style={{
                        flexDirection: "row",
                      }}
                      onPress={() => this.setState({ isAddBankPanelActive: true })}
                    >
                      <Icon
                        type="ionicon"
                        name="swap-horizontal-outline"
                        size={22}
                        color={COLORS.purple}
                      />
                      <Text style={styles.menuText}>ถอนเงิน</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </ScrollView>
            </View>

            <View
              style={{
                margin: SIZES.margin,
                flexDirection: "row",
              }}
            >
              <View>
                <Text
                  style={{
                    ...FONTS.h4,
                  }}
                >
                  รายการล่าสุด
                </Text>
              </View>
              <View
                style={{
                  flex: 1,
                  alignItems: "flex-end",
                }}
              >
                <TouchableOpacity>
                  <Text
                    style={{
                      color: COLORS.bluesky,
                      ...FONTS.h6,
                    }}
                  >

                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <ScrollView
              style={{
                marginBottom: SIZES.margin,
              }}
            >
              {this.state.transaction &&
                this.state.transaction.map((transaction, index) => (
                  <View
                    key={index}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginRight: SIZES.margin - 5,
                      marginLeft: SIZES.margin,
                      marginTop: SIZES.margin,
                    }}
                  >
                    {transaction.action === "deposit" ? (
                      <>
                        <View>
                          {transaction.type === 'promptpay' ? (
                            <Text
                              style={{
                                color: COLORS.lightGray1,
                                ...FONTS.body3,
                              }}
                            >
                              เติมเงินเข้า wallet
                            </Text>
                          ) : (
                            <Text
                              style={{
                                color: COLORS.lightGray1,
                                ...FONTS.body3,
                              }}
                            >
                              ได้รับค่าบริการ
                            </Text>
                          )}

                          <Text
                            style={{
                              color: COLORS.lightGray2,
                              ...FONTS.body4,
                            }}
                          >
                            {transaction.type} - {moment(transaction.created_at).format("YYYY-MM-DD HH:mm")}
                          </Text>
                        </View>
                        <View
                          style={{
                            flexDirection: "row",
                            flex: 1,
                            justifyContent: "flex-end",
                            alignItems: "center",
                          }}
                        >
                          <View
                            style={{
                              marginRight: 10,
                            }}
                          >
                            <Text
                              style={{
                                ...FONTS.h5,
                                color: "#8db7a7",
                              }}
                            >
                              THB +{transaction.amount}
                            </Text>
                          </View>
                          <View>
                            <Icon
                              type="ionicon"
                              name="chevron-forward-outline"
                              size={18}
                              color={COLORS.lightGray2}
                            />
                          </View>
                        </View>
                      </>
                    ) : (
                      <>
                        <View>
                          {transaction.type === 'wallet' ? (
                            <Text
                              style={{
                                color: COLORS.lightGray1,
                                ...FONTS.body3,
                              }}
                            >
                              ชำระค่าบริการ
                            </Text>
                          ) : (
                            <Text
                              style={{
                                color: COLORS.lightGray1,
                                ...FONTS.body3,
                              }}
                            >
                              ถอนเงิน
                            </Text>
                          )}

                          <Text
                            style={{
                              color: COLORS.lightGray2,
                              ...FONTS.body4,
                            }}
                          >
                            {transaction.type} - {moment(transaction.created_at).format("YYYY-MM-DD HH:mm")}
                          </Text>
                        </View>
                        <View
                          style={{
                            flexDirection: "row",
                            flex: 1,
                            justifyContent: "flex-end",
                            alignItems: "center",
                          }}
                        >
                          <View
                            style={{
                              marginRight: 10,
                            }}
                          >
                            <Text
                              style={{
                                ...FONTS.h5,
                                color: "#c75f5f",
                              }}
                            >
                              THB -{transaction.amount}
                            </Text>
                          </View>
                          <View>
                            <Icon
                              type="ionicon"
                              name="chevron-forward-outline"
                              size={18}
                              color={COLORS.lightGray2}
                            />
                          </View>
                        </View>
                      </>
                    )}
                  </View>
                ))}

              {/*_.times(10, (index) => (
              <View key={index} style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginRight: SIZES.margin - 5,
                marginLeft: SIZES.margin,
                marginTop: SIZES.margin,
              }}>
                <View>
                  <Text style={{
                    color: COLORS.lightGray1,
                    ...FONTS.body3
                  }}>ชำระค่าบริการ</Text>
                  <Text style={{
                    color: COLORS.lightGray2,
                    ...FONTS.body4
                  }}>ไปยัง นายเตชิตธนโชติ อามาตมนตรี</Text>
                </View>
                <View style={{
                  flexDirection: 'row',
                  flex: 1,
                  justifyContent: 'flex-end',
                  alignItems: 'center',
                }}>
                  <View style={{
                    marginRight: 10,
                  }}>
                    <Text style={{
                      ...FONTS.h5
                    }}>THB -27.00</Text>
                  </View>
                  <View>
                    <Icon
                      type='ionicon'
                      name='chevron-forward-outline'
                      size={18}
                      color={COLORS.lightGray2}
                    />
                  </View>
                </View>
              </View>
                  ))*/}
            </ScrollView>
          </View>
        </ScrollView>
        <SwipeablePanel
          {...this.state.panelProps}
          isActive={this.state.isPanelActive}
        >
          {this.renderContent()}
        </SwipeablePanel>

        <SwipeablePanel
          {...this.state.panelAddBankProps}
          isActive={this.state.isAddBankPanelActive}
        >
          {this.state.addedAccount ? this.renderWithdraw() : this.renderAddBankContent()}
        </SwipeablePanel>

      </SafeAreaView>
    );
  }
}

export default WalletScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingTop: 60,
  },
  input: {
    borderWidth: 1,
    borderRadius: SIZES.radius2,
    borderColor: COLORS.lightGray2,
    marginTop: SIZES.margin * 1.5,
    padding: 10,
    ...FONTS.h1,
  },

  suggestionMenu: {
    flexDirection: "row",
    backgroundColor: COLORS.white,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.0,

    elevation: 5,
    marginRight: 15,
    padding: SIZES.padding,
    borderRadius: SIZES.radius2,
    alignItems: "center",
  },
  menuText: {
    marginLeft: 5,
    ...FONTS.body4,
  },
  paymentMethod: {
    flexDirection: "row",
    alignItems: "center",
  },
  paymentLabel: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  inputBank: { 
    backgroundColor: COLORS.lightGray3, 
    padding: SIZES.margin ,
    marginTop: 10,
    borderRadius: SIZES.radius2
  }
});
