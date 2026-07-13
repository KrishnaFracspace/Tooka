import type { LegalContent } from '../types';

export const refundData: LegalContent = {
  title: 'Refund Policy',
  lastUpdated: '10 July 2026',
  sections: [
    {
      heading: '1. Overview',
      paragraphs: [
        'This Refund Policy outlines the conditions under which refunds may be issued for bookings made through the Tooka platform. Refund eligibility depends on the cancellation policy of the spa partner and the timing of your cancellation request.',
      ],
    },
    {
      heading: '2. General Refund Principles',
      paragraphs: ['The following principles apply to all refund requests:'],
      bullets: [
        'Refunds are processed only for bookings made and paid through Tooka',
        'Refund amounts may be partial or full depending on cancellation timing',
        'Processing fees charged by payment gateways may be non-refundable',
        'Refunds are credited to the original payment method used for the booking',
      ],
    },
    {
      heading: '3. Cancellation Windows',
      paragraphs: [
        'Each spa partner sets their own cancellation policy, which is displayed before you confirm a booking. Typical cancellation windows include:',
      ],
      bullets: [
        {
          text: 'Free cancellation',
          nested: [
            'Cancelled 24 hours or more before the appointment',
            'Full refund of the booking amount',
          ],
        },
        {
          text: 'Partial refund',
          nested: [
            'Cancelled within 24 hours of the appointment',
            'Up to 50% refund depending on spa policy',
          ],
        },
        {
          text: 'No refund',
          nested: [
            'No-show without prior cancellation',
            'Cancellation after the appointment start time',
          ],
        },
      ],
    },
    {
      heading: '4. How to Request a Refund',
      paragraphs: ['To request a refund, follow these steps:'],
      bullets: [
        'Open your booking in the Tooka app',
        'Select "Cancel Booking" if within the eligible window',
        'Alternatively, contact Tooka support with your booking reference',
        'Provide a reason for cancellation when prompted',
      ],
    },
    {
      heading: '5. Refund Processing Time',
      paragraphs: [
        'Once a refund is approved, it typically takes 5–10 business days to reflect in your account. The exact timeline depends on your bank or payment provider. Tooka will send a confirmation notification when the refund is initiated.',
      ],
    },
    {
      heading: '6. Spa-Initiated Cancellations',
      paragraphs: [
        'If a spa partner cancels your appointment due to unforeseen circumstances (e.g., staff unavailability, facility closure), you are entitled to a full refund or the option to reschedule at no additional cost.',
      ],
    },
    {
      heading: '7. Service Quality Disputes',
      paragraphs: [
        'If you are dissatisfied with the quality of a service received, please contact us within 48 hours of your appointment. We will review your complaint and coordinate with the spa partner. Refunds for service quality issues are evaluated on a case-by-case basis.',
      ],
    },
    {
      heading: '8. Non-Refundable Items',
      paragraphs: ['The following are generally not eligible for refunds:'],
      bullets: [
        'Promotional or discounted bookings marked as non-refundable',
        'Gift vouchers or credits once redeemed',
        'Third-party payment processing fees',
        'Bookings cancelled after the no-refund window has passed',
      ],
    },
    {
      heading: '9. Chargebacks',
      paragraphs: [
        'We encourage you to contact Tooka support before initiating a chargeback with your bank. Chargebacks may result in account suspension while the dispute is investigated. We aim to resolve all refund requests amicably through our support channels.',
      ],
    },
    {
      heading: '10. Changes to This Policy',
      paragraphs: [
        'Tooka reserves the right to update this Refund Policy at any time. Changes will be posted on this page with an updated "Last Updated" date. Bookings made before a policy change will be governed by the policy in effect at the time of booking.',
      ],
    },
    {
      heading: '11. Contact Us',
      paragraphs: [
        'For refund-related inquiries or assistance with a booking, please reach out to us at:',
      ],
      contact: {
        email: 'hello@tooka.app',
      },
    },
  ],
};
