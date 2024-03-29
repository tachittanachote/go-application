import React, { Component } from 'react';
import { View, Text, TouchableWithoutFeedback, TextInput, StyleSheet } from 'react-native';
import { Picker } from '@react-native-community/picker';
import { COLORS, FONTS, SIZES } from '../constants';

import Modal from "react-native-modal";
import Slider from 'rn-range-slider';

import { HorizontalLine } from '.';
import { Label, Notch, Rail, RailSelected, Thumb } from './rn-slider';

class DriverFilter extends Component {

    constructor(props) {
        super(props);
        this.state = {
            filterState: false,
            lowestAge: 0,
            highestAge: 100,
            gender: 'none',
            rangeFilter: false,
        }
    }

    toggleFilter = () => {
        if (this.state.filterState) {
            this.setState({ filterState: false })
        } else {
            this.setState({ filterState: true })
        }
    }

    handleAgeRange(low, high) {
        this.setState({ lowestAge: low, highestAge: high })
    }

    handleGenderSelect(gender) {
        this.setState({ gender: gender })
    }

    updateFilter = () => {
        this.toggleFilter()

        var data = {
            gender: this.state.gender
        }

        return this.props.onFilterCallback(data)
    }

    handleRangeToggle() {
        console.log("Toggle")
        if (this.state.rangeFilter) {
            this.setState({ lowestAge: 0, highestAge: 100, rangeFilter: false })
        }
        else {
            this.setState({ rangeFilter: true })
        }
    }


    render() {
        return (
            <View style={{
                position: 'absolute',
                zIndex: 100,
                right: 0,
                margin: 20,
            }}>

                <TouchableWithoutFeedback onPress={this.toggleFilter}>
                    <View style={{
                        padding: 10,
                        width: SIZES.width * (40 / 100),
                        flex: 1,
                        borderRadius: 20,
                        backgroundColor: COLORS.purple,
                    }}>
                        <Text style={{
                            color: '#ffffff',
                            textAlign: 'center',
                            ...FONTS.h5
                        }}>
                            ตั้งค่าการเดินทาง
                        </Text>
                    </View>
                </TouchableWithoutFeedback>

                <Modal
                    isVisible={this.state.filterState}
                    animationIn="slideInDown"
                    animationOut="slideOutUp"
                >
                    <View style={{
                        flex: 1,
                        margin: '0.5%',
                        backgroundColor: COLORS.white,
                        padding: 20,
                        borderRadius: SIZES.radius,
                    }}>

                        <Text style={{
                            color: COLORS.darkpurple,
                            ...FONTS.h3
                        }}>ตั้งค่าการเดินทาง</Text>

                        <HorizontalLine></HorizontalLine>

                        <View style={{
                            flex: 1,
                        }}>

                            {/* <Text style={{
                                marginBottom: 10,
                                color: COLORS.lightGray2,
                                ...FONTS.h4
                            }}>อายุผู้โดยสาร</Text>

                            {!this.state.rangeFilter ?
                                <TouchableWithoutFeedback onPress={() => this.handleRangeToggle()}>
                                    <View style={styles.toggleRangeBtn}>
                                        <Text style={styles.rangeBtnText}>ระบุช่วงอายุ</Text>
                                    </View>
                                </TouchableWithoutFeedback>
                                :
                                <>
                                    <Text style={{
                                        marginBottom: 10,
                                        color: COLORS.lightGray2,
                                        ...FONTS.body3
                                    }}>ผู้โดยสารอายุระหว่าง {this.state.lowestAge} - {this.state.highestAge} ปี</Text>
                                    <Slider
                                        min={0}
                                        max={100}
                                        step={1}
                                        low={this.state.lowestAge}
                                        high={this.state.highestAge}
                                        disableRange={false}
                                        floatingLabel={true}
                                        renderThumb={() => <Thumb />}
                                        renderRail={() => <Rail />}
                                        renderRailSelected={() => <RailSelected />}
                                        renderLabel={(e) => <Label text={e} />}
                                        renderNotch={() => <Notch />}
                                        onTouchEnd={(low, high) => this.handleAgeRange(low, high)}
                                    />
                                    <TouchableWithoutFeedback onPress={() => this.handleRangeToggle()}>
                                        <View style={styles.toggleRangeBtn}>
                                            <Text style={styles.rangeBtnText}>ยกเลิก</Text>
                                        </View>
                                    </TouchableWithoutFeedback>
                                </>
                            } */}


                            <Text style={{
                                marginTop: 10,
                                color: COLORS.lightGray2,
                                ...FONTS.h4
                            }}>เพศผู้โดยสารร่วม</Text>
                            <Picker
                                selectedValue={this.state.gender}
                                onValueChange={(itemValue, itemIndex) => this.handleGenderSelect(itemValue)}>
                                <Picker.Item label="ไม่ระบุ" value="none" />
                                <Picker.Item label="ชาย" value="male" />
                                <Picker.Item label="หญิง" value="female" />
                            </Picker>

                        </View>

                        <View style={{
                            flex: 1,
                            justifyContent: 'flex-end'
                        }}>
                            <TouchableWithoutFeedback onPress={() => this.updateFilter()}>
                                <View style={{
                                    borderRadius: SIZES.radius - 5,
                                    backgroundColor: COLORS.primary,
                                    padding: SIZES.padding * 1.5,
                                    marginBottom: SIZES.margin - 20,
                                }}>
                                    <Text style={{
                                        textAlign: 'center',
                                        color: COLORS.white,
                                        ...FONTS.h5
                                    }}>บันทึกการตั้งค่า</Text>
                                </View>
                            </TouchableWithoutFeedback>
                            <TouchableWithoutFeedback onPress={() => this.toggleFilter()}>
                                <View style={{
                                    borderRadius: SIZES.radius - 5,
                                    backgroundColor: COLORS.lightRed,
                                    padding: SIZES.padding * 1.5,
                                    marginTop: SIZES.margin,
                                    marginBottom: SIZES.margin - 5,
                                }}>
                                    <Text style={{
                                        textAlign: 'center',
                                        color: COLORS.red,
                                        ...FONTS.h5
                                    }}>ยกเลิก</Text>
                                </View>
                            </TouchableWithoutFeedback>
                        </View>

                    </View>
                </Modal>

            </View>
        )
    }
}

const styles = StyleSheet.create({
    toggleRangeBtn: {
        marginTop: 5,
        backgroundColor: COLORS.purple,
        width: '30%',
        padding: 5,
        borderRadius: 20,
    },
    rangeBtnText: {
        color: COLORS.darkpurple,
        textAlign: 'center',
        ...FONTS.h5
    }
})

export default DriverFilter;