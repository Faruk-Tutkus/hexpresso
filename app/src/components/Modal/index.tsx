import { CustomButton } from '@components';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@providers';
import React from 'react';
import { Modal, Text, TouchableOpacity, View } from 'react-native';
import styles from './styles';

interface ProfileModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  iconName: keyof typeof Ionicons.glyphMap;
}

interface PhotoPickerModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  subtitle: string;
  onCamera: () => void;
  onGallery: () => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({
  visible,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  cancelText,
  iconName
}) => {
  const { colors } = useTheme();
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
          <View style={styles.modalIcon}>
            <Ionicons name={iconName} size={50} color={colors.text} />
          </View>
          
          <Text style={[styles.modalTitle, { color: colors.text }]}>
            {title}
          </Text>
          
          <Text style={[styles.modalDescription, { color: colors.text }]}>
            {message}
          </Text>
          
          <View style={styles.modalButtons}>
            <CustomButton 
              title={cancelText}
              variant="secondary"
              onPress={onClose}
            />
            <CustomButton 
              title={confirmText}
              variant="primary"
              onPress={onConfirm}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export const PhotoPickerModal: React.FC<PhotoPickerModalProps> = ({
  visible,
  onClose,
  title,
  subtitle,
  onCamera,
  onGallery
}) => {
  const { colors } = useTheme();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
          <View style={styles.modalIcon}>
            <Ionicons name="camera" size={50} color={colors.primary} />
          </View>
          
          <Text style={[styles.modalTitle, { color: colors.text }]}>
            {title}
          </Text>
          
          <Text style={[styles.modalDescription, { color: colors.secondaryText }]}>
            {subtitle}
          </Text>
          
          <View style={styles.photoPickerButtons}>
            <TouchableOpacity
              style={[styles.photoPickerOption, { backgroundColor: colors.primary }]}
              onPress={onCamera}
            >
              <Ionicons name="camera" size={24} color={colors.background} />
              <Text style={[styles.photoPickerText, { color: colors.background }]}>
                Kamera
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.photoPickerOption, { backgroundColor: colors.secondary }]}
              onPress={onGallery}
            >
              <Ionicons name="images" size={24} color={colors.background} />
              <Text style={[styles.photoPickerText, { color: colors.background }]}>
                Galeri
              </Text>
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity
            style={[styles.cancelOptionButton, { borderColor: colors.border }]}
            onPress={onClose}
          >
            <Text style={[styles.cancelOptionText, { color: colors.secondaryText }]}>
              İptal
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default ProfileModal; 