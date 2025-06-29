import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: 'AIzaSyANLU9Z8aNqz7M8xIFfcbgHGPEMTJsydo8',
    authDomain: 'chat-app-c2da6.firebaseapp.com',
    projectId: 'chat-app-c2da6',
    storageBucket: 'chat-app-c2da6.firebasestorage.app',
    messagingSenderId: '1064117571545',
    appId: '1:1064117571545:web:fe771076cd697609e813c8',
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);
