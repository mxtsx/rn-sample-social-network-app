import React, {useCallback, useLayoutEffect, useState} from 'react';
import {ActivityIndicator, Image, Keyboard, StyleSheet, View} from "react-native";
import {DrawerActions, useFocusEffect, useNavigation} from "@react-navigation/native";
import {HeaderButtons, Item} from "react-navigation-header-buttons";
import {CustomHeaderButtonComponent} from "../../components/custom-header-button.component";
import {isAndroid} from "../../utils/platform.util";
import {theme} from "../../theme/theme";
import {CustomBackground} from "../../components/custom-background.component";
import {useAvailableWindowParams} from "../../hooks/use-available-window-params.hook";
import {CustomBoldText} from "../../components/custom-bold-text";
import {CustomMediumText} from "../../components/custom-medium-text";
import {useDispatch, useSelector} from "react-redux";
import {sendMessageToChat, startMessagesListening, stopMessagesListening} from "../../redux/chat.reducer";
import {getIsAdded, getMessages, getStatus} from "../../redux/chat.selectors";
import {getId} from "../../redux/auth.selectors";
import {getColors, getNightMode} from "../../redux/theme.selectors";
import {TouchableAreaComponent} from "../../components/touchable-area.component";
import {ChatContainerComponent} from "../../components/chat-container.component";

export const ChatScreen = () => {
    const [text, setText] = useState('')

    const navigation = useNavigation()
    const dispatch = useDispatch()

    useFocusEffect((useCallback(() => {
        dispatch(startMessagesListening())
        return () => {
            dispatch(stopMessagesListening())
        }
    }, [])))

    useLayoutEffect(() => {
        navigation.setOptions({
            title: 'Community Chat',
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

    const colors = useSelector(getColors)
    const status = useSelector(getStatus)
    const messages = useSelector(getMessages)
    const isAdded = useSelector(getIsAdded)

    const isDisabled = status !== 'Ready' || !isAdded

    const onSubmitHandler = () => {
        if(text.trim() && !isDisabled) {
            dispatch(sendMessageToChat(text))
            setText('')
            Keyboard.dismiss()
        }
    }

    return(
        <ChatContainerComponent
            text={text}
            setText={setText}
            submitHandler={onSubmitHandler}
            inputIsDisabled={isDisabled}
        >
            {status === 'Ready' && isAdded
                ? !!messages.length
                    ? messages.map(m => {
                        return <Message message={m} key={m?.id}/>
                    })
                    : <NoMessages/>
                : <ActivityIndicator
                    color={colors.primary}
                    size={'large'}
                    style={{flex: 1}}
                />
            }
        </ChatContainerComponent>
    )
}

const NoMessages = () => {
    const [width, height] = useAvailableWindowParams()
    const isAlbum = height < width

    return(
        <View style={{...styles.noMessagesContainer}}>
            <CustomBoldText style={{
                fontSize:
                    !isAlbum
                        ? theme.fontSize.h3
                        : theme.fontSize.h2}}>
                No messages to show
            </CustomBoldText>
        </View>
    )
}

const Message = ({message}) => {
    const [width, height] = useAvailableWindowParams()
    const isAlbum = height < width

    const isNightMode = useSelector(getNightMode)
    const colors = useSelector(getColors)
    const id = useSelector(getId)

    const navigation = useNavigation()

    const isAuthor = id === message?.userId

    return(
        <CustomBackground style={{
            ...styles.messageWrapper,
            minHeight: !isAlbum
                ? width / 6
                : width / 10,
            backgroundColor:
                !isAuthor
                    ? colors.message
                    : colors.authorMessage,
            flexDirection:
                !isAuthor
                    ? 'row'
                    : 'row-reverse'
        }}>
            <TouchableAreaComponent
                onPress={() => navigation.navigate('Profile', {id: message?.userId})}>
                <View
                    style={{
                        ...styles.messageImageContainer,
                        height: width / 10,
                        width: width / 10,
                        borderRadius: width / 10 / 2,
                    }}>
                    <Image style={{...styles.messageImage}}
                           source={
                               message?.photo
                                   ? {uri: message?.photo}
                                   : !isNightMode
                                   ? require('../../../assets/user.png')
                                   : require('../../../assets/user-inverted.png')}
                    />
                </View>
            </TouchableAreaComponent>
            <View style={{
                ...styles.messageTextContainer,
                marginLeft:
                    !isAlbum
                        ? theme.space[0]
                        : theme.space[2],
                alignItems:
                    !isAuthor
                        ? 'flex-start'
                        : 'flex-end'}}>
                <View>
                    <CustomBoldText
                        style={{fontSize:
                                !isAlbum
                                    ? theme.fontSize.large
                                    : theme.fontSize.h4}}>
                        {message?.userName}
                    </CustomBoldText>
                </View>
                <View>
                    <CustomMediumText
                        style={{fontSize:
                                !isAlbum
                                    ? theme.fontSize.large
                                    : theme.fontSize.larger}}>
                        {message?.message}
                    </CustomMediumText>
                </View>
            </View>
        </CustomBackground>
    )
}

const styles = StyleSheet.create({
    //No Messages
    noMessagesContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    //Message
    messageWrapper: {
        width: '100%',
        paddingVertical: theme.space[2],
        marginVertical: theme.size[1]
    },
    messageImageContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        marginHorizontal: theme.space[2]
    },
    messageImage: {
        height: '100%',
        width: '100%'
    },
    messageTextContainer: {
        width: '80%',
        justifyContent: 'center'
    }
})