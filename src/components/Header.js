import React from 'react';
import { View, Text, StyleSheet, Pressable, Image, Dimensions, Platform } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Header = ({ location, onPressLocation, onPressNotification }) => {
  const {width, height} = Dimensions.get("window");
  return (
    <View style={styles.header}>
      <View style={styles.brandColumn}>
        {/* <Text style={styles.brandText}>Tooka</Text>
        <Text style={styles.brandSubText}>Spa · Salons · Fitness · Wellness</Text> */}
        <Image resizeMode='contain' source={{uri:'https://d2f15ematxpwp4.cloudfront.net/appImages/Tooka_Logo.png'}}
          style={{width: width*0.3, height:Platform.OS == 'android' ? 60 : 80}}
        />
      </View>
      <View style={styles.actionRow}>
        <Pressable style={styles.locationButton} onPress={onPressLocation}>
          <Ionicons name="location-sharp" size={16} color="#3C3C3C" />
          <Text style={styles.locationText}>{location}</Text>
        </Pressable>
        {/* <Pressable style={styles.notificationButton} onPress={onPressNotification}>
          <Ionicons name="notifications-outline" size={22} color="#3C3C3C" />
        </Pressable> */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 0,
  },
  brandColumn: {
    flex: 1,
  },
  brandText: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1F1F1F',
    letterSpacing: 0.3,
  },
  brandSubText: {
    marginTop: 4,
    fontSize: 13,
    color: '#6D6D6D',
    lineHeight: 18,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginRight: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  locationText: {
    marginLeft: 8,
    fontSize: 13,
    color: '#3C3C3C',
    fontWeight: '600',
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
});

export default React.memo(Header);
