import React, { useEffect } from 'react';
import { View, Image, StyleSheet, StatusBar, Text, TouchableOpacity } from 'react-native';
import Scan from './scan';
import { Ionicons } from '@expo/vector-icons';
import { Camera, CameraType } from 'expo-camera';

const HeaderOptions = (routeName, title, navigation) => {
    // const [profile, setProfile] = useState(null)
    // useEffect(() => {
    //     if (profile === null) {
    //         AsyncStorage.getItem('profile').then((data) => {
    //             if (data !== null) {
    //                 setProfile(data)
    //             }
    //         }).catch((e) => {
    //             console.log(e)
    //         })
    //     }
    // }, [])
    const headerComponent = ({ navigation, route, options, }) => {
        return (
            <View className="flex flex-row mx-2 items-center" style={options.headerStyle}>
                {route.name === 'home' ? <View className="flex w-10" >
                    {/* <Image className="ml-2 w-10 h-10 rounded-full "
                        style={styles.profile} source={{ uri: `data:image/png;base64,${user.face_image}` }} /> */}
                </View>
                    : <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Ionicons name='arrow-back-outline' size={32} color='white' />
                    </TouchableOpacity>}
                <View className="flex grow ">
                    <Text className="text-white text-xl font-bold text-center">{options.title}</Text>
                </View>
                <View className="flex h-30 w-10">
                    {route.name === 'home' ? <TouchableOpacity className="flex items-end" onPress={() =>
                        navigation.push('qr-scan')
                    }>
                        <Scan
                            className="w-10 h-10" fill="white"></Scan>
                    </TouchableOpacity> : ""}
                </View>
            </View>
        )
    }
    return {
        title: title,
        cardStyle: { backgroundColor: 'transparent' },
        headerStyle: {
            height: 50,
            marginTop: StatusBar.currentHeight
        },
        header: headerComponent,
        path: routeName
    }
}

const styles = StyleSheet.create({
    profileSize: {
        width: 40,
        height: 40,
        borderRadius: 40 / 2,
        borderWidth: 3,
        borderColor: "white",
    },
    headerHeight: {
        height: 50,
        backgroundColor: 'black'
    },
    container: {
        flex: 1,
        width: '100%',
        height: '100%',
        verticalAlign: 'top',
        alignContent: 'flex-start',
    },
    white: {
        color: 'white',

    },
    profile: {
        borderRadius: 50,
        borderWidth: 2,
        borderColor: '#fff',
    }
})
export default HeaderOptions;