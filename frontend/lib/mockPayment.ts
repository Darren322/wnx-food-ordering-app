/**
 * PROTOTYPE ONLY — simulated Stripe PayNow payment.
 *
 * No real charge is made. Swap this module for a real Stripe
 * (PaymentIntent / PayNow) integration before production.
 */

export interface MockPaymentResult {
  transactionId: string;
  paidAt: string;
}

/** Artificial processing delay so the payment UI feels realistic. */
export const PAYMENT_PROCESSING_DELAY_MS = 1500;

/** Resolve successfully after a short delay with a fake transaction id. */
export function simulatePayNowPayment(
  orderId: string
): Promise<MockPaymentResult> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        transactionId: `PAYNOW-${orderId}-${Date.now()}`,
        paidAt: new Date().toISOString(),
      });
    }, PAYMENT_PROCESSING_DELAY_MS);
  });
}
