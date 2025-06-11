import { useState, useEffect } from 'react';
import { StyleSheet, View, KeyboardAvoidingView, Platform } from 'react-native';
import { Bubble, GiftedChat } from 'react-native-gifted-chat';

const Chat = ({ route, navigation }) => {
    const { name } = route.params;
    const [messages, setMessages] = useState([]);

    // Sends first message
    useEffect(() => {
        navigation.setOptions({ title: name });

        setMessages([
            {
                _id: 1,
                text: 'Hello developer',
                createdAt: new Date(),
                user: {
                    _id: 2,
                    name: 'React Native',
                    avatar: 'https://www.usatoday.com/gcdn/authoring/authoring-images/2025/05/09/USAT/83538946007-2211456576.jpg?crop=2281,2280,x791,y0', // Replace
                },
            },
            {
                _id: 2,
                text: 'This is a system message',
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

    return (
        <View style={styles.container}>
            <GiftedChat
                messages={messages}
                onSend={(messages) => onSend(messages)}
                renderBubble={renderBubble}
                user={{
                    _id: 1,
                }}
            />
            {/* Makes space for the keyboard when user is typing */}
            {Platform.OS === 'android' ? (
                <KeyboardAvoidingView behavior="height" />
            ) : null}
            {Platform.OS === 'ios' ? (
                <KeyboardAvoidingView behavior="padding" />
            ) : null}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // paddingBottom: 30,
        // justifyContent: 'center',
        // alignItems: 'center',
    },
});

export default Chat;
