export const DIRECT_UPI_ID = '999669968@ybl';
export const DIRECT_UPI_NAME = 'NutriRoots';

export function buildUpiPaymentLink(amount: number): string {
  const safeAmount = Number.isFinite(amount) && amount > 0 ? Math.round(amount) : 0;
  return `upi://pay?pa=${DIRECT_UPI_ID}&pn=${DIRECT_UPI_NAME}&am=${safeAmount}&cu=INR`;
}
