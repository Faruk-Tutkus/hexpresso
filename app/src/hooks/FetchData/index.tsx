import { db } from "@api/config.firebase";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { MMKV } from "react-native-mmkv";

// Fallback olarak local JSON dosyalarını import et
import aquariusData from '@json/signs/aquarius.json';
import ariesData from '@json/signs/aries.json';
import cancerData from '@json/signs/cancer.json';
import capricornData from '@json/signs/capricorn.json';
import geminiData from '@json/signs/gemini.json';
import leoData from '@json/signs/leo.json';
import libraData from '@json/signs/libra.json';
import piscesData from '@json/signs/pisces.json';
import sagittariusData from '@json/signs/sagittarius.json';
import scorpioData from '@json/signs/scorpio.json';
import taurusData from '@json/signs/taurus.json';
import virgoData from '@json/signs/virgo.json';

const storage = new MMKV({ id: 'signs_data' });

interface UseFetchDataReturn {
  signs: any[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

const cacheSignsData = (data: any[]) => {
  try {
    storage.set('signs_data', JSON.stringify(data));
    console.log('💾 Signs veriler cache\'e kaydedildi');
  } catch (error) {
    console.error('❌ Signs cache kaydetme hatası:', error);
  }
};

const getCachedSignsData = (): any[] | null => {
  try {
    const cachedData = storage.getString('signs_data');
    if (cachedData) {
      const parsed = JSON.parse(cachedData);
      console.log('📦 Signs cache\'den veri okundu:', parsed.length, 'sign');
      return parsed;
    }
    return null;
  } catch (error) {
    console.error('❌ Signs cache okuma hatası:', error);
    return null;
  }
};

const getLocalSignsData = (): any[] => {
  try {
    const localSigns = [
      aquariusData,
      ariesData,
      cancerData,
      capricornData,
      geminiData,
      leoData,
      libraData,
      piscesData,
      sagittariusData,
      scorpioData,
      taurusData,
      virgoData
    ];
    console.log('📁 Local signs verisi yüklendi:', localSigns.length, 'sign');
    return localSigns;
  } catch (error) {
    console.error('❌ Local signs verisi okuma hatası:', error);
    return [];
  }
};

const fetchSignsFromFirebase = async (): Promise<any[]> => {
  try {
    console.log('🔥 Firebase signs bağlantısı deneniyor...');
    const docRef = collection(db, "signs");
    console.log('📊 Signs collection referansı alındı');
    
    const snapshot = await getDocs(docRef);
    console.log('📄 Signs snapshot alındı, belge sayısı:', snapshot.size);
    
    const signsData = snapshot.docs.map((item) => {
      console.log('📋 Signs belge ID:', item.id);
      return item.data();
    });
    
    console.log('✅ Toplam signs verisi:', signsData.length);
    return signsData;
  } catch (err) {
    console.error('❌ Firebase signs hatası:', err);
    throw err;
  }
};

export const useFetchData = (user: any): UseFetchDataReturn => {
  const [signs, setSigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = async () => {
    setLoading(true);
    setError(null);

    try {
      console.log('🔄 Signs veri yenileme başladı...');
      const data = await fetchSignsFromFirebase();
      
      if (data && data.length > 0) {
        setSigns(data);
        cacheSignsData(data);
        console.log('✅ Firebase\'den signs verisi başarıyla yüklendi');
      } else {
        throw new Error('Firebase\'den boş signs verisi geldi');
      }
    } catch (err) {
      console.log('⚠️ Firebase signs hatası, alternatif kaynaklar deneniyor...');
      setError('Firebase bağlantı sorunu');
      
      // 1. Önce cache'deki veriyi dene
      const cachedData = getCachedSignsData();
      if (cachedData && cachedData.length > 0) {
        setSigns(cachedData);
        console.log('✅ Cache\'den signs verisi yüklendi');
      } else {
        // 2. Cache de boşsa local JSON dosyalarını kullan
        const localData = getLocalSignsData();
        if (localData && localData.length > 0) {
          setSigns(localData);
          cacheSignsData(localData); // Local veriyi cache'e kaydet
          console.log('✅ Local JSON\'dan signs verisi yüklendi');
        } else {
          console.error('❌ Hiçbir kaynaktan signs verisi alınamadı');
          setError('Burç bilgileri yüklenemedi');
        }
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initializeData = async () => {
      if (!user) {
        console.log('⏳ FetchData: User bekleniyor...');
        setLoading(false);
        return;
      }

      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.data()?.newUser) {
          console.log('👤 Yeni kullanıcı, veri yükleme atlanıyor');
          setLoading(false);
          return;
        }
      } catch (error) {
        console.error('❌ User dokümanı kontrol hatası:', error);
      }

      console.log('🚀 Signs hook başlatılıyor...');
      
      // Önce cache'deki veriyi kontrol et
      const cachedData = getCachedSignsData();
      if (cachedData && cachedData.length > 0) {
        setSigns(cachedData);
        setLoading(false);
        console.log('⚡ Cache\'den hızlı signs yükleme tamamlandı');
        
        // Arka planda güncel veriyi getir
        try {
          console.log('🔄 Arka plan signs güncellemesi başlıyor...');
          const freshData = await fetchSignsFromFirebase();
          
          // Update kontrolü
          const docSet = doc(db, 'settings', 'update');
          const docSnapSet = await getDoc(docSet);
          const shouldUpdate = docSnapSet?.data()?.update;
          
          if (freshData && freshData.length > 0 && (!cachedData || shouldUpdate)) {
            setSigns(freshData);
            cacheSignsData(freshData);
            console.log('🔄 Arka plan signs güncellemesi tamamlandı');
          }
        } catch (err) {
          console.log('⚠️ Arka plan signs güncellemesi başarısız, cache verisi kullanılıyor');
        }
      } else {
        // Cache'de veri yoksa sırayla dene
        console.log('💭 Cache boş, diğer kaynaklar deneniyor...');
        await refetch();
      }
    };

    initializeData();
  }, [user]);

  return {
    signs,
    loading,
    error,
    refetch
  };
};


export default useFetchData;