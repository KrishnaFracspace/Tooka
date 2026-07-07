export interface EnquiryBooking {
  id: string;
  spaId: string;
  spaName: string;
  spaImage: string;
  location: string;
  serviceName: string;
  customerName: string;
  customerEmail: string;
  message: string;
  createdAt: string;
  status: 'pending';
}