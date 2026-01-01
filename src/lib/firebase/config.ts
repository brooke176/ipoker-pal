import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getAuth } from 'firebase/auth';

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
};

// Validate Firebase configuration
const requiredFields = ['apiKey', 'authDomain', 'databaseURL', 'projectId', 'appId'];
const missingFields = requiredFields.filter(field => !firebaseConfig[field as keyof typeof firebaseConfig]);

if (missingFields.length > 0) {
  console.error('❌ Firebase configuration error: Missing required fields:', missingFields);
  console.error('Please check your .env file and ensure all VITE_FIREBASE_* variables are set');
  throw new Error(`Firebase configuration incomplete. Missing: ${missingFields.join(', ')}`);
}

console.log('✅ Firebase configuration loaded successfully');
console.log('📊 Database URL:', firebaseConfig.databaseURL);

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize Realtime Database
export const database = getDatabase(app);

// Initialize Auth
export const auth = getAuth(app);
