// import React, { useEffect } from 'react';
// import { Modal, View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
// import { useForm, Controller } from 'react-hook-form';

// type EnquiryFormValues = {
//   name: string;
//   email: string;
//   message: string;
// };

// type Props = {
//   visible: boolean;
//   onClose: () => void;
//   onSubmit: (values: EnquiryFormValues) => void;
//   defaultValues?: Partial<EnquiryFormValues>;
// };

// const EnquiryModal: React.FC<Props> = ({ visible, onClose, onSubmit, defaultValues }) => {
//   const { control, handleSubmit, reset, formState: { errors } } = useForm<EnquiryFormValues>({
//     defaultValues: {
//       name: defaultValues?.name ?? '',
//       email: defaultValues?.email ?? '',
//       message: defaultValues?.message ?? '',
//     },
//   });

//   useEffect(() => {
//     reset({
//       name: defaultValues?.name ?? '',
//       email: defaultValues?.email ?? '',
//       message: defaultValues?.message ?? '',
//     });
//   }, [defaultValues, reset]);

//   return (
//     <Modal visible={visible} animationType="slide" transparent>
//       <View style={styles.backdrop}>
//         <View style={styles.card}>
//           <Text style={styles.title}>Send Enquiry</Text>

//           <Text style={styles.label}>Name</Text>
//           <Controller
//             control={control}
//             name="name"
//             rules={{ required: 'Name is required' }}
//             render={({ field: { onChange, value } }) => (
//               <TextInput style={styles.input} value={value} onChangeText={onChange} />
//             )}
//           />
//           {errors.name && <Text style={styles.error}>{errors.name.message}</Text>}

//           <Text style={styles.label}>Email</Text>
//           <Controller
//             control={control}
//             name="email"
//             rules={{ required: 'Email required', pattern: { value: /.+@.+\..+/, message: 'Invalid email' } }}
//             render={({ field: { onChange, value } }) => (
//               <TextInput style={styles.input} value={value} onChangeText={onChange} keyboardType="email-address" autoCapitalize="none" />
//             )}
//           />
//           {errors.email && <Text style={styles.error}>{errors.email.message}</Text>}

//           <Text style={styles.label}>Message</Text>
//           <Controller
//             control={control}
//             name="message"
//             rules={{ required: 'Message required' }}
//             render={({ field: { onChange, value } }) => (
//               <TextInput style={[styles.input, styles.textArea]} value={value} onChangeText={onChange} multiline />
//             )}
//           />
//           {errors.message && <Text style={styles.error}>{errors.message.message}</Text>}

//           <View style={styles.row}>
//             <Pressable style={[styles.button, styles.cancel]} onPress={onClose}>
//               <Text style={styles.cancelText}>Cancel</Text>
//             </Pressable>
//             <Pressable style={[styles.button, styles.primary]} onPress={handleSubmit(onSubmit)}>
//               <Text style={styles.primaryText}>Submit Enquiry</Text>
//             </Pressable>
//           </View>
//         </View>
//       </View>
//     </Modal>
//   );
// };

// const styles = StyleSheet.create({
//   backdrop: {
//     flex: 1,
//     backgroundColor: 'rgba(0,0,0,0.4)',
//     justifyContent: 'center',
//     padding: 20,
//   },
//   card: {
//     backgroundColor: '#FFFFFF',
//     borderRadius: 18,
//     padding: 20,
//   },
//   title: {
//     fontSize: 20,
//     fontWeight: '800',
//     marginBottom: 12,
//   },
//   label: {
//     fontSize: 13,
//     fontWeight: '700',
//     marginTop: 8,
//     marginBottom: 6,
//   },
//   input: {
//     backgroundColor: '#F3F2EC',
//     borderRadius: 12,
//     paddingHorizontal: 12,
//     paddingVertical: 10,
//   },
//   textArea: {
//     height: 90,
//     textAlignVertical: 'top',
//   },
//   error: {
//     color: '#D14343',
//     fontSize: 12,
//     marginTop: 4,
//   },
//   row: {
//     flexDirection: 'row',
//     justifyContent: 'flex-end',
//     marginTop: 16,
//   },
//   button: {
//     paddingVertical: 12,
//     paddingHorizontal: 18,
//     borderRadius: 12,
//     marginLeft: 12,
//   },
//   cancel: {
//     backgroundColor: '#E8E3D8',
//   },
//   primary: {
//     backgroundColor: '#FFB02E',
//   },
//   cancelText: {
//     color: '#1E1E1E',
//     fontWeight: '700',
//   },
//   primaryText: {
//     color: '#FFFFFF',
//     fontWeight: '800',
//   },
// });

