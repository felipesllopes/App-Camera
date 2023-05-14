import { Feather, FontAwesome } from "@expo/vector-icons";
import { Camera, CameraType, } from "expo-camera";
import { useRef, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View, } from "react-native";

export default function Home() {

    const [type, setType] = useState(CameraType.back);
    const [permission, requestPermission] = Camera.useCameraPermissions();
    const camRef = useRef(null);
    const [capturedPhoto, setCapturedPhoto] = useState();
    const [flashMode, setFlashMode] = useState(Camera.Constants.FlashMode.off)

    if (!permission) {
        return <View />
    }

    if (!permission.granted) {
        return <Text>Acesso negado!</Text>
    }

    async function takePicture() {
        if (camRef) {
            const data = await camRef.current.takePictureAsync();
            setCapturedPhoto(data.uri)
            console.log("\n\n", data)
            console.log(flashMode)
            console.log(type)
        }
    }

    function toggleCameraType() {
        setType(current => (current === CameraType.back ? CameraType.front : CameraType.back))
    }

    function photoFlash() {
        setFlashMode(current => (current === Camera.Constants.FlashMode.off ? Camera.Constants.FlashMode.torch : Camera.Constants.FlashMode.off))
    }


    return (
        <View style={styles.container} >

            <Camera
                ref={camRef}
                style={styles.camera}
                type={type}
                flashMode={flashMode}
            />

            <View style={styles.boxButtons}>

                <TouchableOpacity onPress={toggleCameraType}>
                    <Feather name="refresh-ccw" size={30} color={"white"} />
                </TouchableOpacity>

                <TouchableOpacity onPress={takePicture} style={styles.camButtom} />

                <TouchableOpacity onPress={photoFlash}>
                    {flashMode ?
                        <FontAwesome name="flash" size={30} color={"yellow"} />
                        :
                        <FontAwesome name="flash" size={30} color={"white"} />
                    }
                </TouchableOpacity>
            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    camera: {
        height: 690,
        width: 517.5,
        alignSelf: 'center'
    },
    boxButtons: {
        flex: 1,
        backgroundColor: '#111',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around'
    },
    camButtom: {
        backgroundColor: 'white',
        textAlign: 'center',
        borderWidth: 2,
        borderColor: "#666",
        height: 54,
        width: 54,
        borderRadius: 30
    },
})
