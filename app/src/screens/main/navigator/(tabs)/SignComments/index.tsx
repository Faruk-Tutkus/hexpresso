import { Banner, useInterstitial } from '@ads'
import { db } from '@api/config.firebase'
import Icon from '@assets/icons'
import { AskAI } from '@components'
import { Ionicons } from '@expo/vector-icons'
import { getDateRangeForPeriod, useFetchData } from '@hooks'
import { useAuth, useTheme, useToast } from '@providers'
import DatePicker from '@react-native-community/datetimepicker'
import { doc, onSnapshot } from 'firebase/firestore'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ActivityIndicator, FlatList, Platform, RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import Animated, { Easing, interpolate, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import styles from './styles'
type PeriodType = 'daily' | 'weekly' | 'monthly' | 'yearly'

interface CommentCard {
  id: string
  type: PeriodType
  title: string
  dateRange: string
  content: string
  icon: string
  isExpanded: boolean
  stars?: {
    hustle: number
    sex: number
    success: number
    vibe: number
  }
  matches?: {
    career: string
    friendship: string
    love: string
  }
}

const SignComments = () => {
  const { colors } = useTheme()
  const { t } = useTranslation()
  const { showToast } = useToast();
  const { user } = useAuth()
  const [selectedSignIndex, setSelectedSignIndex] = useState(0)
  const [commentCards, setCommentCards] = useState<CommentCard[]>([])
  const [expandedCard, setExpandedCard] = useState<string | null>(null)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [showDatePicker, setShowDatePicker] = useState(false)
  const flatListRef = useRef<FlatList>(null)

  // Modern hook yapısı - FetchSeers ile aynı
  const { signs, loading, error, refetch } = useFetchData(user);

  const onRefresh = useCallback(async () => {
    refetch()
    showToast('Veriler güncellendi', 'info');
  }, []);

  const { showInterstitial } = useInterstitial({})

  // Animation values for each card
  const animationValues = {
    daily: useSharedValue(0),
    weekly: useSharedValue(0),
    monthly: useSharedValue(0),
    yearly: useSharedValue(0)
  }

  // Animated styles for daily card
  const dailyCardAnimatedStyle = useAnimatedStyle(() => {
    const maxHeight = interpolate(animationValues.daily.value, [0, 1], [120, 1000])
    return { maxHeight }
  })
  const dailyContentAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(animationValues.daily.value, [0, 0.3, 1], [0, 0, 1])
    return { opacity }
  })

  // Animated styles for weekly card
  const weeklyCardAnimatedStyle = useAnimatedStyle(() => {
    const maxHeight = interpolate(animationValues.weekly.value, [0, 1], [120, 1000])
    return { maxHeight }
  })
  const weeklyContentAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(animationValues.weekly.value, [0, 0.3, 1], [0, 0, 1])
    return { opacity }
  })

  // Animated styles for monthly card
  const monthlyCardAnimatedStyle = useAnimatedStyle(() => {
    const maxHeight = interpolate(animationValues.monthly.value, [0, 1], [120, 1000])
    return { maxHeight }
  })
  const monthlyContentAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(animationValues.monthly.value, [0, 0.3, 1], [0, 0, 1])
    return { opacity }
  })

  // Animated styles for yearly card
  const yearlyCardAnimatedStyle = useAnimatedStyle(() => {
    const maxHeight = interpolate(animationValues.yearly.value, [0, 1], [120, 2500])
    return { maxHeight }
  })
  const yearlyContentAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(animationValues.yearly.value, [0, 0.3, 1], [0, 0, 1])
    return { opacity }
  })

  const getAnimatedStyles = (cardType: PeriodType) => {
    switch (cardType) {
      case 'daily':
        return {
          cardAnimatedStyle: dailyCardAnimatedStyle,
          contentAnimatedStyle: dailyContentAnimatedStyle
        }
      case 'weekly':
        return {
          cardAnimatedStyle: weeklyCardAnimatedStyle,
          contentAnimatedStyle: weeklyContentAnimatedStyle
        }
      case 'monthly':
        return {
          cardAnimatedStyle: monthlyCardAnimatedStyle,
          contentAnimatedStyle: monthlyContentAnimatedStyle
        }
      case 'yearly':
        return {
          cardAnimatedStyle: yearlyCardAnimatedStyle,
          contentAnimatedStyle: yearlyContentAnimatedStyle
        }
      default:
        return {
          cardAnimatedStyle: dailyCardAnimatedStyle,
          contentAnimatedStyle: dailyContentAnimatedStyle
        }
    }
  }

  // Zodiac signs data with their names and icon names for the Icon component
  const zodiacSigns = [
    { name: t('horoscope.aries'), iconName: 'zodiac-aries', index: 0, englishName: 'Aries' },
    { name: t('horoscope.taurus'), iconName: 'zodiac-taurus', index: 1, englishName: 'Taurus' },
    { name: t('horoscope.gemini'), iconName: 'zodiac-gemini', index: 2, englishName: 'Gemini' },
    { name: t('horoscope.cancer'), iconName: 'zodiac-cancer', index: 3, englishName: 'Cancer' },
    { name: t('horoscope.leo'), iconName: 'zodiac-leo', index: 4, englishName: 'Leo' },
    { name: t('horoscope.virgo'), iconName: 'zodiac-virgo', index: 5, englishName: 'Virgo' },
    { name: t('horoscope.libra'), iconName: 'zodiac-libra', index: 6, englishName: 'Libra' },
    { name: t('horoscope.scorpio'), iconName: 'zodiac-scorpio', index: 7, englishName: 'Scorpio' },
    { name: t('horoscope.sagittarius'), iconName: 'zodiac-sagittarius', index: 8, englishName: 'Sagittarius' },
    { name: t('horoscope.capricorn'), iconName: 'zodiac-capricorn', index: 9, englishName: 'Capricorn' },
    { name: t('horoscope.aquarius'), iconName: 'zodiac-aquarius', index: 10, englishName: 'Aquarius' },
    { name: t('horoscope.pisces'), iconName: 'zodiac-pisces', index: 11, englishName: 'Pisces' },
  ]

  // Set initial selected sign based on user's sunSign
  useEffect(() => {
    if (!user) return

    let unsubscribe: (() => void) | null = null

    const setupListener = () => {
      try {
        // Real-time listener for user document changes
        unsubscribe = onSnapshot(doc(db, 'users', user.uid), (docSnapshot) => {
          if (docSnapshot.exists()) {
            const userData = docSnapshot.data()

            if (userData?.sunSign) {
              const userSignIndex = zodiacSigns.findIndex(
                sign => sign.englishName.toLowerCase() === userData.sunSign.toLowerCase()
              )

              if (userSignIndex !== -1) {
                setSelectedSignIndex(userSignIndex)
              }
            }
          }
        }, (error) => {
          console.error('Error listening to user sign:', error)
        })
      } catch (error) {
        console.error('Error setting up listener:', error)
      }
    }

    setupListener()

    // Cleanup listener on unmount
    return () => {
      if (unsubscribe) {
        unsubscribe()
      }
    }
  }, [user])

  // Separate useEffect for scroll to selected sign - çalışır hem ilk yüklemede hem refresh sonrası
  useEffect(() => {
    if (!loading && signs.length > 0 && flatListRef.current) {
      console.log('🎯 ScrollToSign: Seçili burca scroll ediliyor...', selectedSignIndex);

      // Kısa bir delay ile scroll işlemi yap
      const scrollTimer = setTimeout(() => {
        flatListRef.current?.scrollToOffset({
          offset: selectedSignIndex * 130, // 115 (card width) + 15 (separator)
          animated: true
        })
        console.log('✅ ScrollToSign: Scroll işlemi tamamlandı');
      }, 500)

      return () => clearTimeout(scrollTimer)
    }
  }, [selectedSignIndex, loading, signs.length]) // loading false olduğunda ve signs yüklendiğinde scroll et

  useEffect(() => {
    if (signs.length > 0) {
      generateCommentCards()
    }
  }, [signs, selectedSignIndex, currentDate])

  const generateCommentCards = () => {
    if (!signs.length) return

    const today = currentDate.toISOString()
    const todayRange = getDateRangeForPeriod('daily', today)
    const weekRange = getDateRangeForPeriod('weekly', today)
    const monthRange = getDateRangeForPeriod('monthly', today)
    const yearRange = getDateRangeForPeriod('yearly', today)
    // Get current sign data from cache
    const currentSignData = signs[selectedSignIndex]
    if (!currentSignData) return

    // Find matching data from cache
    const dailyData = currentSignData.daily?.find((item: any) => item.date === todayRange)
    const weeklyData = currentSignData.weekly?.find((item: any) => item.date === weekRange)
    const monthlyData = currentSignData.monthly?.find((item: any) => item.date === monthRange)
    const yearlyData = currentSignData.yearly?.find((item: any) => item.date === yearRange)

    const cards: CommentCard[] = [
      {
        id: 'daily',
        type: 'daily',
        title: 'Günlük',
        dateRange: todayRange,
        content: dailyData?.description || 'Günlük yorum bulunamadı.',
        icon: 'sunny',
        isExpanded: false,
        stars: dailyData?.stars,
        matches: dailyData?.matches
      },
      {
        id: 'weekly',
        type: 'weekly',
        title: 'Haftalık',
        dateRange: weekRange,
        content: weeklyData?.description || 'Haftalık yorum bulunamadı.',
        icon: 'calendar',
        isExpanded: false,
        stars: weeklyData?.stars,
        matches: weeklyData?.matches
      },
      {
        id: 'monthly',
        type: 'monthly',
        title: 'Aylık',
        dateRange: monthRange,
        content: monthlyData?.description || 'Aylık yorum bulunamadı.',
        icon: 'moon',
        isExpanded: false,
        stars: monthlyData?.stars,
        matches: monthlyData?.matches
      },
      {
        id: 'yearly',
        type: 'yearly',
        title: 'Yıllık',
        dateRange: yearRange,
        content: yearlyData?.description || 'Yıllık yorum bulunamadı.',
        icon: 'planet',
        isExpanded: false,
        stars: yearlyData?.stars,
        matches: yearlyData?.matches
      }
    ]

    setCommentCards(cards)
  }

  const handleCardPress = (cardId: string) => {
    // Close all other cards
    Object.keys(animationValues).forEach(key => {
      if (key !== cardId) {
        animationValues[key as PeriodType].value = withTiming(0, {
          duration: 1000,
          easing: Easing.out(Easing.quad)
        })
      }
    })

    if (expandedCard === cardId) {
      // Close this card
      setExpandedCard(null)
      animationValues[cardId as PeriodType].value = withTiming(0, {
        duration: 1000,
        easing: Easing.out(Easing.quad)
      })
    } else {
      // Open this card
      setExpandedCard(cardId)
      animationValues[cardId as PeriodType].value = withTiming(1, {
        duration: 1000,
        easing: Easing.out(Easing.quad)
      })
    }
  }
  const [days, setDays] = useState<0 | 1 | 2>(1);
  const goToToday = () => {
    setCurrentDate(new Date())
    setDays(1)
  }

  const navigateDay = (direction: 'prev' | 'next') => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const currentDateCopy = new Date(currentDate)
    currentDateCopy.setHours(0, 0, 0, 0)

    // Calculate days difference from today
    const diffTime = currentDateCopy.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (direction === 'prev') {
      // Check if we can go back more (max 5 days back)
      if (diffDays <= -5) {
        setTimeout(() => {
          const nextDay = new Date(currentDate)
          nextDay.setDate(nextDay.getDate() - 1)
          nextDay.setHours(0, 0, 0, 0)
          setCurrentDate(nextDay)
          setDays(0)
        }, 3000)
        showInterstitial()
        return
      }

      const newDate = new Date(currentDate)
      newDate.setDate(newDate.getDate() - 1)
      setCurrentDate(newDate)
      setDays(0)
    } else if (direction === 'next') {
      // Check if we can go forward more (max 1 day forward)
      if (diffDays >= 1) {
        setTimeout(() => {
          const nextDay = new Date(currentDate)
          nextDay.setDate(nextDay.getDate() + 1)
          nextDay.setHours(0, 0, 0, 0)
          setCurrentDate(nextDay)
          setDays(2)
        }, 3000)
        showInterstitial()
        return
      }

      const nextDay = new Date(currentDate)
      nextDay.setDate(nextDay.getDate() + 1)
      nextDay.setHours(0, 0, 0, 0)

      setCurrentDate(nextDay)
      setDays(2)
    }
  }

  // Handle date selection
  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false)
    if (selectedDate) {
      setCurrentDate(selectedDate)
      if (selectedDate.toDateString() === new Date().toDateString()) {
        setDays(1) // Today
      } else if (selectedDate < new Date()) {
        setDays(0) // Past date
      } else {
        setDays(2) // Future date
      }
    }
  }

  const openDatePicker = () => {
    showInterstitial()
    setTimeout(() => {
      setShowDatePicker(true)
    }, 3000)
  }

  const renderSignCard = ({ item, index }: { item: any, index: number }) => {
    const isSelected = index === selectedSignIndex
    const sign = zodiacSigns[index]

    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          setSelectedSignIndex(index)
          showInterstitial()
        }}
      >
        <View style={[
          styles.signCard,
          {
            backgroundColor: isSelected ? colors.primary + '20' : colors.surface + '30',
            borderColor: isSelected ? colors.primary : colors.border,
            borderRadius: isSelected ? 20 : 0,
            opacity: isSelected ? 1 : 0.7,
            width: 115, // Fixed width for consistent layout
          }
        ]}>
          <Icon
            name={sign.iconName}
            size={40}
            color={isSelected ? colors.primary : colors.text}
            zodiac={true}
          />
          <Text style={[
            styles.signCardText,
            { color: isSelected ? colors.primary : colors.text }
          ]}>
            {sign.name}
          </Text>
        </View>
      </TouchableOpacity>
    )
  }

  const renderCommentCard = ({ item }: { item: CommentCard }) => {
    const isExpanded = expandedCard === item.id
    const { cardAnimatedStyle, contentAnimatedStyle } = getAnimatedStyles(item.type)

    const cardColors = {
      daily: colors.primary,
      weekly: colors.secondary,
      monthly: colors.errorText,
      yearly: colors.surface
    }

    return (
      <Animated.View style={[
        styles.commentCard,
        {
          backgroundColor: cardColors[item.type] + '20',
          overflow: 'hidden'
        },
        cardAnimatedStyle
      ]}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            handleCardPress(item.id)
          }}
          style={styles.commentCardHeader}
        >
          <View style={styles.commentCardHeaderLeft}>
            <View style={[styles.iconContainer, { backgroundColor: cardColors[item.type] + '30' }]}>
              <Ionicons name={item.icon as any} size={24} color={cardColors[item.type]} />
            </View>
            <View>
              <Text style={[styles.commentCardTitle, { color: colors.text }]}>
                {item.title}
              </Text>
              <Text style={[styles.commentCardDate, { color: colors.secondaryText }]}>
                {item.dateRange}
              </Text>
            </View>
          </View>
          <Ionicons
            name={isExpanded ? "chevron-up" : "chevron-down"}
            size={24}
            color={colors.secondaryText}
          />
        </TouchableOpacity>
        <Animated.View style={[styles.commentCardContent, contentAnimatedStyle]}>

          {/* Stars Rating */}
          {item.stars && (
            <View style={styles.starsContainer}>
              <Text style={[styles.starsTitle, { color: colors.text }]}>Yıldızlar</Text>
              <View style={styles.starsGrid}>
                <View style={styles.starItem}>
                  <Text style={[styles.starLabel, { color: colors.text }]}>Enerji</Text>
                  <Text style={[styles.starValue, { color: cardColors[item.type] }]}>{item.stars.hustle}/5</Text>
                </View>
                <View style={styles.starItem}>
                  <Text style={[styles.starLabel, { color: colors.text }]}>Aşk</Text>
                  <Text style={[styles.starValue, { color: cardColors[item.type] }]}>{item.stars.sex}/5</Text>
                </View>
                <View style={styles.starItem}>
                  <Text style={[styles.starLabel, { color: colors.text }]}>Başarı</Text>
                  <Text style={[styles.starValue, { color: cardColors[item.type] }]}>{item.stars.success}/5</Text>
                </View>
                <View style={styles.starItem}>
                  <Text style={[styles.starLabel, { color: colors.text }]}>Ruh hali</Text>
                  <Text style={[styles.starValue, { color: cardColors[item.type] }]}>{item.stars.vibe}/5</Text>
                </View>
              </View>
            </View>
          )}

          {/* Matches */}
          {item.matches && (
            <View style={styles.matchesContainer}>
              <Text style={[styles.matchesTitle, { color: colors.text }]}>Uyumlu Burçlar</Text>
              <View style={styles.matchesGrid}>
                <View style={styles.matchItem}>
                  <Text style={[styles.matchLabel, { color: colors.text }]}>Kariyer</Text>
                  <Text style={[styles.matchValue, { color: cardColors[item.type] }]}>{item.matches.career}</Text>
                </View>
                <View style={styles.matchItem}>
                  <Text style={[styles.matchLabel, { color: colors.text }]}>Arkadaşlık</Text>
                  <Text style={[styles.matchValue, { color: cardColors[item.type] }]}>{item.matches.friendship}</Text>
                </View>
                <View style={styles.matchItem}>
                  <Text style={[styles.matchLabel, { color: colors.text }]}>Aşk</Text>
                  <Text style={[styles.matchValue, { color: cardColors[item.type] }]}>{item.matches.love}</Text>
                </View>
              </View>
            </View>
          )}

          <Text style={[styles.commentText, { color: colors.text }]}>
            {item.content}
          </Text>
        </Animated.View>
      </Animated.View>
    )
  }

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.text }]}>
          Yıldızlardan mesajlar yükleniyor...
        </Text>
      </View>
    )
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
            title="Yorumlar güncelleniyor..."
            titleColor={colors.text}
          />
        }
      >
        {/* AI Assistant Section - Now at the top */}
        <View style={styles.aiSection}>
          <AskAI type="comment" />
        </View>

        <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center' }}>
          <Banner adType='banner' />
        </View>

        {/* Zodiac Signs Horizontal List */}
        <View style={styles.signsSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Burç Seçimi</Text>
          <FlatList
            ref={flatListRef}
            data={zodiacSigns}
            renderItem={renderSignCard}
            keyExtractor={(item, index) => index.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.signsListContainer}
            ItemSeparatorComponent={() => <View style={{ width: 15 }} />}
            getItemLayout={(data, index) => ({
              length: 115, // card width
              offset: 130 * index, // card width + separator
              index,
            })}
            onScrollToIndexFailed={(info) => {
              const wait = new Promise(resolve => setTimeout(resolve, 500));
              wait.then(() => {
                flatListRef.current?.scrollToIndex({
                  index: info.index,
                  animated: true,
                  viewPosition: 0.5
                });
              });
            }}
            removeClippedSubviews={false}
          />
          <View style={styles.dailyNavigation}>
            <TouchableOpacity
              style={[styles.dailyNavButton, { borderColor: colors.border, backgroundColor: days === 0 ? colors.secondary : colors.surface + '30' }]}
              onPress={() => navigateDay('prev')}
            >
              <Icon name="chevron-back" size={20} color={colors.secondaryText} />
              <Text style={[styles.dailyNavText, { color: colors.secondaryText }]}>Dün</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.todayIndicator, { backgroundColor: days === 1 ? colors.secondary : colors.surface + '30' }]}
              onPress={goToToday}
            >
              <Text style={[styles.todayText, { color: colors.text }]}>Bugün</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.dailyNavButton, { borderColor: colors.border, backgroundColor: days === 2 ? colors.secondary : colors.surface + '30' }]}
              onPress={() => navigateDay('next')}
            >
              <Text style={[styles.dailyNavText, { color: colors.secondaryText }]}>Yarın</Text>
              <Icon name="chevron-forward" size={20} color={colors.secondaryText} />
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={openDatePicker} style={styles.datePickerButton}>
            <Text style={[styles.dailyDate, { color: colors.text }]}>{currentDate.toLocaleDateString()}</Text>
            <Icon name="calendar" size={24} color={colors.text} style={{ marginLeft: 6, marginTop: 7 }} />
          </TouchableOpacity>
          {showDatePicker && (
            <DatePicker
              value={currentDate}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={onDateChange}
              minimumDate={new Date(new Date().getFullYear(), 0, 1)}
              maximumDate={new Date(new Date().getFullYear(), 11, 31)}
            // For iOS, the DatePicker is shown inline
            // For Android, it's shown as a modal and automatically dismissed after selection
            />
          )}
        </View>
        {/* Comment Cards */}
        <View style={styles.commentsSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {zodiacSigns[selectedSignIndex].name} yorumları
          </Text>

          <FlatList
            data={commentCards}
            renderItem={renderCommentCard}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            ItemSeparatorComponent={() => <View style={{ height: 15 }} />}
          />
        </View>

        <View style={{ height: 50 }} />
        <Banner adType='interstitial' />
      </ScrollView>
    </View>
  )
}

export default SignComments