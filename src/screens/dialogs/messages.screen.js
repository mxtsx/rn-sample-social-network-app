import React, {useCallback, useState} from 'react';
import {ActivityIndicator, Alert, Keyboard, RefreshControl, StyleSheet, TouchableOpacity, View} from "react-native";
import {CustomMediumText} from "../../components/custom-medium-text";
import {useFocusEffect, useRoute} from "@react-navigation/native";
import {useDispatch, useSelector} from "react-redux";
import {
    actions,
    addToRemoved,
    getMessages,
    getNextPageMessages,
    removeMessage,
    restoreMessage,
    sendMessage
} from "../../redux/dialogs.reducer";
import {
    getIsLoading,
    getMessages as getMessagesSelector,
    getNextPageMessages as getNextPageMessagesSelector,
    getRemoved
} from "../../redux/dialogs.selectors";
import {getColors} from "../../redux/theme.selectors";
import {CustomBackground} from "../../components/custom-background.component";
import {useAvailableWindowParams} from "../../hooks/use-available-window-params.hook";
import {CustomBoldText} from "../../components/custom-bold-text";
import {theme} from "../../theme/theme";
import {getId} from "../../redux/auth.selectors";
import {isAndroid} from "../../utils/platform.util";
import {Ionicons} from "@expo/vector-icons";
import {formatDate} from "../../utils/date-format.util";
import {ChatContainerComponent} from "../../components/chat-container.component";
import {wait} from "../../utils/timeout.util";

