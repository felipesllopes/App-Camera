import { Feather, FontAwesome } from "@expo/vector-icons";
import Slider from '@react-native-community/slider';
import { AutoFocus, Camera, CameraType, } from "expo-camera";
import * as MediaLibrary from "expo-media-library";
import { useEffect, useRef, useState } from "react";
import { Image, Modal, SafeAreaView, StyleSheet, Text, TouchableOpacity, View, } from "react-native";

export default function Home() {

    const [type, setType] = useState(CameraType.back);
    const [permission, setPermission] = useState();
    const camRef = useRef(null);
    const [capturedPhoto, setCapturedPhoto] = useState();
    const [flashMode, setFlashMode] = useState(Camera.Constants.FlashMode.off)
    const [open, setOpen] = useState(false);
    const [focus, setFocus] = useState(AutoFocus.on)
    const [zoom, setZoom] = useState(0)

    useEffect(() => {
        (async () => {

            const { status } = await Camera.requestCameraPermissionsAsync();
            setPermission(status === "granted")

            if (!permission) {
                return <View />
            }

            if (!permission.granted) {
                return <Text>Acesso negado!</Text>
            }
        })();

    }, [])

    async function takePicture() {
        if (camRef || permission) {
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

    return (
        <SafeAreaView style={styles.container} >

            <Camera
                style={styles.camera}
                ref={camRef}
                type={type}
                flashMode={flashMode}
                autoFocus={focus}
                zoom={zoom}
            />


            <View style={styles.slidesFocus}>
                <View style={styles.viewSlides}>
                    <Text style={styles.textSlides}>-</Text>
                    <Slider
                        minimumValue={0}
                        maximumValue={1}
                        value={zoom}
                        onValueChange={(valor) => setZoom(valor)}
                        thumbTintColor="#EEE"
                        maximumTrackTintColor="#FFF"
                        minimumTrackTintColor="#CCC"
                        style={{ width: 150, }}
                    />
                    <Text style={styles.textSlides}>+</Text>
                </View>

                <TouchableOpacity style={styles.focus} onPress={changeFocus}>
                    <Text style={styles.textFocus}>Foco</Text>
                    {focus ?
                        <FontAwesome name="crosshairs" size={24} color={"white"} />
                        :
                        <FontAwesome name="ban" size={24} color={"white"} />
                    }
                </TouchableOpacity>
            </View>


            <View style={styles.picture}>
                <TouchableOpacity onPress={toggleCameraType}>
                    <Feather name="refresh-ccw" size={30} color={"white"} />
                </TouchableOpacity>

                <TouchableOpacity onPress={takePicture} style={styles.buttomPicture} />

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
                            <TouchableOpacity style={styles.modalButtons} onPress={() => setOpen(false)}>
                                <FontAwesome name="window-close" size={34} color={"white"} />
                            </TouchableOpacity>
                        </View>

                        <Image
                            style={styles.photo}
                            source={{ uri: capturedPhoto }}
                        />

                        <View style={[styles.viewButtons, { borderBottomLeftRadius: 12, borderBottomRightRadius: 12 }]}>
                            <TouchableOpacity style={styles.modalButtons} onPress={savePicture}>
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
        height: '78%',
        width: "100%",
        alignSelf: 'center'
    },
    slidesFocus: {
        backgroundColor: '#131313',
        alignItems: 'flex-start'
    },
    viewSlides: {
        flexDirection: 'row',
        alignSelf: 'center',
    },
    textSlides: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16
    },
    focus: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 10,
    },
    textFocus: {
        color: 'white',
        fontSize: 17,
        marginRight: 6,
    },
    picture: {
        flex: 1,
        backgroundColor: '#000',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around'
    },
    buttomPicture: {
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
    modalButtons: {
        margin: 1,
    },
    photo: {
        width: '100%',
        height: '65%',
    },
})
