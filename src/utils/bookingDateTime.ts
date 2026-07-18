export const formatBookingDate = (value: string | undefined): string => {
  if (!value) {
    return '--';
  }

  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
  });
};

export const buildBookingDateAndTime = ({
  bookingDateAndTime,
  appointmentDate,
  appointmentTime,
}: {
  bookingDateAndTime?: string;
  appointmentDate?: string;
  appointmentTime?: string;
}): string => {
  if (bookingDateAndTime?.trim()) {
    return bookingDateAndTime.trim();
  }

  return `${formatBookingDate(appointmentDate)} | ${appointmentTime ?? '--'}`;
};

export const formatPaymentCompletedAt = (
  paymentCompletedAt: string | null | undefined,
): string | undefined => {
  if (!paymentCompletedAt?.trim()) {
    return undefined;
  }

  const date = new Date(paymentCompletedAt);
  if (Number.isNaN(date.getTime())) {
    return undefined;
  }

  const formattedDate = date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
  const formattedTime = date.toLocaleTimeString('en-IN', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  return `${formattedDate} | ${formattedTime.toUpperCase()}`;
};
