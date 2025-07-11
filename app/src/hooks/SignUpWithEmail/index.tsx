import { createUserWithEmailAndPassword, getAuth, sendEmailVerification, updateProfile, UserCredential } from "firebase/auth";
import { useState } from "react";

interface SignUpResult {
  user: UserCredential | null;
  error: string | null;
  loading: boolean;
  verificationSent: boolean;
}

export const useSignUpWithEmail = () => {
  const [result, setResult] = useState<SignUpResult>({
    user: null,
    error: null,
    loading: false,
    verificationSent: false,
  });

  const signUp = async (email: string, password: string, displayName: string) => {
    try {
      setResult(prev => ({ ...prev, loading: true, error: null }));
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Send verification email
      if (userCredential.user) {
        await sendEmailVerification(userCredential.user);
        await updateProfile(userCredential.user, {
          displayName: displayName,
        });
        setResult({
          user: userCredential,
          error: null,
          loading: false,
          verificationSent: true,
        });
      }
      
      return userCredential;
    } catch (error: any) {
      const errorMessage = error.message || "An error occurred during sign up";
      setResult({
        user: null,
        error: errorMessage,
        loading: false,
        verificationSent: false,
      });
      throw error;
    }
    finally {
      setResult(prev => ({ ...prev, loading: false }));
    }
  };

  return {
    signUp,
    ...result,
  };
};