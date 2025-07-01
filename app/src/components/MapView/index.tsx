import { Modal } from '@components'
import { useTheme, useToast } from '@providers'
import * as Location from 'expo-location'
import React, { useEffect, useRef, useState } from 'react'
import {
  ActivityIndicator,
  Platform,
  Text,
  TouchableOpacity,
  View
} from 'react-native'
import MapView, { MapPressEvent, Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps'
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
  const { showToast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [showLocationModal, setShowLocationModal] = useState(false)
  const [locationPermissionStatus, setLocationPermissionStatus] = useState<string | null>(null)
  const [currentLocation, setCurrentLocation] = useState<{
    latitude: number
    longitude: number
  }>({
    latitude: initialLatitude,
    longitude: initialLongitude
  })
  const [markerCoordinate, setMarkerCoordinate] = useState<{
    latitude: number
    longitude: number
  } | null>(null)
  const mapRef = useRef<MapView>(null)

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
        showToast('Konum izni verilmedi', 'error')
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
      
      const newLocation = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      }
      
      setCurrentLocation(newLocation)
      setMarkerCoordinate(newLocation)
      
      if (onLocationSelect) {
        onLocationSelect(newLocation.latitude, newLocation.longitude)
      }
      
      // Animate map to current location
      animateToRegion({
        latitude: newLocation.latitude,
        longitude: newLocation.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      })
    } catch (error) {
      showToast('Konum alınamadı', 'error')
    }
  }

  const animateToRegion = (region: Region) => {
    mapRef.current?.animateToRegion(region, 1000)
  }

  const handleMapPress = (event: MapPressEvent) => {
    const { coordinate } = event.nativeEvent
    setMarkerCoordinate(coordinate)
    
    // Animate to the selected position for better user feedback
    animateToRegion({
      latitude: coordinate.latitude,
      longitude: coordinate.longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    })
    
    if (onLocationSelect) {
      onLocationSelect(coordinate.latitude, coordinate.longitude)
    }
  }

  const handleCloseModal = () => {
    setShowLocationModal(false)
    setIsLoading(false)
  }
  
  const handleCurrentLocationPress = () => {
    if (locationPermissionStatus === 'granted') {
      getCurrentLocation()
    } else {
      requestLocationPermission()
    }
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
        onClose={handleCloseModal}
        onConfirm={requestLocationPermission}
        title="Konum İzni"
        message="Konumunuzu görmek için ayarlardan konum iznini açmanız gerekiyor."
        confirmText="Tamam"
        cancelText="İptal"
        iconName="warning"
      />
      
      {/* Harita */}
      <MapView
        ref={mapRef}
        provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
        style={styles.map}
        initialRegion={{
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        onPress={handleMapPress}
        showsUserLocation={locationPermissionStatus === 'granted'}
        showsMyLocationButton={false}
      >
        {markerCoordinate && (
          <Marker
            coordinate={markerCoordinate}
            title="Seçilen Konum"
            description={`Lat: ${markerCoordinate.latitude.toFixed(6)}, Lng: ${markerCoordinate.longitude.toFixed(6)}`}
          />
        )}
      </MapView>
      
      {/* Custom Current Location Button */}
      <TouchableOpacity 
        style={[styles.currentLocationButton, { backgroundColor: colors.background }]}
        onPress={handleCurrentLocationPress}
      >
        <Text style={{ color: colors.primary }}>📍</Text>
      </TouchableOpacity>
    </View>
  )
}

export default MapViewComponent