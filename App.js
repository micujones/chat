/* 
    YOU MIGHT HAVE TO RUN
    npm audit fix --force

    BC OF ASYNC STORAGE
*/
import { StyleSheet, Text, View } from 'react-native';

// Navigation
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

// Components
import Start from './components/Start';
import Chat from './components/Chat';

import { useEffect } from 'react';
import { Alert } from 'react-native';

// Connection
import { useNetInfo } from '@react-native-community/netinfo';
import { disableNetwork, enableNetwork } from 'firebase/firestore';
import { db } from './src/firebaseConfig';

const App = () => {
    const connectionStatus = useNetInfo();
    useEffect(() => {
        if (connectionStatus.isConnected === false) {
            Alert.alert('Connection lost.');
            disableNetwork(db);
        } else if (connectionStatus.isConnected === true) {
            enableNetwork(db);
        }
    }, [connectionStatus.isConnected]);

    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Start">
                <Stack.Screen name="Start" component={Start} />
                <Stack.Screen name="Chat">
                    {(props) => (
                        <Chat
                            db={db}
                            isConnected={connectionStatus.isConnected}
                            {...props}
                        />
                    )}
                </Stack.Screen>
            </Stack.Navigator>
        </NavigationContainer>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
export default App;
