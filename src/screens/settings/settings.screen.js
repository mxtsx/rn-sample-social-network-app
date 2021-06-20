import React, {useCallback, useLayoutEffect} from 'react';
import {StyleSheet} from "react-native";
import {DrawerActions, useFocusEffect, useNavigation} from "@react-navigation/native";
import {HeaderButtons, Item} from "react-navigation-header-buttons";
import {CustomHeaderButtonComponent} from "../../components/custom-header-button.component";
import {isAndroid} from "../../utils/platform.util";
import {theme} from "../../theme/theme";
import {CustomBackground} from "../../components/custom-background.component";
import {CustomSwitchComponent} from "../../components/custom-switch.component";
import {useAvailableWindowParams} from "../../hooks/use-available-window-params.hook";
import {useDispatch, useSelector} from "react-redux";
import {getNightMode} from "../../redux/theme.selectors";
import {changeMode} from "../../redux/theme.reducer";
import {CustomScrollView} from "../../components/custom-scroll-view.component";
import {showToast} from "../../utils/toast.util";

export const SettingsScreen = React.memo(() => {
    const nightMode = useSelector(getNightMode)

    const [width, height] = useAvailableWindowParams()
    const isAlbum = height < width

    const navigation = useNavigation()
    const dispatch = useDispatch()

    useFocusEffect((useCallback(() => {
    }, [])))

    useLayoutEffect(() => {
        navigation.setOptions({
            headerLeft: () => (
                <HeaderButtons HeaderButtonComponent={CustomHeaderButtonComponent}>
                        <Item title={'Toggle Drawer'}
                                iconName={isAndroid
                                    ? 'md-menu'
                                    : 'ios-menu'}
                                onPress={() => navigation.dispatch(DrawerActions.openDrawer())}/>
                </HeaderButtons>
            )
        })
    }, [navigation])

    const switchSize = {
        transform: !isAlbum
            ? [{scaleX: 1.1}, {scaleY: 1.1}]
            : [{scaleX: 1.5}, {scaleY: 1.5}]
    }

    const changeModeHandler = () => {
        dispatch(changeMode(!nightMode))
        showToast('Theme changed!')
    }

    return (
        <CustomScrollView>
           <CustomBackground style={styles.card}>
               <CustomSwitchComponent label={'Night Mode'}
                                      value={nightMode}
                                      fontStyle={{fontSize:
                                              !isAlbum
                                                  ? theme.fontSize.larger
                                                  : theme.fontSize.h4}}
                                      style={styles.switchContainer}
                                      switchStyle={switchSize}
                                      setValue={changeModeHandler}/>
           </CustomBackground>
        </CustomScrollView>
    );
})

const styles = StyleSheet.create({
    container: {
        minHeight: '100%',
        padding: theme.space[2]
    },
    card: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingHorizontal: theme.space[3],
        paddingVertical: theme.space[4]
    },
    switchContainer: {
        width: '85%'
    }
})