export interface EnquirySubmissionResult {
  success: boolean;
  message: string;
}

export const submitEnquiry = async (): Promise<EnquirySubmissionResult> => {
  await new Promise<void>((resolve) => {
    setTimeout(resolve, 1200);
  });

  return {
    success: true,
    message: 'Enquiry received successfully.',
  };
};
