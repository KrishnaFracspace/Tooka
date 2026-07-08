import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import {
  Image,
  Platform,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { useNavigation } from '@react-navigation/native';

/**
 * NoPaymentHistoryScreen
 * -----------------------
 * Single-file, responsive empty-state screen recreated from the provided Figma.
 * Works across Android / iOS phones and tablets.
 *
 * Fonts assumed to be linked via react-native-asset / expo-font:
 *   - "Sora"       (for the title)
 *   - "WorkSans"   (for body / description)
 *
 * Illustration: replace the `require(...)` below with your own asset if desired.
 * We provide a fallback remote URL that shows a "no payment history" illustration.
 */

const PALETTE = {
  heroOrange: '#F5A623',
  heroOrangeDark: '#E89812',
  card: '#FDF6EC',
  title: '#1A1A1A',
  body: '#8E8E93',
  white: '#FFFFFF',
  backBtnBg: 'rgba(0, 0, 0, 0.18)',
};

const FONT = {
  sora: Platform.select({ ios: 'Sora', android: 'Sora', default: 'Sora' }) as string,
  workSans: Platform.select({ ios: 'WorkSans', android: 'WorkSans', default: 'WorkSans' }) as string,
};

interface NoPaymentHistoryScreenProps {
  onBack?: () => void;
  illustration?: number | { uri: string };
}
type NoPaymentHistoryNavigationProp = NativeStackNavigationProp<RootStackParamList, 'NoPayment'>;

const DEFAULT_ILLUSTRATION = {
  uri: 'https://cdn-icons-png.flaticon.com/512/6598/6598519.png',
};

export const NoPaymentHistoryScreen: React.FC<NoPaymentHistoryScreenProps> = ({
  illustration = DEFAULT_ILLUSTRATION,
}) => {
  const { width, height } = useWindowDimensions();

  // Responsive scaling: tablet vs phone
  const isTablet = Math.min(width, height) >= 600;
  const contentMaxWidth = isTablet ? 560 : width;
  const heroHeight = Math.min(height * 0.32, isTablet ? 340 : 280);
  const illustrationSize = isTablet ? 360 : Math.min(width * 0.72, 320);
  const navigation = useNavigation<NoPaymentHistoryNavigationProp>();
//   const navigation = useNavigation<ProfileNavigationProp>();

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={PALETTE.heroOrange}
        translucent={false}
      />

      {/* Orange hero background */}
      <View style={[styles.hero, { height: heroHeight }]}>
        <View style={styles.bubble1} />
        <View style={styles.bubble2} />
        <View style={styles.bubble3} />
        <View style={styles.bubble4} />

        <View style={styles.backButtonWrapper}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Go back"
            onPress={() => {
                navigation.goBack();
            }}
            android_ripple={{ color: 'rgba(255,255,255,0.25)', borderless: true }}
            style={({ pressed }) => [
              styles.backButton,
              pressed && Platform.OS === 'ios' && { opacity: 0.7 },
            ]}
            hitSlop={10}
          >
            <Icon name="chevron-back" size={22} color={PALETTE.white} />
          </Pressable>
        </View>
      </View>

      {/* Rounded card container that overlaps hero */}
      <View style={styles.cardWrapper} pointerEvents="box-none">
        <View
          style={[
            styles.card,
            { maxWidth: contentMaxWidth, alignSelf: 'center', width: '100%' },
          ]}
        >
          <View style={styles.content}>
            <Image
              source={illustration}
              style={{
                width: illustrationSize,
                height: illustrationSize,
                marginBottom: 24,
              }}
              resizeMode="contain"
              accessible
              accessibilityLabel="No payment history illustration"
            />

            <Text style={styles.title} allowFontScaling maxFontSizeMultiplier={1.3}>
              No Payment History Yet!
            </Text>

            <Text style={styles.body} allowFontScaling maxFontSizeMultiplier={1.4}>
              You haven't made any payments so far. Your booking payments and
              transaction receipts will appear here.
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default NoPaymentHistoryScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: PALETTE.card,
  },
  hero: {
    width: '100%',
    backgroundColor: PALETTE.heroOrange,
    overflow: 'hidden',
  },
  bubble1: {
    position: 'absolute',
    width: 320,
    height: 320,
    borderRadius: 200,
    backgroundColor: PALETTE.heroOrangeDark,
    opacity: 0.35,
    top: -140,
    right: -80,
  },
  bubble2: {
    position: 'absolute',
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: PALETTE.heroOrangeDark,
    opacity: 0.55,
    top: 60,
    left: 40,
  },
  bubble3: {
    position: 'absolute',
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: PALETTE.heroOrangeDark,
    opacity: 0.55,
    top: 30,
    left: '55%',
  },
  bubble4: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: PALETTE.heroOrangeDark,
    opacity: 0.6,
    bottom: 40,
    right: 30,
  },
  backButtonWrapper: {
    position: 'absolute',
    top: Platform.OS === 'android' ? 16 : 8,
    left: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: PALETTE.backBtnBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardWrapper: {
    flex: 1,
    marginTop: -160,
    paddingHorizontal: 0,
  },
  card: {
    flex: 1,
    backgroundColor: PALETTE.card,
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 48,
  },
  title: {
    fontFamily: FONT.sora,
    fontSize: 18,
    fontWeight: '700',
    color: PALETTE.title,
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: 0.2,
  },
  body: {
    fontFamily: FONT.workSans,
    fontSize: 14,
    fontWeight: '400',
    color: PALETTE.body,
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 360,
  },
});
