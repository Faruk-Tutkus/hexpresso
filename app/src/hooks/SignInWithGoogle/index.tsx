import { db } from "@api/config.firebase";
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { getAuth, GoogleAuthProvider, signInWithCredential, UserCredential } from "firebase/auth";
import { doc, getDoc, setDoc } from 'firebase/firestore';

interface SignInResult {
  user: UserCredential | null;
  newUser: boolean;
  error: string | null;
  loading: boolean;
}

export const useSignInWithGoogle = () => {
  GoogleSignin.configure({
    webClientId: '503552610366-cncgkggphfoi53jna1euf5qsmpnl46oe.apps.googleusercontent.com',
    scopes: ['https://www.googleapis.com/auth/drive'], // what API you want to access on behalf of the user, default is email and profile
    offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
  });
  const signInGoogle = async () => {
    try {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      const signInResult = await GoogleSignin.signIn();
      let idToken = signInResult.data?.idToken;
      const auth = getAuth();
      if (!idToken) {
        idToken = signInResult.data?.idToken;
      }
      if (!idToken) {
        throw new Error('No ID token found');
      }
      const googleCredential  = GoogleAuthProvider.credential(signInResult.data?.idToken);
      const userCredential = await signInWithCredential(auth, googleCredential);
      const user = userCredential.user;
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      
      if (!userDoc.exists()) {
        await setDoc(doc(db, 'users', user.uid), {
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          createdAt: new Date(),
          newUser: true,
        });
        return {
          userCredential,
          newUser: true,
          user
        };
      } else {
        return {
          userCredential,
          newUser: userDoc.data()?.newUser || false,
          user
        };
      }
    } catch (error: any) {
      const errorMessage = error.message || "An error occurred during sign in";
      throw error;
    }
  };

  return {
    signInGoogle,
  };
};