import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  FlatList,
  Image,
  ImageBackground,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
  type ListRenderItemInfo,
  type ViewStyle,
  type StyleProp,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../../navigation/AppNavigator';
import OfferCard from '../../components/OfferCard';
import { offer as offerData } from '../../data/homeData';
import { useSpaDetails } from '../../hooks/useSpaDetails';
import SpaDetailsSkeleton from '../../components/loaders/SpaDetailsSkeleton';
import StateMessage from '../../components/common/StateMessage';
import EnquiryModal from '../../components/EnquiryModal';
import { useAuth } from '../../context/AuthContext';
import { toSafeNumber, formatRating } from '../../utils/number';
import type { SpaDetails, SpaService, SpaReview } from '../../types/spaDetails';

const PLACEHOLDER_IMAGE = 'https://via.placeholder.com/1000x600';
const DEFAULT_LOCATION = 'Hyderabad';
const DEFAULT_RATING = 4.5;
const DEFAULT_DESCRIPTION = 'Experience luxury wellness and rejuvenation.';
const DEFAULT_NAME = 'Premium Wellness Spa';

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
type SpaDetailsRouteProp = RouteProp<RootStackParamList, 'SpaDetails'>;

type SpaServiceItem = SpaService;
type SpaReviewItem = SpaReview;

const mapAmenityChips = (spa: SpaDetails | null) => {
  const chips: BadgeChipProps[] = [];
  const profile = spa?.profile;

  if (spa?.is_verified) {
    chips.push({ icon: '✔️', label: 'Verified' });
  }

  if (profile?.has_steam_room) {
    chips.push({ icon: '💨', label: 'Steam Room' });
  }

  if (profile?.has_jacuzzi) {
    chips.push({ icon: '🛁', label: 'Jacuzzi' });
  }

  if (profile?.has_couple_room) {
    chips.push({ icon: '❤️', label: 'Couple Room' });
  }

  if (profile?.has_sauna) {
    chips.push({ icon: '🔥', label: 'Sauna' });
  }

  if (profile?.has_swimming_pool) {
    chips.push({ icon: '🏊', label: 'Swimming Pool' });
  }

  return chips;
};

const formatReviewDate = (dateString: string | null) => {
  if (!dateString) {
    return 'Recently';
  }

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return 'Recently';
  }

  return date.toLocaleDateString();
};

