import { Ionicons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera/next';
import { useEffect, useRef, useState } from 'react';
import { Buffer } from 'buffer';


const { View, Text, StyleSheet } = require('react-native');

export default function ScanQRScreen({ route, navigation }) {
    var qr;
    var callback;
    if (route.params) {
        qr = route.params.qr;
        callback = route.params.callback;
    }
    var processing = false;
    const [facing, setFacing] = useState('back');
    const [permission, requestPermission] = useCameraPermissions();
    useEffect(() => {
        if (!permission || !permission.granted) {
            requestPermission()
        }
    }, [])
    const onScanned = (result) => {
        if (processing) { return }
        processing = true;
        try {
            const qrSplit = result.data.split('.')
            if (qrSplit.length === 3) {
                // check if the first split is jwt header
                let jwtHeader = JSON.parse(Buffer.from(qrSplit[0], 'base64').toString('utf-8'))
                if (jwtHeader.typ === 'JWT') {
                    // fetch with API to verify the signature
                    fetch(process.env.EXPO_PUBLIC_API_URL + "/api/v1/provide/verify", {
                        method: 'POST',
                        headers: {
                            Accept: 'application/json',
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            qr: result.data
                        })
                    }).then((respond) => {
                        if (respond.status === 200) {
                            respond.json().then((data) => {
                                console.log(callback)
                                navigation.navigate('consent', { data, callback })
                            })
                        } else {
                            console.log("error", respond)
                        }
                        processing = false
                    })
                }
            } else {
                processing = false
            }
        } catch (e) {
            console.log(e.message)
            processing = false
        }
    }
    if (qr) {
        onScanned({ data: qr })
    }
    const onMountError = (event) => {
        console.log(event)
    }
    return (
        <View className="h-5/6 w-full flex mt-5">
            {!permission ? <Text>Requesting for camera permission</Text> :
                <CameraView barCodeScannerSettings={{
                    barCodeTypes: ["qr"], interval: 500
                }} facing={facing} onMountError={onMountError} onBarcodeScanned={onScanned}>
                    <View className="w-full h-full justify-center items-center z-10">
                        <Ionicons name="scan-outline" size={250} color="white" />
                    </View>

                </CameraView>}

        </View>
    )
}