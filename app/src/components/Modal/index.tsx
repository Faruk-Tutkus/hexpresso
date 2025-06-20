import { CustomButton } from '@components';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@providers';
import React from 'react';
import { Modal, Text, View } from 'react-native';
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
        <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
          <View style={styles.modalIcon}>
            <Ionicons name={iconName} size={50} color={colors.secondaryText} />
          </View>
          
          <Text style={[styles.modalTitle, { color: colors.text }]}>
            {title}
          </Text>
          
          <Text style={[styles.modalDescription, { color: colors.secondaryText }]}>
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

export default ProfileModal; 