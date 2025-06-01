import { useState } from 'react';
import { StyleSheet, View, Text, Button, TextInput } from 'react-native';

const Start = ({ navigation }) => {
    const [name, setName] = useState('');
    return (
        <View style={styles.container}>
            <Text>Bienvenido.</Text>
            <TextInput
                style={styles.textInput}
                value={name}
                onChangeText={setName}
                placeholder="Username"
            />
            <Button
                title="Start chatting"
                onPress={() => navigation.navigate('Screen2', { name: name })}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textInput: {
        width: '88%',
        padding: 15,
        borderWidth: 1,
        marginTop: 15,
        marginBottom: 15,
    },
});
export default Start;
