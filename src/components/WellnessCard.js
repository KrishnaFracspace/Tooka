import React from 'react';
import { Pressable, View, Text, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const WellnessCard = ({ item, onPress }) => {
  return (
    <Pressable onPress={onPress} style={[styles.card, item.big && styles.bigCard]}>
      <View style={styles.iconWrapper}>
        <Ionicons name={item.icon} size={20} color="#FFB02E" />
      </View>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.subtitle}>{item.subtitle}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    width:150,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 12,
    alignItems:'center',
    // flex: 1,
    marginRight: 12,
    // minHeight: 120,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  bigCard: {
    // minHeight: 144,
  },
  iconWrapper: {
    width: 20,
    height: 20,
    borderRadius: 14,
    // backgroundColor: '#FFF4DD',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: '#222222',
    marginBottom: 4
  },
  subtitle: {
    fontSize: 12,
    color: '#7A7A7A',
    lineHeight: 18,
  },
});

export default React.memo(WellnessCard);
