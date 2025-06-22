import { db } from "@api/config.firebase";
import { appleAuth } from '@invertase/react-native-apple-authentication';
import { getAuth, OAuthProvider, signInWithCredential, UserCredential } from "firebase/auth";
import { doc, getDoc, setDoc } from 'firebase/firestore';

interface SignInResult {
  user: UserCredential | null;
  newUser: boolean;
  error: string | null;
  loading: boolean;
}

export const useSignInWithApple = () => {
  const signInApple = async () => {
    try {
      // Apple ile giriş yapma
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
      });

      // Credential kontrol
      if (!appleAuthRequestResponse.identityToken) {
        throw new Error('Apple Sign-In failed - no identity token returned');
      }

      // Firebase credential oluşturma
      const { identityToken, nonce } = appleAuthRequestResponse;
      const appleCredential = new OAuthProvider('apple.com').credential({
        idToken: identityToken,
        rawNonce: nonce,
      });

      const auth = getAuth();
      const userCredential = await signInWithCredential(auth, appleCredential);
      
      const user = userCredential.user;
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      
      if (!userDoc.exists()) {
        // Apple'dan gelen isim bilgisi
        const displayName = appleAuthRequestResponse.fullName?.givenName && appleAuthRequestResponse.fullName?.familyName
          ? `${appleAuthRequestResponse.fullName.givenName} ${appleAuthRequestResponse.fullName.familyName}`
          : user.displayName;

        await setDoc(doc(db, 'users', user.uid), {
          email: user.email,
          displayName: displayName,
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
      const errorMessage = error.message || "An error occurred during Apple sign in";
      throw error;
    }
  };

  return {
    signInApple,
  };
};
