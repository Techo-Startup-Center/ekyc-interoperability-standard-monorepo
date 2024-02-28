import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { Text, View, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import Spinner from 'react-native-loading-spinner-overlay';

const DeepLinkRegisterScreen = ({ route, navigation }) => {
  useEffect(() => {
    if (route && route.params) {
      const { status } = route.params;
      console.log(status)
      if (status === "success") {
        setSpinner(true);
        AsyncStorage.getItem("jti").then((jti) => {
          fetch(`https://idp-requester-demo.svathana.com/api/v1/request/status?jti=${jti}`, { method: "GET", headers: { Accept: "application/json" } })
            .then((response) => {
              if (response.ok) {
                return response.json();
              }
              console.log(response)
              throw new Error("Network response was not ok.");
            }).then(async (responseJson) => {
              const { user } = responseJson;
              setFirstName(user.first_name);
              setLastName(user.last_name);
              setPhoneNumber(user.phone_number);
              setDocumentType(user.document_type);
              setDocumentId(user.document_id);
              setEmail(user.email);
              setDob(user.dob);
              setGender(user.gender);
              setIssueDate(user.issue_date);
              setExpiryDate(user.expiry_date);
              setSpinner(false);
            }).catch(error => {
              setSpinner(false);
            });
        });
      }
    }
  }, []);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [documentType, setDocumentType] = useState("");
  const [documentId, setDocumentId] = useState("");
  const [email, setEmail] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [issueDate, setIssueDate] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [spinner, setSpinner] = useState(false);


  return (
    <View style={styles.container}>
      <Spinner
        visible={spinner}
        textContent={'Loading...'}
        textStyle={styles.spinnerTextStyle}
      />
      <View className="h-full flex bg-white rounded-2xl">
        <Text className="m-2 text-md">Please input your information:</Text>
        <ScrollView className="grow">
          <TextInput
            className="m-2 h-12 pl-5 bg-gray-100 rounded-full text-black/70"
            placeholder="Firstname"
            value={firstName}
            onChangeText={setFirstName}
            editable={false}
          />
          <TextInput
            className="m-2 h-12 pl-5 bg-gray-100 rounded-full text-black/70"
            placeholder="Last Name"
            value={lastName}
            onChangeText={setLastName}
            editable={false}
          />

          {/* <View className="m-2 h-12 pl-1 text-sm bg-gray-100 rounded-full">
          <Picker
            selectedValue={documentType}
            onValueChange={(itemValue, itemIndex) => setDocumentType(itemValue)}
            mode="dropdown"
          >
            <Picker.Item
              style={styles.picker_item}
              label="Select Document"
              value=""
            />
            <Picker.Item label="National ID" value="nid" />
            <Picker.Item label="Passport" value="passport" />
          </Picker>
        </View> */}
          <TextInput
            className="m-2 h-12 pl-5 bg-gray-100 rounded-full text-black/70"
            placeholder="Document Type"
            value={documentType}
            onChangeText={setDocumentType}
            editable={false}
          />
          <TextInput
            className="m-2 h-12 pl-5 bg-gray-100 rounded-full text-black/70"
            placeholder="Document ID"
            value={documentId}
            onChangeText={setDocumentId}
            editable={false}
          />
          <TextInput
            className="m-2 h-12 pl-5 bg-gray-100 rounded-full text-black/70"
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            editable={false}
          />
          <TextInput
            className="m-2 h-12 pl-5 bg-gray-100 rounded-full text-black/70"
            placeholder="Date of Birth"
            value={dob}
            onChangeText={setDob}
            editable={false}
          />
          <TextInput
            className="m-2 h-12 pl-5 bg-gray-100 rounded-full text-black/70"
            placeholder="Gender"
            value={gender}
            onChangeText={setGender}
            editable={false}
          />
          <TextInput
            className="m-2 h-12 pl-5 bg-gray-100 rounded-full text-black/70"
            placeholder="Issue Date"
            value={issueDate}
            onChangeText={setIssueDate}
            editable={false}
          />
          <TextInput
            className="m-2 h-12 pl-5 bg-gray-100 rounded-full text-black/70"
            placeholder="Expiry Date"
            value={expiryDate}
            onChangeText={setExpiryDate}
            editable={false}
          />
        </ScrollView>
        <View className=" flex items-center justify-center mt-2">
          <TouchableOpacity className=" mb-2 h-12 bg-blue-700 rounded-full w-1/2 flex items-center justify-center">
            <Text className="text-white text-center font-bold text-lg ">
              Register
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  spinnerTextStyle: {
    color: '#FFF'
  },
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
    width: "100%",
  }
});

export default DeepLinkRegisterScreen;
