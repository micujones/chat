import { useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    // Image,
    ImageBackground,
    TextInput,
    TouchableOpacity,
} from 'react-native';

const image = '../assets/background-image.png';
// const icon = '../assets/icon-user.svg';

const Start = ({ navigation }) => {
    const [name, setName] = useState('');
    return (
        <View style={styles.container}>
            <ImageBackground
                source={require(image)}
                resizeMode="cover"
                style={styles.backgroundImage}
            >
                <Text style={styles.title}>Chat!</Text>
                <View style={styles.inputSection}>
                    {/* <Image source={require(icon)} style={{ fill: 'black' }} /> */}
                    <TextInput
                        style={[
                            styles.textInput,
                            styles.normalText,
                            // { opacity: 50 },
                        ]}
                        value={name}
                        onChangeText={setName}
                        placeholder="Your Name"
                    />
                    <View style={styles.chooseBackgroundColor}>
                        <TextInput
                            style={[styles.normalText, { opacity: 100 }]}
                            value="Choose Background Color:"
                        />
                        <View style={{ flexDirection: 'row', gap: 12 }}>
                            <TouchableOpacity
                                style={[
                                    styles.circle,
                                    { backgroundColor: '#090C08' },
                                ]}
                            ></TouchableOpacity>
                            <TouchableOpacity
                                style={[
                                    styles.circle,
                                    { backgroundColor: '#474056' },
                                ]}
                            ></TouchableOpacity>
                            <TouchableOpacity
                                style={[
                                    styles.circle,
                                    { backgroundColor: '#8A95A5' },
                                ]}
                            ></TouchableOpacity>
                            <TouchableOpacity
                                style={[
                                    styles.circle,
                                    { backgroundColor: '#B9C6AE' },
                                ]}
                            ></TouchableOpacity>
                        </View>
                    </View>
                    <TouchableOpacity
                        style={[styles.button, styles.bar]}
                        onPress={() =>
                            navigation.navigate('Chat', { name: name })
                        }
                    >
                        <Text style={styles.buttonText}>Start Chatting</Text>
                    </TouchableOpacity>
                </View>
            </ImageBackground>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    backgroundImage: {
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: 30,
    },
    title: {
        fontSize: 45,
        fontWeight: 600,
        color: '#FFFFFF',
        paddingTop: 75,
    },
    inputSection: {
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        height: '44%',
        width: '88%',
    },
    normalText: {
        fontSize: 16,
        fontWeight: 300,
        color: '#757083',
    },
    textInput: {
        width: '88%',
        padding: 15,
        borderWidth: 1,
        marginTop: 15,
        marginBottom: 15,
    },
    chooseBackgroundColor: {
        justifyContent: 'flex-start',
        width: '88%',
        gap: 12,
    },
    circle: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    button: {
        width: '88%',
        padding: 15,
        alignItems: 'center',
        backgroundColor: '#757083',
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 600,
    },
});
export default Start;
