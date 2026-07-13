import React from 'react';
import { Text, View } from 'react-native';

import type { LegalSectionData } from '../types';
import { styles } from '../styles';
import BulletList from './BulletList';
import ContactSection from './ContactSection';

type Props = {
  section: LegalSectionData;
};

function LegalSection({ section }: Props): React.ReactElement {
  return (
    <View style={styles.section} accessibilityRole="summary">
      <Text
        style={styles.sectionHeading}
        allowFontScaling
        maxFontSizeMultiplier={1.3}
        accessibilityRole="header"
      >
        {section.heading}
      </Text>

      {section.paragraphs?.map((paragraph, index) => (
        <Text
          key={`${section.heading}-paragraph-${index}`}
          style={styles.paragraph}
          allowFontScaling
          maxFontSizeMultiplier={1.4}
        >
          {paragraph}
        </Text>
      ))}

      {section.bullets && section.bullets.length > 0 ? (
        <BulletList bullets={section.bullets} />
      ) : null}

      <ContactSection contact={section.contact} links={section.links} />
    </View>
  );
}

export default React.memo(LegalSection);
