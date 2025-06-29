import { db } from '@api/config.firebase';
import { arrayRemove, arrayUnion, collection, doc, getDocs, updateDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';

interface FortuneRecord {
  id: string;
  seerData: any;
  fortuneType: string;
  images?: any;
  dreamText?: string;
  createdAt: any;
  status: 'pending' | 'completed' | 'processing';
  responseTime: number;
  estimatedCompletionTime: any;
  coin: number;
  result?: string;
}

interface UserWithFortunes {
  uid: string;
  fortunerecord: FortuneRecord[];
}

export const useFortuneProcessor = () => {
  const [processing, setProcessing] = useState(false);
  const [processedCount, setProcessedCount] = useState(0);

  const updateFortuneInUserDoc = async (userId: string, oldFortune: FortuneRecord, newFortune: FortuneRecord) => {
    try {
      // Remove old fortune and add updated fortune
      await updateDoc(doc(db, 'users', userId), {
        fortunerecord: arrayRemove(oldFortune)
      });
      
      await updateDoc(doc(db, 'users', userId), {
        fortunerecord: arrayUnion(newFortune)
      });
    } catch (error) {
      console.error('Error updating fortune in user doc:', error);
      throw error;
    }
  };

  const processPendingFortunes = async () => {
    if (processing) return;
    
    setProcessing(true);
    let processed = 0;

    try {
      // Get all users to check their fortunerecord arrays
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const now = new Date();

      for (const userDoc of usersSnapshot.docs) {
        const userData = userDoc.data();
        const fortuneRecords = userData.fortunerecord || [];
        
        // Find pending fortunes that are ready to be revealed (timer expired)
        const readyFortunes = fortuneRecords.filter((fortune: FortuneRecord) => {
          if (fortune.status !== 'pending') return false;
          
          const completionTime = fortune.estimatedCompletionTime.toDate?.() 
            ? fortune.estimatedCompletionTime.toDate()
            : new Date(fortune.estimatedCompletionTime);
          
          return completionTime <= now;
        });

        // Process each ready fortune for this user
        for (const fortune of readyFortunes) {
          try {
            console.log(`Revealing fortune ${fortune.id} for user ${userDoc.id}`);
            
            // Simply change status to completed if result exists
            if (fortune.result) {
              const completedFortune = {
                ...fortune,
                status: 'completed' as const,
                completedAt: new Date()
              };
              await updateFortuneInUserDoc(userDoc.id, fortune, completedFortune);
              processed++;
              console.log(`Fortune ${fortune.id} revealed successfully`);
            } else {
              console.log(`Fortune ${fortune.id} has no result, skipping`);
            }
          } catch (error) {
            console.error(`Error revealing fortune ${fortune.id}:`, error);
          }
        }
      }

      setProcessedCount(processed);
      console.log(`Revealed ${processed} fortunes successfully`);
    } catch (error) {
      console.error('Error in fortune processing:', error);
    } finally {
      setProcessing(false);
    }
  };

  // Auto-process every 30 seconds (much more frequent for better UX)
  useEffect(() => {
    const interval = setInterval(() => {
      processPendingFortunes();
    }, 30 * 1000); // 30 seconds

    // Initial process
    processPendingFortunes();

    return () => clearInterval(interval);
  }, []);

  return {
    processing,
    processedCount,
    processPendingFortunes
  };
};

export default useFortuneProcessor; 