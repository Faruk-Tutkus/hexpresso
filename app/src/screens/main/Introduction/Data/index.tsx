import { FloatingDatePicker, FloatingLabelInput, FloatingLabelPicker, FloatingTimePicker } from '@components';
import { useTheme } from '@providers';
import { useState } from 'react';

const useIntroductionData = () => {
    const { colors } = useTheme();
    const [name, setName] = useState('');
    const [gender, setGender] = useState('');
    const [date, setDate] = useState<Date | ''>('');
    const [time, setTime] = useState<Date | ''>('');
    const [reason, setReason] = useState('');
    const [love, setLove] = useState('');
    const [need, setNeed] = useState('');
    const [mood, setMood] = useState('');
    const [meaning, setMeaning] = useState('');
    const [experience, setExperience] = useState('');
    const [curious, setCurious] = useState('');
    const [error, setError] = useState({
      name: '',
      date: '',
      gender: '',
      reason: '',
      love: '',
      need: '',
      mood: '',
      meaning: '',
      experience: '',
      curious: '',
    });
  
    const data = [
      {
        id: 1,
        title: '✨ Hoş geldin güzel ruh!',
        description: 'Önce enerjine bir dokunalım... İsmini fısıldar mısın bana?',
        FloatingLabelInput: (
          <FloatingLabelInput
            value={name}
            placeholder={'Adını söyle, yıldızlar duysun'}
            onChangeText={setName}
            type={'text'}
            leftIcon={'person'}
            error={error.name}
          />
        ),
        button: {
          onPress: () => {
            if (!name) {
              setError(prev => ({ ...prev, name: 'Adını yazmadan devam edemem tatlım 💫' }));
            }
          }
        }
      },
      {
        id: 2,
        title: '🎂 Doğum Günü Kutlu Olsun...',
        description: 'Burcun, kaderinin kilididir. Ne zaman doğdun canımın içi?',
        FloatingLabelInput: (
          <FloatingDatePicker
            value={date as Date}
            onChange={(date) => setDate(date)}
            placeholder={'Doğum gününü söyle bana'}
            leftIcon={'calendar'}
            error={error.date}
          />
        ),
        button: {
          onPress: () => {
            if (!date) {
              setError(prev => ({ ...prev, date: 'Tarih olmadan gökyüzünü okuyamam tatlım 🌙' }));
              setError(prev => ({ ...prev, name: '' }));
            }
          }
        }
      },
      {
        id: 3,
        title: '⏰ Gecenin kaçıydı o an?',
        description: 'Doğduğun saat, yıldızlar hangi sıradaydı? Bilirsen söyle... Bilmiyorsan boş bırakabilirsin.',
        FloatingLabelInput: (
          <FloatingTimePicker
            value={time as Date}
            onChange={(date) => setTime(date)}
            placeholder={'Doğum saatini söyle tatlım'}
            leftIcon={'time'}
          />
        ),
        button: {
          onPress: () => {
            setError(prev => ({ ...prev, date: '' }));
          }
        }
      },
      {
        id: 4,
        title: '🌺 Enerjin hangi renkte?',
        description: 'Eril mi dişil mi yoksa bambaşka bir frekansta mısın?',
        FloatingLabelInput: (
          <FloatingLabelPicker
            value={gender}
            placeholder={'Kendini nasıl tanımlarsın?'}
            onChangeText={setGender}
            leftIcon={gender === 'Erkek' ? 'man' : gender === 'Kadın' ? 'woman' : 'star'}
            data={[
              { id: '1', label: 'Eril enerjideyim (Erkek)', value: 'Erkek' },
              { id: '2', label: 'Dişil enerjideyim (Kadın)', value: 'Kadın' },
              { id: '5', label: 'Tanımlamak istemiyorum ✨', value: 'Diğer' },
            ]}
            error={error.gender}
          />
        ),
        button: {
          onPress: () => { 
            if (!gender) {
              setError(prev => ({ ...prev, gender: 'Lütfen bir seçim yapınız' }));
            }
          }
        }
      },
      {
        id: 5,
        title: '💭 Ruhunu en çok ne yoruyor bugünlerde?',
        description: 'Dertlerini içime çekmeden sana fal bakamam canım. En çok hangi konu canını sıkıyor?',
        FloatingLabelInput: (
          <FloatingLabelPicker
            value={reason}
            placeholder={'İçindeki yükü seç...'}
            onChangeText={setReason}
            leftIcon={'heart-dislike-outline'}
            data={[
              { id: '1', label: 'Aşk... Kalbim kırık 💔', value: 'aşk' },
              { id: '2', label: 'İş / okul... Yoruldum artık 💼', value: 'iş' },
              { id: '3', label: 'Ailemle aram gergin 🏠', value: 'aile' },
              { id: '4', label: 'Kendime inancım zayıf 🪞', value: 'güven' },
              { id: '5', label: 'Para derdi bitmiyor 💸', value: 'para' },
              { id: '6', label: 'Sağlık sorunlarımdan usandım 🏥', value: 'sağlık' },
              { id: '7', label: 'Gelecek... Korkuyorum 🌫️', value: 'gelecek' },
              { id: '8', label: 'Yalnızım... çok yalnız 🕯️', value: 'yalnızlık' },
              { id: '9', label: 'Arkadaşlarım uzaklaştı 🤝', value: 'arkadaşlık' },
              { id: '10', label: 'Ruhsal bir arayıştayım 🌟', value: 'ruhsal' },
              { id: '11', label: 'Kariyer yolculuğumda kayboldum 🗺️', value: 'kariyer' },
              { id: '12', label: 'İç huzurumu kaybettim 🧘‍♀️', value: 'huzur' },
              { id: '13', label: 'Hayatın kendisi yorucu be abla... 🌀', value: 'hiçbiri' },
            ]}
            error={error.reason}
          />
        ),
        button: {
          onPress: () => { 
            if (!reason) {
              setError(prev => ({ ...prev, reason: 'Lütfen bir seçim yapınız' }));
              setError(prev => ({ ...prev, gender: '' }));
            }
          }
        }
      },
      {
        id: 6,
        title: '❤️ Kalbin ne diyor?',
        description: 'Aşk hayatın nasıl gidiyor tatlım?',
        FloatingLabelInput: (
          <FloatingLabelPicker
            value={love}
            placeholder={'Aşk durumun nedir?'}
            onChangeText={setLove}
            leftIcon={'heart'}
            data={[
              { id: '1', label: 'Aşık oldum, kalbim çarpıyor 🥰', value: 'aşık' },
              { id: '2', label: 'Kalbim kırık, acı çekiyorum 💔', value: 'kırık' },
              { id: '3', label: 'Yalnızım ama umutluyum ��', value: 'umut' },
              { id: '4', label: 'Aşka inancım kalmadı 🖤', value: 'yok' },
              { id: '5', label: 'Karmaşık duygular içindeyim 🎭', value: 'karmaşık' },
              { id: '6', label: 'Yeni bir aşkın eşiğindeyim 🌹', value: 'yeni' },
              { id: '7', label: 'İlişkimde sorunlar var ⚖️', value: 'sorunlu' },
              { id: '8', label: 'Aşkı arıyorum ama bulamıyorum 🔍', value: 'arayış' },
            ]}
            error={error.love}
          />
        ),
        button: {
          onPress: () => {
            if (!love) {
              setError(prev => ({ ...prev, love: 'Lütfen bir seçim yapınız' }));
              setError(prev => ({ ...prev, reason: '' }));
            }
          }
        }
      },
      {
        id: 7,
        title: '🫶 En çok neye ihtiyaç duyuyorsun?',
        description: 'Şu an en çok ne seni iyi hissettirir?',
        FloatingLabelInput: (
          <FloatingLabelPicker
            value={need}
            placeholder={'İhtiyacın nedir?'}
            onChangeText={setNeed}
            leftIcon={'balloon'}
            data={[
              { id: '1', label: 'Sevgi ve şefkat 💞', value: 'sevgi' },
              { id: '2', label: 'İç huzur ve sükunet 🕊️', value: 'huzur' },
              { id: '3', label: 'Başarı ve tanınma 🏆', value: 'başarı' },
              { id: '4', label: 'Güven ve istikrar 🔐', value: 'güven' },
              { id: '5', label: 'Maddi refah ve bolluk 💰', value: 'refah' },
              { id: '6', label: 'Ruhsal gelişim ve aydınlanma 🌟', value: 'ruhsal' },
              { id: '7', label: 'Sağlık ve enerji 💪', value: 'sağlık' },
              { id: '8', label: 'Yaratıcılık ve ilham 🎨', value: 'yaratıcılık' },
              { id: '9', label: 'Özgürlük ve bağımsızlık 🦅', value: 'özgürlük' },
            ]}
            error={error.need}
          />
        ),
        button: {
          onPress: () => {
            if (!need) {
              setError(prev => ({ ...prev, need: 'Lütfen bir seçim yapınız' }));
              setError(prev => ({ ...prev, love: '' }));
            }
          }
        }
      },
      {
        id: 8,
        title: '🌈 Bugün nasılsın?',
        description: 'Ruh halin bir şarkı olsaydı hangi tonda çalardı?',
        FloatingLabelInput: (
          <FloatingLabelPicker
            value={mood}
            placeholder={'Duygusal frekansını seç'}
            onChangeText={setMood}
            leftIcon={'sunny'}
            data={[
              { id: '1', label: 'Mutlu ve neşeli 😊', value: 'mutlu' },
              { id: '2', label: 'Hüzünlü ve melankolik 😢', value: 'hüzünlü' },
              { id: '3', label: 'Kafam karışık ve endişeliyim 🤯', value: 'karışık' },
              { id: '4', label: 'Sakin ve dengeli 😌', value: 'sakin' },
              { id: '5', label: 'Heyecanlı ve tutkulu 🔥', value: 'heyecanlı' },
              { id: '6', label: 'Yorgun ve bitkin 😫', value: 'yorgun' },
              { id: '7', label: 'Öfkeli ve gergin 😠', value: 'öfkeli' },
              { id: '8', label: 'Umutsuz ve karamsar 🌑', value: 'umutsuz' },
              { id: '9', label: 'İçe dönük ve düşünceli 🤔', value: 'düşünceli' },
            ]}
            error={error.mood}
          />
        ),
        button: {
          onPress: () => {
            if (!mood) {
              setError(prev => ({ ...prev, mood: 'Lütfen bir seçim yapınız' }));
              setError(prev => ({ ...prev, need: '' }));
            }
          }
        }
      },
      {
        id: 9,
        title: '🪬 Rüyanda hangi semboller vardı?',
        description: 'Sana özel mesajlar hangi imgelerde saklıydı?',
        FloatingLabelInput: (
          <FloatingLabelPicker
            value={meaning}
            placeholder={'Bir sembol seç'}
            onChangeText={setMeaning}
            leftIcon={'eye-outline'}
            data={[
              { id: '1', label: 'Kelebek - Dönüşüm ve yenilenme 🦋', value: 'kelebek' },
              { id: '2', label: 'Yılan - Bilgelik ve şifa 🐍', value: 'yılan' },
              { id: '3', label: 'Ayna - Kendini keşfetme 🪞', value: 'ayna' },
              { id: '4', label: 'Karanlık - Gizem ve dönüşüm 🌑', value: 'karanlık' },
              { id: '5', label: 'Ay - Sezgi ve duygusallık 🌙', value: 'ay' },
              { id: '6', label: 'Güneş - Güç ve canlılık ☀️', value: 'güneş' },
              { id: '7', label: 'Yıldız - Rehberlik ve umut ⭐', value: 'yıldız' },
              { id: '8', label: 'Su - Duygular ve akış 🌊', value: 'su' },
              { id: '9', label: 'Ateş - Tutku ve dönüşüm 🔥', value: 'ateş' },
              { id: '10', label: 'Toprak - İstikrar ve büyüme 🌱', value: 'toprak' },
            ]}
            error={error.meaning}
          />
        ),
        button: {
          title: 'Yaşanmışlıklara Bakalım 🕰️',
          onPress: () => {
            if (!meaning) {
              setError(prev => ({ ...prev, meaning: 'Lütfen bir seçim yapınız' }));
              setError(prev => ({ ...prev, mood: '' }));
            }
          }
        }
      },
      {
        id: 10,
        title: '📖 Hayatında seni en çok etkileyen neydi?',
        description: 'Bir olay, bir kişi, bir an... Seni en çok şekillendiren şey neydi?',
        FloatingLabelInput: (
          <FloatingLabelPicker
            value={experience}
            placeholder={'Birini seç tatlım'}
            onChangeText={setExperience}
            leftIcon={'star-half'}
            data={[
              { id: '1', label: 'Ailemle yaşadığım bir olay 👪', value: 'aile' },
              { id: '2', label: 'Aşık olduğum biri ❤️', value: 'aşk' },
              { id: '3', label: 'Kariyer yolculuğum 💼', value: 'kariyer' },
              { id: '4', label: 'Bir kayıp... 🕯️', value: 'kayıp' },
              { id: '5', label: 'Ruhsal bir deneyim 🌟', value: 'ruhsal' },
              { id: '6', label: 'Sağlık sorunları 🏥', value: 'sağlık' },
              { id: '7', label: 'Eğitim hayatım 📚', value: 'eğitim' },
              { id: '8', label: 'Yolculuk ve keşif 🌍', value: 'yolculuk' },
              { id: '9', label: 'Yaratıcı bir başarı 🎨', value: 'yaratıcılık' },
              { id: '10', label: 'Maddi bir değişim 💰', value: 'maddi' },
            ]}
          />
        ),
        button: {
          onPress: () => {
            if (!experience) {
              setError(prev => ({ ...prev, experience: 'Lütfen bir seçim yapınız' }));
              setError(prev => ({ ...prev, meaning: '' }));
            }
          }
        }
      },
      {
        id: 11,
        title: '🔍 En çok neyi merak ediyorsun?',
        description: 'Geleceğinle ilgili seni en çok heyecanlandıran veya kafanı kurcalayan konu ne?',
        FloatingLabelInput: (
          <FloatingLabelPicker
            value={curious}
            placeholder={'Merak ettiğin bir alan seç'}
            onChangeText={setCurious}
            leftIcon={'bookmark'}
            data={[
              { id: '1', label: 'Aşk hayatım ve ilişkilerim ❤️', value: 'aşk' },
              { id: '2', label: 'Kariyerim ve iş hayatım 💼', value: 'kariyer' },
              { id: '3', label: 'Sağlık durumum ve enerjim 🏥', value: 'sağlık' },
              { id: '4', label: 'Ailemle ilgili gelişmeler 👪', value: 'aile' },
              { id: '5', label: 'Parasal konular ve maddi durum 💸', value: 'para' },
              { id: '6', label: 'Ruhsal gelişim ve aydınlanma 🌟', value: 'ruhsal' },
              { id: '7', label: 'Yaratıcı projelerim ve yeteneklerim 🎨', value: 'yaratıcılık' },
              { id: '8', label: 'Sosyal ilişkilerim ve arkadaşlıklarım 🤝', value: 'sosyal' },
              { id: '9', label: 'Eğitim ve öğrenme sürecim 📚', value: 'eğitim' },
              { id: '10', label: 'Yolculuklar ve yeni deneyimler 🌍', value: 'yolculuk' },
              { id: '11', label: 'Hayatımın genel akışı ve kaderim 🌀', value: 'genel' },
            ]}
            error={error.curious}
          />
        ),
        button: {
          onPress: () => {
            if (!curious) {
              setError(prev => ({ ...prev, curious: 'Lütfen bir seçim yapınız' }));
              setError(prev => ({ ...prev, experience: '' }));
            }
          }
        }
      }
    ];
  
    return {
      data,
      name,
      setName,
      date,
      setDate,
      gender,
      setGender,
      error,
      time,
      setTime,
      reason,
      setReason,
      love,
      setLove,
      need,
      setNeed,
      mood,
      setMood,
      meaning,
      setMeaning,
      experience,
      setExperience,
      curious,
      setCurious
    };
};

export default useIntroductionData;