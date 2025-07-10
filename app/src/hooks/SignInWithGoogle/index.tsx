import { auth, db } from "@api/config.firebase";
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { doc, getDoc, setDoc } from 'firebase/firestore';



export const useSignInWithGoogle = () => {
  GoogleSignin.configure({
    webClientId: '503552610366-cncgkggphfoi53jna1euf5qsmpnl46oe.apps.googleusercontent.com',
    scopes: ['profile', 'email'], // what API you want to access on behalf of the user, default is email and profile
    offlineAccess: false, // if you want to access Google API on behalf of the user FROM YOUR SERVER
    forceCodeForRefreshToken: true, // Her seferinde hesap seçme ekranı gelsin
  });
  const signInGoogle = async () => {
    try {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      
      // Önce Google'dan çıkış yap ki hesap seçme ekranı gelsin
      try {
        await GoogleSignin.signOut();
        console.log("Google'dan çıkış yapıldı");
      } catch (signOutError) {
        console.log("Google signOut hatası:", signOutError);
        // Hata olsa bile devam et
      }
      
      const signInResult = await GoogleSignin.signIn();
      let idToken = signInResult.data?.idToken;
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
          updatedAt: new Date(),
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