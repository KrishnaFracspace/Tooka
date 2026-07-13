export function getPaymentStatusLabel(
  paymentStatus: string | null | undefined,
): string {
  if (!paymentStatus?.trim()) {
    return 'Pending Payment';
  }

  const normalized = paymentStatus.trim().toLowerCase().replace(/-/g, '_');

  switch (normalized) {
    case 'paid':
    case 'captured':
    case 'success':
      return 'Paid';
    case 'pending':
    case 'pending_payment':
    case 'initiated':
    case 'processing':
      return 'Pending Payment';
    case 'refunded':
      return 'Refunded';
    case 'failed':
    case 'failure':
      return 'Failed';
    default:
      return normalized
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
  }
}
