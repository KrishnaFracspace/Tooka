import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  FlatList,
  Image,
  Linking,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
  type ListRenderItemInfo,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Ionicons from 'react-native-vector-icons/Ionicons';

import SpaDetailsSkeleton from '../../components/loaders/SpaDetailsSkeleton';
import StateMessage from '../../components/common/StateMessage';
import { useAuth } from '../../context/AuthContext';
import type { RootStackParamList } from '../../navigation/AppNavigator';
import type { SpaDetails, SpaService, SpaReview } from '../../types/spaDetails';
import { formatRating, toSafeNumber } from '../../utils/number';
import { offer as offerData } from '../../data/homeData';

const PLACEHOLDER_IMAGE = 'https://via.placeholder.com/1000x600';
const DEFAULT_LOCATION = 'Hyderabad';
const DEFAULT_RATING = 4.5;
const DEFAULT_DESCRIPTION = 'Experience luxury wellness and rejuvenation.';
const DEFAULT_NAME = 'Premium Wellness Spa';
const DEFAULT_PRICE = '₹1,499';
const HORIZONTAL_SCREEN_PADDING = 15;

type BadgeChipProps = {
  label: string;
  icon: string;
};

type InfoTileProps = {
  iconName: string;
  title: string;
  subtitle: string;
};

type ServiceCardProps = {
  title: string;
  duration: string;
  subtitle: string;
  price: string;
  category: string;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
};

type ReviewCardProps = {
  author: string;
  when: string;
  rating: string;
  text: string;
  width: number;
  style?: StyleProp<ViewStyle>;
};

type SpaDetailsContentProps = {
  spa: SpaDetails | null;
  loading: boolean;
  error: string | null;
  onRetry?: () => void;
  spaId: string;
  serviceId?: string;
  serviceName?: string;
  openEnquiry?: boolean;
  onBookSpa?: (spaId: string, serviceId?: string, serviceName?: string) => void;
  onBack?: () => void;
  showBackButton?: boolean;
  showBookBar?: boolean;
};

type SpaDetailsNavigationProp = NativeStackNavigationProp<RootStackParamList>;

type SpaServiceItem = SpaService;
type SpaReviewItem = SpaReview;

const InfoTile: React.FC<InfoTileProps> = ({ iconName, title, subtitle }) => (
  <View style={styles.infoTile}>
    <View style={styles.infoIconCircle}>
      <Ionicons name={iconName} size={16} color="#FFAA26" />
    </View>
    <View style={styles.infoTextColumn}>
      <Text style={styles.infoTitle} numberOfLines={1}>
        {title}
      </Text>
      <Text style={styles.infoSubtitle} numberOfLines={1}>
        {subtitle}
      </Text>
    </View>
  </View>
);

const BadgeChip: React.FC<BadgeChipProps> = ({ label, icon }) => (
  <View style={styles.badgeChip}>
    <Text style={styles.badgeIcon}>{icon}</Text>
    <Text style={styles.badgeLabel} numberOfLines={1}>
      {label}
    </Text>
  </View>
);

const ListSeparator: React.FC = () => <View style={styles.listSeparator} />;

const ServiceCard: React.FC<ServiceCardProps> = ({
  title,
  duration,
  subtitle,
  price,
  category,
  onPress,
  style,
}) => (
  <Pressable
    style={({ pressed }) => [styles.serviceCard, pressed && styles.pressedCard, style]}
    onPress={onPress}
    accessibilityRole="button"
    accessibilityLabel={`Book ${title}`}
  >
    <View style={styles.serviceTitleRow}>
      <Text style={styles.serviceTitle} numberOfLines={2}>
        {title}
      </Text>
      <Text style={styles.servicePrice}>{price}</Text>
    </View>
    {subtitle != "" &&
    <Text style={styles.serviceSubtitle} numberOfLines={3}>
      {subtitle}
    </Text>
    }
    <View style={styles.serviceMetaRow}>
      <View style={styles.metaPill}>
        <Ionicons name="time-outline" size={14} color="#9A9A9A" />
        <Text style={styles.metaText}>{duration}</Text>
      </View>
      <View style={styles.metaPill}>
        <Ionicons name="sparkles-outline" size={14} color="#9A9A9A" />
        <Text style={styles.metaText} numberOfLines={1}>
          {category}
        </Text>
      </View>
    </View>
  </Pressable>
);

