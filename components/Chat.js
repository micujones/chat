import { useState, useEffect } from 'react';
import { StyleSheet, View, KeyboardAvoidingView, Platform } from 'react-native';
import {
    Bubble,
    GiftedChat,
    InputToolbar,
    Send,
} from 'react-native-gifted-chat';
import Icon from 'react-native-vector-icons/Ionicons';

const Chat = ({ route, navigation }) => {
    const { name, bgColor } = route.params;
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        navigation.setOptions({ title: name });

        // Sends first message
        setMessages([
            {
                _id: 1,
                text: `Hello ${name}!`,
                createdAt: new Date(),
                user: {
                    _id: 2,
                    name: 'React Native',
                    avatar: 'https://www.usatoday.com/gcdn/authoring/authoring-images/2025/05/09/USAT/83538946007-2211456576.jpg?crop=2281,2280,x791,y0', // Replace
                },
            },
            {
                _id: 2,
                text: 'Welcome to the chat.',
                createdAt: new Date(),
                system: true,
            },
        ]);
    }, []);

    const onSend = (newMessages) => {
        setMessages((previousMessages) =>
            GiftedChat.append(previousMessages, newMessages)
        );
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
                    _id: 1,
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
