import { db } from "@api/config.firebase";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { MMKV } from "react-native-mmkv";

const storage = new MMKV({ id: 'tarots_data' });

export interface TarotCard {
  id: string;
  name: string;
  info: string;
  url: string;
  localImage: any; // for local require() import
}

interface UseFetchTarotsReturn {
  tarots: TarotCard[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

const cacheTarotsData = (data: TarotCard[]) => {
  try {
    storage.set('tarots_data', JSON.stringify(data));
    console.log('💾 Tarots veriler cache\'e kaydedildi');
  } catch (error) {
    console.error('❌ Tarots cache kaydetme hatası:', error);
  }
};

const getCachedTarotsData = (): TarotCard[] | null => {
  try {
    const cachedData = storage.getString('tarots_data');
    if (cachedData) {
      const parsed = JSON.parse(cachedData);
      console.log('📦 Tarots cache\'den veri okundu:', parsed.length, 'card');
      return parsed;
    }
    return null;
  } catch (error) {
    console.error('❌ Tarots cache okuma hatası:', error);
    return null;
  }
};

// Local assets mapping - 0.png to 21.png for 22 major arcana cards
// Plus 56 minor arcana cards (cups, wands, swords, pentacles)
const getLocalTarotImage = (cardId: string): any => {
  try {
    // Extract number from cardId (assuming format like "0", "1", etc.)
    const cardNumber = parseInt(cardId);
    if (!isNaN(cardNumber) && cardNumber >= 0 && cardNumber <= 21) {
      // Major Arcana cards (0-21)
      switch (cardNumber) {
        case 0: return require('@assets/tarots/0.png');
        case 1: return require('@assets/tarots/1.png');
        case 2: return require('@assets/tarots/2.png');
        case 3: return require('@assets/tarots/3.png');
        case 4: return require('@assets/tarots/4.png');
        case 5: return require('@assets/tarots/5.png');
        case 6: return require('@assets/tarots/6.png');
        case 7: return require('@assets/tarots/7.png');
        case 8: return require('@assets/tarots/8.png');
        case 9: return require('@assets/tarots/9.png');
        case 10: return require('@assets/tarots/10.png');
        case 11: return require('@assets/tarots/11.png');
        case 12: return require('@assets/tarots/12.png');
        case 13: return require('@assets/tarots/13.png');
        case 14: return require('@assets/tarots/14.png');
        case 15: return require('@assets/tarots/15.png');
        case 16: return require('@assets/tarots/16.png');
        case 17: return require('@assets/tarots/17.png');
        case 18: return require('@assets/tarots/18.png');
        case 19: return require('@assets/tarots/19.png');
        case 20: return require('@assets/tarots/20.png');
        case 21: return require('@assets/tarots/21.png');
        default: return require('@assets/tarots/0.png'); // fallback
      }
    }
    
    // Fallback for other cards
    return require('@assets/tarots/0.png');
  } catch (error) {
    console.error('❌ Local tarot image yüklenirken hata:', error);
    return require('@assets/tarots/0.png');
  }
};

const fetchTarotsFromFirebase = async (abortController?: AbortController): Promise<TarotCard[]> => {
  try {
    console.log('🔥 Firebase tarots bağlantısı deneniyor...');
    const docRef = collection(db, "tarots");
    console.log('📊 Tarots collection referansı alındı');
    
    const snapshot = await getDocs(docRef);
    
    // Check if request was aborted
    if (abortController?.signal.aborted) {
      console.log('🚫 Tarots Firebase request aborted');
      return [];
    }
    
    console.log('📄 Tarots snapshot alındı, belge sayısı:', snapshot.size);
    
    const tarotsData: TarotCard[] = snapshot.docs.map((item) => {
      console.log('📋 Tarots belge ID:', item.id);
      const data = item.data();
      return {
        id: item.id,
        name: data.name || '',
        info: data.info || '',
        url: data.url || '',
        localImage: getLocalTarotImage(item.id)
      };
    });
    
    console.log('✅ Toplam tarots verisi:', tarotsData.length);
    return tarotsData;
  } catch (err: any) {
    if (err.name === 'AbortError') {
      console.log('🚫 Tarots Firebase request aborted');
      return [];
    }
    console.error('❌ Firebase tarots hatası:', err);
    throw err;
  }
};

// Create fallback data if Firebase fails
const getFallbackTarotsData = (): TarotCard[] => {
  try {
    const fallbackCards: TarotCard[] = [];
    
    // Generate fallback data for 22 major arcana cards
    for (let i = 0; i <= 21; i++) {
      fallbackCards.push({
        id: i.toString(),
        name: `Tarot Card ${i}`,
        info: `Major Arcana card number ${i}`,
        url: '', // Firebase URL will be empty in fallback
        localImage: getLocalTarotImage(i.toString())
      });
    }
    
    console.log('📁 Fallback tarots verisi oluşturuldu:', fallbackCards.length, 'card');
    return fallbackCards;
  } catch (error) {
    console.error('❌ Fallback tarots verisi oluşturma hatası:', error);
    return [];
  }
};

export const useFetchTarots = (user: any): UseFetchTarotsReturn => {
  const [tarots, setTarots] = useState<TarotCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isMountedRef = useRef(true);
  const abortControllerRef = useRef<AbortController | null>(null);

  const refetch = async () => {
    if (!user?.uid || !isMountedRef.current) {
      console.log('🚫 FetchTarots refetch: User yok veya component unmounted');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('🔄 Tarots veri yenileme başladı...');
      
      // Abort previous request if it exists
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      
      abortControllerRef.current = new AbortController();
      const data = await fetchTarotsFromFirebase(abortControllerRef.current);
      
      if (!isMountedRef.current) return;
      
      if (data && data.length > 0) {
        setTarots(data);
        cacheTarotsData(data);
        console.log('✅ Firebase\'den tarots verisi başarıyla yüklendi');
      } else {
        throw new Error('Firebase\'den boş tarots verisi geldi');
      }
    } catch (err) {
      if (!isMountedRef.current) return;
      
      console.log('⚠️ Firebase tarots hatası, alternatif kaynaklar deneniyor...');
      setError('Firebase bağlantı sorunu');
      
      // 1. Önce cache'deki veriyi dene
      const cachedData = getCachedTarotsData();
      if (cachedData && cachedData.length > 0) {
        setTarots(cachedData);
        console.log('✅ Cache\'den tarots verisi yüklendi');
      } else {
        // 2. Cache de boşsa fallback verisi kullan
        const fallbackData = getFallbackTarotsData();
        if (fallbackData && fallbackData.length > 0) {
          setTarots(fallbackData);
          cacheTarotsData(fallbackData); // Fallback veriyi cache'e kaydet
          console.log('✅ Fallback\'ten tarots verisi yüklendi');
        } else {
          console.error('❌ Hiçbir kaynaktan tarots verisi alınamadı');
          setError('Tarot kartları yüklenemedi');
        }
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    const initializeData = async () => {
      if (!user?.uid) {
        console.log('⏳ FetchTarots: User bekleniyor...');
        setTarots([]);
        setLoading(false);
        setError(null);
        return;
      }

      console.log('🚀 Tarots hook başlatılıyor...');
      
      // Önce cache'deki veriyi kontrol et
      const cachedData = getCachedTarotsData();
      if (cachedData && cachedData.length > 0) {
        setTarots(cachedData);
        setLoading(false);
        console.log('⚡ Cache\'den hızlı tarots yükleme tamamlandı');
        
        // Arka planda güncel veriyi getir
        try {
          console.log('🔄 Arka plan tarots güncellemesi başlıyor...');
          
          // Abort previous request if it exists
          if (abortControllerRef.current) {
            abortControllerRef.current.abort();
          }
          
          abortControllerRef.current = new AbortController();
          const freshData = await fetchTarotsFromFirebase(abortControllerRef.current);
          
          if (!isMountedRef.current) return;
          
          if (freshData && freshData.length > 0) {
            setTarots(freshData);
            cacheTarotsData(freshData);
            console.log('🔄 Arka plan tarots güncellemesi tamamlandı');
          }
        } catch (err) {
          console.log('⚠️ Arka plan tarots güncellemesi başarısız, cache verisi kullanılıyor');
        }
      } else {
        // Cache'de veri yoksa sırayla dene
        console.log('💭 Cache boş, diğer kaynaklar deneniyor...');
        await refetch();
      }
    };

    initializeData();

    // Cleanup function
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [user?.uid]);

  // Component unmount cleanup
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
    };
  }, []);

  return {
    tarots,
    loading,
    error,
    refetch
  };
};

export default useFetchTarots; 