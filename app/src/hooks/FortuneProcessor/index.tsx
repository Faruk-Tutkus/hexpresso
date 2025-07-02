import { db } from '@api/config.firebase';
import { arrayRemove, arrayUnion, doc, onSnapshot } from 'firebase/firestore';
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

export const useFortuneProcessor = (user: any) => {
  const [processing, setProcessing] = useState(false);
  const [processedCount, setProcessedCount] = useState(0);

  const processPendingFortunes = async (userFortunes: FortuneRecord[], userId: string) => {
    if (processing || !userId || !user?.uid) return;
    
    setProcessing(true);
    let processed = 0;

    try {
      const now = new Date();
      
      // Find pending fortunes that are ready to be revealed (timer expired)
      const readyFortunes = userFortunes.filter((fortune: FortuneRecord) => {
        if (fortune.status !== 'pending') return false;
        
        const completionTime = fortune.estimatedCompletionTime.toDate?.() 
          ? fortune.estimatedCompletionTime.toDate()
          : new Date(fortune.estimatedCompletionTime);
        
        return completionTime <= now;
      });

      // Process each ready fortune for this user
      for (const fortune of readyFortunes) {
        try {
          // Double check user still exists before Firebase operations
          if (!user?.uid) {
            console.log('User logged out during processing, stopping');
            break;
          }

          console.log(`Revealing fortune ${fortune.id} for user ${userId}`);
          
          // Simply change status to completed if result exists
          if (fortune.result) {
            const completedFortune = {
              ...fortune,
              status: 'completed' as const,
              completedAt: new Date()
            };
            
            // Update user's fortune record
            const { updateDoc } = await import('firebase/firestore');
            await updateDoc(doc(db, 'users', userId), {
              fortunerecord: arrayRemove(fortune)
            });
            
            await updateDoc(doc(db, 'users', userId), {
              fortunerecord: arrayUnion(completedFortune)
            });
            
            processed++;
            console.log(`Fortune ${fortune.id} revealed successfully`);
          } else {
            console.log(`Fortune ${fortune.id} has no result, skipping`);
          }
        } catch (error) {
          console.error(`Error revealing fortune ${fortune.id}:`, error);
        }
      }

      setProcessedCount(processed);
      if (processed > 0) {
        console.log(`Revealed ${processed} fortunes successfully`);
      }
    } catch (error) {
      console.error('Error in fortune processing:', error);
    } finally {
      setProcessing(false);
    }
  };

  // Listen to user's document and process fortunes when they change
  useEffect(() => {
    if (!user?.uid) {
      setProcessedCount(0);
      return;
    }

    // Listen to user document changes
    const unsubscribe = onSnapshot(doc(db, 'users', user.uid), (docSnapshot) => {
      if (docSnapshot.exists() && user?.uid) {
        const userData = docSnapshot.data();
        const fortuneRecords = userData.fortunerecord || [];
        
        // Process fortunes whenever the document updates
        processPendingFortunes(fortuneRecords, user.uid);
      }
    }, (error) => {
      console.error('FortuneProcessor listener error:', error);
    });

    return () => unsubscribe();
  }, [user?.uid]);

  return {
    processing,
    processedCount
  };
};

export default useFortuneProcessor; 