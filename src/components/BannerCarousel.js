import React from 'react';
import { FlatList, Pressable, View, Text, StyleSheet, ImageBackground } from 'react-native';

const BannerCarousel = ({ banners, onPress }) => {
  return (
    <FlatList
      data={banners}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.list}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <Pressable style={styles.bannerCard} onPress={() => onPress(item)}>
          <ImageBackground source={{ uri: item.image }} style={styles.image} imageStyle={styles.imageStyle}>
            <View style={styles.overlay} />
            <View style={styles.textBlock}>
              <Text style={styles.subTitle}>{item.label}</Text>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.description}>{item.description}</Text>
            </View>
          </ImageBackground>
        </Pressable>
      )}
    />
  );
};

const styles = StyleSheet.create({
  list: {
    paddingBottom: 12,
  },
  bannerCard: {
    width: 320,
    height: 160,
    borderRadius: 28,
    overflow: 'hidden',
    marginRight: 16,
    backgroundColor: '#FFF4DD',
  },
  image: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  imageStyle: {
    borderRadius: 28,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.18)',
  },
  textBlock: {
    padding: 18,
  },
  subTitle: {
    color: '#FFE4A6',
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 8,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 6,
  },
  description: {
    color: '#EAEAEA',
    fontSize: 13,
    lineHeight: 18,
  },
});

export default React.memo(BannerCarousel);
