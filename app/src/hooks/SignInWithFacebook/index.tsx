import { db } from "@api/config.firebase";
import { FacebookAuthProvider, getAuth, signInWithCredential, UserCredential } from "firebase/auth";
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { AccessToken, LoginManager } from 'react-native-fbsdk-next';

interface SignInResult {
  user: UserCredential | null;
  newUser: boolean;
  error: string | null;
  loading: boolean;
}

export const useSignInWithFacebook = () => {
  const signInFacebook = async () => {
    try {
      // Facebook ile giriş yapma
      const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);
      
      if (result.isCancelled) {
        throw new Error('User cancelled Facebook login');
      }

      // Access token alma
      const data = await AccessToken.getCurrentAccessToken();
      
      if (!data) {
        throw new Error('No access token found');
      }

      // Firebase credential oluşturma
      const facebookCredential = FacebookAuthProvider.credential(data.accessToken);
      const auth = getAuth();
      const userCredential = await signInWithCredential(auth, facebookCredential);
      
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
      const errorMessage = error.message || "An error occurred during Facebook sign in";
      throw error;
    }
  };

  return {
    signInFacebook,
  };
};
