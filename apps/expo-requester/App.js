import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from "./pages/HomeScreen";
import DeepLinkRegisterScreen from "./pages/DeepLinkRegisterScreen";
import * as Linking from "expo-linking";
import { Text } from "react-native";
import { StyleSheet } from "react-native";

const prefix = Linking.createURL("/");

const linking = {
  prefixes: [prefix]
};

const Stack = createStackNavigator();

export default function App() {
  return (
      <NavigationContainer linking={linking} fallback={<Text>Loading...</Text>} >
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Register" component={DeepLinkRegisterScreen} />
        </Stack.Navigator>
      </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  spinnerTextStyle: {
    color: '#FFF'
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF'
  },
});
