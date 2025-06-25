import React, { useState } from 'react';
import {
    Button,
    StyleSheet,
    View,
    Image,
    Alert,
    TouchableOpacity,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';

import { Actions } from 'react-native-gifted-chat';
// import { useActionSheet } from '@expo/react-native-action-sheet';

const CustomActions = ({ onSend }) => {
    const [image, setImage] = useState(null);
    const [location, setLocation] = useState(null);

    // const { showActionSheetWithOptions } = useActionSheet();

    const pickImage = async () => {
        let permissions =
            await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (permissions?.granted) {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ['images', 'livePhotos', 'videos'],
            });

            if (!result.canceled) {
                onSend({
                    image: {
                        uri: result.assets[0].uri,
                    },
                });
            } else Alert.alert('Something went wrong while fetching image.');
            // setImage(result.assets[0]);
            // else setImage(null);
        } else Alert.alert("Permissions to access library aren't granted.");
    };

    const takePhoto = async () => {
        let permissions = await ImagePicker.requestCameraPermissionsAsync();

        if (permissions?.granted) {
            const result = await ImagePicker.launchCameraAsync();
            if (!result.canceled) setImage(result.assets[0]);
            else setImage(null);
        }
    };

    const getLocation = async () => {
        let permissions = await Location.requestForegroundPermissionsAsync();

        if (permissions?.granted) {
            const location = await Location.getCurrentPositionAsync({});
            if (location) {
                onSend({
                    location: {
                        latitude: location.coords.latitude,
                        longitude: location.coords.longitude,
                    },
                });
                console.log('Location: ', location);
            } else Alert.alert('Something went wrong while fetching location.');
        } else {
            Alert.alert("Permissions to read location aren't granted.");
        }
    };

    // const onActionPress = () => {
    //     const options = [
    //         'Choose from library',
    //         'Take a picture',
    //         'Send location',
    //         'Cancel',
    //     ];
    //     const cancelButtonIndex = options.length - 1;

    //     showActionSheetWithOptions(
    //         {
    //             options,
    //             cancelButtonIndex,
    //         },
    //         async (buttonIndex) => {
    //             switch (buttonIndex) {
    //                 case 0:
    //                     console.log('user wants to pick an image');
    //                     return;
    //                 case 1:
    //                     console.log('user wants to take a photo');
    //                     return;
    //                 case 2:
    //                     console.log('user wants to get their location');
    //                 default:
    //             }
    //         }
    //     );
    // };

    const options = {
        'Choose from library': () => pickImage(),
        'Take a photo': () => takePhoto(),
        'Send location': async () => getLocation(),
        Cancel: () => {},
    };

    return (
        <Actions
            containerStyle={{
                width: 44,
                height: 44,
                alignItems: 'center',
                justifyContent: 'center',
                marginLeft: 4,
                marginRight: 4,
                marginBottom: 0,
            }}
            icon={() => (
                <Image
                    style={{ width: 24, height: 24 }}
                    source={require('../assets/icon-add.png')}
                    alt="Plus icon created by dmitri13 - Flaticon"
                />
            )}
            options={options}
            optionTintColor="#222B45"
        />
    );
};

const styles = StyleSheet.create({
    container: {
        width: 26,
        height: 26,
        marginLeft: 10,
        marginBottom: 10,
    },
    wrapper: {
        borderRadius: 13,
        borderColor: '#b2b2b2',
        borderWidth: 2,
        flex: 1,
    },
    iconText: {
        color: '#b2b2b2',
        fontWeight: 'bold',
        fontSize: 10,
        backgroundColor: 'transparent',
        textAlign: 'center',
    },
});

export default CustomActions;
