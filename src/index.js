import { Feather, FontAwesome } from "@expo/vector-icons";
import { AutoFocus, Camera, CameraType, } from "expo-camera";
import * as MediaLibrary from "expo-media-library";
import { useRef, useState } from "react";
import { Image, Modal, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Home() {

    const [type, setType] = useState(CameraType.back);
    const [permission, requestPermission] = Camera.useCameraPermissions();
    const camRef = useRef(null);
    const [capturedPhoto, setCapturedPhoto] = useState();
    const [flashMode, setFlashMode] = useState(Camera.Constants.FlashMode.off)
    const [open, setOpen] = useState(false);
    const [focus, setFocus] = useState(AutoFocus.on)
    const [zoom, setZoom] = useState(Camera.defaultProps.zoom)

    if (!permission) {
        return <View />
    }

    if (!permission.granted) {
        return <Text>Acesso negado!</Text>
    }

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
        if (type === "back") {
            setFlashMode(current => (current === Camera.Constants.FlashMode.off ? Camera.Constants.FlashMode.torch : Camera.Constants.FlashMode.off))
        }
    }

    async function savePicture() {
        MediaLibrary.saveToLibraryAsync(capturedPhoto)
        setOpen(false)
    }

    function changeFocus() {
        setFocus(current => (current === Camera.Constants.AutoFocus.off ? Camera.Constants.AutoFocus.on : Camera.Constants.AutoFocus.off))
    }

    // Usar o SLIDER pra poder controlar o zoom. Valor min de 0 e max de 1

    return (
        <SafeAreaView style={styles.container} >

            <Camera
                ref={camRef}
                style={styles.camera}
                type={type}
                flashMode={flashMode}
                autoFocus={focus}
                zoom={zoom}
            />

            <View style={styles.boxOptions}>
                <TouchableOpacity style={styles.focus} onPress={changeFocus}>
                    <Text style={styles.textFocus}>Foco</Text>
                    {focus ?
                        <FontAwesome name="crosshairs" size={24} color={"white"} />
                        :
                        <FontAwesome name="ban" size={24} color={"white"} />
                    }
                </TouchableOpacity>
            </View>

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

                        <View style={[styles.viewButtons, { borderTopLeftRadius: 12, borderTopRightRadius: 12 }]}>
                            <TouchableOpacity style={styles.modalButton} onPress={() => setOpen(false)}>
                                <FontAwesome name="window-close" size={34} color={"white"} />
                            </TouchableOpacity>
                        </View>

                        <Image
                            style={styles.photo}
                            source={{ uri: capturedPhoto }}
                        />

                        <View style={[styles.viewButtons, { borderBottomLeftRadius: 12, borderBottomRightRadius: 12 }]}>
                            <TouchableOpacity style={styles.modalButton} onPress={savePicture}>
                                <FontAwesome name="upload" size={34} color={"white"} />
                            </TouchableOpacity>
                        </View>

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
        height: 666,
        width: 500.5,
        alignSelf: 'center'
    },
    slide: {
        backgroundColor: 'red',
        flexDirection: 'row'
    },
    textSlide: {
        color: 'white',
        fontWeight: 'bold'
    },
    boxOptions: {
        backgroundColor: '#131313',
        alignItems: 'flex-start'
    },
    focus: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    textFocus: {
        color: 'white',
        fontSize: 17,
        marginRight: 6,
    },
    boxButtons: {
        flex: 1,
        backgroundColor: '#000',
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
        margin: 20,
    },
    viewButtons: {
        backgroundColor: 'black',
        alignItems: 'center',
    },
    modalButton: {
        margin: 1,
    },
    photo: {
        width: '100%',
        height: '65%',
    },
})
