import { db } from "@api/config.firebase";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { MMKV } from "react-native-mmkv";
// Fallback olarak local JSON dosyasını import et
import seersLocalData from '@json/seers/seers.json';

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
    console.log('💾 Veriler cache\'e kaydedildi');
  } catch (error) {
    console.error('❌ Cache kaydetme hatası:', error);
  }
};

const getCachedSeersData = (): Seer[] | null => {
  try {
    const cachedData = storage.getString('seers_data');
    if (cachedData) {
      const parsed = JSON.parse(cachedData);
      console.log('📦 Cache\'den veri okundu:', parsed.length, 'seer');
      return parsed;
    }
    return null;
  } catch (error) {
    console.error('❌ Cache okuma hatası:', error);
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
    console.log('📁 Local JSON\'dan veri okundu:', localSeers.length, 'seer');
    return localSeers;
  } catch (error) {
    console.error('❌ Local veri okuma hatası:', error);
    return [];
  }
};

export const useFetchSeers = (user: any): UseFetchSeersReturn => {
  const [seers, setSeers] = useState<Seer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSeersFromFirebase = async (user: any): Promise<Seer[]> => {
    if (!user) {
      return [];
    }
    try {
      console.log('🔥 Firebase bağlantısı deneniyor...');
      const seersCollection = collection(db, "seer"); // "seers" değil "seer" olmalı
      console.log('📊 Collection referansı alındı: seer');
      
      const snapshot = await getDocs(seersCollection);
      console.log('📄 Snapshot alındı, belge sayısı:', snapshot.size);
      
      const seersData: Seer[] = snapshot.docs.map((doc) => {
        console.log('📋 Belge ID:', doc.id);
        const data = doc.data();
        console.log('📝 Belge verisi:', data);
        return {
          id: doc.id,
          ...data
        };
      }) as Seer[];
      
      console.log('✅ Toplam seer verisi:', seersData.length);
      return seersData;
    } catch (err) {
      console.error('❌ Firebase hatası:', err);
      throw err;
    }
  };

  const refetch = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('🔄 Veri yenileme başladı...');
      const data = await fetchSeersFromFirebase(user);
      
      if (data && data.length > 0) {
        setSeers(data);
        cacheSeersData(data);
        console.log('✅ Firebase\'den veri başarıyla yüklendi');
      } else {
        throw new Error('Firebase\'den boş veri geldi');
      }
    } catch (err) {
      console.log('⚠️ Firebase hatası, alternatif kaynaklar deneniyor...');
      setError('Firebase bağlantı sorunu');
      
      // 1. Önce cache'deki veriyi dene
      const cachedData = getCachedSeersData();
      if (cachedData && cachedData.length > 0) {
        setSeers(cachedData);
        console.log('✅ Cache\'den veri yüklendi');
      } else {
        // 2. Cache de boşsa local JSON dosyasını kullan
        const localData = getLocalSeersData();
        if (localData && localData.length > 0) {
          setSeers(localData);
          cacheSeersData(localData); // Local veriyi cache'e kaydet
          console.log('✅ Local JSON\'dan veri yüklendi');
        } else {
          console.error('❌ Hiçbir kaynaktan veri alınamadı');
          setError('Falcı bilgileri yüklenemedi');
        }
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initializeData = async () => {
      console.log('🚀 Hook başlatılıyor...');
      
      // Önce cache'deki veriyi kontrol et
      const cachedData = getCachedSeersData();
      if (cachedData && cachedData.length > 0) {
        setSeers(cachedData);
        setLoading(false);
        console.log('⚡ Cache\'den hızlı yükleme tamamlandı');
        
        // Arka planda güncel veriyi getir
        try {
          const freshData = await fetchSeersFromFirebase(user);
          if (freshData && freshData.length > 0) {
            setSeers(freshData);
            cacheSeersData(freshData);
            console.log('🔄 Arka plan güncellemesi tamamlandı');
          }
        } catch (err) {
          console.log('⚠️ Arka plan güncellemesi başarısız, cache verisi kullanılıyor');
        }
      } else {
        // Cache'de veri yoksa sırayla dene
        console.log('💭 Cache boş, diğer kaynaklar deneniyor...');
        await refetch();
      }
    };

    initializeData();
  }, []);

  return {
    seers,
    loading,
    error,
    refetch
  };
};

export default useFetchSeers; 