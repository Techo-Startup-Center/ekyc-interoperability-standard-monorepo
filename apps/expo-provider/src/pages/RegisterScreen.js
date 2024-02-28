import React, { useEffect, useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, TouchableOpacity, Image, Dimensions, Alert } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { faker } from '@faker-js/faker';
import * as FileSystem from 'expo-file-system';
import { Buffer } from 'buffer'
import crypto from 'react-native-quick-crypto';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function RegisterScreen({ route, navigation }) {
    var _unsubscribe;
    const [firstName, setFirstName] = useState(faker.person.firstName());
    const [lastName, setLastName] = useState(faker.person.lastName());
    const [phoneNumber, setPhoneNumber] = useState("+855" + [faker.number.int({ min: 10000000, max: 99999999 })]);
    const [documentType, setDocumentType] = useState(['National ID', 'Passport'][faker.number.int({ min: 0, max: 1 })]);
    const [documentId, setDocumentId] = useState(faker.number.int({ min: 100000000, max: 999999999 }).toString());
    const [email, setEmail] = useState(faker.internet.email());
    const [dob, setDob] = useState(new Date(faker.date.past()));
    const [gender, setGender] = useState(['Male', 'Female'][faker.number.int({ min: 0, max: 1 })]);
    const [issueDate, setIssueDate] = useState(new Date(new Date(faker.date.past())));
    const [expiryDate, setExpiryDate] = useState(new Date(faker.date.future()));
    const [showDate, setShowDate] = useState(false);
    const [showIssueDate, setShowIssueDate] = useState(false);
    const [showExpiryDate, setShowExpiryDate] = useState(false);
    const [profile, setProfile] = useState(null);
    const [document, setDocument] = useState(null);

    const [validPhoneNumber, setValidPhoneNumber] = useState(true);

    const validatePhoneNumber = (phoneNumber) => {
        // // validate phone number with +855 and 8 or 9 digits
        const regex = /^(\+855|0)([0-9]{8,9})$/;
        if (regex.test(phoneNumber)) {
            setValidPhoneNumber(true);
        } else {
            setValidPhoneNumber(false);
        }
    }
    const saveBase64 = async (uri, isProfile) => {
        FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 }).then((base64) => {
            isProfile ? profileBase64 = base64 : documentBase64 = base64;
            // console.log(base64)
        });
    }
    const options = { day: '2-digit', month: 'long', year: 'numeric' };
    const pickImage = async (isProfile) => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: false,
            aspect: [3, 2],
            quality: 1,
        });
        if (!result.canceled) {
            isProfile ? setProfile(result.assets[0].uri) : setDocument(result.assets[0].uri);
        }
    }
    const downloadResumable = (url) => FileSystem.createDownloadResumable(
        url,
        FileSystem.documentDirectory + faker.number.int({ min: 100000000, max: 999999999 }).toString() + '.jpg',
        {}
    );
    useEffect(() => {
        const avatarLink = faker.image.avatar();
        downloadResumable(avatarLink).downloadAsync().then(({ uri }) => {
            setProfile(uri)
        });
        const imageLink = faker.image.url();
        downloadResumable(imageLink).downloadAsync().then(({ uri }) => {
            setDocument(uri)
        });
    }, [])
    const handleRegister = async () => {
        const profileBase64 = await FileSystem.readAsStringAsync(profile, { encoding: FileSystem.EncodingType.Base64 });
        const documentBase64 = await FileSystem.readAsStringAsync(document, { encoding: FileSystem.EncodingType.Base64 });
        const user = {
            phone_number: phoneNumber,
            first_name: firstName,
            last_name: lastName,
            document_type: documentType,
            document_id: documentId,
            email: email,
            dob: dob.toISOString(),
            gender: gender,
            issue_date: issueDate.toISOString(),
            expiry_date: expiryDate.toISOString(),
            face_image: profileBase64,
            document_image: documentBase64
        };
        const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
            namedCurve: 'secp256k1',
            modulusLength: 2048,
            publicKeyEncoding: {
                type: 'spki',
                format: 'pem'
            },
            privateKeyEncoding: {
                type: 'pkcs8',
                format: 'pem'
            }
        });
        const pub_key = Buffer.from(publicKey).toString('base64')
        fetch(process.env.EXPO_PUBLIC_API_URL + "/api/v1/provide/signup", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ user, pub_key })
        })
            .then(response => {
                if (!response.ok) {
                    console.log(response)
                    throw new Error(`HTTP error! status: ${response.status}, statusText: ${response.statusText}`);
                }
                return response.json()
            })
            .then(async data => {
                try {
                    delete data.oa_doc;
                    // save private key to storage
                    await AsyncStorage.setItem('privateKey', privateKey);
                    // save public key to storage
                    await AsyncStorage.setItem('publicKey', pub_key);
                    // save user data to storage
                    await AsyncStorage.setItem('user', JSON.stringify(data));
                    await AsyncStorage.setItem('profile', profile);
                    console.log("success saving data to storage")
                    Alert.alert("Success", "You have successfully registered", [{
                        text: "Yes",
                        onPress: () => {
                            navigation.navigate('home')
                        }
                    }])
                } catch (err) {
                    console.log(err.message)
                }
            })
            .catch(error => {
                console.error('Registration failed:', error);
                // Handle the error
                Alert.alert("Error", error.message, [{
                    text: "Ok",
                    onPress: () => {
                    }
                }])
            });
    }

    return (
        <View className="h-full flex bg-white rounded-2xl">
            <Text className="m-2 text-md">Please input your information:</Text>
            <ScrollView className="grow">
                <TextInput
                    className="m-2 h-12 pl-5 bg-gray-100 rounded-full"
                    placeholder="Firstname"
                    value={firstName}
                    onChangeText={setFirstName}
                />
                <TextInput
                    className="m-2 h-12 pl-5 bg-gray-100 rounded-full"
                    placeholder="Last Name"
                    value={lastName}
                    onChangeText={setLastName}
                />
                <TextInput
                    className={`m-2 h-12 pl-5 bg-gray-100 rounded-full ${validPhoneNumber ? '' : 'border-red-400 border-solid border-2'}`}
                    placeholder="Phone Number"
                    value={phoneNumber}
                    keyboardType='phone-pad'
                    onChangeText={(text) => {
                        setPhoneNumber(text);
                        validatePhoneNumber(text);
                    }}
                />
                <Text className={`ml-7 -mt-2 text-red-400 ${validPhoneNumber ? "hidden" : "visible"}`}>Invalid phone number</Text>
                <View className="m-2 h-12 pl-1 text-sm bg-gray-100 rounded-full">
                    <Picker selectedValue={documentType} onValueChange={(itemValue, itemIndex) => setDocumentType(itemValue)}
                        mode='dropdown'
                    >
                        <Picker.Item style={styles.picker_item} label='Select Document' value='' />
                        <Picker.Item label="National ID" value="National ID" />
                        <Picker.Item label="Passport" value="Passport" />
                    </Picker>
                </View>
                <TextInput
                    className="m-2 h-12 pl-5 bg-gray-100 rounded-full"
                    placeholder="Document ID"
                    value={documentId}
                    onChangeText={setDocumentId}
                />
                <TextInput
                    className="m-2 h-12 pl-5 bg-gray-100 rounded-full"
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                />
                <View className="m-2 h-12 pl-5 bg-gray-100 rounded-full justify-start flex-row">
                    <TextInput className="grow"
                        placeholder="Date of Birth"
                        value={dob.toLocaleDateString('en-GB', options)}
                        onChangeText={setDob}
                    />
                    {!showDate ? "" : <DateTimePicker
                        value={dob}
                        mode='date'
                        display='default'
                        onChange={(event, selectedDate) => {
                            setShowDate(false);
                            setDob(selectedDate);
                        }} />
                    }
                    <TouchableOpacity className="p-3" onPress={() => setShowDate(!showDate)}>
                        <Ionicons name="calendar-outline" size={24} color="black" />
                    </TouchableOpacity>
                    {/* <Button title="Show Date" onPress={() => setShowDate(!showDate)} /> */}
                </View>
                {/* <TextInput
                    className="m-2 h-12 pl-5 bg-gray-100 rounded-full"
                    placeholder="Gender"
                    value={gender}
                    onChangeText={setGender}
                /> */}
                <View className="m-2 h-12 pl-1 text-sm bg-gray-100 rounded-full">
                    <Picker selectedValue={gender} onValueChange={(itemValue, itemIndex) => setGender(itemValue)}
                        mode='dropdown'
                    >
                        <Picker.Item style={styles.picker_item} label='Select Gender' value='' />
                        <Picker.Item label="Male" value="Male" />
                        <Picker.Item label="Female" value="Female" />
                    </Picker>
                </View>
                {/* <TextInput
                    className="m-2 h-12 pl-5 bg-gray-100 rounded-full"
                    placeholder="Issue Date"
                    value={issueDate}
                    onChangeText={setIssueDate}
                /> */}
                <View className="m-2 h-12 pl-5 bg-gray-100 rounded-full justify-start flex-row">
                    <TextInput className="grow"
                        placeholder="Issue Date"
                        value={issueDate.toLocaleDateString('en-GB', options)}
                        onChangeText={setIssueDate}
                    />
                    {!showIssueDate ? "" : <DateTimePicker
                        value={issueDate}
                        mode='date'
                        display='default'
                        onChange={(event, selectedDate) => {
                            setShowIssueDate(false);
                            setIssueDate(selectedDate);
                        }} />
                    }
                    <TouchableOpacity className="p-3" onPress={() => setShowIssueDate(!showDate)}>
                        <Ionicons name="calendar-outline" size={24} color="black" />
                    </TouchableOpacity>
                    {/* <Button title="Show Date" onPress={() => setShowDate(!showDate)} /> */}
                </View>
                {/* <TextInput
                    className="m-2 h-12 pl-5 bg-gray-100 rounded-full"
                    placeholder="Expiry Date"
                    value={expiryDate}
                    onChangeText={setExpiryDate}
                /> */}
                <View className="m-2 h-12 pl-5 bg-gray-100 rounded-full justify-start flex-row">
                    <TextInput className="grow"
                        placeholder="Expiry Date"
                        value={expiryDate.toLocaleDateString('en-GB', options)}
                        onChangeText={setExpiryDate}
                    />
                    {!showExpiryDate ? "" : <DateTimePicker
                        value={expiryDate}
                        mode='date'
                        display='default'
                        onChange={(event, selectedDate) => {
                            setShowExpiryDate(false);
                            setExpiryDate(selectedDate);
                        }} />
                    }
                    <TouchableOpacity className="p-3" onPress={() => setShowExpiryDate(!showDate)}>
                        <Ionicons name="calendar-outline" size={24} color="black" />
                    </TouchableOpacity>
                    {/* <Button title="Show Date" onPress={() => setShowDate(!showDate)} /> */}
                </View>
                <View className="m-2 pl-1">
                    <Text>Select your profile image:</Text>
                </View>
                <TouchableOpacity className="p-3 bg-gray-100 flex items-center " onPress={() => pickImage(true)}>
                    {profile ? <Image source={{ uri: profile }} style={{ width: 300, height: 200 }} /> :
                        <View className="h-48 flex items-center justify-center"><Ionicons name="image-outline" size={24} color="black" />
                        </View>}
                </TouchableOpacity>
                <View className="m-2 pl-1">
                    <Text>Select your document image:</Text>
                </View>
                <TouchableOpacity className="p-3 bg-gray-100  flex items-center " onPress={() => pickImage(false)}>
                    {document ? <Image source={{ uri: document }} style={{ width: 300, height: 200 }} /> :
                        <View className="h-48 flex items-center justify-center">
                            <Ionicons name="image-outline" className="h-52" size={24} color="black" />
                        </View>
                    }
                </TouchableOpacity>
            </ScrollView >
            <View className=" flex items-center justify-center mt-2">
                <TouchableOpacity className=" mb-2 h-12 bg-blue-700 rounded-full w-1/2 flex items-center justify-center" onPress={handleRegister}>
                    <Text className="text-white text-center font-bold text-lg ">Register</Text>
                </TouchableOpacity>
            </View>
        </View >
    );
};

const styles = StyleSheet.create({
    picker_item: { fontSize: 14, color: '#6d6d6d' }
});