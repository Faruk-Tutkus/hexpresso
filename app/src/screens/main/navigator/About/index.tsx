import { ContainerButton } from '@components';
import { useTheme } from '@providers';
import * as Linking from 'expo-linking';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import Animated, { FadeIn, FadeInLeft, FadeInRight } from 'react-native-reanimated';
import styles from './styles';

const About = () => {
  const { colors } = useTheme();

  const openURL = async (url: string) => {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    }
  };

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <Animated.View entering={FadeIn} style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={[styles.mainTitle, { color: colors.primary }]}>
            Hexpresso
          </Text>
          <Text style={[styles.subtitle, { color: colors.text }]}>
            — yıldızların fısıldadığı rehberin!
          </Text>
        </View>
      </Animated.View>

      {/* Intro */}
      <Animated.View entering={FadeInLeft.delay(200)} style={styles.section}>
        <Text style={[styles.introText, { color: colors.text }]}>
          Kahve fincanından yıldız haritasına uzanan bu yolculukta, Hexpresso sana sadece günlük burç yorumları değil; 
          aynı zamanda senin için özel hazırlanmış, akıllı analizlerle dolu bir astroloji deneyimi sunar.
        </Text>
      </Animated.View>

      {/* What Does It Offer */}
      <Animated.View entering={FadeInRight.delay(400)} style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.primary }]}>
          Ne Sunar?
        </Text>

        <View style={styles.featureContainer}>
          <View style={[styles.featureIcon, { backgroundColor: colors.primary + '20' }]}>
            <Text style={styles.emoji}>🔮</Text>
          </View>
          <View style={styles.featureContent}>
            <Text style={[styles.featureTitle, { color: colors.text }]}>
              Kişiselleştirilmiş Burç Yorumları
            </Text>
            <Text style={[styles.featureDescription, { color: colors.secondaryText }]}>
              Her burç için günlük, haftalık, aylık ve yıllık analizler seni bekliyor. 
              Sadece Güneş burcuna göre değil — yükselen ve ay burcuna göre de derinlemesine içerikler sunar.
            </Text>
          </View>
        </View>

        <View style={styles.featureContainer}>
          <View style={[styles.featureIcon, { backgroundColor: colors.secondary + '20' }]}>
            <Text style={styles.emoji}>📅</Text>
          </View>
          <View style={styles.featureContent}>
            <Text style={[styles.featureTitle, { color: colors.text }]}>
              Zaman Yolculuğu Özelliği
            </Text>
            <Text style={[styles.featureDescription, { color: colors.secondaryText }]}>
              Bugünü okudun, peki ya dün seni nasıl etkiledi? Yarın ne bekliyor? 
              Zaman aralığı butonlarıyla ileri-geri gezebilir, her günün enerjisini keşfedebilirsin.
            </Text>
          </View>
        </View>

        <View style={styles.featureContainer}>
          <View style={[styles.featureIcon, { backgroundColor: colors.surface + '40' }]}>
            <Text style={styles.emoji}>🌌</Text>
          </View>
          <View style={styles.featureContent}>
            <Text style={[styles.featureTitle, { color: colors.text }]}>
              Gerçek Konum Tabanlı Astroloji
            </Text>
            <Text style={[styles.featureDescription, { color: colors.secondaryText }]}>
              Doğduğun konumu harita üzerinden seçerek yıldızların o anki dizilimlerine göre daha net sonuçlar alırsın. 
              Sadece "Koç burcu şöyleymiş" gibi değil — senin "doğum anın" evrenin dilinde çözülür.
            </Text>
          </View>
        </View>

        <View style={styles.featureContainer}>
          <View style={[styles.featureIcon, { backgroundColor: colors.primary + '20' }]}>
            <Text style={styles.emoji}>💫</Text>
          </View>
          <View style={styles.featureContent}>
            <Text style={[styles.featureTitle, { color: colors.text }]}>
              Yıldızlar, Uyum ve Enerji Seviyeleri
            </Text>
            <Text style={[styles.featureDescription, { color: colors.secondaryText }]}>
              Her yorumun yanında senin için hesaplanmış enerji, aşk, başarı ve ruh hali puanları yer alır. 
              Ayrıca o gün hangi burçlarla daha uyumlu olacağın da sana söylenir.
            </Text>
          </View>
        </View>

        <View style={styles.featureContainer}>
          <View style={[styles.featureIcon, { backgroundColor: colors.secondary + '20' }]}>
            <Text style={styles.emoji}>🤖</Text>
          </View>
          <View style={styles.featureContent}>
            <Text style={[styles.featureTitle, { color: colors.text }]}>
              Yapay Zekâ Destekli Astro Asistan (Mordecai)
            </Text>
            <Text style={[styles.featureDescription, { color: colors.secondaryText }]}>
              Bir şey mi merak ettin? "Bu hafta risk almalı mıyım?", "Venüs retrosu beni nasıl etkiler?" 
              gibi sorularına anında cevap veren akıllı astro asistanın 7/24 yanında.
            </Text>
          </View>
        </View>

        <View style={styles.featureContainer}>
          <View style={[styles.featureIcon, { backgroundColor: colors.surface + '40' }]}>
            <Text style={styles.emoji}>🎭</Text>
          </View>
          <View style={styles.featureContent}>
            <Text style={[styles.featureTitle, { color: colors.text }]}>
              Detaylı Burç Analizleri
            </Text>
            <Text style={[styles.featureDescription, { color: colors.secondaryText }]}>
              Her burcun karakteristik özellikleri, aşk hayatı, kariyerler, uyumlu burçlar, 
              ünlü temsilciler ve daha fazlası kapsamlı şekilde sunulur.
            </Text>
          </View>
        </View>
      </Animated.View>

      {/* Why Hexpresso */}
      <Animated.View entering={FadeInLeft.delay(600)} style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.primary }]}>
          Neden Hexpresso?
        </Text>
        <Text style={[styles.bodyText, { color: colors.text }]}>
          Bu uygulama; klasik burç uygulamalarının aksine, görselliğiyle, animasyonlu geçişleriyle ve 
          kullanıcı deneyimiyle modern dünyanın ruhuna hitap eder. Sıkıcı duvar yazısı gibi burç yorumlarını değil, 
          gerçekten senin için yazılmış gibi hissettiren içgörüler sunar.
        </Text>
      </Animated.View>

      {/* Privacy & Security */}
      <Animated.View entering={FadeInRight.delay(800)} style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.primary }]}>
          Gizlilik ve Güvenlik
        </Text>
        <Text style={[styles.bodyText, { color: colors.text }]}>
          Konum ve doğum bilgilerin yalnızca senin astrolojik haritani doğru hesaplamak için kullanılır. 
          Asla üçüncü taraflarla paylaşılmaz. Tüm veriler güvenle saklanır ve hiçbir zaman izinsiz şekilde işlenmez.
        </Text>
      </Animated.View>

      {/* FAQ */}
      <Animated.View entering={FadeInLeft.delay(1000)} style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.primary }]}>
          Sık Sorulanlar
        </Text>

        <View style={styles.faqContainer}>
          <Text style={[styles.faqQuestion, { color: colors.text }]}>
            Bu uygulama sadece Güneş burcuna mı göre çalışıyor?
          </Text>
          <Text style={[styles.faqAnswer, { color: colors.secondaryText }]}>
            Hayır. Güneş, Ay ve Yükselen burç hesaplamaları doğum bilgilerin ve konumun temel alınarak yapılır. 
            Mevcut özellikler sayesinde çok daha kişiselleştirilmiş sonuçlar alırsın.
          </Text>
        </View>

        <View style={styles.faqContainer}>
          <Text style={[styles.faqQuestion, { color: colors.text }]}>
            AI Asistan nasıl çalışıyor?
          </Text>
          <Text style={[styles.faqAnswer, { color: colors.secondaryText }]}>
            Sorduğun sorular, gelişmiş yapay zeka modelleri ile analiz edilir ve doğrudan astrolojik kavramlara göre yorumlanır. 
            Mordecai, ezberden konuşmaz - senin kişisel bilgilerinle harmanlayarak özel cevaplar verir.
          </Text>
        </View>

        <View style={styles.faqContainer}>
          <Text style={[styles.faqQuestion, { color: colors.text }]}>
            Verilerim güvende mi?
          </Text>
          <Text style={[styles.faqAnswer, { color: colors.secondaryText }]}>
            Evet. Firebase altyapısı kullanılarak tüm veriler güvenli şekilde saklanır. 
            Hiçbir kişisel bilgin üçüncü taraflarla paylaşılmaz.
          </Text>
        </View>
      </Animated.View>

      {/* Final Message */}
      <Animated.View entering={FadeInRight.delay(1200)} style={styles.finalSection}>
        <Text style={[styles.finalTitle, { color: colors.primary }]}>
          Hexpresso ile Evrenin Dilini Dinle
        </Text>
        <Text style={[styles.finalText, { color: colors.text }]}>
          Yıldızlar boşuna orada değiller. Onlar sana bir şeyler anlatmaya çalışıyor. 
          Hexpresso, bu mesajları senin için tercüme eder.
        </Text>
        <Text style={[styles.finalSubtext, { color: colors.secondaryText }]}>
          Kendini keşfetmeye ve evrenle hizalanmaya hazırsan...{'\n'}
          Yolculuk şimdi başlıyor.
        </Text>
      </Animated.View>

      {/* Social Media */}
      <Animated.View entering={FadeIn.delay(1400)} style={styles.socialSection}>
        <Text style={[styles.socialTitle, { color: colors.primary }]}>
          💫 Geliştirici ile İletişime Geç
        </Text>
        <Text style={[styles.socialSubtitle, { color: colors.secondaryText }]}>
          Sorularınız, önerileriniz veya geri bildirimleriniz için:
        </Text>

        <View style={styles.socialButtons}>
          <ContainerButton
            title="Instagram'da Takip Et"
            leftImage={require('@assets/image/floatingImage.png')}
            onPress={() => openURL('https://www.instagram.com/thefarukt')}
          />
          
          <ContainerButton
            title="GitHub'da İncele"
            leftImage={require('@assets/image/github.png')}
            onPress={() => openURL('https://github.com/Faruk-Tutkus')}
          />
          
          <ContainerButton
            title="E-posta Gönder"
            leftImage={require('@assets/image/gmail.png')}
            onPress={() => openURL('mailto:so38ware@gmail.com')}
          />
        </View>
      </Animated.View>

      <View style={{ height: 50 }} />
    </ScrollView>
  );
};

export default About;
