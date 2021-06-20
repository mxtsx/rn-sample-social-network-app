import React from 'react';
import {ScrollView} from "react-native";
import {theme} from "../theme/theme";
import {useSelector} from "react-redux";
import {getColors} from "../redux/theme.selectors";

export const CustomScrollView = ({contentContainerStyle, children, ...props}) => {
    const colors = useSelector(getColors)
    return (
        <ScrollView
            contentContainerStyle={{
                ...styles.container,
                ...contentContainerStyle,
                backgroundColor: colors.background
            }}
            {...props}>
            {children}
        </ScrollView>
    )
}

const styles = {
    container: {
        minHeight: '100%',
        padding: theme.space[2]
    }
}