import React from 'react';
import { Text, View } from 'react-native';

import type { LegalBullet } from '../types';
import { styles } from '../styles';

type Props = {
  bullets: LegalBullet[];
  nested?: boolean;
};

function renderBulletText(bullet: LegalBullet): string {
  return typeof bullet === 'string' ? bullet : bullet.text;
}

function renderNestedBullets(bullet: LegalBullet): string[] | undefined {
  return typeof bullet === 'string' ? undefined : bullet.nested;
}

function BulletList({ bullets, nested = false }: Props): React.ReactElement {
  return (
    <View
      style={[styles.bulletList, nested && styles.nestedBulletList]}
      accessibilityRole="list"
    >
      {bullets.map((bullet, index) => {
        const nestedItems = renderNestedBullets(bullet);

        return (
          <View key={`${renderBulletText(bullet)}-${index}`}>
            <View style={styles.bulletRow} accessibilityRole="text">
              <View style={nested ? styles.nestedBulletDot : styles.bulletDot} />
              <Text
                style={styles.bulletText}
                allowFontScaling
                maxFontSizeMultiplier={1.4}
              >
                {renderBulletText(bullet)}
              </Text>
            </View>

            {nestedItems && nestedItems.length > 0 ? (
              <BulletList bullets={nestedItems} nested />
            ) : null}
          </View>
        );
      })}
    </View>
  );
}

export default React.memo(BulletList);
