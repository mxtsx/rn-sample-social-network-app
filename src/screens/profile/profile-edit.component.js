import {useAvailableWindowParams} from "../../hooks/use-available-window-params.hook";
import {Image, StyleSheet, TextInput, View} from "react-native";
import {CustomBoldText} from "../../components/custom-bold-text";
import {theme} from "../../theme/theme";
import React, {useCallback, useState} from "react";
import {CustomBackground} from "../../components/custom-background.component";
import {CustomSwitchComponent} from "../../components/custom-switch.component";
import {Ionicons} from "@expo/vector-icons";
import {isAndroid} from "../../utils/platform.util";
import {ImagePickerComponent} from "../../components/image-picker.component";
import {useSelector} from "react-redux";
import {getColors, getNightMode} from "../../redux/theme.selectors";
import {useFocusEffect} from "@react-navigation/native";

export const ProfileEdit = React.memo(({profile, setUpdatedProfile, image, setImage}) => {
    const [name, setName] = useState(profile.fullName ? profile.fullName : '')
    const [lookingForAJob, setLookingForAJob] = useState(profile.lookingForAJob)
    const [aboutMe, setAboutMe] = useState(profile.aboutMe ? profile.aboutMe : '')
    const [skills, setSkills] = useState(profile.lookingForAJobDescription ? profile.lookingForAJobDescription : '')
    const [contacts, setContacts] = useState(profile.contacts)

    const isNightMode = useSelector(getNightMode)
    const colors = useSelector(getColors)
    const [width] = useAvailableWindowParams()

    useFocusEffect(useCallback(() => {
        setUpdatedProfile({
            fullName: name,
            lookingForAJob,
            aboutMe,
            lookingForAJobDescription: skills,
            contacts: contacts
        })
    }, [name, lookingForAJob, aboutMe, skills, contacts]))

    return(
        <CustomBackground style={styles.container}>
            <View style={styles.medContainer}>
                <View style={{width: width / 3}}>
                        <View style={{
                            ...styles.imageWrapper,
                            height: width / 3,
                            width: width / 3,
                            borderRadius: width / 3 / 2
                        }}
                        >
                            <ImagePickerComponent image={image}
                                                  style={styles.image}
                                                  setImage={setImage}>
                                <Image source={profile?.photos?.large
                                    ? {uri: profile?.photos?.large}
                                    : !isNightMode
                                        ? require('../../../assets/user.png')
                                        : require('../../../assets/user-inverted.png')}
                                       style={styles.image}/>
                            </ImagePickerComponent>
                        </View>
                        <Ionicons style={styles.icon}
                                  name={isAndroid
                                      ? 'md-camera-sharp'
                                      : 'ios-camera-sharp'}
                                  color={colors.photoIcon}
                                  size={40}/>
                </View>
                <View>
                        <CustomBoldText style={styles.item}>
                            Name:
                        </CustomBoldText>
                        <TextInput value={name}
                                   name={'name'}
                                   id={'name'}
                                   placeholderTextColor={colors.placeholder}
                                   onChangeText={setName}
                                   style={{
                                       ...styles.input,
                                       width: width / 1.3,
                                       borderBottomColor: colors.secondary,
                                       color: colors.text
                                   }}
                                   placeholder={'Name'}/>
                    </View>
                    <View style={{...styles.itemContainer, alignItems: 'center', marginVertical: !isAndroid ? theme.space[2] : 0}}>
                        <CustomSwitchComponent label={'Looking for a job:'}
                                               fontStyle={{
                                                   ...styles.item,
                                                   marginRight:
                                                       !isAndroid
                                                           ? theme.space[2]
                                                           : theme.space[0]
                                               }}
                                               value={lookingForAJob}
                                               setValue={setLookingForAJob}/>
                    </View>
                <View>
                    <CustomBoldText style={styles.item}>
                        About me:
                    </CustomBoldText>
                    <TextInput value={aboutMe}
                               name={'about'}
                               id={'about'}
                               placeholderTextColor={colors.placeholder}
                               onChangeText={setAboutMe}
                               style={{
                                   ...styles.input,
                                   width: width / 1.3,
                                   borderBottomColor: colors.secondary,
                                   color: colors.text
                               }}
                               placeholder={'Some information about you'}/>
                </View>
                <View>
                    <CustomBoldText style={styles.item}>
                        Skills:
                    </CustomBoldText>
                    <TextInput value={skills}
                               name={'skills'}
                               id={'skills'}
                               placeholderTextColor={colors.placeholder}
                               onChangeText={setSkills}
                               style={{
                                   ...styles.input,
                                   width: width / 1.3,
                                   borderBottomColor: colors.secondary,
                                   color: colors.text
                               }}
                               placeholder={'Describe your skills'}/>
                </View>
                <View>
                    <CustomBoldText style={styles.item}>
                        Contacts:
                    </CustomBoldText>
                    {Object.keys(profile.contacts).map((key) => {
                        return <Contact width={width}
                                        key={key}
                                        setContacts={setContacts}
                                        contactKey={key}
                                        contacts={contacts}
                                        contactValue={profile?.contacts[key]}/>
                    })}
                </View>
            </View>
        </CustomBackground>
    )
})

const Contact = React.memo(({contactKey, contactValue, contacts, setContacts, width, ...props}) => {
    const [value, setValue] = useState(contactValue)

    const colors = useSelector(getColors)

    const onEndEditingHandler = () => {
        setContacts({
            ...contacts,
            [contactKey]: value
        })
    }

    return (
        <View {...props}>
            <CustomBoldText style={{...styles.item, ...styles.contactKey}}>
                {contactKey}:
            </CustomBoldText>
            <TextInput value={value}
                       name={'about'}
                       id={'about'}
                       placeholderTextColor={colors.placeholder}
                       onChangeText={setValue}
                       onSubmitEditing={onEndEditingHandler}
                       onBlur={onEndEditingHandler}
                       style={{
                           ...styles.input,
                           width: width / 1.3,
                           borderBottomColor: colors.secondary,
                           color: colors.text
                       }}
                       placeholder={`${contactKey}`}/>
        </View>
    )
})

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: theme.space[5],
        paddingHorizontal: theme.space[3]
    },
    medContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    imageWrapper: {
        overflow: 'hidden',
    },
    icon: {
        position: 'absolute',
        bottom: 0,
        right: 0
    },
    image: {
        height: '100%',
        width: '100%'
    },
    lookingForAJob: {
        height: theme.size[4],
        width: theme.size[4],
        borderRadius: theme.size[4] / 2,
        marginLeft: theme.space[2]
    },
    item: {
        marginTop: theme.space[2],
        fontSize: theme.fontSize.larger
    },
    itemContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
    },
    itemInRow: {
        marginLeft: theme.space[2]
    },
    input: {
        fontSize: theme.fontSize.larger,
        borderBottomWidth: 1,
        paddingVertical: theme.space[1],
        fontStyle: 'italic'
    },
    //contacts
    contactKey: {
        fontStyle: 'italic',
        fontWeight: theme.fontWeight.bolder
    }
})