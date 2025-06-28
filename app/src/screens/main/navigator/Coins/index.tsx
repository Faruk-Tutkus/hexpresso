import { Banner, Rewarded } from '@ads';
import Icon from '@assets/icons';
import { Modal as AppModal, CustomButton } from '@components';
import { Task, useAITaskValidator, useTaskManager } from '@hooks';
import { useTheme, useToast } from '@providers';
import Clipboard from '@react-native-clipboard/clipboard';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Linking,
  Modal,
  RefreshControl,
  ScrollView,
  Share,
  Text,
  View
} from 'react-native';
import styles from './styles';

const Coins = () => {
  const { colors, isDark } = useTheme();
  const { showToast } = useToast();
  const [showInstructions, setShowInstructions] = useState(false);
  const [referralCode] = useState('HEXP2024');
  const [selectedTaskForValidation, setSelectedTaskForValidation] = useState<Task | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  
  // Modal states
  const [modalVisible, setModalVisible] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    title: '',
    message: '',
    confirmText: '',
    onConfirm: () => {},
    iconName: 'checkmark-circle' as any
  });

  // Task Manager Hook'u kullan
  const {
    tasks,
    userCoins,
    loading,
    error,
    completedTasks,
    totalTasks,
    progress,
    completeTask,
    addCoins,
    refreshTasks
  } = useTaskManager();

  // AI Task Validator Hook'u kullan
  const {
    validateTask,
    loading: aiLoading,
    error: aiError
  } = useAITaskValidator();

  // Pull to refresh handler
  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await refreshTasks();
      showToast('Veriler yenilendi!', 'success');
    } catch (error) {
      showToast('Yenileme sırasında hata oluştu', 'error');
    } finally {
      setRefreshing(false);
    }
  };

  // Loading durumu
  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.headerSubtitle, { color: colors.text, marginTop: 10 }]}>
          Yükleniyor...
        </Text>
      </View>
    );
  }

  // Error durumu
  if (error) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center', padding: 20 }]}>
        <Icon name="alert-circle" size={48} color={colors.errorBorder} />
        <Text style={[styles.headerTitle, { color: colors.errorText, textAlign: 'center', marginTop: 20 }]}>
          Hata Oluştu
        </Text>
        <Text style={[styles.headerSubtitle, { color: colors.text, textAlign: 'center', marginTop: 10 }]}>
          {error}
        </Text>
        <CustomButton
          title="Tekrar Dene"
          onPress={onRefresh}
          variant="primary"
          size="medium"
          leftIcon="refresh"
          loading={refreshing}
          contentStyle={{ marginTop: 20 }}
        />
      </View>
    );
  }

  const showModal = (title: string, message: string, confirmText: string, onConfirm: () => void, iconName: any = 'checkmark-circle') => {
    setModalConfig({ title, message, confirmText, onConfirm, iconName });
    setModalVisible(true);
  };

  // AI ile task doğrulama
  const handleAIValidation = async (task: Task) => {
    console.log('AI Validation started for task:', task.id);
    showToast('🤖 AI doğrulama başlatılıyor... Lütfen ekran görüntünüzü seçin.', 'success');
    setSelectedTaskForValidation(task);
    
    try {
      // Permission kontrolü
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (permissionResult.granted === false) {
        showModal(
          'İzin Gerekli',
          'Fotoğraf seçmek için galeri izni gereklidir. Lütfen ayarlardan izin verin.',
          'Anladım',
          () => setModalVisible(false),
          'lock-closed'
        );
        setSelectedTaskForValidation(null);
        return;
      }

      // Image picker açma
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        base64: true,
      });

      console.log('Image picker result:', result);

      if (result.canceled) {
        console.log('Image picker cancelled');
        setSelectedTaskForValidation(null);
        return;
      }

      if (result.assets && result.assets[0] && result.assets[0].base64) {
        const base64Image = result.assets[0].base64;
        console.log('Base64 image received, length:', base64Image.length);
        
        showToast('🧠 AI görsel analizi devam ediyor...', 'info');
        
        try {
          console.log('Starting AI validation...');
          const validationResult = await validateTask(
            base64Image,
            task.id as any,
            task.description
          );

          console.log('AI validation result:', validationResult);

          if (validationResult.success && validationResult.result) {
            if (validationResult.result.isDone) {
              // AI doğrulama başarılı - görevi tamamla
              const success = await completeTask(task.id);
              if (success) {
                showToast(`🎉 AI doğruladı! ${task.reward} coin kazandınız!`, 'success');
                showModal(
                  'Görev Doğrulandı! 🎉',
                  `Yapay zeka ekran görüntünüzü analiz etti ve görevinizi başarıyla tamamladığınızı doğruladı!\n\n+${task.reward} coin kazandınız!`,
                  'Harika!',
                  () => setModalVisible(false),
                  'trophy'
                );
              }
            } else {
              // AI doğrulama başarısız
              showModal(
                'Görev Doğrulanamadı ❌',
                'AI analizi görevinizi henüz tamamlamadığınızı gösteriyor. Lütfen:\n\n• Doğru ekran görüntüsünü paylaştığınızdan emin olun\n• Görevin tam olarak tamamlandığını kontrol edin\n• Tekrar deneyin',
                'Tekrar Dene',
                () => {
                  setModalVisible(false);
                  setTimeout(() => handleAIValidation(task), 500);
                },
                'close-circle'
              );
            }
          } else {
            // AI hata
            console.error('AI validation error:', validationResult.error);
            showToast(validationResult.error || 'AI doğrulama hatası', 'error');
            showModal(
              'Doğrulama Hatası',
              'AI analizi sırasında bir hata oluştu. Lütfen tekrar deneyin.',
              'Tekrar Dene',
              () => {
                setModalVisible(false);
                setTimeout(() => handleAIValidation(task), 500);
              },
              'warning'
            );
          }
        } catch (err) {
          console.error('AI validation error:', err);
          showToast('AI doğrulama sırasında hata oluştu', 'error');
        }
      } else {
        console.log('No base64 image in response');
        showToast('Geçerli bir görsel seçilmedi', 'error');
      }
      
    } catch (error) {
      console.error('Image picker error:', error);
      showToast('Görsel seçimi sırasında hata oluştu', 'error');
    } finally {
      setSelectedTaskForValidation(null);
    }
  };

  const openSocialMedia = async (task: Task) => {
    if (task.url) {
      try {
        await Linking.openURL(task.url);
        // Sosyal medya açıldıktan sonra sadece AI doğrulama seçeneği sun
        setTimeout(() => {
          showModal(
            'Görevi Tamamladın mı?',
            `${task.title} görevini tamamladıysan ekran görüntüsü paylaşarak AI ile doğrulat!`,
            'AI ile Doğrula',
            () => {
              setModalVisible(false);
              setTimeout(() => handleAIValidation(task), 500);
            },
            'camera'
          );
        }, 3000);
      } catch (error) {
        showToast('Link açılamadı', 'error');
      }
    }
  };

  const shareFacebook = async () => {
    const facebookUrl = 'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent('https://hexpresso.app') + '&quote=' + encodeURIComponent('🌟 Hexpresso ile günlük burç yorumlarımı takip ediyorum! Astroloji ve burç yorumları için harika bir uygulama. Sen de dene! 🔮✨');
    
    try {
      await Linking.openURL(facebookUrl);
      const facebookTask = tasks.find(t => t.id === 'facebook_share');
      if (facebookTask) {
        setTimeout(() => {
          showModal(
            'Facebook\'ta Paylaştın mı?',
            'Paylaşımı yaptıysan AI ile doğrulat!',
            'AI ile Doğrula',
            () => {
              setModalVisible(false);
              setTimeout(() => handleAIValidation(facebookTask), 500);
            },
            'camera'
          );
        }, 2000);
      }
    } catch (error) {
      showToast('Facebook açılamadı', 'error');
    }
  };

  const shareStory = () => {
    setShowInstructions(true);
  };

  const shareTweet = async () => {
    const tweetText = '🌟 Hexpresso ile günlük burç yorumlarımı okuyorum! Gelecekteki planlarım için harika ipuçları alıyorum. Sen de dene! 🔮✨ #Hexpresso #Burç #Astroloji';
    const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;
    
    try {
      await Linking.openURL(tweetUrl);
      const tweetTask = tasks.find(t => t.id === 'twitter_tweet');
      if (tweetTask) {
        setTimeout(() => {
          showModal(
            'Tweet Paylaştın mı?',
            'Tweet\'i attıysan AI ile doğrulat!',
            'AI ile Doğrula',
            () => {
              setModalVisible(false);
              setTimeout(() => handleAIValidation(tweetTask), 500);
            },
            'camera'
          );
        }, 2000);
      }
    } catch (error) {
      showToast('Twitter açılamadı', 'error');
    }
  };

  const copyReferralCode = async () => {
    await Clipboard.setString(referralCode);
    showToast('Referans kodu kopyalandı!', 'success');
  };

  const shareReferralCode = async () => {
    try {
      await Share.share({
        message: `🌟 Hexpresso uygulamasını denemelisin! Günlük burç yorumları ve kişisel astroloji rehberi. Referans kodum: ${referralCode} - Bu kodla kayıt ol, ikimiz de bonus coin kazanalım! 🔮✨`
      });
      setTimeout(() => {
        showModal(
          'Referans Paylaştın mı?',
          'Arkadaşın bu kodla kayıt olduğunda 200 coin kazanacaksın!',
          'Anladım',
          () => setModalVisible(false),
          'people'
        );
      }, 1000);
    } catch (error) {
      console.log('Share error:', error);
    }
  };

  const getActionButtonText = (task: Task) => {
    switch (task.type) {
      case 'social':
        if (task.platform === 'facebook') return 'Paylaş';
        return 'Takip Et';
      case 'story':
        return 'Paylaş';
      case 'tweet':
        return 'Tweet At';
      default:
        return 'Başlat';
    }
  };

  const handleTaskAction = (task: Task) => {
    switch (task.type) {
      case 'social':
        if (task.platform === 'facebook') {
          shareFacebook();
        } else {
          openSocialMedia(task);
        }
        break;
      case 'story':
        shareStory();
        break;
      case 'tweet':
        shareTweet();
        break;
    }
  };

  const renderTaskCard = (task: Task) => (
    <View
      key={task.id}
      style={[
        styles.taskCard,
        { borderColor: colors.border, borderWidth: 1 }
      ]}
    >
      <View style={styles.taskHeader}>
        <View style={[
          styles.taskIconContainer,
          { backgroundColor: task.completed ? colors.secondary : colors.primary }
        ]}>
          <Icon
            name={task.completed ? 'checkmark' : task.icon || 'star'}
            size={24}
            color={colors.background}
          />
        </View>
        
        <View style={styles.taskInfo}>
          <Text style={[styles.taskTitle, { color: colors.text }]}>
            {task.title}
          </Text>
          <Text style={[styles.taskDescription, { color: colors.text }]}>
            {task.description}
          </Text>
          <View style={styles.taskReward}>
            <Image
              source={require('@assets/image/coin_one.png')}
              style={styles.rewardCoin}
            />
            <Text style={[styles.rewardText, { color: colors.secondary }]}>
              +{task.reward}
            </Text>
          </View>
        </View>
      </View>

      {!task.completed && (
        <View style={styles.taskActions}>
          <CustomButton
            title={getActionButtonText(task)}
            onPress={() => handleTaskAction(task)}
            variant="primary"
            size="small"
            leftIcon={task.icon || 'star'}
            contentStyle={[styles.actionButton, { backgroundColor: colors.primary }]}
          />
          
          {/* AI Doğrulama Butonu */}
          <CustomButton
            title="AI Doğrula"
            onPress={() => {
              console.log('🤖 AI Validation button pressed for task:', task.id, task.title);
              handleAIValidation(task);
            }}
            variant="secondary"
            size="small"
            leftIcon="camera"
            loading={aiLoading && selectedTaskForValidation?.id === task.id}
            disabled={aiLoading && selectedTaskForValidation?.id === task.id}
            contentStyle={[styles.actionButton, { backgroundColor: colors.secondary }]}
          />
        </View>
      )}

      {task.completed && (
        <Text style={[styles.completedText, { color: colors.text }]}>
          ✓ Görev tamamlandı
        </Text>
      )}
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView 
        style={styles.container} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary, colors.secondary]}
            tintColor={colors.primary}
            title="Yenileniyor..."
            titleColor={colors.text}
          />
        }
      >
        <View style={styles.scrollContainer}>
          
          {/* Header */}
          <View style={[styles.header, { backgroundColor: colors.secondaryText }]}>
            <Text style={[styles.headerTitle, { color: colors.background }]}>
              Coin Kazan
            </Text>
            <Text style={[styles.headerSubtitle, { color: colors.background }]}>
              Görevleri tamamla, AI ile doğrula, coin kazan!
            </Text>
            <View style={styles.coinContainer}>
              <Image
                source={require('@assets/image/coin_one.png')}
                style={styles.coinImage}
              />
              <Text style={[styles.coinBalance, { color: colors.background }]}>
                {userCoins}
              </Text>
            </View>
          </View>

          {/* Progress */}
          <View style={styles.progressContainer}>
            <Text style={[styles.progressText, { color: colors.text }]}>
              İlerleme: {completedTasks}/{totalTasks} görev tamamlandı
            </Text>
            <View style={[styles.progressBar, { backgroundColor: colors.border }]}>
              <View
                style={[
                  styles.progressFill,
                  { backgroundColor: colors.secondary, width: `${progress}%` }
                ]}
              />
            </View>
          </View>

          {/* Task Cards */}
          {tasks.map(renderTaskCard)}

          {/* Referral Card */}
          <View style={[
            styles.referralCard,
            { borderColor: colors.border, borderWidth: 1 }
          ]}>
            <Text style={[styles.referralTitle, { color: colors.text }]}>
              🎁 Arkadaş Davet Et
            </Text>
            <Text style={[styles.referralDescription, { color: colors.text }]}>
              Arkadaşlarını davet et, her davet için 200 coin kazan!
            </Text>
            
            <View style={[
              styles.referralCodeContainer,
              { borderColor: colors.primary }
            ]}>
              <Text style={[styles.referralCode, { color: colors.primary }]}>
                {referralCode}
              </Text>
            </View>

            <View style={styles.referralActions}>
              <CustomButton
                title="Kopyala"
                onPress={copyReferralCode}
                variant="primary"
                size="small"
                leftIcon="copy"
                contentStyle={[styles.referralButton, { backgroundColor: colors.primary }]}
              />
              
              <CustomButton
                title="Paylaş"
                onPress={shareReferralCode}
                variant="third"
                size="small"
                leftIcon="share"
                contentStyle={[styles.referralButton, { backgroundColor: colors.secondary }]}
              />
            </View>
          </View>

          {/* Ads */}
          <Banner adType='banner' />
          <Rewarded rewardedType='high' />
          
        </View>
      </ScrollView>

      {/* Instructions Modal */}
      <Modal
        visible={showInstructions}
        transparent
        animationType="fade"
        onRequestClose={() => setShowInstructions(false)}
      >
        <View style={styles.instructionModal}>
          <View style={[
            styles.instructionContent,
            { backgroundColor: isDark ? colors.surface : '#FFFFFF' }
          ]}>
            <Text style={[styles.instructionTitle, { color: colors.text }]}>
              📸 Instagram Story Paylaşımı
            </Text>
            
            <View style={styles.instructionStep}>
              <View style={[styles.stepNumber, { backgroundColor: colors.primary }]}>
                <Text style={[styles.stepNumberText, { color: colors.background }]}>1</Text>
              </View>
              <Text style={[styles.stepText, { color: colors.text }]}>
                Aşağıdaki resmi telefonuna kaydet
              </Text>
            </View>

            <Image
              source={require('@assets/image/floatingImage.png')}
              style={styles.instructionImage}
              resizeMode="cover"
            />

            <View style={styles.instructionStep}>
              <View style={[styles.stepNumber, { backgroundColor: colors.primary }]}>
                <Text style={[styles.stepNumberText, { color: colors.background }]}>2</Text>
              </View>
              <Text style={[styles.stepText, { color: colors.text }]}>
                Instagram'da story'ye ekle ve paylaş
              </Text>
            </View>

            <View style={styles.instructionStep}>
              <View style={[styles.stepNumber, { backgroundColor: colors.primary }]}>
                <Text style={[styles.stepNumberText, { color: colors.background }]}>3</Text>
              </View>
              <Text style={[styles.stepText, { color: colors.text }]}>
                Story paylaştıktan sonra AI ile doğrulat!
              </Text>
            </View>

            <CustomButton
              title="Anladım, Paylaştım!"
              onPress={() => {
                setShowInstructions(false);
                const storyTask = tasks.find(t => t.id === 'instagram_story');
                if (storyTask) {
                  setTimeout(() => {
                    showModal(
                      'Story Paylaştın mı?',
                      'Instagram story\'nde paylaştıysan AI ile doğrulat!',
                      'AI ile Doğrula',
                      () => {
                        setModalVisible(false);
                        setTimeout(() => handleAIValidation(storyTask), 500);
                      },
                      'camera'
                    );
                  }, 500);
                }
              }}
              variant="third"
              size="medium"
              contentStyle={[styles.closeInstructionButton, { backgroundColor: colors.secondary }]}
            />
          </View>
        </View>
      </Modal>

      {/* AI Validation Result Modal */}
      <AppModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onConfirm={modalConfig.onConfirm}
        title={modalConfig.title}
        message={modalConfig.message}
        confirmText={modalConfig.confirmText}
        cancelText="İptal"
        iconName={modalConfig.iconName}
      />
    </View>
  );
};

export default Coins;