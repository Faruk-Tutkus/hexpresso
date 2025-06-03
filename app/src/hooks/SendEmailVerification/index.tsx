import { getAuth, sendEmailVerification } from 'firebase/auth';
import { useState } from 'react';

interface UseEmailVerificationReturn {
  sendVerification: () => Promise<void>;
  loading: boolean;
  error: string | null;
}

export const useEmailVerification = (): UseEmailVerificationReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendVerification = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        throw new Error('No authenticated user found');
      }

      await sendEmailVerification(user);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send verification email');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    sendVerification,
    loading,
    error,
  };
};