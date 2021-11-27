import axios from 'axios';
import React, { Component } from 'react';
import { TouchableWithoutFeedback, View, Text, StyleSheet } from 'react-native';
import { Icon } from 'react-native-elements';

import { COLORS, FONTS, SIZES } from '../constants';

class MenuButton extends Component {

    handlePress = (routeName) => {
        if (this.props.to === "DriverScreen") {
            checkDriverVerified(routeName)
        }
        else {
            this.props.navigation.navigate(routeName);
        }
        
    }

    checkDriverVerified(route) {
        axios.post('/user/driververify').then((resp) => {
            if(resp.data === "verified") {
                this.props.navigation.navigate(route);
            }
            else {
                alert(resp.data)
            }
            console.log(resp)
        }).catch((e) => {
            console.log(e)
        })
    }

    render() {
        return (
            <TouchableWithoutFeedback onPress={() => this.handlePress(this.props.to)}>
                <View style={styles.menuBox}>
                    <Icon
                        name={this.props.iconName ? this.props.iconName : "question"}
                        type='font-awesome-5'
                        color='#C6BDFF'
                        size={SIZES.width * (15/ 100)}
                    />
                    <View style={styles.bottomLabel}>
                        <Text style={styles.bottomLabelFont}>{this.props.buttonLabel}</Text>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        );
    }
}

const styles = StyleSheet.create({
    menuBox: {
        justifyContent: 'flex-end',
        width: '100%',
        height: SIZES.height * (20 / 100),
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
        justifyContent: 'center',
        alignItems: 'center'
    },
    bottomLabel: {
        margin: 10,
    },
    bottomLabelFont: {
        textAlign: 'center',
        borderRadius: SIZES.radius,
        padding: SIZES.padding,
        backgroundColor: COLORS.white,
        color: COLORS.darkpurple,
        ...FONTS.h4
    }
})

export default MenuButton;