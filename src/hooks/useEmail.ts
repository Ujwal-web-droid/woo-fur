import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

type EmailType = 'booking_confirmation' | 'donation_receipt' | 'volunteer_welcome' | 'contact_form' | 'booking_reminder';

interface EmailData {
  [key: string]: any;
}

export const useEmail = () => {
  const { toast } = useToast();

  const sendEmail = async (type: EmailType, to: string, data: EmailData) => {
    try {
      const { data: response, error } = await supabase.functions.invoke('send-email', {
        body: { type, to, data },
      });

      if (error) throw error;

      return { success: true, data: response };
    } catch (error: any) {
      console.error('Email error:', error);
      toast({
        title: 'Email Failed',
        description: 'Unable to send email notification.',
        variant: 'destructive',
      });
      return { success: false, error: error.message };
    }
  };

  const sendBookingConfirmation = async (
    email: string,
    data: {
      name: string;
      serviceType: string;
      date: string;
      time: string;
      animalName?: string;
      duration?: string;
      confirmationUrl?: string;
    }
  ) => {
    return sendEmail('booking_confirmation', email, data);
  };

  const sendDonationReceipt = async (
    email: string,
    data: {
      name?: string;
      amount: number;
      transactionId: string;
      allocation?: string;
      recurring?: boolean;
    }
  ) => {
    return sendEmail('donation_receipt', email, data);
  };

  const sendVolunteerWelcome = async (
    email: string,
    data: { name: string }
  ) => {
    return sendEmail('volunteer_welcome', email, data);
  };

  const sendContactForm = async (data: {
    name: string;
    email: string;
    phone?: string;
    reason: string;
    message: string;
  }) => {
    return sendEmail('contact_form', data.email, data);
  };

  const sendBookingReminder = async (
    email: string,
    data: {
      name: string;
      serviceType: string;
      date: string;
      time: string;
      animalName?: string;
      timeUntil: string;
    }
  ) => {
    return sendEmail('booking_reminder', email, data);
  };

  return {
    sendEmail,
    sendBookingConfirmation,
    sendDonationReceipt,
    sendVolunteerWelcome,
    sendContactForm,
    sendBookingReminder,
  };
};
