import { Banner } from '@ads'
import { Ionicons } from '@expo/vector-icons'
import { useTheme } from '@providers'
import { Image } from 'expo-image'
import { useLocalSearchParams } from 'expo-router'
import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ActivityIndicator, Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import loadCache from 'src/hooks/LoadCache'
import styles from './styles'

const Signs = () => {
  const { colors } = useTheme()
  const { t } = useTranslation()
  const { signIndex } = useLocalSearchParams()
  const [modalVisible, setModalVisible] = useState(false)
  const [modalContent, setModalContent] = useState<{ title: string, content: string, items: any[], type: string, icon: string }>({ title: '', content: '', items: [], type: 'text', icon: 'information-circle' })
  const [signs, setSigns] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const scrollViewRef = useRef<ScrollView>(null)

  useEffect(() => {
    loadCache({ id: 'signs_data', setSigns, setLoading });
  }, [])

  const data = signs[parseInt(signIndex as string)]?.info || {}
  const signName = getSignName(parseInt(signIndex as string))

  function getSignName(index: number) {
    const signNames = [
      t('horoscope.aquarius'),   // 0
      t('horoscope.aries'),      // 1  
      t('horoscope.cancer'),     // 2
      t('horoscope.capricorn'),  // 3
      t('horoscope.gemini'),     // 4
      t('horoscope.leo'),        // 5
      t('horoscope.libra'),      // 6
      t('horoscope.pisces'),     // 7
      t('horoscope.sagittarius'), // 8
      t('horoscope.scorpio'),    // 9
      t('horoscope.taurus'),     // 10
      t('horoscope.virgo'),      // 11
    ]
    return signNames[index] || 'Burç'
  }

  // Get sign image based on index
  const getSignImage = (index: string) => {
    const imageMap: { [key: string]: any } = {
      '0': require('@assets/image/aquarius.svg'),     // Aquarius
      '1': require('@assets/image/aries.svg'),        // Aries
      '2': require('@assets/image/cancer.svg'),       // Cancer
      '3': require('@assets/image/capricorn.svg'),    // Capricorn
      '4': require('@assets/image/gemini.svg'),       // Gemini
      '5': require('@assets/image/leo.svg'),          // Leo
      '6': require('@assets/image/libra.svg'),        // Libra
      '7': require('@assets/image/pisces.svg'),       // Pisces
      '8': require('@assets/image/sagittarius.svg'),  // Sagittarius
      '9': require('@assets/image/scorpio.svg'),      // Scorpio
      '10': require('@assets/image/taurus.svg'),      // Taurus
      '11': require('@assets/image/virgo.svg'),       // Virgo
    }
    return imageMap[index] || require('@assets/image/aquarius.svg')
  }

  const openModal = (title: string, content: string, icon: string = 'information-circle', items: any[] = [], type: string = 'text') => {
    setModalContent({ title, content, items, type, icon })
    setModalVisible(true)
  }

  const closeModal = () => {
    setModalVisible(false)
  }

  const InfoCard = ({ title, content, icon, backgroundColor }: any) => (
    <TouchableOpacity
      style={[styles.infoCard, { backgroundColor: backgroundColor || colors.surface + '20', marginBottom: title === 'Ruh Eşi' ? -25 : 20 }]}
      onPress={() => openModal(title, content, icon)}
      activeOpacity={0.7}
    >
      <View style={styles.cardHeader}>
        {icon && <Ionicons name={icon} size={24} color={colors.text} />}
        <Text style={[styles.cardTitle, { color: colors.text }]}>{title}</Text>
      </View>
      <Text style={[styles.cardContent, { color: colors.text }]} numberOfLines={4}>
        {content?.length > 200 ? content.substring(0, 200) + '...' : content}
      </Text>
    </TouchableOpacity>
  )

  const GridCard = ({ title, items, icon, backgroundColor }: any) => (
    <TouchableOpacity
      style={[styles.gridCard, { backgroundColor: backgroundColor || colors.surface + '20' }]}
      onPress={() => openModal(title, '', icon, items, 'list')}
      activeOpacity={0.7}
    >
      <View style={styles.cardHeader}>
        {icon && <Ionicons name={icon} size={24} color={colors.text} />}
        <Text style={[styles.cardTitle, { color: colors.text }]}>{title}</Text>
      </View>
      <View style={styles.gridContainer}>
        {items?.slice(0, 6).map((item: string, index: number) => (
          <View key={index} style={[styles.gridItem, { backgroundColor: colors.primary + '30' }]}>
            <Text style={[styles.gridItemText, { color: colors.text }]}>{item}</Text>
          </View>
        ))}
        {items?.length > 6 && (
          <View style={[styles.gridItem, { backgroundColor: colors.primary + '50' }]}>
            <Text style={[styles.gridItemText, { color: colors.text }]}>+{items.length - 6} daha</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  )

  const CareerCard = ({ careers }: any) => (
    <TouchableOpacity
      style={[styles.careerCard, { backgroundColor: colors.secondary + '20' }]}
      onPress={() => openModal('Kariyer', '', 'briefcase', careers?.key, 'careers')}
      activeOpacity={0.7}
    >
      <View style={styles.cardHeader}>
        <Ionicons name="briefcase" size={24} color={colors.text} />
        <Text style={[styles.cardTitle, { color: colors.text }]}>Kariyer</Text>
      </View>
      <View style={styles.careerGrid}>
        {careers?.key?.slice(0, 4).map((career: string, index: number) => (
          <View key={index} style={[styles.careerItem, { backgroundColor: colors.secondary + '40' }]}>
            <Ionicons name="star" size={20} color={colors.text} />
            <Text style={[styles.careerText, { color: colors.text }]}>{career ? career.length > 30 ? career.substring(0, 30) + '...' : career : ''}</Text>
          </View>
        ))}
        {careers?.key?.length > 4 && (
          <View style={[styles.careerItem, { backgroundColor: colors.secondary + '60' }]}>
            <Ionicons name="add" size={20} color={colors.text} />
            <Text style={[styles.careerText, { color: colors.text }]}>+{careers.key.length - 4} daha</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  )

  const FamousCard = ({ famous }: any) => (
    <TouchableOpacity
      style={[styles.famousCard, { backgroundColor: colors.primary + '20' }]}
      onPress={() => openModal('Ünlüler', '', 'star', famous?.key, 'famous')}
      activeOpacity={0.7}
    >
      <View style={styles.cardHeader}>
        <Ionicons name="star" size={24} color={colors.text} />
        <Text style={[styles.cardTitle, { color: colors.text }]}>Ünlüler</Text>
      </View>

      <View style={styles.famousGrid}>
        {famous?.key?.slice(0, 4).map((person: string, index: number) => (
          <View key={index} style={[styles.famousItem, { backgroundColor: colors.background }]}>
            <View style={[styles.famousAvatar, { backgroundColor: colors.primary }]}>
              <Text style={[styles.famousInitial, { color: colors.background }]}>
                {person.split(' ').map(n => n[0]).join('')}
              </Text>
            </View>
            <Text style={[styles.famousName, { color: colors.text }]}>{person}</Text>
          </View>
        ))}
      </View>
      {famous?.key?.length > 4 && (
        <Text style={[styles.moreText, { color: colors.text }]}>
          +{famous.key.length - 4} kişi daha
        </Text>
      )}
    </TouchableOpacity>
  )

  const HalfCard = ({ title, content, icon, backgroundColor, onPress }: any) => (
    <TouchableOpacity
      style={[styles.halfCard, { backgroundColor }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.cardHeader}>
        <Ionicons name={icon} size={20} color={colors.text} />
        <Text style={[styles.smallCardTitle, { color: colors.text }]}>{title}</Text>
      </View>
      <Text style={[styles.smallCardContent, { color: colors.text }]} numberOfLines={4}>
        {title === 'ELEMENT'
          ? content
          : (content?.length > 150 ? content.substring(0, 150) + '...' : content)
        }
      </Text>
    </TouchableOpacity>
  )

  const renderModalContent = () => {
    if (modalContent.type === 'text') {
      return (
        <Text style={[styles.modalText, { color: colors.text }]}>
          {modalContent.content}
        </Text>
      )
    } else if (modalContent.type === 'list') {
      return (
        <View style={styles.modalList}>
          {modalContent.items.map((item: string, index: number) => (
            <View key={index} style={[styles.modalListItem, { borderBottomColor: colors.border }]}>
              <View style={[styles.modalListBullet, { backgroundColor: colors.primary }]} />
              <Text style={[styles.modalListText, { color: colors.text }]}>{item}</Text>
            </View>
          ))}
        </View>
      )
    } else if (modalContent.type === 'careers') {
      return (
        <View style={styles.modalCareerList}>
          {modalContent.items.map((career: string, index: number) => (
            <View key={index} style={[styles.modalCareerItem, { backgroundColor: colors.secondary + '20' }]}>
              <Ionicons name="star" size={20} color={colors.secondary} />
              <Text style={[styles.modalCareerText, { color: colors.text }]}>{career}</Text>
            </View>
          ))}
        </View>
      )
    } else if (modalContent.type === 'famous') {
      return (
        <View style={styles.modalFamousList}>
          {modalContent.items.map((person: string, index: number) => (
            <View key={index} style={[styles.modalFamousItem, { backgroundColor: colors.primary + '15' }]}>
              <View style={[styles.modalFamousAvatar, { backgroundColor: colors.primary }]}>
                <Text style={[styles.modalFamousInitial, { color: colors.background }]}>
                  {person.split(' ').map(n => n[0]).join('')}
                </Text>
              </View>
              <Text style={[styles.modalFamousText, { color: colors.text }]}>{person}</Text>
            </View>
          ))}
        </View>
      )
    }
  }

  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ x: 0, y: 0, animated: true })
    }
  }, [signIndex])

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <Image
          source={getSignImage(signIndex as string)}
          style={styles.loadingImage}
          tintColor={colors.primary}
          contentFit="contain"
        />
        <ActivityIndicator size="large" color={colors.primary} style={styles.loadingIndicator} />
        <Text style={[styles.loadingText, { color: colors.text }]}>Burç bilgileri yükleniyor...</Text>
      </View>
    )
  }

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]}
      contentOffset={{ x: 0, y: 0 }}
      ref={scrollViewRef}
    >
      {/* Header Section */}
      <View style={[styles.header, { backgroundColor: colors.secondaryText }]}>
        <Image
          source={getSignImage(signIndex as string)}
          style={styles.signImage}
          tintColor={colors.background}
          contentFit="contain"
        />
        <Text style={[styles.signName, { color: colors.background }]}>
          {signName.toUpperCase()}
        </Text>
        <Text style={[styles.signDates, { color: colors.background }]}>{data.dates}</Text>
      </View>
      <Banner adType='banner' />
      {/* About Section */}
      <InfoCard
        title="Hakkında"
        content={data.about}
        icon="information-circle"
        backgroundColor={colors.surface + '20'}
      />

      {/* Two Column Layout */}
      <View style={styles.twoColumnContainer}>
        <HalfCard
          title="Çekim"
          content={data.attracted}
          icon="heart"
          backgroundColor={colors.secondary + '20'}
          onPress={() => openModal('Çekim', data.attracted, 'heart')}
        />

        <HalfCard
          title="DÜŞMANLAR"
          content={data.enemy}
          icon="warning"
          backgroundColor={'#E23642' + '20'}
          onPress={() => openModal('Düşmanlar', data.enemy, 'warning')}
        />
      </View>
      <Banner adType='banner' />
      {/* Careers Section */}
      <CareerCard careers={data.careers} />

      {/* Famous People */}
      <FamousCard famous={data.famous} />
      <Banner adType='banner' />
      {/* What Makes Happy */}
      <View style={styles.twoColumnContainer}>
        <HalfCard
          title="Mutlu Eden"
          content={data.makeHappy}
          icon="happy"
          backgroundColor={colors.primary + '20'}
          onPress={() => openModal('Mutlu Eden', data.makeHappy, 'happy')}
        />

        <HalfCard
          title="Element"
          content={`🌟 Element: ${data.element || 'Bilinmiyor'}\n🪐 Gezegen: ${data.planet || 'Bilinmiyor'}\n⚡ Modalite: ${data.modality || 'Bilinmiyor'}\n🔮 Sembol: ${data.symbol || 'Bilinmiyor'}`}
          icon="planet"
          backgroundColor={colors.surface + '20'}
          onPress={() => openModal('Element Bilgileri',
            `🌟 Element: ${data.element || 'Bilinmiyor'}\n\n` +
            `🪐 Gezegen: ${data.planet || 'Bilinmiyor'}\n\n` +
            `⚡ Modalite: ${data.modality || 'Bilinmiyor'}\n\n` +
            `🔮 Sembol: ${data.symbol || 'Bilinmiyor'}`,
            'planet')}
        />
      </View>

      {/* Traits */}
      <GridCard
        title="Özellikler"
        items={data.traits?.key}
        icon="flash"
        backgroundColor={colors.primary + '20'}
      />

      {/* Love & Relationships */}
      <InfoCard
        title="Aşk & İlişkiler"
        content={data.love}
        icon="heart-circle"
        backgroundColor={colors.secondary + '20'}
      />
      <Banner adType='banner' />
      {/* Friends */}
      <InfoCard
        title="Arkadaşlık"
        content={data.friends}
        icon="people"
        backgroundColor={colors.surface + '20'}
      />

      {/* Soulmate */}
      <InfoCard
        title="Ruh Eşi"
        content={data.soulmate}
        icon="heart-half"
        backgroundColor={colors.primary + '20'}
      />

      <View style={{ height: 50 }} />
      <Banner adType='interstitial' />
      {/* Enhanced Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
            <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
              <View style={styles.modalTitleContainer}>
                <Ionicons name={modalContent.icon as any} size={28} color={colors.primary} />
                <Text style={[styles.modalTitle, { color: colors.text }]}>{modalContent.title}</Text>
              </View>
              <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                <Ionicons name="close" size={28} color={colors.text} />
              </TouchableOpacity>
            </View>
            <ScrollView
              style={styles.modalBody}
              showsVerticalScrollIndicator={true}
              contentContainerStyle={{ paddingBottom: 20 }}
            >
              {renderModalContent()}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </ScrollView>
  )
}

export default Signs