import { db } from "@api/config.firebase";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { MMKV } from "react-native-mmkv";
// Fallback olarak local JSON dosyasını import et
import seersLocalData from '@json/seers/seers.json';
import { useToast } from "@providers";

const storage = new MMKV({ id: 'seers_data' });

export interface Seer {
  character: string;
  coins: number[];
  experience: string[];
  fortunes: string[];
  info: string;
  lifestory: string;
  name: string;
  note: string;
  responsetime: number;
  url: string;
  id?: string;
  user: any;
}

interface UseFetchSeersReturn {
  seers: Seer[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

const cacheSeersData = (data: Seer[]) => {
  try {
    storage.set('seers_data', JSON.stringify(data));
    console.log('💾 Seers veriler cache\'e kaydedildi');
  } catch (error) {
    console.error('❌ Seers cache kaydetme hatası:', error);
  }
};

const getCachedSeersData = (): Seer[] | null => {
  try {
    const cachedData = storage.getString('seers_data');
    if (cachedData) {
      const parsed = JSON.parse(cachedData);
      console.log('📦 Seers cache\'den veri okundu:', parsed.length, 'seer');
      return parsed;
    }
    return null;
  } catch (error) {
    console.error('❌ Seers cache okuma hatası:', error);
    return null;
  }
};

const getLocalSeersData = (): Seer[] => {
  try {
    const localSeers = seersLocalData.seer.map((seer, index) => ({
      id: seer.name.toLowerCase().replace(/\s+/g, "_"),
      ...seer,
      user: null
    }));
    console.log('📁 Seers local JSON\'dan veri okundu:', localSeers.length, 'seer');
    return localSeers;
  } catch (error) {
    console.error('❌ Seers local veri okuma hatası:', error);
    return [];
  }
};

export const useFetchSeers = (user: any): UseFetchSeersReturn => {
  const [seers, setSeers] = useState<Seer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isMountedRef = useRef(true);
  const abortControllerRef = useRef<AbortController | null>(null);
  const { showToast } = useToast();
  const fetchSeersFromFirebase = async (user: any): Promise<Seer[]> => {
    if (!user?.uid) {
      console.log('🚫 FetchSeers: User yok, Firebase fetch atlanıyor');
      return [];
    }

    try {
      console.log('🔥 FetchSeers: Firebase bağlantısı deneniyor...');
      
      // Abort previous request if it exists
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      
      abortControllerRef.current = new AbortController();
      
      const seersCollection = collection(db, "seer");
      console.log('📊 Seers collection referansı alındı: seer');
      
      const snapshot = await getDocs(seersCollection);
      
      // Check if component is still mounted
      if (!isMountedRef.current) {
        console.log('🚫 FetchSeers: Component unmounted, aborting');
        return [];
      }
      
      console.log('📄 Seers snapshot alındı, belge sayısı:', snapshot.size);
      
      const seersData: Seer[] = snapshot.docs.map((doc) => {
        console.log('📋 Seers belge ID:', doc.id);
        const data = doc.data();
        return {
          id: doc.id,
          ...data
        };
      }) as Seer[];
      
      console.log('✅ Toplam seers verisi:', seersData.length);
      return seersData;
    } catch (err: any) {
      if (err.name === 'AbortError') {
        console.log('🚫 FetchSeers: Request aborted');
        return [];
      }
      console.error('❌ FetchSeers Firebase hatası:', err);
      throw err;
    }
  };

  const refetch = async () => {
    if (!user?.uid || !isMountedRef.current) {
      console.log('🚫 FetchSeers refetch: User yok veya component unmounted');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      console.log('🔄 FetchSeers: Veri yenileme başladı...');
      const data = await fetchSeersFromFirebase(user);
      
      if (!isMountedRef.current) return;
      
      if (data && data.length > 0) {
        setSeers(data);
        cacheSeersData(data);
        showToast('Veriler güncellendi', 'info');
        console.log('✅ FetchSeers: Firebase\'den veri başarıyla yüklendi');
      } else {
        throw new Error('Firebase\'den boş seers verisi geldi');
      }
    } catch (err) {
      if (!isMountedRef.current) return;
      
      console.log('⚠️ FetchSeers: Firebase hatası, alternatif kaynaklar deneniyor...');
      setError('Firebase bağlantı sorunu');
      
      // 1. Önce cache'deki veriyi dene
      const cachedData = getCachedSeersData();
      if (cachedData && cachedData.length > 0) {
        setSeers(cachedData);
        console.log('✅ FetchSeers: Cache\'den veri yüklendi');
      } else {
        // 2. Cache de boşsa local JSON dosyasını kullan
        const localData = getLocalSeersData();
        if (localData && localData.length > 0) {
          setSeers(localData);
          cacheSeersData(localData);
          console.log('✅ FetchSeers: Local JSON\'dan veri yüklendi');
        } else {
          console.error('❌ FetchSeers: Hiçbir kaynaktan veri alınamadı');
          setError('Falcı bilgileri yüklenemedi');
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
        console.log('⏳ FetchSeers: User bekleniyor...');
        setSeers([]);
        setLoading(false);
        setError(null);
        return;
      }

      console.log('🚀 FetchSeers Hook başlatılıyor...');
      
      // Önce cache'deki veriyi kontrol et
      const cachedData = getCachedSeersData();
      if (cachedData && cachedData.length > 0) {
        setSeers(cachedData);
        setLoading(false);
        console.log('⚡ FetchSeers: Cache\'den hızlı yükleme tamamlandı');
        
        // Arka planda güncel veriyi getir
        try {
          const freshData = await fetchSeersFromFirebase(user);
          if (isMountedRef.current && freshData && freshData.length > 0) {
            setSeers(freshData);
            cacheSeersData(freshData);
            console.log('🔄 FetchSeers: Arka plan güncellemesi tamamlandı');
          }
        } catch (err) {
          console.log('⚠️ FetchSeers: Arka plan güncellemesi başarısız, cache verisi kullanılıyor');
        }
      } else {
        // Cache'de veri yoksa sırayla dene
        console.log('💭 FetchSeers: Cache boş, diğer kaynaklar deneniyor...');
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
  }, [user?.uid]); // Artık user'a bağlı!

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
    seers,
    loading,
    error,
    refetch
  };
};

export default useFetchSeers; 