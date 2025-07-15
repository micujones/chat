import React, { useState } from 'react';
import { Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';

import { Actions } from 'react-native-gifted-chat';

import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storage } from '../src/firebaseConfig';

const CustomActions = ({ user, onSend }) => {
    const [messageData, setMessageData] = useState({});

    const generateReference = (uri) => {
        const timeStamp = new Date().getTime();
        const imageName = uri.split('/')[uri.split('/').length - 1];
        return `${user._id}-${timeStamp}-${imageName}`;
    };

    // "random" function from here: https://stackoverflow.com/a/8084248/3452513
    const messageIdGenerator = () =>
        (Math.random() + 1).toString(36).substring(7);

    // Send message with customView object and add'l message data
    const sendMessageData = (customViewObject) => {
        onSend([
            {
                ...customViewObject,
                // Add message data for document
                _id: messageIdGenerator(),
                user: user,
                createdAt: new Date(),
            },
        ]);
    };

    // Uploading to Firebase Storage
    const uploadAndSendImage = async (imageURI) => {
        const uniqueRefString = generateReference(imageURI);
        const response = await fetch(imageURI);
        const blob = await response.blob();
        const newUploadRef = ref(storage, uniqueRefString);
        uploadBytes(newUploadRef, blob).then(async (snapshot) => {
            console.log('Image file has been uploaded.');
            // Sending message with Gifted Chat
            const imageURL = await getDownloadURL(snapshot.ref);
            sendMessageData({
                image: imageURL,
            });
        });
    };

    const pickImage = async () => {
        let permissions =
            await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (permissions?.granted) {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ['images', 'livePhotos', 'videos'],
            });

            if (!result.canceled)
                await uploadAndSendImage(result.assets[0].uri);
            else Alert.alert('Something went wrong while fetching image.');
        } else Alert.alert("Permissions to access library aren't granted.");
    };

    const takePhoto = async () => {
        let permissions = await ImagePicker.requestCameraPermissionsAsync();

        if (permissions?.granted) {
            const result = await ImagePicker.launchCameraAsync();
            if (!result.canceled)
                await uploadAndSendImage(result.assets[0].uri);
            else Alert.alert('Something went wrong while taking photo.');
        } else Alert.alert("Permissions to access camera aren't granted.");
    };

    const getLocation = async () => {
        let permissions = await Location.requestForegroundPermissionsAsync();

        if (permissions?.granted) {
            const location = await Location.getCurrentPositionAsync({});
            if (location) {
                sendMessageData({
                    location: {
                        latitude: location.coords.latitude,
                        longitude: location.coords.longitude,
                    },
                });
            } else Alert.alert('Something went wrong while fetching location.');
        } else {
            Alert.alert("Permissions to read location aren't granted.");
        }
    };

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

export default CustomActions;
