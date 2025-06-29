import { useState, useEffect } from 'react';
import {
    Button,
    Image,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    View,
} from 'react-native';
import {
    Bubble,
    GiftedChat,
    InputToolbar,
    Send,
} from 'react-native-gifted-chat';
import Icon from 'react-native-vector-icons/Ionicons';
import CustomActions from './CustomActions';
import MapView, {
    Marker,
    PROVIDER_DEFAULT,
    PROVIDER_GOOGLE,
} from 'react-native-maps';

// Firebase
import {
    addDoc,
    collection,
    onSnapshot,
    orderBy,
    query,
} from 'firebase/firestore';
import { db } from '../src/firebaseConfig';

import AsyncStorage from '@react-native-async-storage/async-storage';

const Chat = ({ route, navigation, isConnected }) => {
    const { userID, name, bgColor } = route.params;
    const [messages, setMessages] = useState([]);

    const user = { _id: userID, name: name };

    let unsubMessages;
    useEffect(() => {
        navigation.setOptions({ title: name });

        if (isConnected === true) {
            // unregister current onSnapshot() listener to avoid registering multiple listeners when
            // useEffect code is re-executed.
            if (unsubMessages) unsubMessages();
            unsubMessages = null;

            const q = query(
                collection(db, 'messages'),
                // where("uid", "==", userID),
                orderBy('createdAt', 'desc')
            );

            // Update collections
            unsubMessages = onSnapshot(q, (querySnapshot) => {
                let newMessages = [];
                querySnapshot.forEach((message) => {
                    newMessages.push({
                        id: message.id,
                        ...message.data(),
                        createdAt: new Date(
                            message.data().createdAt.toMillis()
                        ),
                    });
                });
                cacheMessages(newMessages);
                setMessages(newMessages);
            });
        } else if (isConnected === false) loadCachedMessages();

        // Clean up code
        return () => {
            if (unsubMessages) unsubMessages();
        };
    }, [isConnected]);

    const onSend = (props) => {
        if (props[0].location) console.log('Location sent.', props);
        addDoc(collection(db, 'messages'), props[0]); // Props are an array
    };

    // CACHE FUNCTIONS
    const cacheMessages = async (messagesToCache) => {
        try {
            await AsyncStorage.setItem(
                'messages',
                JSON.stringify(messagesToCache)
            );
        } catch (error) {
            console.log(error.message);
        }
    };

    const loadCachedMessages = async () => {
        const cachedMessages = (await AsyncStorage.getItem('messages')) || [];
        setMessages(JSON.parse(cachedMessages));
    };

    // RENDERING FUNCTIONS
    const renderBubble = (props) => {
        return (
            <Bubble
                {...props}
                wrapperStyle={{
                    right: { backgroundColor: '#0d71fe' },
                    left: { backgroundColor: '#fff' },
                }}
            />
        );
    };

    const renderInputToolBar = (props) => {
        if (isConnected === true) {
            return (
                <InputToolbar
                    {...props}
                    containerStyle={{
                        paddingLeft: 10,
                        paddingRight: 10,
                    }}
                />
            );
        } else return null;
    };

    const renderSend = (props) => {
        return (
            <Send {...props}>
                <View style={{ marginBottom: 10 }}>
                    <Icon name="send" size={24} color="#0075FD" />
                </View>
            </Send>
        );
    };

    const renderActions = (props) => {
        return <CustomActions user={user} onSend={onSend} {...props} />;
    };

    const renderCustomView = (props) => {
        const { currentMessage } = props;

        console.log(currentMessage);
        if (currentMessage.location) {
            return (
                <View style={[styles.customViewContainer, styles.mapContainer]}>
                    <MapView
                        provider={PROVIDER_DEFAULT}
                        style={{ flex: 1 }}
                        region={{
                            latitude: currentMessage.location.latitude,
                            longitude: currentMessage.location.longitude,
                            latitudeDelta: 0.0922,
                            longitudeDelta: 0.0421,
                        }}
                        scrollEnabled={false}
                        zoomEnabled={false}
                    >
                        <Marker
                            coordinate={currentMessage.location}
                            title="Location"
                        />
                    </MapView>
                </View>
            );
        }

        if (currentMessage.image) {
            return (
                <View
                    style={[styles.customViewContainer, styles.imageContainer]}
                >
                    <Image src={currentMessage.image} />
                </View>
            );
        }
        return null;
    };

    return (
        <View style={[styles.container, { backgroundColor: bgColor }]}>
            <KeyboardAvoidingView
                // Makes space for the keyboard when user is typing
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            ></KeyboardAvoidingView>
            {isConnected === false && (
                <Button title="You are offline." color="#de0a26" />
            )}
            <GiftedChat
                messages={messages}
                onSend={onSend}
                renderBubble={renderBubble}
                renderInputToolbar={renderInputToolBar}
                renderSend={renderSend}
                renderActions={renderActions}
                renderCustomView={renderCustomView}
                user={user}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    customViewContainer: {
        width: 150,
        borderRadius: 13,
        margin: 3,
        overflow: 'hidden',
    },
    mapContainer: {
        height: 100,
    },
    imageContainer: {
        height: 'auto',
    },
});

export default Chat;
