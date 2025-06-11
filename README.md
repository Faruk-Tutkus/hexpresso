# Hexpresso - Modern Expo React Native Uygulaması

Bu proje, Expo ve React Native kullanılarak geliştirilmiş, modern ve ölçeklenebilir bir mobil uygulama projesidir. TypeScript ile geliştirilmiş olup, Firebase entegrasyonu ve çoklu dil desteği içermektedir.

## 🚀 Teknolojiler
- npx npm-check-updates -u - → Update package.json

- [Expo](https://expo.dev) - React Native geliştirme platformu
- [React Native](https://reactnative.dev) - Mobil uygulama geliştirme framework'ü
- [TypeScript](https://www.typescriptlang.org) - Tip güvenli JavaScript
- [Firebase](https://firebase.google.com) - Backend servisleri
- [React Navigation](https://reactnavigation.org) - Navigasyon yönetimi
- [React i18next](https://react.i18next.com) - Çoklu dil desteği
- [Expo Router](https://docs.expo.dev/router/introduction/) - Dosya tabanlı routing
- [Expo Font](https://docs.expo.dev/versions/latest/sdk/font/) - Özel font desteği

## 📦 Kurulum

1. Gerekli bağımlılıkları yükleyin:

   ```bash
   npm install
   ```

2. Uygulamayı başlatın:

   ```bash
   npm start
   # veya
   npx expo start
   ```

## 🎯 Geliştirme Seçenekleri

Uygulamayı aşağıdaki platformlarda çalıştırabilirsiniz:

- [Expo Go](https://expo.dev/go) - Expo uygulaması ile test etme
- [Android Emulator](https://docs.expo.dev/workflow/android-studio-emulator/) - Android Studio emülatörü
- [iOS Simulator](https://docs.expo.dev/workflow/ios-simulator/) - iOS simülatörü
- [Development Build](https://docs.expo.dev/develop/development-builds/introduction/) - Geliştirme sürümü

## 📁 Proje Yapısı

```
hexpresso/
├── app/                    # Ana uygulama dizini
│   ├── _layout.tsx        # Uygulama düzeni ve tema yapılandırması
│   └── src/               # Kaynak kodları
│       ├── api/           # API istekleri ve servisler
│       ├── assets/        # Statik dosyalar ve fontlar
│       ├── components/    # Yeniden kullanılabilir bileşenler
│       │   ├── Animation/         # Animasyon bileşenleri
│       │   ├── Container/         # Konteyner bileşenleri
│       │   ├── CustomButton/      # Özel buton bileşenleri
│       │   ├── FloatingDatePicker/# Tarih seçici bileşenleri
│       │   ├── FloatingLabelInput/# Form input bileşenleri
│       │   └── Toast/            # Bildirim bileşenleri
│       ├── constants/     # Sabit değerler
│       ├── hooks/         # Özel React hooks'ları
│       ├── locales/       # Dil dosyaları
│       ├── providers/     # Context providers
│       ├── screens/       # Uygulama ekranları
│       │   ├── auth/      # Kimlik doğrulama ekranları
│       │   ├── main/      # Ana uygulama ekranları
│       │   └── side/      # Yan ekranlar
│       └── utils/         # Yardımcı fonksiyonlar
├── assets/                # Genel statik dosyalar
└── node_modules/          # Bağımlılıklar
```

## 🛠️ Kullanılabilir Komutlar

- `npm start` - Uygulamayı başlatır
- `npm run android` - Android için başlatır
- `npm run ios` - iOS için başlatır
- `npm run web` - Web için başlatır
- `npm run lint` - Kod kalitesi kontrolü
- `npm run reset-project` - Projeyi sıfırlar

## 🔧 Özellikler

### Temel Özellikler
- TypeScript ile tip güvenliği
- Firebase entegrasyonu
- Çoklu dil desteği
- Modern UI bileşenleri
- Responsive tasarım
- Expo Router ile dosya tabanlı routing

### UI Bileşenleri
- Özel butonlar ve form elemanları
- Animasyonlu geçişler
- Toast bildirimleri
- Tarih ve zaman seçiciler
- Özel font desteği (Almendra, CroissantOne, Domine)
- Tema desteği (Açık/Koyu mod)

### Mimari Özellikler
- Modüler yapı
- Context API ile state yönetimi
- Özel hook'lar
- Servis tabanlı API entegrasyonu
- Çoklu dil desteği
- Tema yönetimi

## 📚 Öğrenme Kaynakları

- [Expo Dokümantasyonu](https://docs.expo.dev)
- [React Native Dokümantasyonu](https://reactnative.dev/docs/getting-started)
- [TypeScript Dokümantasyonu](https://www.typescriptlang.org/docs)
- [Firebase Dokümantasyonu](https://firebase.google.com/docs)
- [React Navigation Dokümantasyonu](https://reactnavigation.org/docs/getting-started)

## 🤝 Katkıda Bulunma

1. Bu repository'yi fork edin
2. Yeni bir branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add some amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📝 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için [LICENSE](LICENSE) dosyasına bakın.
