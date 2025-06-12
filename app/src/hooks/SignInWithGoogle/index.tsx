import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { getAuth, GoogleAuthProvider, signInWithCredential, UserCredential } from "firebase/auth";
import { useState } from "react";

interface SignInResult {
  user: UserCredential | null;
  newUser: boolean;
  error: string | null;
  loading: boolean;
}

export const useSignInWithGoogle = () => {
  const [result, setResult] = useState<SignInResult>({
    user: null,
    newUser: false,
    error: null,
    loading: false,
  });
  GoogleSignin.configure({
    webClientId: '503552610366-cncgkggphfoi53jna1euf5qsmpnl46oe.apps.googleusercontent.com',
    scopes: ['https://www.googleapis.com/auth/drive'], // what API you want to access on behalf of the user, default is email and profile
    offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
  });
  const signInGoogle = async () => {
    try {
      setResult(prev => ({ ...prev, loading: true, error: null }));
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
      if (userCredential) {
        setResult({
          user: userCredential,
          newUser: false,
          error: null,
          loading: true,
        });
        return userCredential;
      } else {
        throw 'auth/email-not-verified';
      }
    } catch (error: any) {
      const errorMessage = error.message || "An error occurred during sign in";
      setResult({
        user: null,
        newUser: false,
        error: errorMessage,
        loading: false,
      });
      throw error;
    }
    finally {
      setResult(prev => ({ ...prev, loading: false }));
    }
  };

  return {
    signInGoogle,
    ...result,
  };
};