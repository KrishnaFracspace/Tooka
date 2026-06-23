import React from 'react';
import {
  ScrollView,
  View,
  Text,
  Image,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  ViewStyle,
  StyleProp,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const AVATAR = { uri: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=60' };

type StatCardProps = {
  label: string;
  value: string | number;
  icon?: string;
  style?: StyleProp<ViewStyle>;
};

const StatCard: React.FC<StatCardProps> = ({ label, value, icon, style }) => (
  <View style={[styles.statCard, style]}>
    <Text style={styles.statIcon}>{icon ?? '📅'}</Text>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

type MenuItemProps = {
  label: string;
  leading?: string;
  destructive?: boolean;
  onPress?: () => void;
};

const MenuItem: React.FC<MenuItemProps> = ({ label, leading, destructive, onPress }) => (
  <Pressable onPress={onPress} style={styles.menuItem}>
    <Text style={[styles.menuIcon]}>{leading ?? '📄'}</Text>
    <Text style={[styles.menuLabel, destructive && styles.menuLabelDestructive]}>{label}</Text>
    <Text style={[styles.menuChevron, destructive && styles.menuLabelDestructive]}>›</Text>
  </Pressable>
);

const ProfileScreen: React.FC = () => {
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={[styles.header, isTablet && styles.headerTablet]}>
          <View style={styles.headerInner}>
            <View style={styles.avatarWrap}>
              <Image source={AVATAR} style={styles.avatar} />
            </View>
            <View style={styles.profileMeta}>
              <Text style={styles.profileName}>Ayra Raj</Text>
              <Text style={styles.profileEmail}>ayraraj18@gmail.com</Text>
              <Text style={styles.profilePhone}>+91 1234567890</Text>
            </View>
            <Pressable style={styles.editButton}>
              <Text style={styles.editIcon}>✎</Text>
            </Pressable>
          </View>
        </View>

        <Text style={styles.sectionTitle}>My Bookings</Text>

        <View style={[styles.statsRow, isTablet && styles.statsRowTablet]}>
          <StatCard label="Upcoming" value={2} icon="📅" />
          <StatCard label="Completed" value={0} icon="✔️" style={styles.statCardSpacing} />
          <StatCard label="Cancelled" value={1} icon="✖️" style={styles.statCardSpacing} />
          <StatCard label="Rescheduled" value={0} icon="🔁" style={styles.statCardSpacing} />
        </View>

        <View style={styles.menuCard}>
          <MenuItem label="Payment History" leading="💳" />
          <View style={styles.divider} />
          <MenuItem label="My address" leading="📍" />
          <View style={styles.divider} />
          <MenuItem label="Help & Support" leading="🎧" />
          <View style={styles.divider} />
          <MenuItem label="Refer & Earn" leading="🔗" />
          <View style={styles.divider} />
          <MenuItem label="Saved Spas" leading="🤍" />
          <View style={styles.divider} />
          <MenuItem label="Settings" leading="⚙️" />
          <View style={styles.divider} />
          <MenuItem label="Logout" leading="🚪" destructive />
        </View>

        <View style={{ height: 80 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F6F1E8' },
  container: { paddingHorizontal: 16, paddingBottom: 24 },
  header: {
    backgroundColor: '#8F9E75',
    height: 200,
    borderBottomLeftRadius: 200,
    borderBottomRightRadius: 200,
    justifyContent: 'flex-end',
    paddingBottom: 28,
    marginBottom: 12,
  },
  headerTablet: { height: 260 },
  headerInner: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 18 },
  avatarWrap: { width: 92, height: 92, borderRadius: 46, borderWidth: 4, borderColor: '#FFFFFF', overflow: 'hidden', backgroundColor: '#EEE' },
  avatar: { width: '100%', height: '100%' },
  profileMeta: { marginLeft: 18, flex: 1 },
  profileName: { color: '#FFFFFF', fontSize: 26, fontWeight: '800', marginBottom: 6 },
  profileEmail: { color: '#F0F0EF', fontSize: 14, marginBottom: 4 },
  profilePhone: { color: '#F0F0EF', fontSize: 14 },
  editButton: { padding: 8 },
  editIcon: { color: '#FFFFFF', fontSize: 18 },

  sectionTitle: { fontSize: 22, fontWeight: '800', color: '#1E1E1E', marginVertical: 12 },

  statsRow: { flexDirection: 'row', justifyContent: 'space-between' },
  statsRowTablet: { paddingHorizontal: 40 },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  statCardSpacing: { marginLeft: 12 },
  statIcon: { fontSize: 20, marginBottom: 6 },
  statValue: { fontSize: 20, fontWeight: '800', color: '#1E1E1E' },
  statLabel: { fontSize: 13, color: '#7A7A7A', marginTop: 6 },

  menuCard: {
    marginTop: 18,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 18, paddingHorizontal: 18 },
  menuIcon: { fontSize: 18, marginRight: 12 },
  menuLabel: { flex: 1, fontSize: 16, color: '#3A3A3A' },
  menuLabelDestructive: { color: '#D0453B' },
  menuChevron: { color: '#BDBDBD', fontSize: 18 },
  divider: { height: 1, backgroundColor: '#E9E5DC', marginLeft: 18 },

  bottomNavWrap: { position: 'absolute', left: 0, right: 0, bottom: 18, alignItems: 'center' },
  bottomNav: {
    width: '92%',
    backgroundColor: '#8F9E75',
    borderRadius: 40,
    paddingVertical: 14,
    paddingHorizontal: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  navItem: { alignItems: 'center', justifyContent: 'center' },
  navItemCenter: { backgroundColor: '#FFFFFF', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 24 },
  navIcon: { fontSize: 20, color: '#FFFFFF' },
  navLabel: { fontSize: 13, color: '#7B8B55', marginTop: 4 },
  navLabelActive: { fontSize: 13, color: '#FFFFFF', marginTop: 4 },
});

export default ProfileScreen;
