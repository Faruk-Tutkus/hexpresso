import { getAuth, signInWithEmailAndPassword, UserCredential } from "firebase/auth";
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
      const auth = getAuth();
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      if (userCredential.user.emailVerified) {
        setResult({
          user: userCredential,
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