// export default EnquiryModal;


import React, { useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import type { EnquiryFormValues } from '../types/Enquiry';

type Props = {
  visible: boolean;
  onClose: () => void;
  onSubmit: (values: EnquiryFormValues) => Promise<void>;
  defaultValues?: Partial<EnquiryFormValues>;
  loading?: boolean;
};

const EnquiryModal: React.FC<Props> = ({
  visible,
  onClose,
  onSubmit,
  defaultValues,
  loading = false,
}) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EnquiryFormValues>({
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
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <Text style={styles.title}>Send Enquiry</Text>

          <Text style={styles.label}>Name</Text>
          <Controller
            control={control}
            name="name"
            rules={{ required: 'Name is required' }}
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={styles.input}
                placeholder="Enter your name"
                value={value}
                editable={!loading}
                onChangeText={onChange}
              />
            )}
          />
          {errors.name && <Text style={styles.error}>{errors.name.message}</Text>}

          <Text style={styles.label}>Email</Text>
          <Controller
            control={control}
            name="email"
            rules={{
              required: 'Email is required',
              pattern: { value: /.+@.+\..+/, message: 'Enter a valid email' },
            }}
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                keyboardType="email-address"
                autoCapitalize="none"
                value={value}
                editable={!loading}
                onChangeText={onChange}
              />
            )}
          />
          {errors.email && <Text style={styles.error}>{errors.email.message}</Text>}

          <Text style={styles.label}>Message</Text>
          <Controller
            control={control}
            name="message"
            rules={{ required: 'Message is required' }}
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Tell us about your enquiry..."
                multiline
                value={value}
                editable={!loading}
                onChangeText={onChange}
              />
            )}
          />
          {errors.message && <Text style={styles.error}>{errors.message.message}</Text>}

          <View style={styles.row}>
            <Pressable disabled={loading} style={[styles.button, styles.cancel, loading && styles.disabledButton]} onPress={onClose}>
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>

            <Pressable disabled={loading} style={[styles.button, styles.primary, loading && styles.disabledButton]} onPress={handleSubmit(onSubmit)}>
              {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryText}>Submit Enquiry</Text>}
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
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Sora-SemiBold',
    color: '#1F1F1F',
    marginBottom: 12,
  },
  label: {
    fontSize: 13,
    fontFamily: 'WorkSans-SemiBold',
    color: '#1F1F1F',
    marginTop: 8,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E7E2DA',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#FFF8F0',
    fontFamily: 'WorkSans-Regular',
    color: '#1F1F1F',
  },
  textArea: {
    minHeight: 96,
    textAlignVertical: 'top',
  },
  error: {
    color: '#D64545',
    fontSize: 12,
    fontFamily: 'WorkSans-Regular',
    marginTop: 4,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 18,
    gap: 10,
  },
  button: {
    borderRadius: 999,
    paddingVertical: 12,
    paddingHorizontal: 16,
    minWidth: 110,
    alignItems: 'center',
  },
  cancel: {
    backgroundColor: '#F3EEE7',
  },
  primary: {
    backgroundColor: '#FFB02E',
  },
  disabledButton: {
    opacity: 0.7,
  },
  cancelText: {
    color: '#1F1F1F',
    fontFamily: 'WorkSans-SemiBold',
  },
  primaryText: {
    color: '#FFFFFF',
    fontFamily: 'WorkSans-SemiBold',
  },
});

export default EnquiryModal;