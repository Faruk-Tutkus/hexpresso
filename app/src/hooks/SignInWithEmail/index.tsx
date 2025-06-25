import { auth, db } from "@api/config.firebase";
import { signInWithEmailAndPassword, UserCredential } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useState } from "react";
interface SignInResult {
  user: UserCredential | null;
  error: string | null;
  loading: boolean;
}

export const useSignInWithEmail = () => {
  const [result, setResult] = useState<SignInResult>({
    user: null,
    error: null,
    loading: false,
  });

  const signIn = async (email: string, password: string) => {
    try {
      setResult(prev => ({ ...prev, loading: true, error: null }));
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      if (user.emailVerified) {
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
      } else {
        throw 'auth/email-not-verified';
      }
    } catch (error: any) {
      const errorMessage = error.message || "An error occurred during sign in";
      setResult({
        user: null,
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
    signIn,
    ...result,
  };
};