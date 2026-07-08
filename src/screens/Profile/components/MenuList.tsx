import React from 'react';
import { View } from 'react-native';

import MenuItem, { type MenuItemConfig } from './MenuItem';
import { styles } from '../styles';

type Props = {
  items: MenuItemConfig[];
};

function MenuList({ items }: Props): React.ReactElement {
  return (
    <View style={styles.menuCard}>
      {items.map((item, index) => (
        <MenuItem
          key={item.id}
          {...item}
          showDivider={index < items.length - 1}
        />
      ))}
    </View>
  );
}

export default React.memo(MenuList);
