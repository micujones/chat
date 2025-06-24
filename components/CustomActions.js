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

import { useActionSheet } from '@expo/react-native-action-sheet';

const CustomActions = ({ wrapperStyle, iconTextStyle }) => {
    const [image, setImage] = useState(null);
    const [location, setLocation] = useState(null);

    const { showActionSheetWithOptions } = useActionSheet();

    const pickImage = async () => {
        let permissions =
            await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (permissions?.granted) {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ['images', 'livePhotos', 'videos'],
            });
            if (!result.canceled) setImage(result.assets[0]);
            else setImage(null);
        }
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
            const result = await Location.getCurrentPositionAsync({});
            setLocation(result);
        } else {
            Alert.alert("Permissions to read location aren't granted.");
        }
    };

    const onActionPress = () => {
        const options = [
            'Choose from library',
            'Take a picture',
            'Send location',
            'Cancel',
        ];
        const cancelButtonIndex = options.length - 1;

        showActionSheetWithOptions(
            {
                options,
                cancelButtonIndex,
            },
            async (buttonIndex) => {
                switch (buttonIndex) {
                    case 0:
                        console.log('user wants to pick an image');
                        return;
                    case 1:
                        console.log('user wants to take a photo');
                        return;
                    case 2:
                        console.log('user wants to get their location');
                    default:
                }
            }
        );
    };
    return (
        <TouchableOpacity style={styles.container} onPress={onActionPress}>
            <View style={[styles.wrapper, wrapperStyle]}>
                <Text style={[styles.iconText, iconTextStyle]}>+</Text>
            </View>
        </TouchableOpacity>
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
