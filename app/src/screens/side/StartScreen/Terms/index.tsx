import { Container } from '@components';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@providers';
import { router } from 'expo-router';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import styles from './styles';

const Terms = () => {
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
          Kullanım Şartları
        </Text>
        <View style={styles.placeholder} />
      </View>
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Container style={[styles.content, { backgroundColor: colors.background }]}>
          <Text style={[styles.lastUpdated, { color: colors.secondaryText }]}>
            Son Güncelleme: 29 Haziran 2025
          </Text>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              1. Hizmet Tanımı
            </Text>
            <Text style={[styles.sectionText, { color: colors.secondaryText }]}>
              Hexpresso, kişiselleştirilmiş astroloji deneyimi sunan bir mobil uygulamadır. Uygulamamız aşağıdaki hizmetleri sağlar:{'\n\n'}
              • Günlük, haftalık ve aylık burç yorumları{'\n'}
              • Kişisel astroloji haritası (güneş, ay, yükselen burç analizi){'\n'}
              • Tarot ve fal okuma deneyimleri{'\n'}
              • Coin sistemi ile premium içerik erişimi{'\n'}
              • AI destekli kişisel rehberlik{'\n\n'}
              Tüm içeriklerimiz eğlence ve kişisel gelişim amaçlıdır.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              2. Kullanıcı Kabul Şartları
            </Text>
            <Text style={[styles.sectionText, { color: colors.secondaryText }]}>
              Bu uygulamayı indirip kullanarak:{'\n\n'}
              • 8 yaşından büyük olduğunuzu beyan edersiniz{'\n'}
              • Bu şartları ve Gizlilik Politikamızı kabul edersiniz{'\n'}
              • Doğru ve güncel bilgiler sağlamayı taahhüt edersiniz{'\n'}
              • Uygulamayı yasa dışı amaçlarla kullanmayacağınızı garanti edersiniz
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              3. Hesap Güvenliği ve Sorumluluklar
            </Text>
            <Text style={[styles.sectionText, { color: colors.secondaryText }]}>
              Kullanıcı olarak şunları taahhüt edersiniz:{'\n\n'}
              • Hesap bilgilerinizi güvende tutmak{'\n'}
              • Başkalarının hesaplarına yetkisiz erişim sağlamamak{'\n'}
              • Spam, taciz veya zararlı içerik paylaşmamak{'\n'}
              • Telif haklarına saygı göstermek{'\n'}
              • Uygulamanın teknik altyapısına zarar vermemek
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              4. Coin Sistemi ve Satın Alımlar
            </Text>
            <Text style={[styles.sectionText, { color: colors.secondaryText }]}>
              Hexpresso'da coin sistemi bulunmaktadır:{'\n\n'}
              • Coinler premium içeriklere erişim sağlar{'\n'}
              • Reklam izleyerek veya satın alarak coin kazanabilirsiniz{'\n'}
              • Satın alımlar Google Play/App Store şartlarına tabidir{'\n'}
              • İade politikası platform şartlarına uygun olarak uygulanır{'\n'}
              • Coinlerin nakde çevrilmesi mümkün değildir
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              5. İçerik ve Sorumluluk Reddi
            </Text>
            <Text style={[styles.sectionText, { color: colors.secondaryText }]}>
              ÖNEMLİ UYARI: Hexpresso'daki tüm astroloji içerikleri:{'\n\n'}
              • Eğlence, kişisel gelişim ve rehberlik amaçlıdır{'\n'}
              • Tıbbi, hukuki veya finansal tavsiye değildir{'\n'}
              • Bilimsel kesinlik iddiası taşımaz{'\n'}
              • Önemli kararlar almadan önce uzman görüşü alınmalıdır{'\n\n'}
              Uygulama geliştiricileri, içeriklerden kaynaklı herhangi bir zarar, kayıp veya olumsuz sonuçtan sorumlu değildir.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              6. Fikri Mülkiyet Hakları
            </Text>
            <Text style={[styles.sectionText, { color: colors.secondaryText }]}>
              Hexpresso uygulamasında bulunan:{'\n\n'}
              • Tüm tasarım, logo ve görseller{'\n'}
              • Yazılım kodu ve algoritma{'\n'}
              • Astroloji içerikleri ve yorumları{'\n'}
              • Marka adı ve kimlik unsurları{'\n\n'}
              Faruk Tutkus ve/veya lisans verenlere aittir. İzinsiz kullanım, kopyalama veya dağıtım yasaktır.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              7. Hizmet Kesintileri ve Değişiklikler
            </Text>
            <Text style={[styles.sectionText, { color: colors.secondaryText }]}>
              Hexpresso rezerv hakları:{'\n\n'}
              • Hizmeti geçici veya kalıcı olarak durdurma{'\n'}
              • Uygulamanın özelliklerini değiştirme veya güncelleme{'\n'}
              • Bu şartları önceden bildirimle revize etme{'\n'}
              • Kullanıcı hesaplarını kötüye kullanım durumunda askıya alma{'\n\n'}
              Kritik değişiklikler uygulama içinde duyurulacaktır.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              8. Şikayetler ve İletişim
            </Text>
            <Text style={[styles.sectionText, { color: colors.secondaryText }]}>
              Sorularınız, şikayetleriniz veya önerileriniz için:{'\n\n'}
              📧 Email: support@hexpresso.com{'\n'}
              📱 Uygulama içi destek sistemi{'\n'}
              🌐 Web: www.hexpresso.com{'\n\n'}
              Şikayetleriniz 7 iş günü içinde yanıtlanacaktır.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              9. Geçerlilik ve Yürürlük
            </Text>
            <Text style={[styles.sectionText, { color: colors.secondaryText }]}>
              • Bu şartlar Türkiye Cumhuriyeti yasalarına tabi olup, İstanbul mahkemeleri yetkilidir{'\n'}
              • Şartların herhangi bir maddesi geçersiz olsa bile, diğer maddeler geçerliliğini korur{'\n'}
              • Bu döküman Türkçe olarak hazırlanmış olup, çeviriler sadece bilgilendirme amaçlıdır{'\n'}
              • Güncel şartlara her zaman uygulama içinden erişebilirsiniz
            </Text>
          </View>

          <View style={[styles.footerSection, { borderTopColor: colors.border }]}>
            <Text style={[styles.footerText, { color: colors.secondaryText }]}>
              © 2024 Hexpresso - Faruk Tutkus{'\n'}
              Tüm hakları saklıdır.
            </Text>
          </View>
        </Container>
      </ScrollView>
    </View>
  );
};

export default Terms; 