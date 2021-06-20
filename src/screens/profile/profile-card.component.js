import {useAvailableWindowParams} from "../../hooks/use-available-window-params.hook";
import {ActivityIndicator, Image, StyleSheet, TextInput, TouchableOpacity, View} from "react-native";
import {CustomBoldText} from "../../components/custom-bold-text";
import {CustomMediumText} from "../../components/custom-medium-text";
import {theme} from "../../theme/theme";
import {CustomButtonComponent} from "../../components/custom-button.component";
import React, {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {actions, setUserStatus} from "../../redux/profile.reducer";
import {CustomBackground} from "../../components/custom-background.component";
import {followUser, unfollowUser} from "../../redux/users.reducer";
import {getFollowingIsFetching} from "../../redux/users.selectors";
import {getIsFollowed, getStatus} from "../../redux/profile.selectors";
import {getColors, getNightMode} from "../../redux/theme.selectors";

export const ProfileCard = React.memo(({profile, isOwner}) => {
    const [statusEditMode, setStatusEditMode] = useState(false)

    const [width, height] = useAvailableWindowParams()
    const isAlbum = height < width

    const isNightMode = useSelector(getNightMode)
    const colors = useSelector(getColors)
    const status = useSelector(getStatus)
    const isFollowed = useSelector(getIsFollowed)
    const isFollowingFetching = useSelector(getFollowingIsFetching).some(id => id === profile.userId)
    const isContactInformation = Object.values(profile.contacts).map(v => v).some(r => r)

    const dispatch = useDispatch()

    const followUnfollowHandler = (id, name) => {
        !isFollowed ? dispatch(followUser(id, name)) : dispatch(unfollowUser(id, name))
        dispatch(actions.userIsFollowed(!isFollowed))
    }

    return(
        <CustomBackground style={styles.container}>
            <View style={{
                ...styles.topContainer
            }}>
                <View style={{width: isAlbum ? width / 2 : width / 3, alignItems: 'center'}}>
                    <View style={{
                        ...styles.imageWrapper,
                        height: width / 3,
                        width: width / 3,
                        borderRadius: width / 3 / 2}}
                    >
                        <Image style={styles.image}
                               resizeMode={'contain'}
                               source={profile?.photos?.large
                                   ? {uri: profile?.photos?.large}
                                   : !isNightMode
                                       ? require('../../../assets/user.png')
                                       : require('../../../assets/user-inverted.png')} />
                    </View>
                </View>
                <View style={{
                    ...styles.descriptionContainer,
                    width: width / 2,
                }}>
                    <View>
                        <CustomBoldText style={styles.name}>
                            {profile?.fullName}
                        </CustomBoldText>
                    </View>
                    {!statusEditMode
                        ? <View>
                            <TouchableOpacity activeOpacity={0.7}
                                              onLongPress={() => {
                                                  setStatusEditMode(true)
                                              }}>
                                <Status status={status} isOwner={isOwner} />
                            </TouchableOpacity>
                        </View>
                        : isOwner
                            ? <EditStatus status={status} setEditMode={setStatusEditMode}/>
                            : <Status status={status} isOwner={isOwner} />}
                    <View style={{...styles.itemContainer, justifyContent: 'center', alignItems: 'center'}}>
                        <CustomBoldText style={{...styles.item}}>
                            Looking for a job
                        </CustomBoldText>
                        <View style={{...styles.lookingForAJob, backgroundColor: !!profile?.lookingForAJob
                                ? colors.green
                                : colors.alert}} />
                    </View>
                </View>
            </View>
            <View style={{...styles.medContainer, alignItems: isAlbum ? 'center' : 'flex-start'}}>
                {!isOwner &&
                <View style={styles.buttonContainer}>
                    <CustomButtonComponent
                        onPress={() => followUnfollowHandler(profile?.userId, profile?.fullName)}
                        disabled={isFollowingFetching}
                        style={{minWidth: width / 4}}
                        color={isFollowingFetching && colors.grayish}>
                        {isFollowed === null
                            ? <ActivityIndicator
                                style={{flex: 1}}
                                size={'small'}
                                color={colors.background}/>
                            : !isFollowed
                                ? 'Follow'
                                : 'Unfollow'}
                    </CustomButtonComponent>
                </View>}
                {!!profile?.aboutMe &&
                    <View style={{...styles.itemContainer, justifyContent: isAlbum ? 'center' : 'flex-start'}}>
                        <CustomBoldText style={styles.item}>About me: </CustomBoldText>
                        <CustomMediumText style={{...styles.item}}>
                            {profile?.aboutMe}
                        </CustomMediumText>
                    </View>}
                    {!!profile?.lookingForAJob &&
                    <View style={{...styles.itemContainer, justifyContent: isAlbum ? 'center' : 'flex-start'}}>
                        <CustomBoldText style={styles.item}>Skills: </CustomBoldText>
                        <CustomMediumText style={{...styles.item}}>
                            {profile?.lookingForAJobDescription}
                        </CustomMediumText>
                    </View>}
                {isContactInformation &&
                <View>
                    <CustomBoldText style={{...styles.item, ...styles.title}}>
                        Contacts:
                    </CustomBoldText>
                    {Object.keys(profile?.contacts).map((key) => {
                        return <Contact key={key} contactKey={key} contactValue={profile?.contacts[key]}/>
                    })}
                </View>}
            </View>
        </CustomBackground>
    )
})

const Contact = React.memo(({contactKey, contactValue, ...props}) => {
    return (
        <View {...props}>
            {!!contactValue &&
            <View style={{...styles.itemContainer}}>
                <CustomBoldText style={{...styles.item, ...styles.contactKey}}>{contactKey}: </CustomBoldText>
                <CustomMediumText style={{...styles.item}} numberOfLines={1}>
                    {contactValue}
                </CustomMediumText>
            </View>
            }
        </View>
    )
})

const Status = React.memo(({status, isOwner}) => {
    const colors = useSelector(getColors)
    return(
        <CustomMediumText style={styles.status}>
            {status !== null
                ? !!status
                    ? status
                    : isOwner
                        ? 'Set your status!'
                        : 'No status.'
                : <ActivityIndicator
                    color={colors.preloader}
                    style={{flex: 1}}
                    size={'small'}
                />}
        </CustomMediumText>
    )
})

const EditStatus = React.memo(({status, setEditMode}) => {
    const [text, setText] = useState(status ? status : '')

    const colors = useSelector(getColors)
    const dispatch = useDispatch()

    const onSubmitHandler = () => {
        dispatch(setUserStatus(text))
        setEditMode(false)
    }
    return(
        <View>
            <TextInput value={text}
                       style={{
                           ...styles.editStatus,
                           color: colors.text,
                           borderBottomColor: colors.primary,
                       }}
                       id={'text'}
                       name={'text'}
                       placeholderTextColor={colors.placeholder}
                       onSubmitEditing={onSubmitHandler}
                       onBlur={onSubmitHandler}
                       onChangeText={setText}
                       placeholder={'Your status'}/>
        </View>
    )
})

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: theme.space[5],
        paddingHorizontal: theme.space[3]
    },
    topContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    imageWrapper: {
        overflow: 'hidden'
    },
    image: {
        height: '100%',
        width: '100%'
    },
    descriptionContainer: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    name: {
        fontSize: theme.fontSize.h4,
        textAlign: 'center'
    },
    status: {
        fontSize: theme.fontSize.larger,
        marginVertical: theme.space[3],
        fontStyle: 'italic',
        textAlign: 'center'
    },
    //editStatus
    editStatus: {
        fontSize: theme.fontSize.larger,
        borderBottomWidth: 1,
        marginVertical: theme.space[3],
        paddingVertical: theme.space[1]
    },
    lookingForAJob: {
        height: theme.size[4],
        width: theme.size[4],
        borderRadius: theme.size[4] / 2,
        marginLeft: theme.space[2]
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        width: '100%',
        marginVertical: theme.space[3]
    },
    title: {
        marginTop: theme.space[4],
        marginBottom: theme.space[2]
    },
    item: {
        fontSize: theme.fontSize.larger
    },
    medContainer: {
        width: '100%',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        paddingTop: theme.space[5]
    },
    itemContainer: {
        flexWrap: 'wrap',
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'flex-start'
    },
    //contacts
    contactKey: {
        fontStyle: 'italic',
        fontWeight: theme.fontWeight.bolder
    }
})