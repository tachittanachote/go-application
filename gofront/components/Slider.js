import React, { Component } from 'react';
import { ScrollView, View, Image, StyleSheet } from 'react-native';
import { SIZES, images } from '../constants';


class Slider extends Component {
    render() {
        return (
            <View style={styles.slide}>
                <ScrollView
                    horizontal={true}
                >
                    <View style={styles.slideContent}>
                        <Image style={styles.images} source={images.slide_1}></Image>
                    </View>
                    <View style={styles.slideContent}>
                        <Image style={styles.images} source={images.slide_1}></Image>
                    </View>
                    <View style={styles.lastSlideContent}>
                        <Image style={styles.images} source={images.slide_1}></Image>
                    </View>
                    
                </ScrollView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    images: { 
        height: 160, 
        width: 380,
        borderRadius: 10
    },
    slide: {
        padding: SIZES.padding
    },
    slideContent: {
        marginRight: 10
    },
    lastSlideContent: {
        marginRight: 0
    }
})

export default Slider;