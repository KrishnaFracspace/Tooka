import React from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

interface EnquirySuccessModalProps {
  visible: boolean;
  onDone: () => void;
}

const EnquirySuccessModal: React.FC<EnquirySuccessModalProps> = React.memo(({ visible, onDone }) => {
  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <View style={styles.iconCircle}>
            <Text style={styles.icon}>✓</Text>
          </View>
          <Text style={styles.title}>Enquiry Submitted</Text>
          <Text style={styles.message}>Thank you! We’ve received your enquiry and our team will contact you shortly.</Text>
          <Pressable style={styles.button} onPress={onDone} accessibilityRole="button">
            <Text style={styles.buttonText}>Done</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
});

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(17,24,39,0.45)',
    paddingHorizontal: 24,
  },
  card: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingHorizontal: 24,
    paddingVertical: 28,
    alignItems: 'center',
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FFF4DB',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  icon: {
    fontSize: 30,
    color: '#FFB02E',
    fontWeight: '800',
  },
  title: {
    fontFamily: 'Sora-SemiBold',
    fontSize: 20,
    color: '#1F1F1F',
    marginBottom: 8,
  },
  message: {
    fontFamily: 'WorkSans-Regular',
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#FFB02E',
    borderRadius: 999,
    paddingVertical: 12,
    paddingHorizontal: 24,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: 'WorkSans-SemiBold',
    fontSize: 15,
    color: '#FFFFFF',
  },
});

export default EnquirySuccessModal;