function SpaDetailsScreen(): React.ReactElement {
  const navigation = useNavigation<SpaDetailsNavigationProp>();
  const route = useRoute<SpaDetailsRouteProp>();
  const { spaId, serviceId, serviceName, openEnquiry } = route.params;
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;
  const offer = offerData;
  const { user, isAuthenticated } = useAuth();
  const { spa, loading, refreshing, error, refetch, onRefresh } = useSpaDetails(spaId);

  const [enquiryVisible, setEnquiryVisible] = useState(false);
  const [selectedService, setSelectedService] = useState<{ id?: string; name?: string }>({
    id: serviceId,
    name: serviceName,
  });

  // Auto-open the enquiry modal when returning from the auth flow.
  useEffect(() => {
    if (openEnquiry) {
      setSelectedService({ id: serviceId, name: serviceName });
      setEnquiryVisible(true);
      // Clear the flag so the modal does not reopen on re-render / refocus.
      navigation.setParams({ openEnquiry: false });
    }
  }, [openEnquiry, serviceId, serviceName, navigation]);

  const enquiryDefaults = useMemo(
    () => ({
      name: user?.userName ?? '',
      email: user?.email ?? '',
      message: '',
    }),
    [user?.userName, user?.email],
  );

  const handleSubmitEnquiry = useCallback(
    (values: { name: string; email: string; message: string }) => {
      const payload = {
        spaId,
        serviceId: selectedService.id,
        serviceName: selectedService.name,
        name: values.name,
        email: values.email,
        message: values.message,
      };
      // TODO: replace with submitEnquiry API call when backend is ready.
      console.log('submitEnquiry', payload);
      setEnquiryVisible(false);
    },
    [spaId, selectedService.id, selectedService.name],
  );

  const heroImage = useMemo(
    () => ({ uri: spa?.cover_photo_url ?? PLACEHOLDER_IMAGE }),
    [spa?.cover_photo_url],
  );

  const spaName = spa?.name ?? DEFAULT_NAME;
  const spaRating = toSafeNumber(spa?.rating_google, DEFAULT_RATING);
  const reviewSummary = `${toSafeNumber(spa?.review_count_google, 0)} reviews`;
  const spaLocation = spa?.locality_name ?? spa?.city_name ?? DEFAULT_LOCATION;
  const spaAddress = useMemo(() => {
    const parts: string[] = [];
    if (spa?.address_line1) parts.push(spa.address_line1);
    if (spa?.address_line2) parts.push(spa.address_line2);
    if (spa?.locality_name) parts.push(spa.locality_name);
    if (spa?.city_name) parts.push(spa.city_name);
    return parts.length ? parts.join(', ') : DEFAULT_LOCATION;
  }, [spa?.address_line1, spa?.address_line2, spa?.locality_name, spa?.city_name]);
  const spaDescription = spa?.tagline ?? spa?.description ?? spa?.editorial_summary ?? DEFAULT_DESCRIPTION;
  const amenityChips = useMemo(() => mapAmenityChips(spa), [spa]);
//   console.log("Servicess: ", spa?.services);

  const services = useMemo(() => spa?.services ?? [], [spa?.services]);
  const reviews = useMemo(() => spa?.reviews ?? [], [spa?.reviews]);

  const handlePressService = useCallback(
    (service: SpaServiceItem) => {
      setSelectedService({ id: service.id, name: service.name });

      if (isAuthenticated) {
        setEnquiryVisible(true);
        return;
      }

      navigation.navigate('Login', {
        spaId,
        serviceId: service.id,
        serviceName: service.name,
      });
    },
    [isAuthenticated, navigation, spaId],
  );

  const handleGetDirections = useCallback(() => {
    // TODO: Implement map navigation using spa coordinates
    if (__DEV__) {
      console.log('Get directions for', spa?.lat, spa?.lng);
    }
  }, [spa?.lat, spa?.lng]);

  const renderServiceItem = useCallback(
    ({ item, index }: ListRenderItemInfo<SpaServiceItem>) => {
      const durationText = item.duration_minutes != null ? `${item.duration_minutes} mins` : 'N/A';
      const priceText = item.base_price ? `${item.currency ?? 'INR'} ${item.base_price}` : 'Contact for price';
      const subtitleText = item.short_description ?? item.description ?? 'No description available';

      return (
        <ServiceCard
          key={item.id}
          imageSource={{ uri: item.cover_image_url ?? PLACEHOLDER_IMAGE }}
          title={item.name}
          duration={durationText}
          subtitle={subtitleText}
          price={priceText}
          style={index > 0 ? styles.serviceCardSpacing : undefined}
          onPress={() => handlePressService(item)}
        />
      );
    },
    [handlePressService],
  );

  const renderReviewItem = useCallback(
    ({ item, index }: ListRenderItemInfo<SpaReviewItem>) => (
      <ReviewCard
        key={item.id}
        author={item.reviewer_name ?? 'Guest'}
        when={formatReviewDate(item.created_at)}
        rating={formatRating(item.rating, DEFAULT_RATING)}
        text={item.comment ?? 'No comment available.'}
        style={[styles.reviewCardFlex, isTablet && index === 1 && styles.reviewCardMargin]}
      />
    ),
    [isTablet],
  );

  if (loading && spa === null) {
    return <SpaDetailsSkeleton />;
  }

  if (error && spa === null) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StateMessage
          title="Something went wrong"
          subtitle="Unable to load spa details."
          actionLabel="Try Again"
          onAction={refetch}
        />
      </SafeAreaView>
    );
  }

  if (!spa) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StateMessage
          title="Spa details not available."
          subtitle="Please try again."
          actionLabel="Retry"
          onAction={refetch}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <ImageBackground source={heroImage} style={styles.heroImageBackground} imageStyle={styles.heroImageStyle}>
          <View style={styles.heroOverlay} />
          <View style={styles.heroTopRow}>
            <View style={styles.heroBadge}>
              <Text style={styles.heroBadgeText}>{spaRating.toFixed(1)}</Text>
            </View>
            <Pressable style={styles.heroHeart}>
              <Text style={styles.heroHeartText}>♡</Text>
            </Pressable>
          </View>
          <View style={styles.heroTextArea}>
            <Text style={styles.heroHeadline}>{spaName}</Text>
            <View style={styles.heroMetaRow}>
              <Text style={styles.heroMeta}>⭐ {spaRating.toFixed(1)} ({reviewSummary})</Text>
              <Text style={styles.heroMeta}>{spaDescription}</Text>
            </View>
          </View>
        </ImageBackground>

        <View style={[styles.section, isTablet && styles.sectionRow]}>
          {amenityChips.map((item) => (
            <BadgeChip key={item.label} icon={item.icon} label={item.label} />
          ))}
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Popular Services</Text>
        </View>

        {services.length === 0 ? (
          <Text style={styles.emptyText}>No services available.</Text>
        ) : (
          <FlatList<SpaServiceItem>
            data={services}
            keyExtractor={(item) => item.id}
            renderItem={renderServiceItem}
            scrollEnabled={false}
            ItemSeparatorComponent={() => <View style={styles.listSeparator} />}
            removeClippedSubviews
          />
        )}

        <View style={[styles.sectionHeader, styles.reviewSectionHeader]}>
          <Text style={styles.sectionTitle}>What Guests Say</Text>
          <Text style={styles.reviewSummary}>{reviewSummary}</Text>
        </View>

        {reviews.length === 0 ? (
          <Text style={styles.emptyText}>No reviews available yet.</Text>
        ) : (
          <FlatList<SpaReviewItem>
            data={reviews}
            keyExtractor={(item) => item.id}
            renderItem={renderReviewItem}
            scrollEnabled={false}
            numColumns={isTablet ? 2 : 1}
            columnWrapperStyle={isTablet ? styles.reviewRowTablet : undefined}
            ItemSeparatorComponent={() => <View style={styles.listSeparator} />}
            removeClippedSubviews
          />
        )}

        <Pressable style={styles.viewAllReviewsButton}>
          <Text style={styles.viewAllReviewsText}>View All Reviews</Text>
        </Pressable>

        <Text style={styles.sectionTitle}>Location</Text>
        <View style={styles.mapCard}>
          <Image source={{ uri: spa.cover_photo_url ?? PLACEHOLDER_IMAGE }} style={styles.mapImage} resizeMode="cover" />
          <View style={styles.mapOverlay} />
          <View style={styles.mapPinContainer}>
            <Text style={styles.mapPinText}>⭐ {spaRating.toFixed(1)}</Text>
          </View>
        </View>

        <View style={styles.locationDetails}>
          <View>
            <Text style={styles.locationName}>{spaName}</Text>
            <Text style={styles.locationAddress}>{spaAddress}</Text>
          </View>
          <View style={[styles.locationActionRow, isTablet && styles.locationActionRowTablet]}>
            <Pressable style={styles.directionButton} onPress={handleGetDirections}>
              <Text style={styles.directionButtonText}>Get Directions</Text>
            </Pressable>
            <Pressable style={styles.outlineButton}>
              <Text style={styles.outlineButtonText}>View Opening Hours</Text>
            </Pressable>
          </View>
        </View>

        <OfferCard
          item={offer}
          onPress={() => {
            // TODO: Add offer action
          }}
        />

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

      <EnquiryModal
        visible={enquiryVisible}
        onClose={() => setEnquiryVisible(false)}
        onSubmit={handleSubmitEnquiry}
        defaultValues={enquiryDefaults}
      />
    </SafeAreaView>
  );
}

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
    backgroundColor: '#FFB02E',
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
    justifyContent: 'space-between',
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
    backgroundColor: '#FFB02E',
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
    backgroundColor: '#FFB02E',
    borderRadius: 18,
    paddingVertical: 18,
    paddingHorizontal: 32,
  },
  bookNowActionText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 16,
  },
  listSeparator: {
    height: 0,
  },
  emptyText: {
    fontSize: 14,
    color: '#7A7A7A',
    marginBottom: 16,
  },
});

export default SpaDetailsScreen;
