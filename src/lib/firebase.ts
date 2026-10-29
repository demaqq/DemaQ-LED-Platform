import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInAnonymously,
  updateProfile,
  signOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import {
  initializeFirestore,
  getFirestore,
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  where
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase safely
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Use the provisioned named databaseId specified in firebase-applet-config.json
const namedDbId = (firebaseConfig as any).firestoreDatabaseId && (firebaseConfig as any).firestoreDatabaseId !== '(default)'
  ? (firebaseConfig as any).firestoreDatabaseId
  : undefined;

// Use initializeFirestore with long-polling enabled for robust iframe/preview connections to the named database
export const db = namedDbId
  ? initializeFirestore(app, { experimentalForceLongPolling: true }, namedDbId)
  : initializeFirestore(app, { experimentalForceLongPolling: true });

export const googleProvider = new GoogleAuthProvider();

googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error: any) {
    const errorMsg = error?.message || String(error);
    console.warn('Google Sign-In popup notice:', errorMsg);

    if (errorMsg.includes('identity-toolkit-api') || errorMsg.includes('api-has-not-been-used')) {
      throw new Error('Google Authentication is initializing on the cloud project. Please use email sign-in or the Instant Admin session.');
    }
    if (errorMsg.includes('popup-closed-by-user') || errorMsg.includes('cancelled-popup-request')) {
      throw new Error('Sign-in cancelled. Please try again.');
    }
    if (errorMsg.includes('popup-blocked')) {
      throw new Error('Popup was blocked by your browser. Please allow popups for this site.');
    }
    throw error;
  }
};

export const signInWithEmail = async (email: string, pass: string) => {
  return await signInWithEmailAndPassword(auth, email, pass);
};

export const registerWithEmail = async (email: string, pass: string, displayName?: string) => {
  const cred = await createUserWithEmailAndPassword(auth, email, pass);
  if (displayName && cred.user) {
    await updateProfile(cred.user, { displayName });
  }
  return cred.user;
};

export const signInGuest = async (demoName?: string) => {
  const cred = await signInAnonymously(auth);
  if (demoName && cred.user) {
    await updateProfile(cred.user, { displayName: demoName });
  }
  return cred.user;
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Logout error:', error);
  }
};

export {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  where,
  onAuthStateChanged
};
export type { User };