const ReviewCard: React.FC<ReviewCardProps> = ({ author, when, rating, text, width, style }) => {
  const ratingValue = Math.max(0, Math.min(5, Math.round(toSafeNumber(rating, DEFAULT_RATING))));

  return (
    <View style={[styles.reviewCard, { width }, style]}>
      <View style={styles.reviewHeader}>
        <View style={styles.reviewAvatar}>
          <Text style={styles.reviewAvatarText}>{author.charAt(0).toUpperCase()}</Text>
        </View>
        <Text style={styles.reviewAuthor} numberOfLines={1}>
          {author}
        </Text>
      </View>
      <View style={styles.reviewRatingRow}>
        {Array.from({ length: 5 }).map((_, index) => (
          <Ionicons
            key={`${author}-star-${index}`}
            name={index < ratingValue ? 'star' : 'star-outline'}
            size={15}
            color="#F8C51D"
          />
        ))}
        <Text style={styles.reviewWhen}>• {when}</Text>
      </View>
      <Text style={styles.reviewText} numberOfLines={4}>
        {text}
      </Text>
    </View>
  );
};

const mapAmenityChips = (spa: SpaDetails | null) => {
  const chips: BadgeChipProps[] = [];
  const profile = spa?.profile;

  if (spa?.is_verified) {
    chips.push({ icon: '✓', label: 'Verified' });
  }

  if (profile?.has_steam_room) {
    chips.push({ icon: '♨', label: 'Steam Room' });
  }

  if (profile?.has_jacuzzi) {
    chips.push({ icon: '○', label: 'Jacuzzi' });
  }

  if (profile?.has_couple_room) {
    chips.push({ icon: '♡', label: 'Couple Room' });
  }

  if (profile?.has_sauna) {
    chips.push({ icon: '△', label: 'Sauna' });
  }

  if (profile?.has_swimming_pool) {
    chips.push({ icon: '≈', label: 'Swimming Pool' });
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

const formatServicePrice = (price: string | null, currency: string | null) => {
  if (!price) {
    return 'Contact';
  }

  const numericPrice = Number(price);
  const formattedPrice = Number.isFinite(numericPrice)
    ? numericPrice.toLocaleString('en-IN', { maximumFractionDigits: 0 })
    : price;

  if (!currency || currency.toUpperCase() === 'INR') {
    return `₹${formattedPrice}`;
  }

  return `${currency} ${formattedPrice}`;
};

const getLowestServicePrice = (services: SpaServiceItem[]) => {
  const prices = services
    .map((service) => Number(service.base_price))
    .filter((price) => Number.isFinite(price) && price > 0);

  if (prices.length === 0) {
    return DEFAULT_PRICE;
  }

  return `₹${Math.min(...prices).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
};

const getTimingSummary = (spa: SpaDetails | null) => {
  const firstTiming = spa?.timings?.find((timing) => timing.open && timing.close);

  if (!firstTiming?.open || !firstTiming.close) {
    return 'Hours unavailable';
  }

  return `${firstTiming.open} - ${firstTiming.close}`;
};

const SpaDetailsContent = memo(function SpaDetailsContent({
  spa,
  loading,
  error,
  onRetry,
  spaId,
  serviceId,
  serviceName,
  onBookSpa,
  onBack,
  openEnquiry = false,
  showBackButton = true,
  showBookBar = true,
}: SpaDetailsContentProps): React.ReactElement {
  const navigation = useNavigation<SpaDetailsNavigationProp>();
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;
  const contentWidth = Math.min(width, 1200);
  const heroCardWidth = Math.max(280, contentWidth - HORIZONTAL_SCREEN_PADDING * 2);
  const reviewCardWidth = isTablet ? 300 : Math.max(260, width * 0.64);
  const offer = offerData;
  const { user, isAuthenticated } = useAuth();
  // console.log('Auth: ', isAuthenticated, user);

  const [selectedHeroIndex, setSelectedHeroIndex] = useState(0);
  const [selectedService, setSelectedService] = useState<{ id?: string; name?: string }>({
    id: serviceId,
    name: serviceName,
  });
  // console.log("Spa details: ", spa?.is_bookable);

  useEffect(() => {
    setSelectedService({ id: serviceId, name: serviceName });
  }, [serviceId, serviceName]);

  const heroImage = useMemo(() => ({ uri: spa?.cover_photo_url ?? PLACEHOLDER_IMAGE }), [spa?.cover_photo_url]);

  const spaName = spa?.name ?? DEFAULT_NAME;
  const spaRating = toSafeNumber(spa?.rating_google, DEFAULT_RATING);
  const reviewCount = toSafeNumber(spa?.review_count_google, 0);
  const reviewSummary = `${reviewCount.toLocaleString('en-IN')} reviews`;
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

  const services = useMemo(() => spa?.services ?? [], [spa?.services]);
  const reviews = useMemo(() => spa?.reviews ?? [], [spa?.reviews]);
  const featuredServices = useMemo(() => services.slice(0, 3), [services]);
  const startingPrice = useMemo(() => getLowestServicePrice(services), [services]);
  const openingSummary = useMemo(() => getTimingSummary(spa), [spa]);
  const heroImages = useMemo(() => {
    const urls = [
      spa?.cover_photo_url,
      ...(spa?.gallery?.map((item) => item.image_url) ?? []),
    ].filter((url): url is string => Boolean(url));

    const uniqueUrls = Array.from(new Set(urls));
    return uniqueUrls.length ? uniqueUrls.map((uri) => ({ uri })) : [heroImage];
  }, [heroImage, spa?.cover_photo_url, spa?.gallery]);

  const handlePressService = useCallback(
    (service: SpaServiceItem) => {
      setSelectedService({ id: service.id, name: service.name });

      if (onBookSpa) {
        onBookSpa(spaId, service.id, service.name);
        return;
      }

      if (isAuthenticated) {
        return;
      }

      navigation.navigate('Login', {
        spaId,
        serviceId: service.id,
        serviceName: service.name,
      });
    },
    [isAuthenticated, navigation, onBookSpa, spaId],
  );

  // const handleGetDirections = useCallback(() => {
  //   Linking.openURL(spa.google_maps_url)
  //   if (__DEV__) {
  //     console.log('Get directions for', spa?.lat, spa?.lng);
  //   }
  // }, [spa?.lat, spa?.lng]);

  const handleGetDirections = useCallback(async () => {
    const url = spa?.google_maps_url;

    if (!url) {
      console.warn('Google Maps URL is missing');
      return;
    }

    try {
      const supported = await Linking.canOpenURL(url);

      if (supported) {
        await Linking.openURL(url);
      } else {
        console.warn('Cannot open URL:', url);
      }
    } catch (error) {
      console.error('Failed to open Google Maps URL', error);
    }
  }, [spa?.google_maps_url]);

  const handleHeroScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const nextIndex = Math.round(event.nativeEvent.contentOffset.x / heroCardWidth);
      setSelectedHeroIndex(Math.max(0, Math.min(nextIndex, heroImages.length - 1)));
    },
    [heroCardWidth, heroImages.length],
  );

  const handlePressBookNow = useCallback(() => {
    if (services[0]) {
      handlePressService(services[0]);
    }
  }, [handlePressService, services]);

  const renderServiceItem = useCallback(
    ({ item, index }: ListRenderItemInfo<SpaServiceItem>) => {
      console.log("Services: ",item);
      const durationText = item.duration_minutes != null ? `${item.duration_minutes} min` : 'N/A';
      const priceText = formatServicePrice(item.base_price, item.currency);
      const subtitleText = item.short_description ?? item.description ?? "";
      const categoryText = item.category ?? 'Wellness';

      return (
        <ServiceCard
          key={item.id}
          title={item.name}
          duration={durationText}
          subtitle={subtitleText}
          price={priceText}
          category={categoryText}
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
        width={reviewCardWidth}
        style={index > 0 ? styles.reviewCardSpacing : undefined}
      />
    ),
    [reviewCardWidth],
  );

  if (loading && spa === null) {
    return <SpaDetailsSkeleton />;
  }

  // if (error && spa === null) {
  //   return (
  //     <View style={styles.contentFallback}>
  //       <StateMessage
  //         title="Something went wrong"
  //         subtitle={error}
  //         actionLabel="Try Again"
  //         onAction={onRetry ?? (() => undefined)}
  //       />
  //     </View>
  //   );
  // }

  if (!spa) {
    return <SpaDetailsSkeleton />;
  }

  return (
    <View style={styles.contentRoot}>
      <View style={styles.heroShell}>
        <FlatList
          data={heroImages}
          horizontal
          keyExtractor={(item, index) => `${item.uri}-${index}`}
          showsHorizontalScrollIndicator={false}
          snapToInterval={heroCardWidth + 12}
          decelerationRate="fast"
          bounces={false}
          onMomentumScrollEnd={handleHeroScroll}
          contentContainerStyle={styles.heroList}
          renderItem={({ item }) => (
            <Image
              source={item}
              style={[styles.heroImage, { width: heroCardWidth }]}
              resizeMode="cover"
              accessibilityIgnoresInvertColors
            />
          )}
        />

        {showBackButton && (
          <Pressable
            style={styles.backButton}
            onPress={onBack ?? (() => navigation.goBack())}
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
          </Pressable>
        )}

        {/* <Pressable
          style={styles.favoriteButton}
          hitSlop={10}
          accessibilityRole="button"
          accessibilityLabel="Save spa"
        >
          <Ionicons name="heart-outline" size={26} color="#FFFFFF" />
        </Pressable> */}

        {heroImages.length > 1 && (
          <View style={styles.pagination}>
            {heroImages.slice(0, 5).map((item, index) => (
              <View
                key={`${item.uri}-dot-${index}`}
                style={[styles.paginationDot, index === selectedHeroIndex && styles.paginationDotActive]}
              />
            ))}
          </View>
        )}
      </View>

      <View style={styles.headingRow}>
        <View style={styles.headingTextColumn}>
          <Text style={styles.spaName}>{spaName}</Text>
          <View style={styles.locationRow}>
            <Ionicons name="location-outline" size={17} color="#6C6258" />
            <Text style={styles.locationText} numberOfLines={1}>
              {spaLocation}
            </Text>
          </View>
        </View>
        <View style={styles.ratingRow} accessible accessibilityLabel={`${spaRating.toFixed(1)} rating, ${reviewSummary}`}>
          <Ionicons name="star" size={17} color="#E8C520" />
          <Text style={styles.ratingText}>
            {spaRating.toFixed(1)} <Text style={styles.ratingCount}>({reviewCount.toLocaleString('en-IN')})</Text>
          </Text>
        </View>
      </View>

      <Text style={styles.descriptionText} numberOfLines={3}>
        {spaDescription}
      </Text>

      <View style={styles.infoGrid}>
        <InfoTile iconName="time-outline" title="Open" subtitle={openingSummary} />
        <InfoTile
          iconName="shield-checkmark-outline"
          title={spa.is_verified ? 'Trusted Partner' : 'Partner Spa'}
          subtitle={spa.is_verified ? 'Verified spa' : 'Wellness spa'}
        />
      </View>

      {amenityChips.length > 0 && (
        <View style={styles.amenitiesList}>
          {amenityChips.map((item) => (
            <BadgeChip key={item.label} icon={item.icon} label={item.label} />
          ))}
        </View>
      )}

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Featured Treatments</Text>
      </View>

      {featuredServices.length === 0 ? (
        <Text style={styles.emptyText}>No services available.</Text>
      ) : (
        <FlatList<SpaServiceItem>
          data={featuredServices}
          keyExtractor={(item) => item.id}
          renderItem={renderServiceItem}
          scrollEnabled={false}
          ItemSeparatorComponent={ListSeparator}
          removeClippedSubviews
        />
      )}

      {/* {services.length > 3 && (
        <Pressable
          style={styles.viewAllTreatmentsButton}
          accessibilityRole="button"
          accessibilityLabel="View all treatments"
        >
          <Text style={styles.viewAllTreatmentsText}>View all treatments</Text>
          <Ionicons name="chevron-forward" size={18} color="#2D2B28" />
        </Pressable>
      )} */}

      <View style={[styles.sectionHeader, styles.reviewSectionHeader]}>
        <Text style={styles.sectionTitle}>What Guests Say</Text>
      </View>

      {reviews.length === 0 ? (
        <Text style={styles.emptyText}>No reviews available yet.</Text>
      ) : (
        <FlatList<SpaReviewItem>
          data={reviews}
          horizontal
          keyExtractor={(item) => item.id}
          renderItem={renderReviewItem}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.reviewList}
          removeClippedSubviews
        />
      )}

      {/* <Text style={[styles.sectionTitle, styles.standaloneSectionTitle]}>Exclusive Offers</Text>
      <Pressable
        style={styles.offerCard}
        onPress={() => {}}
        accessibilityRole="button"
        accessibilityLabel={`${offer.title} ${offer.subtitle}`}
      >
        <Image
          source={heroImage}
          style={styles.offerImage}
          resizeMode="cover"
          accessibilityIgnoresInvertColors
        />
        <View style={styles.offerOverlay} />
        <View style={styles.offerContent}>
          <Text style={styles.offerLabel}>{offer.label}</Text>
          <Text style={styles.offerTitle}>{offer.title}</Text>
          <Text style={styles.offerSubtitle}>{offer.subtitle}</Text>
        </View>
        <View style={styles.offerButton}>
          <Text style={styles.offerButtonText}>{offer.cta}</Text>
        </View>
      </Pressable> */}

      <Text style={[styles.sectionTitle, styles.standaloneSectionTitle]}>Location</Text>
      <View style={styles.locationCard}>
        {/* <View style={styles.mapPreview}>
          <View style={[styles.mapRoad, styles.mapRoadOne]} />
          <View style={[styles.mapRoad, styles.mapRoadTwo]} />
          <View style={[styles.mapRoad, styles.mapRoadThree]} />
          <Text style={[styles.mapLabel, styles.mapLabelTop]}>Shri Peddamma Talli Temple</Text>
          <Text style={[styles.mapLabel, styles.mapLabelBottom]}>Malkam Cheruvu Park</Text>
          <View style={styles.mapMarker}>
            <Ionicons name="location-sharp" size={24} color="#FFFFFF" />
          </View>
        </View> */}
        <View style={styles.locationAddressRow}>
          <Text style={styles.locationAddress} numberOfLines={3}>
            {spaAddress}
          </Text>
          {spa.google_maps_url &&
            <Pressable
              style={styles.directionButton}
              onPress={handleGetDirections}
              accessibilityRole="button"
              accessibilityLabel="Get directions"
            >
              <Ionicons name="navigate" size={20} color="#FFFFFF" />
            </Pressable>
          }
        </View>
      </View>

      

      {showBookBar && (
        <View style={styles.bookNowRow}>
          <View style={styles.bookNowPriceColumn}>
            <Text style={styles.fromText}>Starting from</Text>
            <Text style={styles.bookNowPrice}>{startingPrice}</Text>
          </View>
          <Pressable
            style={({ pressed }) => [
              styles.bookNowAction,
              pressed && styles.bookNowActionPressed,
              !spa.is_bookable && styles.bookNowActionDisabled,
            ]}
            onPress={handlePressBookNow}
            disabled={!spa.is_bookable}
            accessibilityRole="button"
            accessibilityLabel="Book now"
          >
            <Text style={styles.bookNowActionText}>Book Now</Text>
          </Pressable>
        </View>
      )}

    </View>
  );
});

const styles = StyleSheet.create({
  contentRoot: {
    flex: 1,
    backgroundColor: '#FBF3EA',
    paddingBottom: 0,
  },
  contentFallback: {
    paddingVertical: 56,
    paddingHorizontal: 24,
    backgroundColor: '#FBF3EA',
  },
  heroShell: {
    position: 'relative',
    marginTop: 12,
    marginBottom: 26,
  },
  heroList: {
    paddingHorizontal: HORIZONTAL_SCREEN_PADDING,
    columnGap: 12,
  },
  heroImage: {
    height: 322,
    borderRadius: 8,
    backgroundColor: '#E4D8C8',
  },
  backButton: {
    position: 'absolute',
    top: 18,
    left: 22,
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(61, 45, 34, 0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  favoriteButton: {
    position: 'absolute',
    right: 32,
    bottom: 22,
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pagination: {
    position: 'absolute',
    bottom: 28,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  paginationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FFFFFF',
  },
  paginationDotActive: {
    width: 30,
    backgroundColor: '#FFAA26',
  },
  headingRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: HORIZONTAL_SCREEN_PADDING,
    marginBottom: 26,
    gap: 16,
  },
  headingTextColumn: {
    flex: 1,
  },
  spaName: {
    color: '#282725',
    fontSize: 22,
    fontWeight: '800',
    lineHeight: 28,
    marginBottom: 10,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  locationText: {
    flex: 1,
    color: '#5F5952',
    fontSize: 15,
    fontWeight: '500',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingTop: 5,
  },
  ratingText: {
    color: '#8C8881',
    fontSize: 14,
    fontWeight: '800',
  },
  ratingCount: {
    color: '#8C8881',
    fontWeight: '600',
  },
  infoGrid: {
    flexDirection: 'row',
    paddingHorizontal: HORIZONTAL_SCREEN_PADDING,
    gap: 12,
    marginBottom: 22,
  },
  infoTile: {
    flex: 1,
    minHeight: 70,
    borderRadius: 9,
    backgroundColor: '#FFF8EE',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    shadowColor: '#8B6C45',
    shadowOpacity: 0.05,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 5 },
    elevation: 1,
  },
  infoIconCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: '#FFAA26',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  infoTextColumn: {
    flex: 1,
  },
  infoTitle: {
    color: '#292825',
    fontSize: 16,
    fontWeight: '800',
    lineHeight: 22,
  },
  infoSubtitle: {
    color: '#5F5952',
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
  },
  amenitiesList: {
    flexDirection: 'row',
    paddingHorizontal: HORIZONTAL_SCREEN_PADDING,
    paddingBottom: 20,
    gap: 10,
    flexWrap: 'wrap',
  },
  badgeChip: {
    minHeight: 36,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    gap: 7,
  },
  badgeIcon: {
    color: '#FFAA26',
    fontSize: 14,
    fontWeight: '800',
  },
  badgeLabel: {
    color: '#4E4943',
    fontSize: 13,
    fontWeight: '700',
  },
  sectionHeader: {
    paddingHorizontal: HORIZONTAL_SCREEN_PADDING,
    marginBottom: 0,
  },
  sectionTitle: {
    color: '#282725',
    fontSize: 21,
    fontWeight: '800',
    lineHeight: 28,
    marginBottom: 18,
  },
  standaloneSectionTitle: {
    paddingHorizontal: HORIZONTAL_SCREEN_PADDING,
  },
  reviewSectionHeader: {
    marginTop: 12,
  },
  serviceCard: {
    marginHorizontal: HORIZONTAL_SCREEN_PADDING,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 24,
    paddingVertical: 15,
    shadowColor: '#7E6342',
    shadowOpacity: 0.06,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 2,
  },
  serviceCardSpacing: {
    marginTop: 14,
  },
  pressedCard: {
    transform: [{ scale: 0.995 }],
    opacity: 0.92,
  },
  serviceTitleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 14,
    marginBottom: 12,
  },
  serviceTitle: {
    flex: 1,
    color: '#262523',
    fontSize: 20,
    fontWeight: '800',
    lineHeight: 25,
  },
  servicePrice: {
    color: '#FFA323',
    fontSize: 20,
    fontWeight: '900',
    lineHeight: 25,
  },
  serviceSubtitle: {
    color: '#8A8A8A',
    fontSize: 15,
    fontWeight: '500',
    lineHeight: 24,
    marginBottom: 18,
  },
  serviceMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18,
  },
  metaPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    maxWidth: '48%',
  },
  metaText: {
    color: '#929292',
    fontSize: 13,
    fontWeight: '700',
  },
  viewAllTreatmentsButton: {
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingVertical: 16,
    marginBottom: 12,
  },
  viewAllTreatmentsText: {
    color: '#2D2B28',
    fontSize: 15,
    fontWeight: '700',
  },
  reviewList: {
    paddingHorizontal: HORIZONTAL_SCREEN_PADDING,
    paddingBottom: 24,
  },
  reviewCard: {
    minHeight: 152,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#7E6342',
    shadowOpacity: 0.05,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 2,
  },
  reviewCardSpacing: {
    marginLeft: 12,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    gap: 12,
  },
  reviewAvatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#232323',
    alignItems: 'center',
    justifyContent: 'center',
  },
  reviewAvatarText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  reviewAuthor: {
    flex: 1,
    color: '#2B2926',
    fontSize: 16,
    fontWeight: '800',
  },
  reviewRatingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    marginBottom: 10,
  },
  reviewWhen: {
    color: '#989898',
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 4,
  },
  reviewText: {
    color: '#4B4946',
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
  },
  offerCard: {
    height: 128,
    marginHorizontal: HORIZONTAL_SCREEN_PADDING,
    marginBottom: 28,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#33210F',
  },
  offerImage: {
    ...StyleSheet.absoluteFill,
    width: '100%',
    height: '100%',
  },
  offerOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(39, 22, 7, 0.58)',
  },
  offerContent: {
    position: 'absolute',
    left: 20,
    top: 20,
    right: 140,
  },
  offerLabel: {
    color: '#F6EFE7',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 12,
  },
  offerTitle: {
    fontFamily:'Sora-Bold',
    color: '#FFFFFF',
    fontSize: 18,
    // fontWeight: '900',
    // lineHeight: 28,
    marginBottom: 8,
  },
  offerSubtitle: {
    fontFamily:'WorkSans-Medium',
    color: '#FFF4E4',
    fontSize: 13,
    // fontWeight: '800',
    // lineHeight: 20,
  },
  offerButton: {
    position: 'absolute',
    right: 22,
    bottom: 28,
    backgroundColor: '#FFB02E',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  offerButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
  },
  locationCard: {
    marginHorizontal: HORIZONTAL_SCREEN_PADDING,
    marginBottom: 15,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    shadowColor: '#7E6342',
    shadowOpacity: 0.06,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 2,
  },
  mapPreview: {
    // height: 174,
    overflow: 'hidden',
    backgroundColor: '#C7D0D0',
  },
  mapRoad: {
    position: 'absolute',
    height: 18,
    borderRadius: 9,
    backgroundColor: 'rgba(170, 177, 177, 0.7)',
  },
  mapRoadOne: {
    left: -40,
    right: -30,
    top: 40,
    transform: [{ rotate: '-24deg' }],
  },
  mapRoadTwo: {
    left: 70,
    right: -60,
    top: 112,
    transform: [{ rotate: '13deg' }],
  },
  mapRoadThree: {
    width: 230,
    left: -30,
    top: 118,
    transform: [{ rotate: '61deg' }],
  },
  mapLabel: {
    position: 'absolute',
    color: 'rgba(78, 120, 110, 0.72)',
    fontSize: 18,
    fontWeight: '800',
    lineHeight: 22,
  },
  mapLabelTop: {
    top: 20,
    right: 30,
    width: 210,
    color: 'rgba(106, 112, 122, 0.56)',
  },
  mapLabelBottom: {
    left: 40,
    bottom: 16,
    width: 180,
  },
  mapMarker: {
    position: 'absolute',
    left: '43%',
    top: '42%',
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFAA26',
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationAddressRow: {
    minHeight: 72,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 14,
    gap: 14,
  },
  locationAddress: {
    flex: 1,
    color: '#969696',
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 22,
  },
  directionButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#242424',
    alignItems: 'center',
    justifyContent: 'center',
  },
  descriptionText: {
    color: '#1f1f1f',
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 21,
    paddingHorizontal: HORIZONTAL_SCREEN_PADDING,
    marginTop: -20,
    marginBottom:12
  },
  bookNowRow: {
    marginTop: 0,
    minHeight: 50,
    backgroundColor: '#FBF3EA',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: HORIZONTAL_SCREEN_PADDING,
    paddingTop: 12,
    paddingBottom: 0,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(112, 96, 77, 0.08)',
    gap: 18,
  },
  bookNowPriceColumn: {
    minWidth: 102,
  },
  fromText: {
    color: '#A19A93',
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
    marginBottom: 3,
  },
  bookNowPrice: {
    color: '#262523',
    fontSize: 30,
    fontWeight: '900',
    lineHeight: 36,
  },
  bookNowAction: {
    flex: 1,
    minHeight: 59,
    borderRadius: 10,
    backgroundColor: '#FFB02E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookNowActionPressed: {
    opacity: 0.88,
  },
  bookNowActionDisabled: {
    opacity: 0.45,
  },
  bookNowActionText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
  },
  listSeparator: {
    height: 0,
  },
  emptyText: {
    color: '#7A746E',
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 22,
    marginHorizontal: HORIZONTAL_SCREEN_PADDING,
    marginBottom: 22,
  },
});

export default SpaDetailsContent;