export const MessagesScreen = React.memo(() => {
    const [refreshing, setRefreshing] = useState(false)
    const [isScrolling, setIsScrolling] = useState(true)
    const [text, setText] = useState('')
    const [currentPage, setCurrentPage] = useState(1)

    const areNextPageMessages = useSelector(getNextPageMessagesSelector)
    const messages = useSelector(getMessagesSelector)
    const colors = useSelector(getColors)
    const isDisabled = useSelector(getIsLoading)
    const id = useRoute().params?.id

    const dispatch = useDispatch()

    const loadData = (id, currentPage) => {
        dispatch(getMessages(id, currentPage, 10))
            .then(() => {
                if(refreshing) {
                    setRefreshing(false)
                }
                if(!isScrolling) {
                    wait(500).then(() => setIsScrolling(true))
                }
            })
        dispatch(getNextPageMessages(id, currentPage + 1, 10))
    }

    useFocusEffect((useCallback(() => {
        loadData(id, currentPage)
    }, [currentPage])))

    useFocusEffect(useCallback(() => {
        return () => {
            dispatch(actions.messagesCleared())
            setIsScrolling(true)
        }
    }, []))

    const onRefreshHandler = () => {
        if(areNextPageMessages) {
            setRefreshing(true)
            setIsScrolling(false)
            setCurrentPage(prev => prev + 1)
        }
    }

    const onSubmitHandler = async () => {
        if(text.trim()) {
            await dispatch(sendMessage(id, text))
            setText('')
            Keyboard.dismiss()
        }
    }

    return(
        <ChatContainerComponent
            submitHandler={() => onSubmitHandler(text)}
            inputIsDisabled={isDisabled}
            text={text}
            scrollOnChange={isScrolling}
            setText={setText}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    enabled={!!messages?.length && messages?.length > 9 && areNextPageMessages}
                    onRefresh={onRefreshHandler}
                    colors={[colors.primary]}
                    tintColor={colors.primary}
                />
            }
        >
            {messages !== null
                ? !!messages?.length
                    ? messages?.map(m => {
                        return <Message key={m?.id} message={m} setIsScrolling={setIsScrolling}/>
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
})

const NoMessages = React.memo(() => {
    const [width, height] = useAvailableWindowParams()
    const isAlbum = height < width

    return(
        <View style={{...styles.noMessagesContainer}}>
            <CustomBoldText style={{
                fontSize:
                    !isAlbum
                        ? theme.fontSize.h3
                        : theme.fontSize.h2,
                textAlign: 'center'
            }}>
                No messages to show
            </CustomBoldText>
        </View>
    )
})

const Message = React.memo(({message, setIsScrolling}) => {
    const [width, height] = useAvailableWindowParams()
    const isAlbum = height < width

    const dispatch = useDispatch()

    const isRemoved = useSelector(getRemoved).some(id => id === message?.id)
    const date = formatDate(new Date(message?.addedAt))
    const colors = useSelector(getColors)
    const id = useSelector(getId)

    const isAuthor = id === message?.senderId

    const onDeleteHandler = () => {
        Alert.alert(
            'Delete this message?',
            'Message will be deleted only for you',
            [{
                text: 'Cancel',
                style: 'cancel'
            },
                {
                    text: 'Delete',
                    onPress: () => dispatch(addToRemoved(message?.id))
                }]
        )
    }

    if(isRemoved) {
        return <DeletedMessage id={message?.id} userId={message?.senderId} setIsScrolling={setIsScrolling} />
    }

    return (
        <CustomBackground
            style={{
                backgroundColor:
                    !isAuthor
                        ? colors.message
                        : colors.authorMessage,
                minHeight: !isAlbum
                    ? width / 6
                    : width / 10,
                marginBottom: theme.space[1]
            }}>
            <TouchableOpacity
                activeOpacity={0.7}
                onLongPress={onDeleteHandler}
                style={{
                    ...styles.messageWrapper,
                    flexDirection: 'row',
                    paddingHorizontal:
                        !isAlbum
                            ? theme.space[3]
                            : theme.space[4]
                }}>
                <View style={{
                    ...styles.messageTextContainer
                }}>
                    <View style={styles.messageText}>
                        <CustomBoldText
                            style={{
                                fontSize:
                                    !isAlbum
                                        ? theme.fontSize.large
                                        : theme.fontSize.h4,
                            }}>
                            {message?.senderName}
                        </CustomBoldText>
                    </View>
                    <View style={styles.messageText}>
                        <CustomMediumText
                            style={{
                                fontSize:
                                    !isAlbum
                                        ? theme.fontSize.large
                                        : theme.fontSize.larger,
                            }}>
                            {message?.body}
                        </CustomMediumText>
                    </View>
                </View>
                <View style={{
                    ...styles.informationWrapper
                }}>
                    <View>
                        <Ionicons
                            name={
                                message?.viewed
                                    ? !isAndroid
                                    ? 'ios-eye'
                                    : 'md-eye'
                                    : !isAndroid
                                    ? 'ios-eye-off'
                                    : 'md-eye-off'
                            }
                            color={colors.icon}
                            size={
                                !isAlbum
                                    ? 20
                                    : 24
                            }/>
                    </View>
                    <View>
                        <CustomMediumText
                            style={{
                                ...styles.messageSent,
                                color: colors.text,
                                fontSize:
                                    !isAlbum
                                        ? theme.fontSize.small
                                        : theme.fontSize.medium,
                            }}>
                            {date}
                        </CustomMediumText>
                    </View>
                </View>
            </TouchableOpacity>
        </CustomBackground>
    )
})

const DeletedMessage = React.memo(({id, userId, setIsScrolling}) => {
    const [width, height] = useAvailableWindowParams()
    const isAlbum = height < width

    const colors = useSelector(getColors)
    const dispatch = useDispatch()

    const ownerId = useSelector(getId)

    const isAuthor = ownerId === userId

    const onRestoreHandler = () => {
        dispatch(restoreMessage(id))
    }

    const onRemoveHandler = () => {
        setIsScrolling(false)
        dispatch(removeMessage(id))
    }

    return(
        <CustomBackground
            style={{
                ...styles.messageWrapper,
                ...styles.removedMessage,
                flexDirection: 'row',
                paddingHorizontal:
                    !isAlbum
                        ? theme.space[3]
                        : theme.space[6],
                backgroundColor:
                    !isAuthor
                        ? colors.message
                        : colors.authorMessage,
                minHeight:
                    !isAlbum
                        ? width / 6
                        : width / 10
            }}>
            <View style={styles.removedMessageText}>
                <View style={styles.icon}>
                    <TouchableOpacity
                        onPress={onRestoreHandler}
                        activeOpacity={0.7}>
                        <Ionicons
                            name={
                                !isAndroid
                                    ? 'ios-close-circle'
                                    : 'md-close-circle'}
                            size={
                                !isAlbum
                                    ? 26
                                    : 35}
                        />
                    </TouchableOpacity>
                </View>
                <View>
                    <CustomBoldText style={{
                        fontSize:
                            !isAlbum
                                ? theme.fontSize.larger
                                : theme.fontSize.h4
                    }}>
                        Message was deleted
                    </CustomBoldText>
                </View>
                <View style={styles.icon}>
                    <TouchableOpacity
                        onPress={onRemoveHandler}
                        activeOpacity={0.7}>
                        <Ionicons
                            name={
                                !isAndroid
                                    ? 'ios-checkmark-circle'
                                    : 'md-checkmark-circle'}
                            size={
                                !isAlbum
                                    ? 26
                                    : 35}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        </CustomBackground>
    )
})

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
        paddingVertical: theme.space[2]
    },
    informationWrapper: {
        width: '40%',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-end'
    },
    messageTextContainer: {
        width: '60%',
        justifyContent: 'center',
        alignItems:'flex-start'
    },
    messageText: {
        width: '100%'
    },
    messageSent: {
        fontStyle: 'italic',
        textAlign: 'right'
    },
    //Deleted message
    removedMessage: {
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: theme.space[1]
    },
    removedMessageText: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    icon: {
        overflow: 'hidden'
    }
})