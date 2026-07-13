import React from 'react';

import LegalScreen from './components/LegalScreen';
import { privacyData } from './data/privacy';

function PrivacyPolicyScreen(): React.ReactElement {
  return (
    <LegalScreen
      title={privacyData.title}
      lastUpdated={privacyData.lastUpdated}
      sections={privacyData.sections}
    />
  );
}

export default PrivacyPolicyScreen;
