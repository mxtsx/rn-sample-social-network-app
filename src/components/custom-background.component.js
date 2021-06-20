import React from 'react';
import {StyleSheet, View} from "react-native";
import {theme} from "../theme/theme";
import {useSelector} from "react-redux";
import {getColors} from "../redux/theme.selectors";

export const CustomBackground = ({style, children}) => {

    const colors = useSelector(getColors)

    return (
        <View style={{
            ...styles(colors).contentWrapper,
            ...style}}>
            {children}
        </View>
    );
};

const styles = (colors) => StyleSheet.create({
    contentWrapper: {
        borderRadius: theme.size[2],
        backgroundColor: colors.card,
        shadowColor: colors.cardShadow,
        shadowOpacity: 0.26,
        shadowOffset: {width: 0, height: 2},
        shadowRadius: 8,
        elevation: 5,
        alignItems: 'center'
    }
})