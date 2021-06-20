import {useSelector} from "react-redux";
import {getColors} from "../redux/theme.selectors";
import React, {useRef} from "react";
import {isAndroid} from "../utils/platform.util";
import {KeyboardAvoidingView, ScrollView, StyleSheet, TextInput, TouchableWithoutFeedback, View} from "react-native";
import {CustomBackground} from "./custom-background.component";
import {theme} from "../theme/theme";
import {useAvailableWindowParams} from "../hooks/use-available-window-params.hook";
import {Ionicons} from "@expo/vector-icons";

export const ChatContainerComponent = ({text, setText, inputIsDisabled, submitHandler, children, scrollOnChange, ...props}) => {

    const colors = useSelector(getColors)

    return (
        <View
            style={{
                ...styles.container,
                backgroundColor: colors.background
            }}
        >
            <Chat children={children}
                  scrollOnChange={scrollOnChange}
                  {...props} />
            <Input
                text={text}
                setText={setText}
                submitHandler={submitHandler}
                inputIsDisabled={inputIsDisabled}/>
        </View>
    );
};

const Chat = ({children, scrollOnChange = true, ...props}) => {
    const scrollViewRef = useRef()

    const colors = useSelector(getColors)

    return(
        <CustomBackground style={{
            ...styles.card,
        }}>
            <ScrollView ref={scrollViewRef}
                        onContentSizeChange={
                            !!scrollOnChange
                                ? () => scrollViewRef?.current?.scrollToEnd({
                                    animated: true,
                                    duration: 300
                                })
                                : () => {}}
                        contentContainerStyle={{
                            ...styles.chat,
                            backgroundColor: colors.grayish
                        }}
                        {...props}
            >
                {children}
            </ScrollView>
        </CustomBackground>
    )
}

const Input = ({text, setText, inputIsDisabled, submitHandler}) => {
    const colors = useSelector(getColors)

    const [width, height] = useAvailableWindowParams()
    const isAlbum = height < width

    let InputContainer = View
    if(!isAndroid) {
        InputContainer = KeyboardAvoidingView
    }

    return (
        <InputContainer style={{...styles.inputContainer}}
                        behavior={'padding'}
                        keyboardVerticalOffset={!isAlbum ? 60 : 40}>
            <CustomBackground style={{...styles.inputWrapper}}>
                <TextInput placeholder={'Your message'}
                           value={text}
                           name={'message'}
                           id={'message'}
                           placeholderTextColor={colors.placeholder}
                           onChangeText={setText}
                           onSubmitEditing={submitHandler}
                           style={{
                               ...styles.input,
                               borderColor: colors.element,
                               color: colors.text
                           }}/>
                <TouchableWithoutFeedback
                    onPress={submitHandler}
                    disabled={inputIsDisabled}>
                    <View style={{...styles.buttonContainer}}>
                        <Ionicons name={'navigate-circle'}
                                  color={!inputIsDisabled
                                      ? colors.element
                                      : colors.grayish}
                                  size={!isAlbum ? 30 : 35}
                        />
                    </View>
                </TouchableWithoutFeedback>
            </CustomBackground>
        </InputContainer>
    )
};


const styles = StyleSheet.create({
    container: {
        height: '100%',
        padding: theme.space[2]
    },
    //Chat
    card: {
        flex: 0.89,
        padding: theme.space[2],
        marginBottom: theme.space[2]
    },
    chat: {
        minWidth: '100%',
        minHeight: '100%',
        borderRadius: theme.size[2],
        overflow: 'hidden',
        justifyContent: 'flex-start',
        padding: theme.space[1],
    },
    //Input
    inputContainer: {
        width: '100%',
        position: 'absolute',
        bottom: 0
    },
    inputWrapper: {
        flex: 0.1,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: theme.space[2],
        marginBottom: theme.space[2],
        marginHorizontal: theme.space[2],
    },
    input: {
        width: '88%',
        height: '100%',
        borderWidth: 2,
        borderRadius: theme.size[2],
        padding: theme.space[2]
    },
    buttonContainer: {
        width: '10%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden'
    }
})