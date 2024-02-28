import dataString from '../../assets/qr-respond.json'
import { kycTierInfoRequest } from '../utility/KycTier'
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { View, Text, Image, TouchableOpacity, Alert } from 'react-native';
import crypto from 'react-native-quick-crypto';
import { Buffer } from 'buffer'
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ConsentScreen({ route, navigation }) {
    const { data, qr, callback } = route.params;
    // console.log(data)
    const tiersRequest = kycTierInfoRequest(data.payload.template)
    const onPressReject = () => {
        console.log("press reject")
        Alert.alert("Reject", "Are you sure you want to reject this request?", [
            {
                text: "Yes",
                onPress: () => {
                    navigation.popToTop()
                }
            },
            {
                text: "No",
                onPress: () => { }
            }
        ])
    }
    const onPressAgree = async () => {
        console.log("press agree")
        try {
            const sign = crypto.createSign('SHA256');
            const qr = data.qr;
            sign.update(Buffer.from(qr));
            const privateKey = await AsyncStorage.getItem('privateKey');
            const userString = await AsyncStorage.getItem('user');
            const user = JSON.parse(userString)
            const signature = sign.sign(privateKey, 'base64');
            fetch(process.env.EXPO_PUBLIC_API_URL + "/api/v1/provide/authenticate", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ qr, signature, "uid": user.id })
            })
                .then(response => {
                    if (response.status !== 200) {
                        throw new Error(`Authentication failed with status ${response.status}`)
                    }
                    return response.json()
                })
                .then(async data => {
                    Alert.alert("Success", "You have successfully authenticated", [{
                        text: "Yes",
                        onPress: () => {
                            navigation.navigate('home', { 'callback': callback ? `${callback}?status=success` : null })
                        }
                    }])
                })
                .catch(error => {
                    Alert.alert("Error", error.message, [{
                        text: "Ok",
                        onPress: () => {
                            navigation.navigate('home', { 'callback': callback ? `${callback}?status=fail` : null })
                        }
                    }])
                });
        } catch (e) {
            console.log(e)
        }
    }
    return (
        <View className="h-full w-full flex">
            <StatusBar style="auto" />
            <View className="h-full bg-white rounded-2xl my-5">
                <View className="grow">
                    <View className="items-center justify-start">
                        <Image className="mt-4 w-16 h-16" source={require("../../assets/company.jpg")} />
                        <Text className="my-1 text-2xl font-bold text-center">Consent Request</Text>
                        <Text className="text-lg underline text-blue-500 font-bold">{data.payload.iss}</Text>
                    </View>
                    <View className="m-5">
                        <Text className="text-start text-lg my-2">
                            {`Request to access your information such as:`}
                        </Text>
                        <View className="flex flex-wrap flex-row">
                            {tiersRequest.map((tier, index) => {
                                return (
                                    <View key={index} className="w-1/2 items-start">
                                        <Text className="text-center text-lg">{`- ${tier}`}</Text>
                                    </View>
                                )
                            })}
                        </View>
                    </View>
                </View>
                <View className="flex flex-row" >
                    <View className=" w-1/2">
                        <TouchableOpacity className="ml-5 mb-10 mr-2 h-12 bg-red-600 rounded-full flex items-center justify-center " onPress={onPressReject}>
                            <Text className="text-white text-center font-bold text-lg">Reject</Text>
                        </TouchableOpacity>
                    </View>
                    <View className=" w-1/2">
                        <TouchableOpacity className="ml-2 mb-10 mr-5 h-12 bg-blue-700 rounded-full flex items-center justify-center" onPress={onPressAgree}>
                            <Text className="text-white text-center font-bold text-lg">Agree</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    )
}