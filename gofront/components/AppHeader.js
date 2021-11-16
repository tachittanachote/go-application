import React, { Component } from 'react';
import { View, Text } from 'react-native';

import { COLORS, FONTS, SIZES } from '../constants';

class AppHeader extends Component {
    render() {
        return (
            <View
                style={{
                    flex: 1,
                    width: '100%',
                    marginTop: SIZES.height * (10 / 100),
                }}>
                <Text
                    style={{
                        textAlign: 'center',
                        color: COLORS.white,
                        ...FONTS.title,
                    }}>
                    Go
                </Text>
                <Text
                    style={{
                        textAlign: 'center',
                        color: COLORS.white,
                        ...FONTS.body3,
                    }}>
                    แอปฯ ที่ตอบทุกโจทย์ในชีวิตประจำวันของคุณ
                </Text>
            </View>
        );
    }
}

export default AppHeader;
