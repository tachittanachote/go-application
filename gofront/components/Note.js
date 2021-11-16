import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { Icon } from 'react-native-elements';
import { TextInput } from 'react-native-gesture-handler';
import { COLORS, FONTS } from '../constants';

class Note extends Component {

    onChangeText = (text) => {
        return this.props.onCallBack ? this.props.onCallBack(text) : null;
    }

    render() {
        return (
            <View>
                <View style={{
                    flex: 1,
                    flexDirection: 'row'
                }}>
                    <Icon
                        name="create-outline"
                        type='ionicon'
                        color={COLORS.bluesky}
                    ></Icon>
                    <Text style={{
                        textAlignVertical: 'center',
                        color: COLORS.bluesky,
                        ...FONTS.h5
                    }}>หมายเหตุหรือจุดสังเกตสำหรับคนขับ</Text>
                </View>
                <View>
                    <TextInput style={{
                        marginLeft: 25,
                        padding: 0,
                    }} 
                    onChangeText={(text) => this.onChangeText(text)}
                    placeholder="เพิ่มจุดสังเกตุ"></TextInput>
                </View>
            </View>
        )
    }
}

export default Note;