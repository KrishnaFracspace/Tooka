import React, { useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  Image,
  useWindowDimensions,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/AppNavigator';

import Header from '../../components/Header';
import SearchBar from '../../components/SearchBar';
import CategoryCard from '../../components/CategoryCard';
import FeaturedSpaCard from '../../components/FeaturedSpaCard';
import NearbySpaCard from '../../components/NearbySpaCard';
import OfferCard from '../../components/OfferCard';
import BannerCarousel from '../../components/BannerCarousel';
import WellnessCard from '../../components/WellnessCard';
import {
  categories as categoriesData,
  featuredSpas as featuredSpasData,
  nearbySpas as nearbySpasData,
  wellnessMoments as wellnessMomentsData,
  banners as bannersData,
  offer as offerData,
  wellnessInsight as wellnessInsightData,
} from '../../data/homeData';
import { SafeAreaView } from 'react-native-safe-area-context';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

interface CategoryItem {
  id: string;
  label: string;
  icon: string;
  selected?: boolean;
}

interface FeaturedSpaItem {
  id: string;
  name: string;
  location: string;
  distance: string;
  rating: string;
  reviews: string;
  price: string;
  oldPrice?: string;
  badge?: string;
  image: string;
  favorite?: boolean;
}

interface NearbySpaItem {
  id: string;
  name: string;
  subtitle: string;
  typeA: string;
  typeB: string;
  rating: string;
  image: string;
}

interface BannerItem {
  id: string;
  label: string;
  title: string;
  description: string;
  image: string;
}

interface OfferItem {
  id: string;
  label: string;
  title: string;
  subtitle: string;
  cta: string;
}

interface WellnessMomentItem {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  big?: boolean;
}

interface WellnessInsightItem {
  id: string;
  title: string;
  description: string;
  image: string;
}

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { width } = useWindowDimensions();
  const [selectedCategory, setSelectedCategory] = useState<string>('spa');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const isTablet = width >= 768;

  const categories = categoriesData as CategoryItem[];
  const featuredSpas = featuredSpasData as FeaturedSpaItem[];
  const nearbySpas = nearbySpasData as NearbySpaItem[];
  const wellnessMoments = wellnessMomentsData as WellnessMomentItem[];
  const banners = bannersData as BannerItem[];
  const offer = offerData as OfferItem;
  const wellnessInsight = wellnessInsightData as WellnessInsightItem;

  const handlePressSpaCard = (): void => navigation.navigate('SpaDetails');
  const handlePressCategory = (id: string): void => setSelectedCategory(id);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={[styles.content, isTablet && styles.contentTablet]}
        showsVerticalScrollIndicator={false}
      >
        <Header
          location="Banjara Hills"
          onPressLocation={() => {
            // TODO: Add location selector navigation
          }}
          onPressNotification={() => {
            // TODO: Add notification navigation
          }}
        />

        <Text style={styles.greeting}>Good Morning, Ayra</Text>
        <Text style={styles.title}>Ready to relax and recharge?</Text>

        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          onPressSearch={() => {
            // TODO: Add search action
          }}
          onPressFilter={() => {
            // TODO: Add filter screen navigation
          }}
        />

        {/* <BannerCarousel
          banners={banners}
          onPress={() => {
            // TODO: Add banner navigation
          }}
        /> */}

        {/* <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Spa categories</Text>
          <Pressable onPress={() => {}}>
            <Text style={styles.sectionAction}>View All</Text>
          </Pressable>
        </View> */}

        <FlatList<CategoryItem>
          data={categories}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.categoriesList}
          renderItem={({ item }) => (
            <CategoryCard
              icon={item.icon}
              label={item.label}
              selected={item.id === selectedCategory}
              onPress={() => handlePressCategory(item.id)}
            />
          )}
        />

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Curated for you</Text>
          <Pressable onPress={() => {}}>
            <Text style={styles.sectionAction}>See all</Text>
          </Pressable>
        </View>

        <FlatList<FeaturedSpaItem>
          data={featuredSpas}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.featuredList}
          renderItem={({ item }) => (
            <FeaturedSpaCard
              item={item}
              onPress={handlePressSpaCard}
              onPressFavorite={() => {
                // TODO: Handle favorite toggle
              }}
            />
          )}
        />

        <View style={styles.nearbySection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Explore Nearby</Text>
            <Pressable onPress={() => {}}>
              <Text style={styles.sectionAction}>View Map</Text>
            </Pressable>
          </View>

          <Pressable style={styles.mapCard} onPress={() => {}}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=900&q=60' }}
              style={styles.mapImage}
            />
            <View style={styles.mapOverlay} />
            <View style={styles.mapBadge}>
              <Ionicons name="location-sharp" size={16} color="#FFB02E" />
              <Text style={styles.mapBadgeText}>Nearby spas</Text>
            </View>
            <View style={styles.mapInfo}>
              <Text style={styles.mapTitle}>Malkam Cheruvu Park</Text>
              <Text style={styles.mapSubtitle}>Find the best spas around your current area.</Text>
            </View>
          </Pressable>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Available Right Now</Text>
          <Pressable onPress={() => {}}>
            <Text style={styles.sectionAction}>See all</Text>
          </Pressable>
        </View>

        <FlatList<NearbySpaItem>
          data={nearbySpas}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <NearbySpaCard item={item} onPress={handlePressSpaCard} />}
          scrollEnabled={false}
          ItemSeparatorComponent={() => <View style={styles.listSeparator} />}
        />

        <OfferCard
          item={offer}
          onPress={() => {
            // TODO: Add offer action
          }}
        />

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Your wellness moment</Text>
          <Pressable onPress={() => {}}>
            <Text style={styles.sectionAction}>Explore</Text>
          </Pressable>
        </View>

        <View style={styles.wellnessRow}>
          {wellnessMoments.map((item) => (
            <WellnessCard key={item.id} item={item} onPress={() => {}} />
          ))}
        </View>

        <Pressable style={styles.insightCard} onPress={() => {}}>
          <Image source={{ uri: wellnessInsight.image }} style={styles.insightImage} />
          <View style={styles.insightContent}>
            <Text style={styles.insightLabel}>WELLNESS INSIGHT</Text>
            <Text style={styles.insightTitle}>{wellnessInsight.title}</Text>
            <Text style={styles.insightDescription}>{wellnessInsight.description}</Text>
          </View>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F4EFE8',
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  contentTablet: {
    paddingHorizontal: 24,
  },
  greeting: {
    fontFamily:"WorkSans-Medium",
    fontSize: 16,
    color: '#6D6D6D',
    marginBottom: 0,
  },
  title: {
    fontFamily:"Sora-SemiBold",
    fontSize: 18,
    color: '#1F1F1F',
    lineHeight: 36,
    marginBottom: 15,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily:'Sora-SemiBold',
    fontSize: 16,
    color: '#1F1F1F',
  },
  sectionAction: {
    fontSize: 13,
    color: '#FFB02E',
    fontWeight: '700',
  },
  categoriesList: {
    paddingBottom: 18,
  },
  featuredList: {
    paddingBottom: 24,
  },
  nearbySection: {
    marginBottom: 24,
  },
  mapCard: {
    width: '100%',
    borderRadius: 28,
    overflow: 'hidden',
    minHeight: 220,
    backgroundColor: '#F4EFE8',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 4,
  },
  mapImage: {
    width: '100%',
    height: 220,
  },
  mapOverlay: {
    // ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.18)',
  },
  mapBadge: {
    position: 'absolute',
    top: 18,
    left: 18,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  mapBadgeText: {
    marginLeft: 8,
    color: '#3C3C3C',
    fontSize: 12,
    fontWeight: '700',
  },
  mapInfo: {
    position: 'absolute',
    bottom: 18,
    left: 18,
    right: 18,
  },
  mapTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 6,
  },
  mapSubtitle: {
    color: '#EDEDED',
    fontSize: 13,
    lineHeight: 20,
  },
  listSeparator: {
    height: 0,
  },
  wellnessRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  insightCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding:12,
    marginHorizontal:20,
    overflow: 'hidden',
    alignItems:'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 4,
  },
  insightImage: {
    width: '100%',
    height: 180,
    borderRadius:10
  },
  insightContent: {
    paddingHorizontal: 30,
    paddingVertical:10,
    alignItems:'center'
  },
  insightLabel: {
    color: '#FFB02E',
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 10,
    letterSpacing: 0.7,
    textAlign:'center'
  },
  insightTitle: {
    fontFamily:'Sora-SemiBold',
    fontSize: 16,
    fontWeight: '800',
    color: '#1F1F1F',
    marginBottom: 10,
    lineHeight: 30,
    textAlign:'center'
  },
  insightDescription: {
    fontSize: 13,
    color: '#8f8f8f',
    lineHeight: 20,
    textAlign:'center'
  },
});

export default HomeScreen;
