import React from 'react';
import {HeaderButton} from "react-navigation-header-buttons";
import {Ionicons} from "@expo/vector-icons";
import {useSelector} from "react-redux";
import {getColors, getNightMode} from "../redux/theme.selectors";
import {isAndroid} from "../utils/platform.util";

export const CustomHeaderButtonComponent = (props) => {
    const colors = useSelector(getColors)
    const isNightMode = useSelector(getNightMode)
    return <HeaderButton {...props}
                         color={
                             !isNightMode
                                 ? isAndroid
                                     ? colors.white
                                     : colors.primary
                                 : colors.white
                         }
                         iconSize={23}
                         IconComponent={Ionicons}/>
}