import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../constants';

const Label = ({ text, ...restProps }) => {
  return (
    <View style={styles.root} {...restProps}>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    padding: 8,
    width: 60,
    backgroundColor: COLORS.purple,
    borderRadius: 4,
  },
  text: {
    fontSize: 16,
    color: '#fff',
  },
});

export default Label;