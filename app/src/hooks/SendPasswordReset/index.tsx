import { auth } from "@api/config.firebase";
import { sendPasswordResetEmail } from "firebase/auth";
import { useState } from "react";

interface PasswordResetResult {
  success: boolean;
  error: string | null;
  loading: boolean;
}

export const useSendPasswordReset = () => {
  const [result, setResult] = useState<PasswordResetResult>({
    success: false,
    error: null,
    loading: false,
  });

  const sendPasswordReset = async (email: string) => {
    try {
      setResult(prev => ({ ...prev, loading: true, error: null, success: false }));
      await sendPasswordResetEmail(auth, email);
      setResult({
        success: true,
        error: null,
        loading: false,
      });
      return true;
    } catch (error: any) {
      const errorMessage = error.message || "Şifre sıfırlama e-postası gönderilirken bir hata oluştu";
      setResult({
        success: false,
        error: errorMessage,
        loading: false,
      });
      throw error;
    }
  };

  const resetState = () => {
    setResult({
      success: false,
      error: null,
      loading: false,
    });
  };

  return {
    sendPasswordReset,
    resetState,
    ...result,
  };
}; 