import { StatusBar } from "expo-status-bar";
import { Text, View, TouchableOpacity, Alert } from "react-native";
import * as Linking from 'expo-linking';
import AsyncStorage from '@react-native-async-storage/async-storage';


const HomeScreen = ({ navigation }) => {
  const callback = "requester.ekycis://Register";
  const navigateToDeepLinkRegisterScreen = () => {
    // get qr code
    fetch("https://idp-requester-demo.svathana.com/api/v1/request/new", { method: "POST", headers: { Accept: "application/json" } })
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      console.log(response);
      throw new Error("Network response was not ok.");
    }).then(async (responseJson) => { 
        const {qr, jti} = responseJson;
      await AsyncStorage.setItem("jti", jti);
        Linking.openURL(`ekycis://qr-scan?qr=${qr}&callback=${callback}`);
      
    }).catch(error => {
      console.log(error)
      Alert.alert("Error", error.message, [{
          text: "Ok",
          onPress: () => {
          }
      }])
  });
    // navigation.navigate("Register");
  }

  return (
    <View className="flex-1 items-center justify-center bg-white">
      <View className="flex-1 justify-center gap-2">
        <TouchableOpacity className="py-2 px-4 bg-blue-400 rounded-lg items-center justify-center">
          <Text className="text-white text-center text-lg">Register</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="py-2 px-4 bg-purple-400 rounded-lg items-center justify-center"
          onPress={navigateToDeepLinkRegisterScreen}
        >
          <Text className="text-white text-center text-lg">
            Register with eKYCIS Demo Provider
          </Text>
        </TouchableOpacity>
      </View>
      <StatusBar style="auto" />
    </View>
  );
};

export default HomeScreen;
