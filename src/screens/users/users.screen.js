import React, {useCallback, useLayoutEffect, useState} from 'react';
import {
    ActivityIndicator,
    FlatList,
    Image,
    Keyboard,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import {DrawerActions, useFocusEffect, useNavigation} from "@react-navigation/native";
import {HeaderButtons, Item} from "react-navigation-header-buttons";
import {CustomHeaderButtonComponent} from "../../components/custom-header-button.component";
import {isAndroid} from "../../utils/platform.util";
import {CustomBackground} from "../../components/custom-background.component";
import {theme} from "../../theme/theme";
import {useAvailableWindowParams} from "../../hooks/use-available-window-params.hook";
import {CustomBoldText} from "../../components/custom-bold-text";
import {CustomMediumText} from "../../components/custom-medium-text";
import {Ionicons} from "@expo/vector-icons";
import {TouchableAreaComponent} from "../../components/touchable-area.component";
import {useDispatch, useSelector} from "react-redux";
import {actions, followUser, getUsers, unfollowUser} from "../../redux/users.reducer";
import {
    getCurrentFilter,
    getCurrentPage,
    getFollowingIsFetching,
    getIsFetching,
    getPageSize,
    getTotalUsersCountSelector,
    getUsersSelector
} from "../../redux/users.selectors";
import {CustomSwitchComponent} from "../../components/custom-switch.component";
import {getColors, getNightMode} from "../../redux/theme.selectors";
import {getId} from "../../redux/auth.selectors";
import {getError} from "../../redux/error.selectors";
import {ErrorComponent} from "../../components/error.component";

export const UsersScreen = React.memo(() => {
    const [refreshing, setRefreshing] = useState(false)

    const usersNumber = useSelector(getPageSize)
    const page = useSelector(getCurrentPage)
    const filter = useSelector(getCurrentFilter)
    const users = useSelector(getUsersSelector)
    const isFetching = useSelector(getIsFetching)
    const colors = useSelector(getColors)
    const error = useSelector(getError)

    const navigation = useNavigation()
    const dispatch = useDispatch()

    useFocusEffect((useCallback(() => {
        dispatch(getUsers(usersNumber, page, filter))
        return () => {
            dispatch(actions.resetFilter())
            dispatch(actions.setCurrentPage(1))
            dispatch(actions.setFetching(true))
        }
    }, [usersNumber, page, filter])))

    useLayoutEffect(() => {
        navigation.setOptions({
            title: 'Users',
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
        dispatch(getUsers(usersNumber, page, filter))
        setRefreshing(false)
    }, [usersNumber, page, filter])

    return (
        <View style={{
            ...styles.container,
            backgroundColor: colors.background
        }}>
            <Searchbar />
            {!!users?.length && <Paginator/>}
            {!isFetching
                ? !error
                    ? !!users.length
                        ? <View style={{flex: 1}}>
                            <FlatList data={users}
                                      onRefresh={onRefreshHandler}
                                      refreshing={refreshing}
                                      keyExtractor={item => item.id.toString()}
                                      renderItem={(user) => {
                                          return <UserCard user={user.item}/>
                                      }}/>
                        </View>
                        : <NoUsers/>
                    : <ErrorComponent
                        disabled={isFetching}
                        onRefreshHandler={onRefreshHandler}
                    />
                : <ActivityIndicator style={{flex: 1}} color={colors.preloader} size={'large'}/>}
        </View>
    );
})

const NoUsers = () => {
    const [width, height] = useAvailableWindowParams()
    const isAlbum = height < width

    return(
        <View style={styles.noUsers}>
            <CustomBoldText style={{fontSize: !isAlbum ? theme.fontSize.h4 : theme.fontSize.h2}}>
                No users to show
            </CustomBoldText>
        </View>
    )
}

const Searchbar = React.memo(() => {
    const [isToggle, setIsToggle] = useState(false)
    const [isFriend, setIsFriend] = useState(null)
    const [all, setAll] = useState(true)
    const [followed, setFollowed] = useState(false)
    const [unfollowed, setUnfollowed] = useState(false)
    const [text, setText] = useState('')

    const error = useSelector(getError)
    const colors = useSelector(getColors)
    const pageSize = useSelector(getPageSize)

    const [width, height] = useAvailableWindowParams()
    const isAlbum = height < width

    const dispatch = useDispatch()

    const onSubmitHandler = useCallback(() => {
        if(!error) {
            let filter = {
                term: text,
                friend: isFriend
            }
            dispatch(getUsers(pageSize, 1, filter))
            setIsToggle(false)
            Keyboard.dismiss()
        }
    }, [isFriend, text])

    const onValueChangeHandler = (value) => {
        if(value === 'all') {
            setAll(!all)
            setFollowed(false)
            setUnfollowed(false)
            setIsFriend(null)
        }
        if(value === 'followed') {
            setFollowed(!followed)
            setAll(false)
            setUnfollowed(false)
            setIsFriend(true)
        }
        if(value === 'unfollowed') {
            setUnfollowed(!unfollowed)
            setAll(false)
            setFollowed(false)
            setIsFriend(false)
        }
    }

    useFocusEffect(useCallback(() => {
        return () => {
            setText('')
        }
    }, []))

    const switchFont = {
        fontSize: !isAlbum
            ? theme.fontSize.medium
            : theme.fontSize.h4
    }

    const switchSize = {
        transform: !isAlbum
            ? [{scaleX: .8}, {scaleY: .8}]
            : [{scaleX: 1}, {scaleY: 1}]
    }

    const switchItemPadding = {
        paddingVertical: !isAlbum
            ? theme.space[0]
            : theme.space[1]
    }

    return(
        <CustomBackground style={{...styles.searchbarCard}}>
            <View style={{
                ...styles.searchbar,
                minHeight:
                    !isAlbum
                        ? width / 12
                        : width / 14
            }}>
                <TouchableAreaComponent
                    onPress={() => setIsToggle(!isToggle)}>
                    <View style={{
                        ...styles.icon,
                        borderRadius:
                            !isAlbum
                                ? 30 / 2
                                : 60 / 2
                    }}>
                        <Ionicons
                            name={!isToggle
                                ? 'add'
                                : 'remove'}
                            size={
                                !isAlbum
                                    ? 24
                                    : 40
                            }
                            color={colors.element}/>
                    </View>
                </TouchableAreaComponent>
                <TextInput placeholder={'Search'}
                           id={'search'}
                           name={'search'}
                           value={text}
                           placeholderTextColor={colors.placeholder}
                           onChangeText={setText}
                           onSubmitEditing={onSubmitHandler}
                           style={{
                               ...styles.searchInput,
                               fontSize:
                                   !isAlbum
                                       ? theme.fontSize.medium
                                       : theme.fontSize.larger,
                               borderColor: colors.element,
                               color: colors.text
                           }}/>
                <TouchableAreaComponent
                    disabled={error}
                    onPress={onSubmitHandler}>
                    <View style={{...styles.icon, borderRadius: !isAlbum ? 30 / 2 : 60 / 2}}>
                        <Ionicons
                            name={'search'}
                            size={
                                !isAlbum
                                    ? 24
                                    : 40}
                            color={colors.element}/>
                    </View>
                </TouchableAreaComponent>
            </View>
            {!!isToggle &&
            <View style={styles.switchBar}>
                <CustomSwitchComponent label={'All'}
                                       style={{...styles.switch, ...switchItemPadding}}
                                       value={all}
                                       switchStyle={!isAndroid && switchSize}
                                       fontStyle={switchFont}
                                       setValue={() => onValueChangeHandler('all')}/>
                <CustomSwitchComponent label={'Followed'}
                                       style={{...styles.switch, ...switchItemPadding}}
                                       value={followed}
                                       switchStyle={!isAndroid && switchSize}
                                       fontStyle={switchFont}
                                       setValue={() => onValueChangeHandler('followed')}/>
                <CustomSwitchComponent label={'Unfollowed'}
                                       style={{...styles.switch, ...switchItemPadding}}
                                       value={unfollowed}
                                       switchStyle={!isAndroid && switchSize}
                                       fontStyle={switchFont}
                                       setValue={() => onValueChangeHandler('unfollowed')}/>
            </View>
            }
        </CustomBackground>
    )
})

const UserCard = React.memo(({user}) => {
    const [width, height] = useAvailableWindowParams()
    const isAlbum = height < width

    const userId = useSelector(getId)
    const isOwner = userId === user?.id
    const isNightMode = useSelector(getNightMode)
    const colors = useSelector(getColors)
    const followingIsFetching = useSelector(getFollowingIsFetching).some(userId => userId === user?.id)

    const navigation = useNavigation()
    const dispatch = useDispatch()

    const followUnfollowHandler = (id, name) => {
        !user.followed ? dispatch(followUser(id, name)) : dispatch(unfollowUser(id, name))
    }

    return (
        <CustomBackground style={{
            height: width / 5,
            marginBottom: theme.space[2]
        }}>
            <TouchableOpacity
                style={{
                    ...styles.card
                }}
                activeOpacity={0.7}
                onPress={() => navigation.navigate('Profile', {id: user?.id})}>
            <View style={styles.profileWrapper}>
                <View style={{
                    height: width / 7,
                    width: width / 7,
                    borderRadius: width / 7 / 2,
                    overflow: 'hidden',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
                >
                    <Image source={user?.photos?.small
                        ? {uri: user?.photos?.small}
                        : !isNightMode
                            ? require('../../../assets/user.png')
                            : require('../../../assets/user-inverted.png')}
                           resizeMode={'contain'}
                           style={styles.image}/>
                </View>
                <View style={styles.infoWrapper}>
                    <View>
                        <CustomBoldText
                            style={{
                                fontSize:
                                    !isAlbum
                                        ? theme.fontSize.large
                                        : theme.fontSize.h3
                            }}
                            numberOfLines={1}
                        >
                            {user?.name}
                        </CustomBoldText>
                    </View>
                    <View style={{
                        width: '100%'
                    }}>
                        <CustomMediumText
                            style={{
                                fontSize:
                                    !isAlbum
                                        ? theme.fontSize.medium
                                        : theme.fontSize.larger
                            }}
                            numberOfLines={1}
                        >
                            {user?.status}
                        </CustomMediumText>
                    </View>
                </View>
            </View>
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => followUnfollowHandler(user?.id, user?.name)}
                    disabled={followingIsFetching || isOwner}>
                    <View style={styles.icon}>
                        {!isOwner &&
                        <Ionicons name={!user?.followed
                            ? !isAndroid ? 'ios-person-add' : 'md-person-add'
                            : !isAndroid ? 'ios-person-remove' : 'md-person-remove'}
                                   size={!isAlbum ? 35 : 60}
                                   color={!followingIsFetching
                                       ? colors.usersAdd
                                       : colors.grayish}/>}
                    </View>
                </TouchableOpacity>
            </TouchableOpacity>
        </CustomBackground>
    )
})

const Paginator = React.memo(() => {
    const [width, height] = useAvailableWindowParams()
    const isAlbum = height < width

    const colors = useSelector(getColors)
    const users = useSelector(getUsersSelector)
    const currentPage = useSelector(getCurrentPage)
    const pageSize = useSelector(getPageSize)
    const totalUsersCount = useSelector(getTotalUsersCountSelector)
    const totalPagesCount = Math.ceil(totalUsersCount/pageSize)
    const isFirstPage = currentPage === 1
    const isLastPage = currentPage === totalPagesCount

    const dispatch = useDispatch()

    const firstPageButtonColor =
        !isFirstPage
            ? colors.element
            : colors.grayish

    const lastPageButtonColor =
        !isLastPage
            ? colors.element
            : colors.grayish


    return(
        <CustomBackground style={{
            ...styles.card,
            justifyContent: 'center',
            minHeight: width / 10,
            alignSelf: 'center'
        }}>
            <PaginatorButton
                onPress={() => dispatch(actions.setCurrentPage(currentPage / currentPage))}
                disabled={isFirstPage}
                color={firstPageButtonColor}>
                {currentPage / currentPage}
            </PaginatorButton>
            <PaginatorButton
                onPress={() => dispatch(actions.setCurrentPage(currentPage - 1))}
                disabled={isFirstPage}
                color={firstPageButtonColor}>
                <Ionicons name={!isAndroid
                    ? 'ios-arrow-back'
                    : 'md-arrow-back'}
                          color={colors.white}
                          size={!isAlbum
                              ? theme.fontSize.medium
                              : theme.fontSize.larger}/>
            </PaginatorButton>
            <PaginatorButton
                disabled={true}
                color={colors.danger}>
                {currentPage}
            </PaginatorButton>
            <PaginatorButton
                onPress={() => dispatch(actions.setCurrentPage(currentPage + 1))}
                disabled={isLastPage}
                color={lastPageButtonColor}>
                <Ionicons name={!isAndroid
                    ? 'ios-arrow-forward'
                    : 'md-arrow-forward'}
                          color={colors.white}
                          size={!isAlbum
                              ? theme.fontSize.medium
                              : theme.fontSize.larger}/>
            </PaginatorButton>
            <PaginatorButton
                onPress={() => dispatch(actions.setCurrentPage(totalPagesCount))}
                disabled={isLastPage || !totalUsersCount}
                color={lastPageButtonColor}>
                {!!totalPagesCount
                    ? !!users.length
                        ? totalPagesCount
                        : currentPage
                    : false}
            </PaginatorButton>
        </CustomBackground>
    )
})

const PaginatorButton = React.memo(({onPress, disabled, children, color}) => {
    const [width, height] = useAvailableWindowParams()
    const isAlbum = height < width

    const colors = useSelector(getColors)

    const isNightMode = useSelector(getNightMode)

    return(
        <TouchableAreaComponent
            onPress={!!onPress ? onPress : () => {}}
            disabled={disabled}>
            <View style={{
                ...styles.paginatorElementWrapper,
                height:
                    !isAlbum
                        ? width / 13
                        : width / 16,
                width: width / 7,
                borderRadius: width / 15 / 2,
                backgroundColor: color
            }}>
                {!!children
                    ? <CustomBoldText style={{
                        color: colors.white,
                        fontSize:
                            !isAlbum
                                ? theme.fontSize.medium
                                : theme.fontSize.larger
                    }}>
                        {children}
                    </CustomBoldText>
                    : <ActivityIndicator color={!isNightMode ? colors.grayish : colors.preloader} size={'small'}/>
                }
            </View>
        </TouchableAreaComponent>
    )
})

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: theme.space[2]
    },
    card: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: theme.space[2],
        paddingHorizontal: theme.space[4],
        marginBottom: theme.space[2]
    },
    icon: {
        overflow: 'hidden',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    noUsers: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    //Searchbar
    searchbarCard: {
        width: '100%',
        flexDirection: 'column',
        paddingHorizontal: theme.space[2],
        paddingVertical: theme.space[3],
        marginBottom: theme.space[2]
    },
    searchbar: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    searchInput: {
        borderWidth: 2,
        width: '80%',
        height: '100%',
        paddingVertical: theme.space[1],
        paddingHorizontal: theme.space[2],
        borderRadius: 5
    },
    switchBar: {
        width: '100%',
        paddingTop: theme.space[3],
        paddingHorizontal: theme.space[3],
        flexDirection: 'column',
    },
    switch: {
        width: '100%',
        justifyContent: 'space-between'
    },
    //Profile
    profileWrapper: {
        flexDirection: 'row',
        flex: 1
    },
    image: {
        height: '100%',
        width: '100%'
    },
    infoWrapper: {
        flex: 1,
        paddingHorizontal: theme.space[3],
        justifyContent: 'center'
    },
    //Paginator
    paginatorElementWrapper: {
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: theme.space[2],
        overflow: 'hidden'
    }
})