import { Container } from '@components';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@providers';
import { router } from 'expo-router';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import styles from './styles';

const Privacy = () => {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <TouchableOpacity 
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons 
            name="arrow-back" 
            size={24} 
            color={colors.text} 
          />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Gizlilik Politikası
        </Text>
        <View style={styles.placeholder} />
      </View>
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Container style={[styles.content, { backgroundColor: colors.background }]}>
          <Text style={[styles.lastUpdated, { color: colors.secondaryText }]}>
            Son Güncelleme: 29 Haziran 2025 | KVKK & GDPR Uyumlu
          </Text>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              1. Gizlilik Politikası Hakkında
            </Text>
            <Text style={[styles.sectionText, { color: colors.secondaryText }]}>
              Hexpresso olarak kişisel verilerinizin korunması bizim için son derece önemlidir. Bu politika:{'\n\n'}
              • Hangi verileri topladığımızı{'\n'}
              • Bu verileri nasıl kullandığımızı{'\n'}
              • Haklarınızı nasıl koruyabileceğinizi{'\n'}
              • Bizimle nasıl iletişim kurabileceğinizi{'\n\n'}
              açıklar. Bu politika KVKK (Türkiye) ve GDPR (AB) düzenlemelerine uygun olarak hazırlanmıştır.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              2. Topladığımız Kişisel Veriler
            </Text>
            <Text style={[styles.sectionText, { color: colors.secondaryText }]}>
              Daha iyi hizmet sunabilmek için aşağıdaki bilgileri toplarız:{'\n\n'}
              <Text style={{ fontWeight: '600' }}>📝 Hesap Bilgileri:</Text>{'\n'}
              • Ad, soyad{'\n'}
              • E-posta adresi{'\n'}
              • Doğum tarihi ve saati{'\n'}
              • Cinsiyet{'\n\n'}
              <Text style={{ fontWeight: '600' }}>📍 Konum Bilgileri:</Text>{'\n'}
              • Doğum yeri (astroloji hesaplamaları için){'\n'}
              • Genel konum (isteğe bağlı){'\n\n'}
              <Text style={{ fontWeight: '600' }}>📱 Cihaz Bilgileri:</Text>{'\n'}
              • IP adresi{'\n'}
              • Cihaz türü ve işletim sistemi{'\n'}
              • Uygulama kullanım istatistikleri{'\n\n'}
              <Text style={{ fontWeight: '600' }}>🔐 Üçüncü Taraf Bilgileri:</Text>{'\n'}
              • Google/Facebook hesap bilgileri (giriş yaparken)
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              3. Verilerin Kullanım Amaçları
            </Text>
            <Text style={[styles.sectionText, { color: colors.secondaryText }]}>
              Topladığımız veriler yalnızca şu amaçlarla kullanılır:{'\n\n'}
              <Text style={{ fontWeight: '600' }}>🔮 Astroloji Hizmetleri:</Text>{'\n'}
              • Kişisel astroloji haritası oluşturma{'\n'}
              • Burç yorumları kişiselleştirme{'\n'}
              • Doğum haritası analizi{'\n\n'}
              <Text style={{ fontWeight: '600' }}>⚙️ Teknik Hizmetler:</Text>{'\n'}
              • Hesap yönetimi ve güvenlik{'\n'}
              • Uygulama performansını iyileştirme{'\n'}
              • Hata ayıklama ve destek{'\n\n'}
              <Text style={{ fontWeight: '600' }}>📊 Analitik:</Text>{'\n'}
              • Kullanım istatistikleri (anonim){'\n'}
              • Uygulama geliştirme{'\n'}
              • A/B test çalışmaları
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              4. Üçüncü Taraf Hizmetler
            </Text>
            <Text style={[styles.sectionText, { color: colors.secondaryText }]}>
              Hexpresso aşağıdaki üçüncü taraf hizmetleri kullanır:{'\n\n'}
              <Text style={{ fontWeight: '600' }}>🔥 Firebase (Google):</Text>{'\n'}
              • Kullanıcı kimlik doğrulama{'\n'}
              • Veritabanı hizmetleri{'\n'}
              • Anlık bildirimler{'\n\n'}
              <Text style={{ fontWeight: '600' }}>📍 Google Maps:</Text>{'\n'}
              • Konum seçimi ve harita hizmetleri{'\n\n'}
              <Text style={{ fontWeight: '600' }}>📱 Google/Facebook SDK:</Text>{'\n'}
              • Sosyal medya girişi{'\n\n'}
              <Text style={{ fontWeight: '600' }}>📢 Google AdMob:</Text>{'\n'}
              • Kişiselleştirilmiş reklamlar{'\n\n'}
              Bu hizmetlerin kendi gizlilik politikaları mevcuttur ve ilgili şirketlerin politikalarını incelemenizi öneririz.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              5. Veri Güvenliği
            </Text>
            <Text style={[styles.sectionText, { color: colors.secondaryText }]}>
              Verilerinizi korumak için şu önlemleri alıyoruz:{'\n\n'}
              <Text style={{ fontWeight: '600' }}>🔒 Teknik Güvenlik:</Text>{'\n'}
              • SSL/TLS şifreleme{'\n'}
              • Firebase güvenlik kuralları{'\n'}
              • Düzenli güvenlik güncellemeleri{'\n\n'}
              <Text style={{ fontWeight: '600' }}>🛡️ Erişim Kontrolü:</Text>{'\n'}
              • Sınırlı personel erişimi{'\n'}
              • İki faktörlü kimlik doğrulama{'\n'}
              • Düzenli erişim denetimi{'\n\n'}
              <Text style={{ fontWeight: '600' }}>💾 Veri Yedekleme:</Text>{'\n'}
              • Otomatik yedekleme sistemleri{'\n'}
              • Felaket kurtarma planları
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              6. KVKK Kapsamında Haklarınız
            </Text>
            <Text style={[styles.sectionText, { color: colors.secondaryText }]}>
              Kişisel Verilerin Korunması Kanunu kapsamında aşağıdaki haklarınız bulunmaktadır:{'\n\n'}
              <Text style={{ fontWeight: '600' }}>📋 Bilgi Alma Hakkı:</Text>{'\n'}
              • Hangi verilerinizin işlendiğini öğrenme{'\n'}
              • İşleme amacını ve süresini öğrenme{'\n\n'}
              <Text style={{ fontWeight: '600' }}>✏️ Düzeltme Hakkı:</Text>{'\n'}
              • Yanlış verilerin düzeltilmesini isteme{'\n'}
              • Eksik verilerin tamamlanmasını isteme{'\n\n'}
              <Text style={{ fontWeight: '600' }}>🗑️ Silme Hakkı:</Text>{'\n'}
              • Verilerinizin silinmesini isteme{'\n'}
              • Hesabınızı tamamen kapatma{'\n\n'}
              <Text style={{ fontWeight: '600' }}>⏸️ İşlemeyi Durdurma:</Text>{'\n'}
              • Belirli işlemleri durdurma talebi{'\n'}
              • Pazarlama iletişiminden çıkma{'\n\n'}
              Bu haklarınızı kullanmak için bizimle iletişime geçebilirsiniz.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              7. Çerezler ve İzleme
            </Text>
            <Text style={[styles.sectionText, { color: colors.secondaryText }]}>
              Uygulamamız deneyiminizi iyileştirmek için çeşitli izleme teknolojileri kullanır:{'\n\n'}
              <Text style={{ fontWeight: '600' }}>🍪 Zorunlu Çerezler:</Text>{'\n'}
              • Oturum yönetimi{'\n'}
              • Güvenlik kontrolleri{'\n'}
              • Temel uygulama işlevleri{'\n\n'}
              <Text style={{ fontWeight: '600' }}>📊 Analitik Çerezler:</Text>{'\n'}
              • Google Analytics{'\n'}
              • Firebase Analytics{'\n'}
              • Kullanım istatistikleri{'\n\n'}
              <Text style={{ fontWeight: '600' }}>🎯 Reklam Çerezleri:</Text>{'\n'}
              • AdMob izleme{'\n'}
              • Kişiselleştirilmiş reklamlar{'\n\n'}
              Uygulama ayarlarından reklam kişiselleştirmesini kapatabilirsiniz.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              8. Çocukların Gizliliği
            </Text>
            <Text style={[styles.sectionText, { color: colors.secondaryText }]}>
              Hexpresso 8 yaş altı çocuklara yönelik değildir:{'\n\n'}
              • 8 yaş altından bilinçli olarak veri toplamayız{'\n'}
              • Böyle bir durumla karşılaştığımızda verileri hemen sileriz{'\n'}
              • Ebeveynler çocuklarının verilerinin silinmesini talep edebilir{'\n'}
              • 8-18 yaş arası kullanıcılar için ebeveyn izni önerilir
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              9. Uluslararası Veri Transferi
            </Text>
            <Text style={[styles.sectionText, { color: colors.secondaryText }]}>
              Verileriniz aşağıdaki durumlarda yurt dışına aktarılabilir:{'\n\n'}
              • Firebase sunucuları (Google Cloud - AB veri merkezleri){'\n'}
              • Google ve Facebook hizmetleri{'\n'}
              • AdMob reklam ağı{'\n\n'}
              Tüm transferler GDPR ve KVKK'ya uygun güvencelerle yapılır.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              10. İletişim ve Şikayet
            </Text>
            <Text style={[styles.sectionText, { color: colors.secondaryText }]}>
              Gizlilik konularında bizimle iletişime geçin:{'\n\n'}
              <Text style={{ fontWeight: '600' }}>📧 E-posta:</Text>{'\n'}
              so38ware@gmail.com{'\n\n'}
                             <Text style={{ fontWeight: '600' }}>📱 Uygulama İçi:</Text>{'\n'}
               Ayarlar {'->'} Gizlilik {'->'} İletişim{'\n\n'}
              <Text style={{ fontWeight: '600' }}>🏛️ Veri Koruma Kurulu:</Text>{'\n'}
              Şikayetlerinizi kvkk.gov.tr adresine iletebilirsiniz{'\n\n'}
              <Text style={{ fontWeight: '600' }}>⏱️ Yanıt Süresi:</Text>{'\n'}
              30 gün içinde yanıtlanacaktır.
            </Text>
          </View>

          <View style={[styles.footerSection, { borderTopColor: colors.border }]}>
            <Text style={[styles.footerText, { color: colors.secondaryText }]}>
              © 2025 Hexpresso - Faruk Tutkus{'\n'}
              Veri Sorumlusu: Faruk Tutkus{'\n'}
              Bu politika düzenli olarak gözden geçirilir.
            </Text>
          </View>
        </Container>
      </ScrollView>
    </View>
  );
};

export default Privacy; 