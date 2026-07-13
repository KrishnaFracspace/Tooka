import React from 'react';

import LegalScreen from './components/LegalScreen';
import { termsData } from './data/terms';

function TermsScreen(): React.ReactElement {
  return (
    <LegalScreen
      title={termsData.title}
      lastUpdated={termsData.lastUpdated}
      sections={termsData.sections}
    />
  );
}

export default TermsScreen;
