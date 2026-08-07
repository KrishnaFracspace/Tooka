import React from 'react';
import { Text, View } from 'react-native';
import { styles } from '../styles';

type Props = {
  label: string;
  value: number | string;
};

function PriceCard({ label, value }: Props): React.ReactElement {
  const displayValue =
    typeof value === 'number'
      ? `₹${value.toLocaleString('en-IN')}`
      : value;

  return (
    <View>
      <Text style={styles.priceLabel}>{label}</Text>
      <Text style={styles.priceValue}>{displayValue}</Text>
    </View>
  );
}

export default React.memo(PriceCard);
