import React, { Component } from 'react';
import {
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView
} from 'react-native';
import { Icon } from 'react-native-elements';
import { BackButton } from '../components';

import { COLORS, SIZES, FONTS } from '../constants';


import _ from 'lodash'
import { UserContext } from '../context';

class WalletScreen extends Component {

  static contextType = UserContext

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <BackButton navigation={this.props.navigation}></BackButton>
        <View style={{
          position: 'absolute',
          width: '100%',
          alignItems: 'center',
          marginTop: SIZES.margin * 1.35
        }}>
          <Text style={{
            fontWeight: 'bold',
            fontSize: SIZES.body3
          }}>วิธีการชำระเงิน</Text>
        </View>


        <View style={{
          margin: SIZES.margin,
          backgroundColor: COLORS.white,
          borderRadius: SIZES.radius,
          backgroundColor: COLORS.white,
          shadowColor: "#000",
          shadowOffset: {
            width: 3,
            height: 3,
          },
          shadowOpacity: 0.20,
          shadowRadius: 1.41,

          elevation: 5,
          position: 'relative',
          height: SIZES.height * (22 / 100),
        }}>

          <View><Text style={{
            fontSize: SIZES.h3,
            color: COLORS.purple,
            paddingLeft: SIZES.padding,
            paddingTop: SIZES.padding,
            fontWeight: 'bold'
          }}>GoPay Wallet</Text></View>
          <View style={{
            flexDirection: 'row',
            paddingLeft: SIZES.padding,
          }}>
            <Icon
              type='foundation'
              name='dollar'
              size={22}
              color={COLORS.lightGray2}
            />
            <Text style={{
              paddingLeft: SIZES.padding,
              ...FONTS.h1
            }}>{this.context.user.wallet_balance}</Text>
          </View>



          <View style={{
            position: 'absolute',
            bottom: 0,
            padding: SIZES.padding * 2.5,
            borderTopWidth: 1,
            borderTopColor: COLORS.lightGray3,
            flex: 2,
            width: '100%',
            flexDirection: 'row',
            alignItems: 'center'
          }}>
            <TouchableOpacity style={{
              flexDirection: 'row',
            }}>
              <View>
                <Text style={{
                  fontWeight: 'bold',
                  color: COLORS.bluesky,
                  fontSize: SIZES.body4,
                }}>เติมเงินเพื่อใช้การชำระโดยไม่ใช้เงินสด!</Text>
              </View>
              <View style={{
                flex: 1,
                alignItems: 'flex-end'
              }}>
                <Icon
                  type='ionicon'
                  name='chevron-forward-outline'
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
            shadowRadius: 16.00,

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
              <View style={{
                flexDirection: 'row',
                margin: SIZES.margin,
              }}>
                <View style={styles.suggestionMenu}>
                  <TouchableOpacity style={{
                    flexDirection: 'row',
                  }}>
                    <Icon
                      type='ionicon'
                      name='add-outline'
                      size={22}
                      color={COLORS.purple}
                    />
                    <Text style={styles.menuText}>เติมเงิน</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.suggestionMenu}>
                  <TouchableOpacity style={{
                    flexDirection: 'row',
                  }}>
                    <Icon
                      type='ionicon'
                      name='scan-outline'
                      size={22}
                      color={COLORS.purple}
                    />
                    <Text style={styles.menuText}>สแกนจ่าย</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.suggestionMenu}>
                  <TouchableOpacity style={{
                    flexDirection: 'row',
                  }}>
                    <Icon
                      type='ionicon'
                      name='swap-horizontal-outline'
                      size={22}
                      color={COLORS.purple}
                    />
                    <Text style={styles.menuText}>โอนเงิน</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </View>

          <View style={{
            margin: SIZES.margin,
            flexDirection: 'row'
          }}>
            <View>
              <Text style={{
                ...FONTS.h4
              }}>รายการล่าสุด</Text>
            </View>
            <View style={{
              flex: 1,
              alignItems: 'flex-end'
            }}>
              <TouchableOpacity>
                <Text style={{
                  color: COLORS.bluesky,
                  ...FONTS.h6
                }}>ดูทั้งหมด</Text>
              </TouchableOpacity>
            </View>
          </View>



          <ScrollView style={{
            marginBottom: SIZES.margin,
          }}>


            {_.times(10, () => (
              <View style={{
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
            ))}
            

          </ScrollView>

        </View>

      </SafeAreaView>
    );
  }
}

export default WalletScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingTop: 60
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
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.00,

    elevation: 5,
    marginRight: 15,
    padding: SIZES.padding,
    borderRadius: SIZES.radius2,
    alignItems: 'center'
  },
  menuText: {
    marginLeft: 5,
    ...FONTS.body4
  }

});
