import { FloatingDatePicker, FloatingLabelInput, FloatingLabelPicker, FloatingTimePicker } from '@components';
import { useAuth, useTheme } from '@providers';
import { useState } from 'react';

const useIntroductionData = () => {
    const { colors } = useTheme();
    const { user } = useAuth();
    const [name, setName] = useState(user?.displayName || '');
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
              { id: '1', label: 'Eril enerjideyim (Erkek)', value: 'masculine_energy' },
              { id: '2', label: 'Dişil enerjideyim (Kadın)', value: 'feminine_energy' },
              { id: '5', label: 'Tanımlamak istemiyorum ✨', value: 'undefined_energy' },
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
              { id: '1', label: 'Aşk... Kalbim kırık 💔', value: 'broken_heart_love' },
              { id: '2', label: 'İş / okul... Yoruldum artık 💼', value: 'work_school_exhaustion' },
              { id: '3', label: 'Ailemle aram gergin 🏠', value: 'family_tension' },
              { id: '4', label: 'Kendime inancım zayıf 🪞', value: 'low_self_confidence' },
              { id: '5', label: 'Para derdi bitmiyor 💸', value: 'financial_struggles' },
              { id: '6', label: 'Sağlık sorunlarımdan usandım 🏥', value: 'health_issues' },
              { id: '7', label: 'Gelecek... Korkuyorum 🌫️', value: 'future_anxiety' },
              { id: '8', label: 'Yalnızım... çok yalnız 🕯️', value: 'loneliness' },
              { id: '9', label: 'Arkadaşlarım uzaklaştı 🤝', value: 'distant_friendships' },
              { id: '10', label: 'Ruhsal bir arayıştayım 🌟', value: 'spiritual_search' },
              { id: '11', label: 'Kariyer yolculuğumda kayboldum 🗺️', value: 'career_confusion' },
              { id: '12', label: 'İç huzurumu kaybettim 🧘‍♀️', value: 'lost_inner_peace' },
              { id: '13', label: 'Hayatın kendisi yorucu be abla... 🌀', value: 'general_life_exhaustion' },
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
              { id: '1', label: 'Aşık oldum, kalbim çarpıyor 🥰', value: 'new_love_excitement' },
              { id: '2', label: 'Kalbim kırık, acı çekiyorum 💔', value: 'heartbreak_pain' },
              { id: '3', label: 'Yalnızım ama umutluyum 🕯️', value: 'hopeful_solitude' },
              { id: '4', label: 'Aşka inancım kalmadı 🖤', value: 'lost_faith_in_love' },
              { id: '5', label: 'Karmaşık duygular içindeyim 🎭', value: 'complex_emotions' },
              { id: '6', label: 'Yeni bir aşkın eşiğindeyim 🌹', value: 'on_the_brink_of_love' },
              { id: '7', label: 'İlişkimde sorunlar var ⚖️', value: 'relationship_problems' },
              { id: '8', label: 'Aşkı arıyorum ama bulamıyorum 🔍', value: 'searching_for_love' },
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
              { id: '1', label: 'Sevgi ve şefkat 💞', value: 'love_and_affection' },
              { id: '2', label: 'İç huzur ve sükunet 🕊️', value: 'inner_peace_and_tranquility' },
              { id: '3', label: 'Başarı ve tanınma 🏆', value: 'success_and_recognition' },
              { id: '4', label: 'Güven ve istikrar 🔐', value: 'security_and_stability' },
              { id: '5', label: 'Maddi refah ve bolluk 💰', value: 'material_prosperity' },
              { id: '6', label: 'Ruhsal gelişim ve aydınlanma 🌟', value: 'spiritual_growth' },
              { id: '7', label: 'Sağlık ve enerji 💪', value: 'health_and_energy' },
              { id: '8', label: 'Yaratıcılık ve ilham 🎨', value: 'creativity_and_inspiration' },
              { id: '9', label: 'Özgürlük ve bağımsızlık 🦅', value: 'freedom_and_independence' },
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
              { id: '1', label: 'Mutlu ve neşeli 😊', value: 'happy_and_cheerful' },
              { id: '2', label: 'Hüzünlü ve melankolik 😢', value: 'sad_and_melancholic' },
              { id: '3', label: 'Kafam karışık ve endişeliyim 🤯', value: 'confused_and_anxious' },
              { id: '4', label: 'Sakin ve dengeli 😌', value: 'calm_and_balanced' },
              { id: '5', label: 'Heyecanlı ve tutkulu 🔥', value: 'excited_and_passionate' },
              { id: '6', label: 'Yorgun ve bitkin 😫', value: 'tired_and_exhausted' },
              { id: '7', label: 'Öfkeli ve gergin 😠', value: 'angry_and_tense' },
              { id: '8', label: 'Umutsuz ve karamsar 🌑', value: 'hopeless_and_pessimistic' },
              { id: '9', label: 'İçe dönük ve düşünceli 🤔', value: 'introspective_and_thoughtful' },
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
              { id: '1', label: 'Kelebek - Dönüşüm ve yenilenme 🦋', value: 'transformation_and_renewal' },
              { id: '2', label: 'Yılan - Bilgelik ve şifa 🐍', value: 'wisdom_and_healing' },
              { id: '3', label: 'Ayna - Kendini keşfetme 🪞', value: 'self_discovery' },
              { id: '4', label: 'Karanlık - Gizem ve dönüşüm 🌑', value: 'mystery_and_transformation' },
              { id: '5', label: 'Ay - Sezgi ve duygusallık 🌙', value: 'intuition_and_emotion' },
              { id: '6', label: 'Güneş - Güç ve canlılık ☀️', value: 'power_and_vitality' },
              { id: '7', label: 'Yıldız - Rehberlik ve umut ⭐', value: 'guidance_and_hope' },
              { id: '8', label: 'Su - Duygular ve akış 🌊', value: 'emotions_and_flow' },
              { id: '9', label: 'Ateş - Tutku ve dönüşüm 🔥', value: 'passion_and_transformation' },
              { id: '10', label: 'Toprak - İstikrar ve büyüme 🌱', value: 'stability_and_growth' },
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
              { id: '1', label: 'Ailemle yaşadığım bir olay 👪', value: 'family_experience' },
              { id: '2', label: 'Aşık olduğum biri ❤️', value: 'falling_in_love' },
              { id: '3', label: 'Kariyer yolculuğum 💼', value: 'career_journey' },
              { id: '4', label: 'Bir kayıp... 🕯️', value: 'significant_loss' },
              { id: '5', label: 'Ruhsal bir deneyim 🌟', value: 'spiritual_experience' },
              { id: '6', label: 'Sağlık sorunları 🏥', value: 'health_challenges' },
              { id: '7', label: 'Eğitim hayatım 📚', value: 'educational_journey' },
              { id: '8', label: 'Yolculuk ve keşif 🌍', value: 'travel_and_discovery' },
              { id: '9', label: 'Yaratıcı bir başarı 🎨', value: 'creative_achievement' },
              { id: '10', label: 'Maddi bir değişim 💰', value: 'financial_change' },
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
              { id: '1', label: 'Aşk hayatım ve ilişkilerim ❤️', value: 'love_life_and_relationships' },
              { id: '2', label: 'Kariyerim ve iş hayatım 💼', value: 'career_and_work_life' },
              { id: '3', label: 'Sağlık durumum ve enerjim 🏥', value: 'health_and_energy_status' },
              { id: '4', label: 'Ailemle ilgili gelişmeler 👪', value: 'family_developments' },
              { id: '5', label: 'Parasal konular ve maddi durum 💸', value: 'financial_matters' },
              { id: '6', label: 'Ruhsal gelişim ve aydınlanma 🌟', value: 'spiritual_development' },
              { id: '7', label: 'Yaratıcı projelerim ve yeteneklerim 🎨', value: 'creative_projects_and_talents' },
              { id: '8', label: 'Sosyal ilişkilerim ve arkadaşlıklarım 🤝', value: 'social_relationships' },
              { id: '9', label: 'Eğitim ve öğrenme sürecim 📚', value: 'education_and_learning' },
              { id: '10', label: 'Yolculuklar ve yeni deneyimler 🌍', value: 'travels_and_new_experiences' },
              { id: '11', label: 'Hayatımın genel akışı ve kaderim 🌀', value: 'life_path_and_destiny' },
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
      date,
      gender,
      time,
      reason,
      love,
      need,
      mood,
      meaning,
      experience,
      curious,
    };
};

export default useIntroductionData;