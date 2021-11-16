import React from 'react';
import {StyleSheet, View} from 'react-native';
import { COLORS } from '../../constants';

const RailSelected = () => {
  return (
    <View style={styles.root}/>
  );
};

export default RailSelected;

const styles = StyleSheet.create({
  root: {
    height: 4,
    backgroundColor: COLORS.purple,
    borderRadius: 2,
  },
});