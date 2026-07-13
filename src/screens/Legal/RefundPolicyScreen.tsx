import React from 'react';

import LegalScreen from './components/LegalScreen';
import { refundData } from './data/refund';

function RefundPolicyScreen(): React.ReactElement {
  return (
    <LegalScreen
      title={refundData.title}
      lastUpdated={refundData.lastUpdated}
      sections={refundData.sections}
    />
  );
}

export default RefundPolicyScreen;
