import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';

interface PaymentOptions {
  amount: number;
  paymentType: 'donation' | 'booking';
  metadata?: {
    donationId?: string;
    bookingId?: string;
    allocation?: { type: string; id?: string };
    recurring?: boolean;
    recurringFrequency?: string;
  };
}

export const usePayment = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const initiatePayment = async (options: PaymentOptions) => {
    setIsProcessing(true);

    try {
      const merchantTransactionId = `WF_${Date.now()}_${Math.random().toString(36).substring(7)}`;
      const merchantUserId = user?.id || `guest_${Date.now()}`;

      const { data, error } = await supabase.functions.invoke('phonepe-payment', {
        body: {
          amount: options.amount,
          merchantTransactionId,
          merchantUserId,
          callbackUrl: `${window.location.origin}/payment/callback`,
          paymentType: options.paymentType,
          metadata: options.metadata,
        },
      });

      if (error) throw error;

      if (data?.success && data?.paymentUrl) {
        // Redirect to PhonePe payment page
        window.location.href = data.paymentUrl;
        return { success: true, transactionId: data.transactionId };
      } else {
        throw new Error(data?.error || 'Failed to initiate payment');
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      toast({
        title: 'Payment Failed',
        description: error.message || 'Unable to process payment. Please try again.',
        variant: 'destructive',
      });
      return { success: false, error: error.message };
    } finally {
      setIsProcessing(false);
    }
  };

  const checkPaymentStatus = async (transactionId: string) => {
    try {
      const { data, error } = await supabase
        .from('donations')
        .select('status')
        .eq('transaction_id', transactionId)
        .single();

      if (error) throw error;
      return data?.status || 'unknown';
    } catch (error) {
      console.error('Error checking payment status:', error);
      return 'error';
    }
  };

  return {
    initiatePayment,
    checkPaymentStatus,
    isProcessing,
  };
};
