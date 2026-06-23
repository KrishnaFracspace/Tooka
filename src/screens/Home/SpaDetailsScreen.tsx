import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { JSX } from 'react';
import {
  ScrollView,
  View,
  Text,
  Image,
  ImageBackground,
  StyleSheet,
  useWindowDimensions,
  Pressable,
  ViewStyle,
  StyleProp,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { useNavigation } from '@react-navigation/native';

const HERO_IMAGE = {
  uri: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1000&q=60',
};
const SERVICE_IMAGE = {
  uri: 'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=900&q=60',
};
const SERVICE_IMAGE_2 = {
  uri: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=900&q=60',
};
const SERVICE_IMAGE_3 = {
  uri: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=60',
};
const MAP_IMAGE = {
  uri: 'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=900&q=60',
};

type BadgeChipProps = {
  label: string;
  icon: string;
};

const BadgeChip: React.FC<BadgeChipProps> = ({ label, icon }) => (
  <View style={styles.badgeChip}>
    <Text style={styles.badgeIcon}>{icon}</Text>
    <Text style={styles.badgeLabel}>{label}</Text>
  </View>
);

type ServiceCardProps = {
  imageSource: { uri: string };
  title: string;
  duration: string;
  subtitle: string;
  price: string;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
};

const ServiceCard: React.FC<ServiceCardProps> = ({
  imageSource,
  title,
  duration,
  subtitle,
  price,
  onPress,
  style,
}) => (
  <View style={[styles.serviceCard, style]}>
    <Image source={imageSource} style={styles.serviceImage} resizeMode="cover" />
    <View style={styles.serviceContent}>
      <View style={styles.serviceTitleRow}>
        <Text style={styles.serviceTitle}>{title}</Text>
        <Text style={styles.serviceDuration}>{duration}</Text>
      </View>
      <Text style={styles.serviceSubtitle}>{subtitle}</Text>
      <View style={styles.serviceActionRow}>
        <Text style={styles.servicePrice}>{price}</Text>
        <Pressable style={styles.bookButton} onPress={onPress}>
          <Text style={styles.bookButtonText}>Book</Text>
        </Pressable>
      </View>
    </View>
  </View>
);

type ReviewCardProps = {
  author: string;
  when: string;
  rating: string;
  text: string;
  style?: StyleProp<ViewStyle>;
};

const ReviewCard: React.FC<ReviewCardProps> = ({ author, when, rating, text, style }) => (
  <View style={[styles.reviewCard, style]}>
    <View style={styles.reviewHeader}>
      <View style={styles.reviewAvatar}>
        <Text style={styles.reviewAvatarText}>{author.charAt(0)}</Text>
      </View>
      <View style={styles.reviewMeta}>
        <Text style={styles.reviewAuthor}>{author}</Text>
        <Text style={styles.reviewWhen}>{when}</Text>
      </View>
      <Text style={styles.reviewRating}>{rating}</Text>
    </View>
    <Text style={styles.reviewText}>{text}</Text>
  </View>
);

type SpaDetailsNavigationProp = NativeStackNavigationProp<RootStackParamList, 'SpaDetails'>;

function SpaDetailsScreen(): JSX.Element {
  const navigation = useNavigation<SpaDetailsNavigationProp>();
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <ImageBackground source={HERO_IMAGE} style={styles.heroImageBackground} imageStyle={styles.heroImageStyle}>
          <View style={styles.heroOverlay} />
          <View style={styles.heroTopRow}>
            <View style={styles.heroBadge}> 
              <Text style={styles.heroBadgeText}>4.8</Text>
            </View>
            <Pressable style={styles.heroHeart}>
              <Text style={styles.heroHeartText}>♡</Text>
            </Pressable>
          </View>
          <View style={styles.heroTextArea}>
            <Text style={styles.heroHeadline}>Tiamoz Salon & Spa</Text>
            <View style={styles.heroMetaRow}>
              <Text style={styles.heroMeta}>⭐ 4.8 (2.4K)</Text>
              <Text style={styles.heroMeta}>A premium wellness destination offering Thai therapies, deep tissue massages, aromatherapy & luxury relaxation experiences.</Text>
            </View>
          </View>
        </ImageBackground>

        <View style={[styles.section, isTablet && styles.sectionRow]}> 
          <BadgeChip icon="🏅" label="Premium" />
          <BadgeChip icon="✔️" label="Certified" />
          <BadgeChip icon="🛡️" label="Hygiene" />
          <BadgeChip icon="⭐" label="Top Rated" />
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Popular Services</Text>
        </View>

        <ServiceCard
          imageSource={SERVICE_IMAGE}
          title="Body Massage"
          duration="40 mins"
          subtitle="Relieves muscle tension and chronic stress"
          price="₹1,499"
          onPress={() => navigation.navigate('Login')}
        />
        <ServiceCard
          imageSource={SERVICE_IMAGE_2}
          title="Thai Massage"
          duration="60 mins"
          subtitle="Relieves muscle tension and chronic stress"
          price="₹1,799"
          style={styles.serviceCardSpacing}
          onPress={() => navigation.navigate('Login')}
        />
        <ServiceCard
          imageSource={SERVICE_IMAGE_3}
          title="Swedish Massage"
          duration="75 mins"
          subtitle="Relieves muscle tension and chronic stress"
          price="₹1,699"
          style={styles.serviceCardSpacing}
          onPress={() => navigation.navigate('Login')}
        />

        <View style={[styles.sectionHeader, styles.reviewSectionHeader]}> 
          <Text style={styles.sectionTitle}>What Guests Say</Text>
          <Text style={styles.reviewSummary}>4.8 (2.4K)</Text>
        </View>

        <View style={[styles.reviewRow, isTablet && styles.reviewRowTablet]}>
          <ReviewCard
            author="Dhruv"
            when="2 days ago"
            rating="5.0"
            text="The therapists were professional & ambience was incredibly relaxing. Will definitely come back!"
            style={styles.reviewCardFlex}
          />
          <ReviewCard
            author="Darsh"
            when="1 week ago"
            rating="4.9"
            text="The therapists were professional & ambience was incredibly relaxing. Will definitely come back!"
            style={[styles.reviewCardFlex, isTablet && styles.reviewCardMargin]}
          />
        </View>

        <Pressable style={styles.viewAllReviewsButton}>
          <Text style={styles.viewAllReviewsText}>View All Reviews</Text>
        </Pressable>

        <Text style={styles.sectionTitle}>Location</Text>
        <View style={styles.mapCard}>
          <Image source={MAP_IMAGE} style={styles.mapImage} resizeMode="cover" />
          <View style={styles.mapOverlay} />
          <View style={styles.mapPinContainer}>
            <Text style={styles.mapPinText}>⭐ 4.8</Text>
          </View>
        </View>

        <View style={styles.locationDetails}>
          <View>
            <Text style={styles.locationName}>Tiamoz Salon & Spa</Text>
            <Text style={styles.locationAddress}>Road number 12, MLA colony, Banjara Hills, Hyderabad</Text>
          </View>
          <View style={[styles.locationActionRow, isTablet && styles.locationActionRowTablet]}>
            <Pressable style={styles.directionButton}>
              <Text style={styles.directionButtonText}>Get Directions</Text>
            </Pressable>
            <Pressable style={styles.outlineButton}>
              <Text style={styles.outlineButtonText}>View Opening Hours</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.offerCard}>
          <View>
            <Text style={styles.offerLabel}>Limited time</Text>
            <Text style={styles.offerTitle}>Take a break today.</Text>
            <Text style={styles.offerSubtitle}>20% off at your favourite spa.</Text>
          </View>
          <Pressable style={styles.offerButton}>
            <Text style={styles.offerButtonText}>Claim Now</Text>
          </Pressable>
        </View>

        <View style={[styles.bookNowRow, isTablet && styles.bookNowRowTablet]}>
          <View>
            <Text style={styles.fromText}>Starting from</Text>
            <Text style={styles.bookNowPrice}>₹1,499</Text>
          </View>
          <Pressable style={styles.bookNowAction}>
            <Text style={styles.bookNowActionText}>Book Now</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F6F1E8',
  },
  container: {
    paddingHorizontal: 16,
    paddingBottom: 30,
  },
  heroImageBackground: {
    width: '100%',
    height: 320,
    borderRadius: 28,
    overflow: 'hidden',
    marginTop: 16,
    marginBottom: 24,
    justifyContent: 'space-between',
  },
  heroImageStyle: {
    borderRadius: 28,
  },
  heroOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.22)',
  },
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 18,
    zIndex: 1,
  },
  heroBadge: {
    backgroundColor: '#FFFFFFE6',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  heroBadgeText: {
    fontWeight: '700',
    fontSize: 14,
    color: '#2A2A2A',
  },
  heroHeart: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: '#FFFFFFE6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroHeartText: {
    fontSize: 18,
    color: '#2A2A2A',
  },
  heroTextArea: {
    paddingHorizontal: 18,
    paddingBottom: 24,
    zIndex: 1,
  },
  heroHeadline: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 10,
  },
  heroMetaRow: {
    marginTop: 6,
  },
  heroMeta: {
    color: '#EAEAEA',
    fontSize: 14,
    lineHeight: 22,
  },
  section: {
    flexDirection: 'row',
    // flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  sectionRow: {
    flexDirection: 'row',
  },
  badgeChip: {
    minWidth: '30%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 16,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
    marginBottom: 12,
    marginRight: 12,
  },
  badgeIcon: {
    marginRight: 10,
    fontSize: 16,
  },
  badgeLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2E2E2E',
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1E1E1E',
  },
  serviceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  serviceCardSpacing: {
    marginTop: 0,
  },
  serviceImage: {
    width: '100%',
    height: 120,
  },
  serviceContent: {
    padding: 18,
  },
  serviceTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  serviceTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#161616',
    flex: 1,
    marginRight: 10,
  },
  serviceDuration: {
    fontSize: 13,
    fontWeight: '600',
    color: '#7A7A7A',
  },
  serviceSubtitle: {
    fontSize: 13,
    color: '#6E6E6E',
    marginBottom: 16,
    lineHeight: 20,
  },
  serviceActionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  servicePrice: {
    fontSize: 18,
    fontWeight: '800',
    color: '#212121',
  },
  bookButton: {
    backgroundColor: '#7B8B55',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  bookButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  reviewSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reviewSummary: {
    fontSize: 15,
    color: '#7A7A7A',
    fontWeight: '600',
  },
  reviewRow: {
    flexDirection: 'column',
  },
  reviewRowTablet: {
    flexDirection: 'row',
  },
  reviewCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 18,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
    marginBottom: 16,
  },
  reviewCardFlex: {
    flex: 1,
  },
  reviewCardMargin: {
    marginLeft: 16,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  reviewAvatar: {
    width: 44,
    height: 44,
    borderRadius: 16,
    backgroundColor: '#2E2E2E',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  reviewAvatarText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  reviewMeta: {
    flex: 1,
  },
  reviewAuthor: {
    fontSize: 15,
    fontWeight: '800',
    color: '#161616',
  },
  reviewWhen: {
    fontSize: 12,
    color: '#8B8B8B',
  },
  reviewRating: {
    fontSize: 14,
    fontWeight: '700',
    color: '#7B8C56',
  },
  reviewText: {
    fontSize: 14,
    color: '#585858',
    lineHeight: 20,
  },
  viewAllReviewsButton: {
    alignSelf: 'flex-start',
    marginBottom: 24,
  },
  viewAllReviewsText: {
    color: '#4D5B2D',
    fontWeight: '700',
    fontSize: 14,
  },
  mapCard: {
    position: 'relative',
    width: '100%',
    borderRadius: 24,
    overflow: 'hidden',
    height: 180,
    marginBottom: 16,
  },
  mapImage: {
    width: '100%',
    height: '100%',
  },
  mapOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.16)',
  },
  mapPinContainer: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    backgroundColor: '#222222',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
  },
  mapPinText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  locationDetails: {
    marginBottom: 24,
  },
  locationName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#181818',
    marginBottom: 6,
  },
  locationAddress: {
    fontSize: 14,
    color: '#6D6D6D',
    lineHeight: 20,
    marginBottom: 18,
  },
  locationActionRow: {
    flexDirection: 'column',
  },
  locationActionRowTablet: {
    flexDirection: 'row',
  },
  directionButton: {
    backgroundColor: '#7B8B55',
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    marginBottom: 12,
  },
  directionButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  outlineButton: {
    borderWidth: 1,
    borderColor: '#D7D2C5',
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  outlineButtonText: {
    color: '#3A3A3A',
    fontWeight: '700',
    fontSize: 14,
  },
  offerCard: {
    backgroundColor: '#232724',
    borderRadius: 28,
    padding: 24,
    marginBottom: 24,
  },
  offerLabel: {
    color: '#B9B7AD',
    fontSize: 13,
    marginBottom: 8,
  },
  offerTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 8,
  },
  offerSubtitle: {
    color: '#DFDCD1',
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 18,
  },
  offerButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignSelf: 'flex-start',
  },
  offerButtonText: {
    color: '#3A4A22',
    fontWeight: '800',
    fontSize: 14,
  },
  bookNowRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bookNowRowTablet: {
    justifyContent: 'space-between',
  },
  fromText: {
    fontSize: 13,
    color: '#7A7A7A',
    marginBottom: 4,
  },
  bookNowPrice: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1E1E1E',
  },
  bookNowAction: {
    backgroundColor: '#7B8B55',
    borderRadius: 18,
    paddingVertical: 18,
    paddingHorizontal: 32,
  },
  bookNowActionText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 16,
  },
});

export default SpaDetailsScreen;
