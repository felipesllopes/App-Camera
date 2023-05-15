import { Feather, FontAwesome } from "@expo/vector-icons";
import { Camera, CameraType, } from "expo-camera";
import * as Permissions from "expo-permissions";
import { useEffect, useRef, useState } from "react";
import { Image, Modal, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import * as MediaLibrary from "expo-media-library"

export default function Home() {

    const [type, setType] = useState(CameraType.back);
    const [permission, requestPermission] = Camera.useCameraPermissions();
    const camRef = useRef(null);
    const [capturedPhoto, setCapturedPhoto] = useState();
    const [flashMode, setFlashMode] = useState(Camera.Constants.FlashMode.off)
    const [open, setOpen] = useState(false);

    useEffect(() => {
        (async () => {

            if (!permission) {
                return <View />
            }

            if (!permission.granted) {
                return <Text>Acesso negado!</Text>
            }

            // const { status } = Permissions.MEDIA_LIBRARY
            // console.log(status)

        })();
    }, [])



    async function takePicture() {
        if (camRef) {
            const data = await camRef.current.takePictureAsync();
            setCapturedPhoto(data.uri);
            setOpen(true);
        }
    }

    function toggleCameraType() {
        setType(current => (current === CameraType.back ? CameraType.front : CameraType.back))
        setFlashMode(Camera.Constants.FlashMode.off)
    }

    function photoFlash() {
        setFlashMode(current => (current === Camera.Constants.FlashMode.off ? Camera.Constants.FlashMode.torch : Camera.Constants.FlashMode.off))
    }

    async function savePicture() {
        MediaLibrary.saveToLibraryAsync(capturedPhoto)
        setOpen(false)
    }

    return (
        <SafeAreaView style={styles.container} >

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

            {capturedPhoto &&
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={open}
                >
                    <View style={styles.modalPhoto}>

                        <View style={styles.modalButtons}>
                            <TouchableOpacity style={styles.modalButton} onPress={() => setOpen(false)}>
                                <FontAwesome name="window-close" size={40} color={"red"} />
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.modalButton} onPress={savePicture}>
                                <FontAwesome name="upload" size={40} color={"white"} />
                            </TouchableOpacity>
                        </View>

                        <Image
                            style={styles.photo}
                            source={{ uri: capturedPhoto }}
                        />

                    </View>
                </Modal>
            }

        </SafeAreaView>
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
    modalPhoto: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 20,
    },
    modalButtons: {
        flexDirection: 'row',
    },
    modalButton: {
        margin: 10,
    },
    photo: {
        width: '100%',
        height: '85%',
    },
})
