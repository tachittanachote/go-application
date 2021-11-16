import React, { Component } from 'react';
import { Text } from 'react-native';

import { COLORS, SIZES, FONTS } from '../constants';

class Title extends Component {
  render() {
    return (
        <Text style={{
            color: COLORS.darkpurple,
            marginBottom: SIZES.margin,
            ...FONTS.h4
        }}>{this.props.title}</Text>
    );
  }
}

export default Title;