import { Platform, StyleSheet } from 'react-native';

export const colors = {
  background: '#FBF3EA',
  primary: '#FFAA26',
  primaryDark: '#E8950F',
  heading: '#2D2B28',
  body: '#6C6258',
  muted: '#9A9084',
  border: '#EBE3D7',
  white: '#FFFFFF',
  disabled: '#F4EFEA',
  priceBubble: '#FFF3E0',
  accentGreenBg: '#EBF7ED',
  accentGreenText: '#2E7D32',
  ratingGold: '#F8C51D',
};

export const fonts = {
  heading: 'Sora-SemiBold',
  subHeading: 'Sora-Medium',
  body: 'WorkSans-Medium',
  regular: 'WorkSans-Regular',
};

export const sharedShadow = {
  shadowColor: '#3D2D22',
  shadowOpacity: 0.06,
  shadowRadius: 10,
  shadowOffset: { width: 0, height: 4 },
  elevation: 2,
};

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  tabletContent: {
    alignSelf: 'center',
    maxWidth: 720,
    width: '100%',
  },

  // ──────────────────────────────────────────────
  // Top Header & Hero/Summary Component
  // ──────────────────────────────────────────────
  heroWrap: {
    backgroundColor: colors.background,
    paddingTop: Platform.OS === 'ios' ? 12 : 16,
  },
  topHeaderBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  headerBackButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    ...sharedShadow,
  },
  headerTitle: {
    fontFamily: fonts.heading,
    fontSize: 18,
    color: colors.heading,
  },
  headerRightPlaceholder: {
    width: 38,
  },

  // Spa Confirmation Summary Card
  summaryCard: {
    marginHorizontal: 18,
    marginBottom: 16,
    borderRadius: 16,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    ...sharedShadow,
  },
  spaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  spaThumbnail: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: '#EFE6DC',
  },
  spaMetaColumn: {
    flex: 1,
    marginLeft: 12,
  },
  spaNameText: {
    fontFamily: fonts.heading,
    fontSize: 16,
    color: colors.heading,
    marginBottom: 4,
  },
  spaLocationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  spaLocationText: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.body,
    marginLeft: 4,
    flex: 1,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  ratingText: {
    fontFamily: fonts.subHeading,
    fontSize: 13,
    color: colors.heading,
    marginLeft: 3,
  },

  // Selected Treatment Detail Divider & Box
  serviceDivider: {
    height: 1,
    backgroundColor: '#F3EDE4',
    marginVertical: 12,
  },
  selectedServiceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectedServiceMeta: {
    flex: 1,
    paddingRight: 10,
  },
  serviceCardTitle: {
    fontFamily: fonts.heading,
    fontSize: 15,
    color: colors.heading,
    marginBottom: 4,
  },
  servicePillsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  metaPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7EFE6',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  metaPillText: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.body,
    marginLeft: 4,
  },
  servicePriceText: {
    fontFamily: fonts.heading,
    fontSize: 18,
    color: colors.primaryDark,
  },

  // Legacy fallback styles for compatibility
  heroImageWrap: { width: 0, height: 0 },
  heroImage: { width: 0, height: 0 },
  heroOverlay: { display: 'none' },
  backButton: { display: 'none' },
  curveSvg: { display: 'none' },
  serviceCard: {},
  serviceTitle: {},
  durationRow: {},
  clockCircle: {},
  durationText: {},
  priceLabel: {},
  priceValue: {},

  // ──────────────────────────────────────────────
  // Sections (Schedule, Slots, Options)
  // ──────────────────────────────────────────────
  section: {
    paddingHorizontal: 18,
    marginTop: 16,
  },
  firstSection: {
    marginTop: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: {
    fontFamily: fonts.heading,
    fontSize: 17,
    color: colors.heading,
  },
  sectionSideText: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.muted,
  },

  // Guest Selector
  guestRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 8,
    ...sharedShadow,
  },
  stepperButton: {
    width: 42,
    height: 42,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
  },
  stepperButtonDisabled: {
    backgroundColor: colors.disabled,
    borderColor: 'transparent',
  },
  guestCountPill: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    marginHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
  },
  guestCountValue: {
    fontFamily: fonts.heading,
    fontSize: 18,
    color: colors.white,
  },
  guestCountLabel: {
    fontFamily: fonts.regular,
    fontSize: 11,
    color: colors.white,
  },
  guestButton: {
    height: 35,
    borderRadius: 28,
    borderWidth: 1.5,
    borderColor: colors.muted,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  guestButtonSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  guestText: {
    fontFamily: fonts.body,
    fontSize: 16,
    color: colors.heading,
  },
  guestTextSelected: {
    color: colors.white,
  },

  // ──────────────────────────────────────────────
  // Booking Schedule & Date Tabs
  // ──────────────────────────────────────────────
  scheduleSection: {
    marginTop: 16,
  },
  nextAvailable: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  nextAvailableText: {
    fontFamily: fonts.body,
    fontSize: 11,
    color: colors.primaryDark,
    marginLeft: 4,
    textTransform: 'uppercase',
  },
  tabsCard: {
    flexDirection: 'row',
    gap: 10,
  },
  dateTab: {
    flex: 1,
    height: 52,
    borderRadius: 14,
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
    ...sharedShadow,
  },
  dateTabActive: {
    borderColor: colors.primary,
    backgroundColor: colors.white,
  },
  dateTabText: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.body,
  },
  dateTabTextActive: {
    fontFamily: fonts.heading,
    color: colors.heading,
  },
  dateUnderline: {
    display: 'none',
  },

  // ──────────────────────────────────────────────
  // Time Slots Grid
  // ──────────────────────────────────────────────
  slotCard: {
    marginTop: 8,
    borderRadius: 18,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    ...sharedShadow,
  },
  slotGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8,
  },
  slotState: {
    minHeight: 90,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  slotStateTitle: {
    fontFamily: fonts.heading,
    fontSize: 14,
    color: colors.heading,
    textAlign: 'center',
  },
  slotStateText: {
    marginTop: 4,
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.muted,
    textAlign: 'center',
  },
  slotButton: {
    height: 42,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    marginVertical: 4,
  },
  slotButtonSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    ...sharedShadow,
  },
  slotButtonDisabled: {
    backgroundColor: colors.disabled,
    borderColor: 'transparent',
  },
  slotText: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.heading,
  },
  slotTextSelected: {
    fontFamily: fonts.heading,
    color: colors.white,
  },
  slotTextDisabled: {
    color: '#BDB3A6',
  },
  selectedBadge: {
    position: 'absolute',
    right: 3,
    top: 3,
    backgroundColor: colors.heading,
    borderRadius: 3,
    paddingHorizontal: 3,
    paddingVertical: 1,
  },
  selectedBadgeText: {
    fontFamily: fonts.body,
    fontSize: 6,
    color: colors.white,
    letterSpacing: 0.5,
  },

  // Arrival Tip Card
  arrivalTipCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.accentGreenBg,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginTop: 12,
  },
  arrivalTipText: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.accentGreenText,
    marginLeft: 6,
    flex: 1,
  },

  // ──────────────────────────────────────────────
  // Booking Option Card
  // ──────────────────────────────────────────────
  optionSection: {
    marginTop: 18,
  },
  optionCard: {
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    paddingVertical: 16,
    overflow: 'hidden',
    marginTop: 8,
    ...sharedShadow,
  },
  optionCardSelected: {
    borderColor: colors.primary,
  },
  optionTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.heading,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  radioInner: {
    width: 11,
    height: 11,
    borderRadius: 5.5,
    backgroundColor: colors.heading,
  },
  optionCopy: {
    flex: 1,
    paddingRight: 60,
  },
  optionTitle: {
    fontFamily: fonts.heading,
    fontSize: 15,
    color: colors.heading,
  },
  optionSubtitle: {
    marginTop: 2,
    fontFamily: fonts.regular,
    fontSize: 11,
    color: colors.muted,
  },
  optionDescription: {
    marginTop: 6,
    fontFamily: fonts.regular,
    fontSize: 11,
    lineHeight: 16,
    color: colors.body,
  },
  priceBubble: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 72,
    backgroundColor: colors.priceBubble,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
  },
  priceBubbleText: {
    fontFamily: fonts.heading,
    fontSize: 16,
    color: colors.heading,
  },

  // ──────────────────────────────────────────────
  // Payment Footer / CTA
  // ──────────────────────────────────────────────
  footerWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.white,
    paddingHorizontal: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    ...sharedShadow,
  },
  footerInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  payLabel: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.muted,
  },
  payValue: {
    marginTop: 2,
    fontFamily: fonts.heading,
    fontSize: 20,
    color: colors.heading,
  },
  proceedButton: {
    width: '100%',
    height: 52,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: colors.primary,
  },
  proceedButtonDisabled: {
    opacity: 0.5,
  },
  proceedGradient: {
    flex: 1,
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  proceedPressed: {
    opacity: Platform.OS === 'ios' ? 0.75 : 0.88,
  },
  proceedText: {
    fontFamily: fonts.heading,
    fontSize: 16,
    color: colors.white,
  },
});
