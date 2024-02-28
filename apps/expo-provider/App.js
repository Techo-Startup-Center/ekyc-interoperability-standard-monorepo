import React, { useEffect } from 'react';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './src/pages/HomeScreen';
import HeaderOptions from './src/components/HeaderOptionComponent';
import { ImageBackground } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import data from './assets/user.json'
import ScanQRScreen from './src/pages/ScanQrScreen';
import { RootSiblingParent } from 'react-native-root-siblings';
import ConsentScreen from './src/pages/ConsentScreen';
import RegisterScreen from './src/pages/RegisterScreen';
import { Text } from 'react-native';

import * as Linking from "expo-linking";

const prefix = Linking.createURL("/");

const linking = {
  prefixes: [prefix]
};

const Stack = createStackNavigator();

export default function App() {
  return (
    <RootSiblingParent>
      <ImageBackground source={require('./assets/background.png')} resizeMethod='scale'
        style={{ flex: 1 }}>
        <NavigationContainer linking={linking} fallback={<Text>Loading...</Text>} theme={navTheme}>
          <Stack.Navigator>
            <Stack.Screen name="home" component={HomeScreen} options={({ navigation }) => HeaderOptions("home", "CamDigiKey", navigation)} />
            <Stack.Screen name="qr-scan" component={ScanQRScreen} options={({ navigation }) => HeaderOptions("qr-scan", "CamDigiKey", navigation)} />
            <Stack.Screen name="register" component={RegisterScreen} options={({ navigation }) => HeaderOptions("register", "Register", navigation)} />
            <Stack.Screen name="consent" component={ConsentScreen} options={({ navigation }) => HeaderOptions("consent", "CamDigiKey", navigation)} />
          </Stack.Navigator>
        </NavigationContainer>
      </ImageBackground>
    </RootSiblingParent>
  )
}

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: 'transparent',
  },
};

const styles = {
  screen: {
    flex: 1,
  },
  //trainsparent
  background: {
    backgroundColor: 'transparent',
  },
}