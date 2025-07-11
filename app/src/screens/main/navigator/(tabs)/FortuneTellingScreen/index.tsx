import { Banner } from '@ads';
import { SeerCard } from '@components';
import { useFetchSeers, useRandomApiKey } from '@hooks';
import { useAuth, useTheme, useToast } from '@providers';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, Platform, RefreshControl, Text, UIManager, View } from 'react-native';
import Animated, {
  FadeIn,
  FadeInDown,
  LayoutAnimationConfig,
  SlideInRight
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from './styles';

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

// Memoized Header Component
const FortuneTellingHeader = React.memo(() => {
  const { colors } = useTheme();

  return (
    <>
    <Animated.View
      style={[styles.headerContainer, { backgroundColor: colors.secondaryText }]}
      entering={FadeInDown.duration(800).springify()}
    >
      <Text style={[styles.title, { color: colors.background }]}>
        Falcını Seç
      </Text>
      <Text style={[styles.subtitle, { color: colors.background }]}>
        Ruhuna dokunan sesi seç, geleceğini okusun
      </Text>
      <View style={[styles.divider, { backgroundColor: colors.primary }]} />
    </Animated.View>
    <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center' }}>
      <Banner adType='banner' />
    </View>
    </>
  );
});

const FortuneTellingScreen = () => {
  const { user } = useAuth();
  const { seers, loading, error, refetch } = useFetchSeers(user);
  const { colors } = useTheme();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const { showToast } = useToast();
  const toggleCard = useCallback((index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  }, [activeIndex]);
  const randomApiKey = useRandomApiKey();
  console.log(randomApiKey);

  const renderSeerCard = useCallback(({ item, index }: { item: any, index: number }) => (
    <Animated.View
      entering={SlideInRight.delay(index * 100).springify()}
      key={item.id || item.name}
    >
      <SeerCard
        seer={item}
        isExpanded={index === activeIndex}
        onPress={() => toggleCard(index)}
      />
    </Animated.View>
  ), [activeIndex, toggleCard]);

  const renderEmptyComponent = useCallback(() => (
    <Animated.View
      style={styles.emptyContainer}
      entering={FadeIn.delay(300)}
    >
      <View style={styles.emptyAnimation}>
        <Text style={[styles.emptyIcon, { color: colors.primary }]}>🔮</Text>
      </View>
      <Text style={[styles.emptyText, { color: colors.secondaryText }]}>
        Falcı bilgileri bulunamadı
      </Text>
      <Text style={[styles.emptySubtext, { color: colors.secondaryText }]}>
        Lütfen daha sonra tekrar deneyiniz
      </Text>
    </Animated.View>
  ), [colors]);

  const renderErrorComponent = useCallback(() => (
    <Animated.View
      style={styles.errorContainer}
      entering={FadeIn.delay(300)}
    >
      <Text style={[styles.errorText, { color: colors.errorText }]}>
        {error}
      </Text>
    </Animated.View>
  ), [colors, error]);

  // Debug için console log ekle
  React.useEffect(() => {
    console.log('📱 FortuneTellingScreen render edildi');
    console.log('🔍 Mevcut durum:');
    console.log('  - Loading:', loading);
    console.log('  - Error:', error);
    console.log('  - Seers count:', seers.length);
    //console.log('  - Seers data:', seers);
  }, [loading, error, seers]);

  if (loading && seers.length === 0) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <FortuneTellingHeader />
        <Animated.View
          style={styles.loadingContainer}
          entering={FadeIn.duration(500)}
        >
          <View style={styles.loadingAnimation}>
            <Text style={[styles.loadingIcon, { color: colors.primary }]}>✨</Text>
          </View>
          <ActivityIndicator
            size="large"
            color={colors.primary}
            style={styles.loadingIndicator}
          />
          <Text style={[styles.loadingText, { color: colors.secondaryText }]}>
            Falcı bilgileri yükleniyor...
          </Text>
        </Animated.View>
      </SafeAreaView>
    );
  }

  return (
    <LayoutAnimationConfig skipEntering>
      <FlatList
        data={seers}
        keyExtractor={(item) => item.id || item.name}
        renderItem={renderSeerCard}
        ListHeaderComponent={FortuneTellingHeader}
        ListEmptyComponent={error ? renderErrorComponent : renderEmptyComponent}
        contentContainerStyle={[styles.listContent]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={()=> {
              refetch();
              showToast('Veriler güncellendi', 'info');
            }}
            colors={[colors.primary]} 
            tintColor={colors.primary}
            title="Yorumlar güncelleniyor..."
            titleColor={colors.text}
          />
        }
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        removeClippedSubviews={Platform.OS === 'android'}
      />
    </LayoutAnimationConfig>
  );
};

export default FortuneTellingScreen;