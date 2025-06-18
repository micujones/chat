import { useState, useEffect } from 'react';
import { StyleSheet, View, KeyboardAvoidingView, Platform } from 'react-native';
import {
    Bubble,
    GiftedChat,
    InputToolbar,
    Send,
} from 'react-native-gifted-chat';
import Icon from 'react-native-vector-icons/Ionicons';

// Firebase
import {
    addDoc,
    collection,
    onSnapshot,
    orderBy,
    query,
} from 'firebase/firestore';
import { db } from '../src/firebaseConfig';

const Chat = ({ route, navigation }) => {
    const { userID, name, bgColor } = route.params;
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        navigation.setOptions({ title: name });

        const q = query(
            collection(db, 'messages'),
            orderBy('createdAt', 'desc')
        );

        // Update collections
        const unsubMessages = onSnapshot(q, (querySnapshot) => {
            let newMessages = [];
            querySnapshot.forEach((message) => {
                newMessages.push({
                    id: message.id,
                    ...message.data(),
                    createdAt: new Date(message.data().createdAt.toMillis()),
                });
            });
            setMessages(newMessages);
        });

        // Clean up code
        return () => {
            if (unsubMessages) unsubMessages();
        };
    }, []);

    const onSend = (newMessages) => {
        addDoc(collection(db, 'messages'), newMessages[0]);
    };

    const renderBubble = (props) => {
        return (
            <Bubble
                {...props}
                wrapperStyle={{
                    right: { backgroundColor: '#000' },
                    left: { backgroundColor: '#fff' },
                }}
            />
        );
    };

    const renderInputToolBar = (props) => {
        return (
            <InputToolbar
                {...props}
                containerStyle={{
                    paddingLeft: 10,
                    paddingRight: 10,
                }}
            />
        );
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

    return (
        <View style={[styles.container, { backgroundColor: bgColor }]}>
            <KeyboardAvoidingView
                // Makes space for the keyboard when user is typing
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            ></KeyboardAvoidingView>
            <GiftedChat
                messages={messages}
                onSend={(messages) => onSend(messages)}
                renderBubble={renderBubble}
                renderInputToolbar={renderInputToolBar}
                renderSend={renderSend}
                user={{
                    _id: userID,
                    name: name,
                }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

export default Chat;
