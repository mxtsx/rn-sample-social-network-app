import React, {useCallback, useLayoutEffect, useState} from 'react';
import {ActivityIndicator} from "react-native";
import {DrawerActions, useFocusEffect, useNavigation, useRoute} from "@react-navigation/native";
import {HeaderButtons, Item} from "react-navigation-header-buttons";
import {CustomHeaderButtonComponent} from "../../components/custom-header-button.component";
import {isAndroid} from "../../utils/platform.util";
import {useDispatch, useSelector} from "react-redux";
import {getId} from "../../redux/auth.selectors";
import {
    actions,
    getCurrentUserStatus,
    isUserFollowed,
    setNewProfilePhotos,
    setUserProfile,
    setUserProfileUpdate
} from "../../redux/profile.reducer";
import {getProfile, getProfileIsFetching} from "../../redux/profile.selectors";
import {ProfileCard} from "./profile-card.component";
import {ProfileEdit} from "./profile-edit.component";
import {updateUrl} from "../../utils/update-url.util";
import {getColors} from "../../redux/theme.selectors";
import {CustomScrollView} from "../../components/custom-scroll-view.component";
import {startChatting} from "../../redux/dialogs.reducer";
import {getError} from "../../redux/error.selectors";
import {errorActions} from "../../redux/error.reducer";
import {ErrorComponent} from "../../components/error.component";
import {showToast} from "../../utils/toast.util";

export const ProfileScreen = React.memo(() => {
    const [profileEditMode, setProfileEditMode] = useState(false)
    const [updatedProfile, setUpdatedProfile] = useState(null)
    const [selectedImage, setSelectedImage] = useState(null)
    const [id, setId] = useState(null)

    let profile = useSelector(getProfile)
    const ownerId = useSelector(getId)
    const userId = useRoute().params?.id
    let isOwner = id === ownerId

    const error = useSelector(getError)
    const colors = useSelector(getColors)
    const isLoading = useSelector(getProfileIsFetching)

    const navigation = useNavigation()
    const dispatch = useDispatch()

    const getUsers = () => {
        if (!userId) {
            setId(ownerId)
        } else {
            setId(userId)
        }
        if (id) {
            dispatch(setUserProfile(id))
            dispatch(getCurrentUserStatus(id))
            dispatch(isUserFollowed(id))
        }
    }

    const clearUsers = () => {
        dispatch(actions.getNewProfile(null))
        dispatch(actions.getUserStatus(null))
        dispatch(actions.userIsFollowed(null))
    }

    useFocusEffect((useCallback(() => {
        if(!error) {
            getUsers()
        }
        return () => {
            clearUsers()
            setId(null)
        }
    }, [id])))

    const onSubmitHandler = useCallback(async () => {
        if (updatedProfile) {
            await dispatch(setUserProfileUpdate(updatedProfile, ownerId))
            if (selectedImage){
                const updatedUrl = updateUrl(selectedImage)
                await dispatch(setNewProfilePhotos(updatedUrl))
            }
            setProfileEditMode(false)
        } else {
            showToast('Nothing to update')
        }
    }, [dispatch, updatedProfile, selectedImage])

    const startChattingHandler = async () => {
        await startChatting(profile.userId)
        navigation.navigate('Dialog', {id: id})
    }

    useLayoutEffect(() => {
        navigation.setOptions({
            title: profile?.fullName,
            headerLeft: () => (
                <HeaderButtons HeaderButtonComponent={CustomHeaderButtonComponent}>
                    {!profileEditMode && isOwner && !userId || error
                        ? <Item title={'Toggle Drawer'}
                                iconName={isAndroid
                                    ? 'md-menu'
                                    : 'ios-menu'}
                                onPress={() => navigation.dispatch(DrawerActions.openDrawer())}/>
                        : profileEditMode && isOwner
                            ? <Item title={'Toggle Drawer'}
                                    iconName={isAndroid
                                        ? 'md-close'
                                        : 'ios-close'}
                                    onPress={() => {
                                        setSelectedImage(profile?.photos?.large)
                                        setProfileEditMode(false)
                                    }}/>
                            : <Item title={'Go back'}
                                    iconName={isAndroid
                                        ? 'md-arrow-back'
                                        : 'ios-arrow-back'}
                                    onPress={() => {
                                        navigation.goBack()
                                    }}/>}
                </HeaderButtons>
            ),
            headerRight: () => (
                <HeaderButtons HeaderButtonComponent={CustomHeaderButtonComponent}>
                    {isOwner && !profileEditMode
                            ? <Item title={'Edit Page'}
                                    iconName={isAndroid
                                        ? 'md-create-sharp'
                                        : 'ios-create-sharp'}
                                    onPress={() => {
                                        setProfileEditMode(true)
                                    }}/>
                            : isOwner
                                ? <Item title={'Save edit'}
                                        iconName={isAndroid
                                            ? 'md-save'
                                            : 'ios-save'}
                                        onPress={() => {
                                            onSubmitHandler()
                                        }}/>
                                : userId &&
                                <Item title={'Start dialog'}
                                      iconName={'navigate'}
                                      onPress={() => {
                                          startChattingHandler()
                                      }}/>}
                </HeaderButtons>
            )
        })
    }, [
        navigation,
        profile?.fullName,
        isOwner,
        profileEditMode,
        updatedProfile,
        selectedImage
    ])

    const onRefreshHandler = () => {
        dispatch(errorActions.errorCleared())
        getUsers()
    }

    if(error) {
        return <ErrorComponent
            onRefreshHandler={onRefreshHandler}
            disabled={isLoading}
        />
    }

    return (
        <CustomScrollView>
            {!isLoading && !!profile?
                !profileEditMode
                    ? <ProfileCard profile={profile}
                                   isOwner={isOwner}/>
                    : <ProfileEdit profile={profile}
                                   image={selectedImage}
                                   setImage={setSelectedImage}
                                   setUpdatedProfile={setUpdatedProfile}/>
                : <ActivityIndicator style={{flex: 1}}
                                     color={colors.preloader}
                                     size={'large'}/>}
        </CustomScrollView>
    );
})