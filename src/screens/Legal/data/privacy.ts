import type { LegalContent } from '../types';

export const privacyData: LegalContent = {
  title: 'Privacy Policy',
  lastUpdated: '10 July 2026',
  sections: [
    {
      heading: '1. Introduction',
      paragraphs: [
        'Tooka ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our mobile application and related services.',
      ],
    },
    {
      heading: '2. Information We Collect',
      paragraphs: ['We may collect the following types of information:'],
      bullets: [
        {
          text: 'Personal information',
          nested: [
            'Name and contact details',
            'Mobile number for OTP verification',
            'Email address',
            'Profile photo (optional)',
          ],
        },
        {
          text: 'Usage information',
          nested: [
            'App interaction data',
            'Search and booking history',
            'Device type and operating system',
          ],
        },
        {
          text: 'Location information',
          nested: [
            'Approximate location for spa discovery',
            'Saved addresses for profile and bookings',
          ],
        },
        'Payment transaction records (processed securely via payment partners)',
      ],
    },
    {
      heading: '3. How We Use Your Information',
      paragraphs: ['We use collected information to:'],
      bullets: [
        'Create and manage your account',
        'Process bookings and payments',
        'Personalise spa recommendations near you',
        'Send booking confirmations and service updates',
        'Improve app performance and user experience',
        'Comply with legal obligations',
      ],
    },
    {
      heading: '4. Information Sharing',
      paragraphs: [
        'We do not sell your personal information. We may share data with trusted third parties only when necessary:',
      ],
      bullets: [
        'Spa partners — to fulfil your bookings',
        'Payment processors — to complete transactions securely',
        'Analytics providers — to improve our services (anonymised where possible)',
        'Legal authorities — when required by law or to protect rights and safety',
      ],
    },
    {
      heading: '5. Data Security',
      paragraphs: [
        'We implement industry-standard security measures to protect your data, including encryption in transit and secure storage practices. However, no method of electronic transmission is 100% secure, and we cannot guarantee absolute security.',
      ],
    },
    {
      heading: '6. Data Retention',
      paragraphs: [
        'We retain your personal information for as long as your account is active or as needed to provide services. You may request deletion of your account and associated data, subject to legal retention requirements.',
      ],
    },
    {
      heading: '7. Your Rights',
      paragraphs: ['Depending on your jurisdiction, you may have the right to:'],
      bullets: [
        'Access the personal data we hold about you',
        'Request correction of inaccurate information',
        'Request deletion of your data',
        'Withdraw consent for optional data processing',
        'Opt out of marketing communications',
      ],
    },
    {
      heading: '8. Cookies & Tracking',
      paragraphs: [
        'Our app may use local storage and analytics tools to remember preferences and understand usage patterns. You can manage certain tracking preferences through your device settings.',
      ],
    },
    {
      heading: '9. Children\'s Privacy',
      paragraphs: [
        'Tooka is not intended for users under 18 years of age. We do not knowingly collect personal information from children. If we become aware of such collection, we will take steps to delete the information promptly.',
      ],
    },
    {
      heading: '10. Third-Party Links',
      paragraphs: [
        'Our app may contain links to third-party websites or services. We are not responsible for the privacy practices of those third parties. We encourage you to review their privacy policies.',
      ],
    },
    {
      heading: '11. Changes to This Policy',
      paragraphs: [
        'We may update this Privacy Policy from time to time. We will notify you of significant changes through the app or via email. Continued use after changes constitutes acceptance of the updated policy.',
      ],
    },
    {
      heading: '12. Contact Us',
      paragraphs: [
        'For privacy-related questions or to exercise your data rights, please contact us at:',
      ],
      contact: {
        email: 'hello@tooka.app',
      },
    },
  ],
};
