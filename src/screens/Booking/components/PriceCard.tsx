import React from 'react';
import { Text, View } from 'react-native';
import { styles } from '../styles';

type Props = {
  label: string;
  value: number;
};

function PriceCard({ label, value }: Props): React.ReactElement {
  return (
    <View>
      <Text style={styles.priceLabel}>{label}</Text>
      <Text style={styles.priceValue}>₹{value.toLocaleString('en-IN')}</Text>
    </View>
  );
}

export default React.memo(PriceCard);
