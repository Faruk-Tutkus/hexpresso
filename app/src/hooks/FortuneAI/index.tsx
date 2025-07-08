import { GoogleGenAI, HarmBlockThreshold, HarmCategory, Type } from "@google/genai";
import { useState } from 'react';

interface FortuneAIRequest {
  fortuneType: string;
  seerData: any;
  userData?: any;
  images?: string[];
  dreamText?: string;
}

interface FortuneAIResponse {
  interpretation: string;
  advice: string;
  timeframe: string;
  warnings?: string[];
  positiveAspects?: string[];
}

// AI instance
const ai = new GoogleGenAI({ apiKey: process.env.EXPO_PUBLIC_GEMINI_API_KEY || '' });

export const useFortuneAI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateFortuneInterpretation = async (request: FortuneAIRequest): Promise<FortuneAIResponse | null> => {
    setLoading(true);
    setError(null);

    try {
      const systemInstruction = createSystemInstruction(request.seerData);
      const prompt = createPersonalizedPrompt(request);
      const fullPrompt = systemInstruction + "\n\n" + prompt;
      
      const response = await ai.models.generateContent({
        model: "gemini-1.5-flash",
        contents: fullPrompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            required: ["interpretation", "advice", "timeframe"],
            properties: {
              interpretation: { type: Type.STRING },
              advice: { type: Type.STRING },
              timeframe: { type: Type.STRING },
              warnings: { 
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              positiveAspects: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              }
            },
          },
          safetySettings: [
            {
              category: HarmCategory.HARM_CATEGORY_HARASSMENT,
              threshold: HarmBlockThreshold.BLOCK_NONE,
            },
            {
              category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
              threshold: HarmBlockThreshold.BLOCK_NONE,
            },
            {
              category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
              threshold: HarmBlockThreshold.BLOCK_NONE,
            },
            {
              category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
              threshold: HarmBlockThreshold.BLOCK_NONE,
            },
          ],
        }
      });

      const responseText = response.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (responseText) {
        try {
          const parsed = JSON.parse(responseText);
          console.log('FortuneAI Response:', parsed);
          return parsed as FortuneAIResponse;
        } catch (parseError) {
          console.error('FortuneAI JSON parse error:', parseError);
          return null;
        }
      }
      
      return null;
    } catch (err) {
      console.error('Fortune AI Error:', err);
      setError('Fal yorumu oluşturulurken hata oluştu');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const createSystemInstruction = (seerData: any): string => {
    return `
Sen ${seerData.name} adında bir profesyonel falcısın.

KİŞİLİK ÖZELLİKLERİN:
- Karakter: "${seerData.character}"
- Hayat hikayesi: "${seerData.lifestory}"
- Özel not: "${seerData.note}"
- Deneyim alanları: ${seerData.experience?.join(', ') || 'Genel fal yorumları'}

YORUM TARZI:
- ${seerData.character} özelliklerine uygun bir dil kullan
- Sıcak, samimi ama aynı zamanda mistik bir ton kullan
- Kişiye "sen" diye hitap et
- Türkçe yaz
- Umut verici ve olumlu bir yaklaşım sergile
- Detaylı ve kişiselleştirilmiş yorumlar yap

Bu karakterin ruhu ve bilgeliğiyle insanlara rehberlik et.
`;
  };

  const createPersonalizedPrompt = (request: FortuneAIRequest): string => {
    const { fortuneType, userData, images, dreamText } = request;

    let basePrompt = `${fortuneType} yorumu yapacaksın.

`;

    switch (fortuneType) {
      case 'Kahve Falı':
        basePrompt += `
KAHVE FALI ANALİZİ:
Fincan görüntülerini analiz et. Telve desenlerinde şu sembolleri ara:
- Kader çizgileri ve yol işaretleri
- Hayvan şekilleri (yeni dostluklar, düşmanlar, koruyucu ruhlar)
- Geometrik şekiller (değişimler, fırsatlar, engeller)
- İnsan siluetleri (gelecek ilişkiler, aile bağları)
- Doğa motifleri (büyüme, yenilenme, mevsim değişimi)
- Objeler ve semboller (seyahat, para, aşk)

FİNCAN BÖLGELERİ:
- Fincan kenarı: Yakın gelecek (1-2 hafta)
- Orta kısım: Orta vadeli gelecek (3-6 ay)
- Alt kısım: Uzak gelecek (6 ay - 1 yıl)
- Sap yanı: Ev hayatı ve aile
- Karşı taraf: İş hayatı ve sosyal çevre
`;
        break;
      
      case 'El Falı':
        basePrompt += `
EL FALI ANALİZİ:
Sol ve sağ el görüntülerini analiz et:

ANA ÇİZGİLER:
- Yaşam çizgisi: Sağlık, enerji, yaşam süresi
- Kalp çizgisi: Aşk, ilişkiler, duygusal yaşam
- Kafa çizgisi: Zeka, karakter, düşünce tarzı
- Kader çizgisi: Kariyer, başarı, yaşam yolu

EL ÖZELLİKLERİ:
- Sol el: Doğuştan yetenekler ve potansiyel
- Sağ el: Kazanılan tecrübeler ve mevcut durum
- Avuç şekli: Genel karakter
- Parmak uzunlukları: Kişilik özellikleri
- Avuç eti: Fiziksel güç ve enerji

DİĞER İŞARETLER:
- Yıldız işaretleri: Özel yetenekler
- Adalar: Geçici zorluklar
- Çatallanmalar: Seçim noktaları
- Kesintiler: Değişim dönemleri
`;
        break;
      
      case 'Rüya Yorumu':
        basePrompt += `
RÜYA ANALİZİ:
Analiz edeceğin rüya: "${dreamText}"

RÜYA UNSURLARI:
- Ortam ve mekanlar (ev, doğa, bilinmeyen yerler)
- Karakterler (aile, arkadaşlar, yabancılar, hayvanlar)
- Duygular (korku, sevinç, huzur, endişe)
- Renkler (her rengin özel anlamı var)
- Objeler ve semboller (arabalar, hayvanlar, doğa)
- Eylemler (uçmak, düşmek, koşmak, konuşmak)

PSİKOLOJİK ANLAM:
- Bilinçaltından gelen mesajlar
- Bastırılmış duygular
- Gelecek öngörüleri
- İç dünyadan yansıyan endişeler
- Ruhsal büyüme işaretleri

SEMBOLLER:
- Su: Duygular, temizlik, yenilenme
- Ateş: Tutku, öfke, dönüşüm
- Hayvanlar: İçgüdüler, doğal yanlar
- Uçmak: Özgürlük, hedeflere ulaşma
- Düşmek: Kontrol kaybı, endişeler
`;
        break;
      
      case 'Tarot':
        basePrompt += `
TAROT KARTI YORUMU:
3 kart çekildiğini varsayarak yorum yap:

KART POZİSYONLARI:
1. Geçmiş: Mevcut durumun kökleri
2. Şimdi: Mevcut durum ve fırsatlar
3. Gelecek: Muhtemel gelişmeler

BÜYÜK ARKANA:
- Ana yaşam dersleri ve ruhsal gelişim
- Önemli değişim noktaları
- Kadersel olaylar

KÜÇÜK ARKANA:
- Günlük yaşam olayları
- Pratik konular
- Kısa vadeli gelişmeler

KART ANLAMLARI:
- Düz kart: Olumlu enerji, normal akış
- Ters kart: Engeller, iç çelişkiler
- Kombo anlamları: Kartların birbirine etkisi
`;
        break;
    }

    if (userData) {
      basePrompt += `
KİŞİ BİLGİLERİ:
- İsim: ${userData.name || 'Belirtilmemiş'}
- Yaş: ${userData.age || 'Belirtilmemiş'}
- Cinsiyet: ${userData.gender || 'Belirtilmemiş'}
- İlgilendiği konu: ${userData.reason || 'Genel hayat rehberliği'}
- Ruhsal durum: ${userData.mood || 'Normal'}
- Özel durum: ${userData.specialSituation || 'Yok'}
`;
    }

    basePrompt += `
Bu bilgileri kullanarak detaylı, kişiselleştirilmiş ve umut dolu bir yorum yap.
Falcı karakterin olan ${request.seerData.name} olarak, "${request.seerData.character}" özelliklerinle yorumla.
`;

    return basePrompt;
  };

  return {
    generateFortuneInterpretation,
    loading,
    error
  };
};

export default useFortuneAI; 