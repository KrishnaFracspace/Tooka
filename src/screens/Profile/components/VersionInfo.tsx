import React from 'react';
import { Text, View } from 'react-native';

import { styles } from '../styles';

type Props = {
  appName: string;
  version: string;
};

function VersionInfo({ appName, version }: Props): React.ReactElement {
  return (
    <View style={styles.versionWrap}>
      <Text style={styles.appName}>{appName}</Text>
      <Text style={styles.appVersion}>Version {version}</Text>
    </View>
  );
}

export default React.memo(VersionInfo);
