import { Dimensions } from "react-native";
const { width, height } = Dimensions.get("window");

export const COLORS = {
    primary: "#8A79FF",
    secondary: "#E2DEFF",

    black: "#1E1F20",
    white: "#FFFFFF",
    red: "#ec4949",
    bluesky: "#5F98CD",


    lightGray: "#525252",
    lightGray2: "#838383",
    lightGray3: "#F4F4F4",
    transparent: "transparent",
    lightRed: '#FFE0E0',

    purple: '#A699FE',
    darkpurple: "#221B52",
}

export const SIZES = {
    base: 8,
    font: 14,

    radius: 15,
    radius2: 5,

    padding: 8,

    title: 22,

    margin: 15,
    top: 65,

    appTitle: 68,
    appSubtitle: 48,

    h1: 30,
    h2: 22,
    h3: 20,
    h4: 18,
    h5: 16,

    body1: 30,
    body2: 20,
    body3: 16,
    body4: 14,
    body5: 12,

    //app dimensions
    width,
    height
}

export const FONTS = {
    title: {
        fontFamily: "Roboto-Black",
        fontSize: SIZES.appTitle,
        lineHeight: 68,
    },

    subtitle: {
        fontFamily: "Roboto-Black",
        fontSize: SIZES.appSubtitle,
        lineHeight: 52,
    },

    h1: {
        fontFamily: "Roboto-Black",
        fontSize: SIZES.h1,
        lineHeight: 36,
    },
    h2: {
        fontFamily: "Roboto-Bold",
        fontSize: SIZES.h2,
        lineHeight: 30,
    },
    h3: {
        fontFamily: "Roboto-Bold",
        fontSize: SIZES.h3,
        lineHeight: 22,
    },
    h4: {
        fontFamily: "Roboto-Bold",
        fontSize: SIZES.h4,
        lineHeight: 22,
    },
    h5: {
        fontFamily: "Roboto-Bold",
        fontSize: SIZES.h5,
        lineHeight: 22,
    },

    body1: {
        fontFamily: "Roboto-Regular",
        fontSize: SIZES.body1,
        lineHeight: 36,
    },
    body2: {
        fontFamily: "Roboto-Regular",
        fontSize: SIZES.body2,
        lineHeight: 30,
    },
    body3: {
        fontFamily: "Roboto-Regular",
        fontSize: SIZES.body3,
        lineHeight: 22,
    },
    body4: {
        fontFamily: "Roboto-Regular",
        fontSize: SIZES.body4,
        lineHeight: 22,
    },
    body5: {
        fontFamily: "Roboto-Regular",
        fontSize: SIZES.body5,
        lineHeight: 22,
    },
}

export const MAPS = {
    markerSize: {
        height: 32,
        width: 32,
    }, 
    carImageSize: {
        height: 60,
        width: 32,
    }
}

const appTheme = { COLORS, SIZES, FONTS, MAPS };

export default appTheme;