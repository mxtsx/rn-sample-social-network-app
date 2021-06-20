import React, {useCallback, useLayoutEffect, useState} from 'react';
import {ActivityIndicator, FlatList, Image, StyleSheet, TouchableOpacity, View} from "react-native";
import {CustomBackground} from "../../components/custom-background.component";
import {theme} from "../../theme/theme";
import {CustomMediumText} from "../../components/custom-medium-text";
import {DrawerActions, useFocusEffect, useNavigation} from "@react-navigation/native";
import {HeaderButtons, Item} from "react-navigation-header-buttons";
import {CustomHeaderButtonComponent} from "../../components/custom-header-button.component";
import {isAndroid} from "../../utils/platform.util";
import {useDispatch, useSelector} from "react-redux";
import {getDialogs as getDialogsSelector, getIsLoading} from "../../redux/dialogs.selectors";
import {CustomBoldText} from "../../components/custom-bold-text";
import {useAvailableWindowParams} from "../../hooks/use-available-window-params.hook";
import {getColors, getNightMode} from "../../redux/theme.selectors";
import {actions, getDialogs} from "../../redux/dialogs.reducer";
import {formatDate} from "../../utils/date-format.util";
import {TouchableAreaComponent} from "../../components/touchable-area.component";
import {wait} from "../../utils/timeout.util";
import {getError} from "../../redux/error.selectors";
import {ErrorComponent} from "../../components/error.component";

export const DialogsScreen = React.memo(() => {
    const [refreshing, setRefreshing] = useState(false)
    const dialogs = useSelector(getDialogsSelector)
    const isLoading = useSelector(getIsLoading)
    const colors = useSelector(getColors)
    const error = useSelector(getError)

    const navigation = useNavigation()
    const dispatch = useDispatch()

    useFocusEffect((useCallback(() => {
        dispatch(getDialogs())
        return () => {
            dispatch(actions.isLoadingChanged(true))
        }
    }, [])))

    useLayoutEffect(() => {
        navigation.setOptions({
            headerLeft: () => (
                <HeaderButtons HeaderButtonComponent={CustomHeaderButtonComponent}>
                    <Item title={'Toggle Drawer'}
                          iconName={isAndroid
                              ? 'md-menu'
                              : 'ios-menu'} onPress={() => navigation.dispatch(DrawerActions.openDrawer())}/>
                </HeaderButtons>
            )
        })
    }, [])

    const onRefreshHandler = useCallback(() => {
        setRefreshing(true)
        dispatch(getDialogs())
        dispatch(actions.isLoadingChanged(false))
        wait(500).then(() => setRefreshing(false))
    }, [])

    const onErrorRefreshHandler = () => {
        dispatch(getDialogs())
    }

    return (
        <View style={{
            ...styles.dialogsWrapper,
            backgroundColor: colors.background
        }}>
            {!error
                ? !isLoading
                    ? !!dialogs?.length
                        ? <FlatList
                            data={dialogs}
                            onRefresh={onRefreshHandler}
                            refreshing={refreshing}
                            keyExtractor={item => item.id.toString()}
                            renderItem={data => <DialogComponent dialog={data.item}/>}/>
                        : <NoDialogs/>
                    : <ActivityIndicator style={{flex: 1}} color={colors.preloader} size={'large'}/>
                : <ErrorComponent
                    onRefreshHandler={onErrorRefreshHandler}
                    disabled={isLoading}
                />}
        </View>
    );
})

const DialogComponent = React.memo(({dialog}) => {
    const [width, height] = useAvailableWindowParams()
    const isAlbum = height < width

    const date = formatDate(new Date(dialog?.lastUserActivityDate))

    const navigation = useNavigation()

    const isNightMode = useSelector(getNightMode)
    const colors = useSelector(getColors)

    return (
        <CustomBackground
            style={{
                ...styles.container,
                minHeight: width / 5
            }}>
            <TouchableOpacity
                style={styles.touchableOpacity}
                activeOpacity={0.7}
                onPress={() => navigation.navigate('Dialog', {id: dialog.id})}
            >
                <View style={styles.profile}>
                    <TouchableAreaComponent
                        onPress={() => navigation.navigate('Profile', {id: dialog.id})}
                    >
                        <View style={{
                            height: width / 7,
                            width: width / 7,
                            borderRadius: width / 7 / 2,
                            overflow: 'hidden',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                        >
                            <Image source={dialog?.photos?.small
                                ? {uri: dialog?.photos?.small}
                                : !isNightMode
                                    ? require('../../../assets/user.png')
                                    : require('../../../assets/user-inverted.png')}
                                   resizeMode={'contain'}
                                   style={styles.image}/>
                        </View>
                    </TouchableAreaComponent>
                    <View style={{
                        ...styles.contactInformation,
                        paddingLeft:
                            !isAlbum
                                ? theme.space[2]
                                : theme.space[4]
                    }}>
                        <View style={styles.contactInformationItem}>
                            <CustomBoldText style={{
                                fontSize:
                                    !isAlbum
                                        ? theme.fontSize.medium
                                        : theme.fontSize.larger,
                                color: colors.text
                            }}>
                                {dialog?.userName}
                            </CustomBoldText>
                        </View>
                        <View style={styles.contactInformationItem}>
                            <CustomMediumText
                                numberOfLines={1}
                                style={{
                                fontSize:
                                    !isAlbum
                                        ? theme.fontSize.medium
                                        : theme.fontSize.larger,
                                color: colors.text
                            }}>
                                Last seen: {date}
                            </CustomMediumText>
                        </View>
                    </View>
                </View>
                {!!dialog?.newMessagesCount &&
                <View style={styles.newMessage}>
                    <View style={{
                        ...styles.newMessageContainer,
                        height:
                            !isAlbum
                                ? width / 16
                                : width / 10 / 2,
                        width:
                            !isAlbum
                                ? width / 16
                                : width / 10 / 2,
                        borderRadius:
                            !isAlbum
                                ? width / 16 / 2
                                : width / 10 / 2,
                        backgroundColor: colors.green
                    }}>
                        <CustomBoldText style={{
                            color: colors.white,
                            fontSize:
                                !isAlbum
                                    ? theme.fontSize.medium
                                    : theme.fontSize.larger
                        }}>
                            {dialog?.newMessagesCount}
                        </CustomBoldText>
                    </View>
                </View>}
            </TouchableOpacity>
        </CustomBackground>
    )
})

const NoDialogs = React.memo(() => {
    const [width, height] = useAvailableWindowParams()
    const isAlbum = height < width

    const colors = useSelector(getColors)

    return(
        <View style={styles.noDialogsContainer}>
            <CustomBoldText style={{
                fontSize:
                    !isAlbum
                        ? theme.fontSize.h3
                        : theme.fontSize.h2,
                color: colors.text
            }}>
                No dialogs to show
            </CustomBoldText>
        </View>
    )
})

const styles = StyleSheet.create({
    dialogsWrapper: {
        flex: 1,
        padding: theme.space[2]
    },
    //Dialogs
    container: {
        padding: theme.space[1],
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: theme.space[2]
    },
    touchableOpacity: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'flex-start'
    },
    profile: {
        width: '85%',
        flexDirection: 'row',
        justifyContent: 'flex-start',
    },
    image: {
        height: '100%',
        width: '100%'
    },
    contactInformation: {
        width: '100%',
        flexDirection: 'column',
        justifyContent: 'center',
    },
    contactInformationItem: {
        width: '85%',
    },
    newMessage: {
        width: '15%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    newMessageContainer: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    //No Dialogs
    noDialogsContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})