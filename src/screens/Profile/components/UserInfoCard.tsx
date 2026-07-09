import React from 'react';
import { ImageSourcePropType, Text, useWindowDimensions, View } from 'react-native';

import ProfileAvatar from './ProfileAvatar';
import { styles } from '../styles';

const AVATAR = {
  uri: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=60',
};

type Props = {
  name: string;
  email: string;
  phone: string;
  avatarSource?: ImageSourcePropType;
  onEditPress?: () => void;
};

function UserInfoCard({ name, email, phone, avatarSource, onEditPress }: Props): React.ReactElement {
  const { width } = useWindowDimensions();
  const compact = width < 390;
  // console.log("User Profile: ", name, email, phone, avatarSource);

  return (
    <View style={[styles.userCard, compact && styles.compactUserCard]}>
      <View style={styles.userCardInner}>
        <ProfileAvatar source={avatarSource ?? AVATAR} compact={compact} onEditPress={onEditPress} />
        <View style={[styles.userMeta, compact && styles.compactMeta]}>
          <Text style={styles.userName} numberOfLines={1}>
            {name}
          </Text>
          <Text style={styles.userEmail} numberOfLines={1}>
            {email}
          </Text>
          <Text style={styles.userPhone} numberOfLines={1}>
            {phone}
          </Text>
        </View>
      </View>
    </View>
  );
}

export default React.memo(UserInfoCard);
