import React, { useEffect } from 'react';
import { Modal, View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { useForm, Controller } from 'react-hook-form';

type EnquiryFormValues = {
  name: string;
  email: string;
  message: string;
};

type Props = {
  visible: boolean;
  onClose: () => void;
  onSubmit: (values: EnquiryFormValues) => void;
  defaultValues?: Partial<EnquiryFormValues>;
};

const EnquiryModal: React.FC<Props> = ({ visible, onClose, onSubmit, defaultValues }) => {
  const { control, handleSubmit, reset, formState: { errors } } = useForm<EnquiryFormValues>({
    defaultValues: {
      name: defaultValues?.name ?? '',
      email: defaultValues?.email ?? '',
      message: defaultValues?.message ?? '',
    },
  });

  useEffect(() => {
    reset({
      name: defaultValues?.name ?? '',
      email: defaultValues?.email ?? '',
      message: defaultValues?.message ?? '',
    });
  }, [defaultValues, reset]);

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <Text style={styles.title}>Send Enquiry</Text>

          <Text style={styles.label}>Name</Text>
          <Controller
            control={control}
            name="name"
            rules={{ required: 'Name is required' }}
            render={({ field: { onChange, value } }) => (
              <TextInput style={styles.input} value={value} onChangeText={onChange} />
            )}
          />
          {errors.name && <Text style={styles.error}>{errors.name.message}</Text>}

          <Text style={styles.label}>Email</Text>
          <Controller
            control={control}
            name="email"
            rules={{ required: 'Email required', pattern: { value: /.+@.+\..+/, message: 'Invalid email' } }}
            render={({ field: { onChange, value } }) => (
              <TextInput style={styles.input} value={value} onChangeText={onChange} keyboardType="email-address" autoCapitalize="none" />
            )}
          />
          {errors.email && <Text style={styles.error}>{errors.email.message}</Text>}

          <Text style={styles.label}>Message</Text>
          <Controller
            control={control}
            name="message"
            rules={{ required: 'Message required' }}
            render={({ field: { onChange, value } }) => (
              <TextInput style={[styles.input, styles.textArea]} value={value} onChangeText={onChange} multiline />
            )}
          />
          {errors.message && <Text style={styles.error}>{errors.message.message}</Text>}

          <View style={styles.row}>
            <Pressable style={[styles.button, styles.cancel]} onPress={onClose}>
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
            <Pressable style={[styles.button, styles.primary]} onPress={handleSubmit(onSubmit)}>
              <Text style={styles.primaryText}>Submit Enquiry</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 12,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    marginTop: 8,
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#F3F2EC',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  textArea: {
    height: 90,
    textAlignVertical: 'top',
  },
  error: {
    color: '#D14343',
    fontSize: 12,
    marginTop: 4,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 12,
    marginLeft: 12,
  },
  cancel: {
    backgroundColor: '#E8E3D8',
  },
  primary: {
    backgroundColor: '#FFB02E',
  },
  cancelText: {
    color: '#1E1E1E',
    fontWeight: '700',
  },
  primaryText: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
});

export default EnquiryModal;
