import { Ionicons } from '@expo/vector-icons'
import { useTheme } from '@providers'
import * as Location from 'expo-location'
import React, { useEffect, useState } from 'react'
import {
  ActivityIndicator,
  Alert,
  Modal,
  Platform,
  Text,
  TouchableOpacity,
  View
} from 'react-native'
import MapView, { MapPressEvent, Marker, PROVIDER_GOOGLE } from 'react-native-maps'
import styles from './styles'

interface MapViewComponentProps {
  onLocationSelect?: (latitude: number, longitude: number) => void
  initialLatitude?: number
  initialLongitude?: number
}

const MapViewComponent: React.FC<MapViewComponentProps> = ({
  onLocationSelect,
  initialLatitude = 41.0082,
  initialLongitude = 28.9784
}) => {
  const { colors } = useTheme()
  
  const [isLoading, setIsLoading] = useState(true)
  const [showLocationModal, setShowLocationModal] = useState(false)
  const [locationPermissionStatus, setLocationPermissionStatus] = useState<string | null>(null)
  const [currentLocation, setCurrentLocation] = useState<{
    latitude: number
    longitude: number
  } | null>(null)
  const [markerCoordinate, setMarkerCoordinate] = useState<{
    latitude: number
    longitude: number
  } | null>(null)

  useEffect(() => {
    checkLocationPermission()
  }, [])

  const checkLocationPermission = async () => {
    try {
      const { status } = await Location.getForegroundPermissionsAsync()
      setLocationPermissionStatus(status)
      
      if (status === 'granted') {
        await getCurrentLocation()
      } else {
        setShowLocationModal(true)
      }
    } catch (error) {
      console.error('Permission check error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync()
      setLocationPermissionStatus(status)
      
      if (status === 'granted') {
        setShowLocationModal(false)
        await getCurrentLocation()
      } else {
        Alert.alert(
          'Konum İzni',
          'Konumunuzu görmek için ayarlardan konum iznini açmanız gerekiyor.',
          [{ text: 'Tamam' }]
        )
      }
    } catch (error) {
      console.error('Permission request error:', error)
    }
  }

  const getCurrentLocation = async () => {
    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High
      })
      setCurrentLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      })
    } catch (error) {
      console.error('Get location error:', error)
    }
  }

  const handleMapPress = (event: MapPressEvent) => {
    const { coordinate } = event.nativeEvent
    setMarkerCoordinate(coordinate)
    
    if (onLocationSelect) {
      onLocationSelect(coordinate.latitude, coordinate.longitude)
    }
  }

  const handleCloseModal = () => {
    setShowLocationModal(false)
    setIsLoading(false)
  }

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centerContent, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.text }]}>
          Harita yükleniyor...
        </Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      {/* Konum İzni Modal */}
      <Modal
        visible={showLocationModal}
        transparent
        animationType="fade"
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <View style={styles.modalIcon}>
              <Ionicons name="location" size={50} color={colors.secondary} />
            </View>
            
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              Konum Erişimi
            </Text>
            
            <Text style={[styles.modalDescription, { color: colors.secondaryText }]}>
              Harita özelliklerini kullanabilmek için konumunuza erişim izni vermeniz gerekmektedir.
            </Text>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton, { borderColor: colors.border }]}
                onPress={handleCloseModal}
              >
                <Text style={[styles.modalButtonText, { color: colors.text }]}>
                  İptal
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, styles.allowButton, { backgroundColor: colors.primary }]}
                onPress={requestLocationPermission}
              >
                <Text style={[styles.modalButtonText, { color: '#FFFFFF' }]}>
                  İzin Ver
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Harita */}
      <MapView
        provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
        style={styles.map}
        initialRegion={{
          latitude: currentLocation?.latitude || initialLatitude,
          longitude: currentLocation?.longitude || initialLongitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        onPress={handleMapPress}
        showsUserLocation={locationPermissionStatus === 'granted'}
        showsMyLocationButton={locationPermissionStatus === 'granted'}
      >
        {markerCoordinate && (
          <Marker
            coordinate={markerCoordinate}
            title="Seçilen Konum"
            description={`Lat: ${markerCoordinate.latitude.toFixed(6)}, Lng: ${markerCoordinate.longitude.toFixed(6)}`}
          />
        )}
      </MapView>
    </View>
  )
}

export default MapViewComponent