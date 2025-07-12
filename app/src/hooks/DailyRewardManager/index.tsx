import { db } from '@api/config.firebase';
import { useAuth, useToast } from '@providers';
import { doc, getDoc, serverTimestamp, Timestamp, updateDoc } from 'firebase/firestore';
import { useCallback, useState } from 'react';

interface DailyRewardState {
  canClaimReward: boolean;
  isChecking: boolean;
  lastRewardDate: string | null; // YYYY-MM-DD formatında string
}

export const useDailyRewardManager = () => {
  const [state, setState] = useState<DailyRewardState>({
    canClaimReward: false,
    isChecking: false,
    lastRewardDate: null,
  });
  
  const { user } = useAuth();
  const { showToast } = useToast();

  // Tarihi YYYY-MM-DD formatında string'e çevir
  const formatDateToString = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Sunucu zamanını al ve bugünün tarihini YYYY-MM-DD formatında döndür
  const getTodayString = (): string => {
    const today = new Date();
    return formatDateToString(today);
  };

  // Günlük ödül durumunu kontrol et
  const checkDailyReward = useCallback(async () => {
    if (!user?.uid) return;

    try {
      setState(prev => ({ ...prev, isChecking: true }));
      
      const userRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) {
        console.log('User document does not exist');
        return;
      }

      const userData = userDoc.data();
      
      // lastDailyRewardDate artık string formatında (YYYY-MM-DD)
      const lastRewardDateString = userData.lastDailyRewardDate;
      const todayString = getTodayString();

      // Eğer lastDailyRewardDate yoksa veya bugünkü tarihten farklıysa ödül ver
      if (!lastRewardDateString || lastRewardDateString !== todayString) {
        setState(prev => ({ 
          ...prev, 
          canClaimReward: true, 
          lastRewardDate: lastRewardDateString 
        }));
        return true;
      } else {
        setState(prev => ({ 
          ...prev, 
          canClaimReward: false, 
          lastRewardDate: lastRewardDateString 
        }));
        return false;
      }
    } catch (error) {
      console.error('Daily reward check error:', error);
      return false;
    } finally {
      setState(prev => ({ ...prev, isChecking: false }));
    }
  }, [user?.uid]);

  // Günlük ödülü claim et
  const claimDailyReward = useCallback(async (): Promise<boolean> => {
    if (!user?.uid || !state.canClaimReward) return false;

    try {
      const userRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) return false;

      const userData = userDoc.data();
      const currentCoins = userData.coins || 0;
      const todayString = getTodayString();

      // Çifte kontrol - tekrar aynı gün mü kontrol et
      if (userData.lastDailyRewardDate === todayString) {
        console.log('Daily reward already claimed today');
        setState(prev => ({ 
          ...prev, 
          canClaimReward: false, 
          lastRewardDate: todayString 
        }));
        return false;
      }

      // Coins, lastDailyRewardDate (string formatında) ve serverTimestamp güncelle
      await updateDoc(userRef, {
        coins: currentCoins + 100,
        lastDailyRewardDate: todayString, // YYYY-MM-DD formatında string
        lastDailyRewardTimestamp: serverTimestamp(), // Sunucu zamanı (güvenlik için)
      });

      setState(prev => ({ 
        ...prev, 
        canClaimReward: false, 
        lastRewardDate: todayString 
      }));

      // Toast göster
      showToast('🎉 Günlük ödül! 100 coin kazandınız! 💰', 'success');
      
      console.log(`Daily reward claimed: 100 coins added for ${todayString}`);
      return true;
    } catch (error) {
      console.error('Daily reward claim error:', error);
      showToast('Günlük ödül alınırken hata oluştu', 'error');
      return false;
    }
  }, [user?.uid, state.canClaimReward, showToast]);

  // Otomatik günlük ödül kontrolü ve verme
  const autoClaimDailyReward = useCallback(async () => {
    if (!user?.uid) return;

    try {
      const canClaim = await checkDailyReward();
      if (canClaim) {
        // Küçük bir gecikme ile toast'un daha iyi görünmesini sağla
        setTimeout(async () => {
          await claimDailyReward();
        }, 1500);
      }
    } catch (error) {
      console.error('Auto daily reward error:', error);
    }
  }, [user?.uid, checkDailyReward, claimDailyReward]);

  // Manual günlük ödül kontrolü (sadece kontrol, otomatik verme yapmaz)
  const checkDailyRewardStatus = useCallback(async () => {
    return await checkDailyReward();
  }, [checkDailyReward]);

  // Güvenlik kontrolleri - sunucu zamanı ile karşılaştırma
  const validateRewardSecurity = useCallback(async () => {
    if (!user?.uid) return true;

    try {
      const userRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) return true;

      const userData = userDoc.data();
      const lastTimestamp = userData.lastDailyRewardTimestamp;
      
      if (lastTimestamp && lastTimestamp instanceof Timestamp) {
        const lastRewardTime = lastTimestamp.toDate();
        const now = new Date();
        
        // Eğer son ödül zamanı gelecekteyse (kullanıcı saati değiştirmiş olabilir)
        if (lastRewardTime > now) {
          console.warn('Suspicious activity: Last reward time is in the future');
          return false;
        }
      }
      
      return true;
    } catch (error) {
      console.error('Security validation error:', error);
      return true; // Hata durumunda sistem çalışmaya devam etsin
    }
  }, [user?.uid]);

  return {
    ...state,
    checkDailyReward: checkDailyRewardStatus,
    claimDailyReward,
    autoClaimDailyReward,
    validateRewardSecurity,
  };
}; 