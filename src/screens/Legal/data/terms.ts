import type { LegalContent } from '../types';

export const termsData: LegalContent = {
  title: 'Terms & Conditions',
  lastUpdated: '10 July 2026',
  sections: [
    {
      heading: '1. Platform Services',
      paragraphs: [
        'Tooka is a digital wellness platform that connects users with verified spa and wellness service providers. Tooka acts as a technology intermediary and does not directly provide spa or wellness services.',
      ],
      bullets: [
        'Browse spa listings and services',
        'View pricing, availability, and service details',
        'Book appointments through the app',
        'Make secure payments via integrated payment gateways',
        'Manage bookings and view payment history',
      ],
    },
    {
      heading: '2. User Eligibility',
      paragraphs: [
        'By using Tooka, you confirm that you meet the following eligibility requirements:',
      ],
      bullets: [
        'You are at least 18 years of age',
        'You provide accurate and complete registration information',
        'You use the platform only for lawful purposes',
        'You comply with all applicable local laws and regulations',
      ],
    },
    {
      heading: '3. User Account & OTP Verification',
      paragraphs: [
        'Account creation requires mobile number verification through OTP. You are responsible for maintaining the confidentiality of your account credentials and for all activities conducted through your account.',
        'Tooka reserves the right to suspend or terminate accounts that provide false information or violate these terms.',
      ],
    },
    {
      heading: '4. Booking & Payments',
      paragraphs: [
        'When you book a service through Tooka, you enter into a direct service agreement with the spa partner. Tooka facilitates the booking and payment process but is not the service provider.',
      ],
      bullets: [
        'All prices displayed are set by spa partners and may change without prior notice',
        'Payment is processed securely through our integrated payment gateway',
        'Booking confirmation is subject to spa partner availability',
        'Receipts and transaction records are available in your payment history',
      ],
    },
    {
      heading: '5. Spa Partner Responsibilities',
      paragraphs: [
        'Spa partners listed on Tooka are independent service providers responsible for:',
      ],
      bullets: [
        {
          text: 'Delivering services as described in their listings',
          nested: ['Service quality', 'Staff conduct', 'Hygiene standards'],
        },
        {
          text: 'Maintaining valid licenses and certifications',
          nested: ['Business registration', 'Health and safety compliance'],
        },
        'Honouring confirmed bookings unless cancellation policies apply',
        'Resolving service-related disputes directly with customers',
      ],
    },
    {
      heading: '6. User Conduct',
      paragraphs: ['You agree not to engage in any of the following while using Tooka:'],
      bullets: [
        {
          text: 'Misuse of the platform',
          nested: [
            'Creating fake accounts or bookings',
            'Attempting to manipulate ratings or reviews',
          ],
        },
        {
          text: 'Harmful behaviour',
          nested: [
            'Harassing spa staff or other users',
            'Posting offensive or misleading content',
          ],
        },
        'Circumventing payment systems or booking fees',
        'Reverse-engineering or copying platform features',
      ],
    },
    {
      heading: '7. Cancellations & Refunds',
      paragraphs: [
        'Cancellation and refund policies are determined by individual spa partners and are displayed at the time of booking. Tooka processes refund requests in accordance with the applicable refund policy.',
        'For detailed refund terms, please refer to our Refund Policy.',
      ],
    },
    {
      heading: '8. Limitation of Liability',
      paragraphs: [
        'Tooka shall not be liable for any direct, indirect, incidental, or consequential damages arising from your use of the platform or services booked through it. Our total liability is limited to the amount paid for the specific booking in question.',
      ],
    },
    {
      heading: '9. Privacy & Data Usage',
      paragraphs: [
        'Your personal data is collected and processed in accordance with our Privacy Policy. By using Tooka, you consent to the collection and use of information as described therein.',
      ],
    },
    {
      heading: '10. Suspension & Termination',
      paragraphs: [
        'Tooka reserves the right to suspend or terminate your access to the platform at any time, with or without notice, for conduct that violates these terms or is harmful to other users or spa partners.',
      ],
    },
    {
      heading: '11. Changes to These Terms',
      paragraphs: [
        'We may update these Terms & Conditions from time to time. Continued use of the platform after changes are posted constitutes acceptance of the revised terms. We encourage you to review this page periodically.',
      ],
    },
    {
      heading: '12. Contact Us',
      paragraphs: ['If you have questions about these Terms & Conditions, please contact us at:'],
      contact: {
        email: 'hello@tooka.app',
      },
    },
  ],
};
