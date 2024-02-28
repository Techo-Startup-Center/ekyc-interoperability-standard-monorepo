import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Scan from '../components/scan';
import { ScrollView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Linking from 'expo-linking';


export default function HomeScreen({ route, navigation }) {
    var _unsubscribe;
    const [user, setUser] = useState(null)
    const getSetUser = () => {
        AsyncStorage.getItem('user').then((data) => {
            if (data === null) {
                navigation.navigate('register')
            } else {
                try {
                    //parse data to object
                    obj = JSON.parse(data)
                    setUser(obj)
                } catch (e) {
                    console.log(e)
                }

            }
        }).catch((e) => {
            console.log("error", e)
        })
    }
    useEffect(() => {
        this._unsubscribe = navigation.addListener('state', () => {
            if (!user) {
                getSetUser()
            }
        })
        getSetUser();
        if (route && route.params && route.params.callback) {
            Linking.openURL(route.params.callback);
        }
    }, []);
    componentWillUnmount = () => {
        this._unsubscribe();
    }
    const handleLogout = async () => {
        // save private key to storage
        await AsyncStorage.removeItem('privateKey');
        // save public key to storage
        await AsyncStorage.removeItem('publicKey');
        // save user data to storage
        await AsyncStorage.removeItem('user');
        setUser(null)
        navigation.navigate('register')
    }
    return (
        <ScrollView className="flex">
            <StatusBar style="auto" />
            <View className="flex h-32">
            </View>
            {user ? <View className="h-full bg-white rounded-2xl my-5">
                <View className="items-center justify-start">
                    <Image className="-mt-20 w-32 h-32 rounded-full " style={styles.profile} source={{ uri: `data:image/png;base64,${user.face_image}` }} />
                    <Text className="text-2xl font-bold text-center">{`${user.last_name} ${user.first_name}`}</Text>
                </View>
                <View className="m-2">
                    <Text className="mx-1 text-lg text-gray-500" >Personal Information:</Text>
                    <View className="mx-5">
                        <View className="flex flex-row w-full items-center mt-4">
                            <Text className="text-sm text-gray-500 w-1/3 text-right">Firstname:</Text>
                            <Text className="text-lg pl-2 font-medium w-2/3">{`${user.first_name}`}</Text>
                        </View>
                        <View className="flex flex-row w-full items-center mt-4">
                            <Text className="text-sm text-gray-500 w-1/3 text-right">Lastname:</Text>
                            <Text className="text-lg pl-2 font-medium w-2/3">{`${user.last_name}`}</Text>
                        </View>
                        <View className="flex flex-row w-full items-center mt-4">
                            <Text className="text-sm text-gray-500 w-1/3 text-right">Phone Number:</Text>
                            <Text className="text-lg pl-2 font-medium w-2/3">{`${user.phone_number}`}</Text>
                        </View>
                        <View className="flex flex-row w-full items-center mt-4">
                            <Text className="text-sm text-gray-500 w-1/3 text-right">Document Type:</Text>
                            <Text className="text-lg pl-2 font-medium w-2/3">{`${user.document_type}`}</Text>
                        </View>
                        <View className="flex flex-row w-full items-center mt-4">
                            <Text className="text-sm text-gray-500 w-1/3 text-right">Document ID:</Text>
                            <Text className="text-lg pl-2 font-medium w-2/3">{`${user.document_id}`}</Text>
                        </View>
                        <View className="flex flex-row w-full items-center mt-4">
                            <Text className="text-sm text-gray-500 w-1/3 text-right">Email:</Text>
                            <Text className="text-md pl-2 font-medium w-2/3">{`${user.email}`}</Text>
                        </View>
                        <View className="flex flex-row w-full items-center mt-4">
                            <Text className="text-sm text-gray-500 w-1/3 text-right">Date of Birth:</Text>
                            <Text className="text-lg pl-2 font-medium w-2/3">{new Date(user.dob).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</Text>
                        </View>
                        <View className="flex flex-row w-full items-center mt-4">
                            <Text className="text-sm text-gray-500 w-1/3 text-right">Gender:</Text>
                            <Text className="text-lg pl-2 font-medium w-2/3">{`${user.gender}`}</Text>
                        </View>
                        <View className="flex flex-row w-full items-center mt-4">
                            <Text className="text-sm text-gray-500 w-1/3 text-right">Issue Date:</Text>
                            <Text className="text-lg pl-2 font-medium w-2/3">{new Date(user.issue_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</Text>
                        </View>
                        <View className="flex flex-row w-full items-center mt-4">
                            <Text className="text-sm text-gray-500 w-1/3 text-right">Expiry Date:</Text>
                            <Text className="text-lg pl-2 font-medium w-2/3">{new Date(user.expiry_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</Text>
                        </View>
                        <View className="flex w-full items-center mt-4">
                            <Text className="text-sm text-gray-500 text-right">Face Image:</Text>
                            <Image className="mt-2 w-40 h-40 " source={{ uri: `data:image/png;base64,${user.face_image}` }} />
                        </View>
                        <View className="flex w-full items-center mt-4">
                            <Text className="text-sm text-gray-500 text-right">Document Image:</Text>
                            <Image className="mt-2 w-80 h-60" source={{ uri: `data:image/png;base64,${user.document_image}` }} />
                        </View>
                    </View>
                </View>
                <View className=" flex items-center justify-center mt-2">
                    <TouchableOpacity className=" mb-2 h-12 bg-red-600  rounded-full w-1/2 flex items-center justify-center" onPress={handleLogout}>
                        <Text className="text-white text-center font-bold text-lg ">Logout</Text>
                    </TouchableOpacity>
                </View>
            </View> : <Text>Loading</Text>}
        </ScrollView >
    );
}

const styles = StyleSheet.create({
    profile: {
        borderRadius: 50,
        borderWidth: 4,
        borderColor: '#fff',
    }
});
