const EXPIRING_SOON_WINDOW_DAYS = 30;

export type ComputedDocumentStatus = 'VALID' | 'EXPIRING_SOON' | 'EXPIRED';

export function computeDocumentStatus(expiresAt: Date, now = new Date()): ComputedDocumentStatus {
  const msUntilExpiry = expiresAt.getTime() - now.getTime();
  const daysUntilExpiry = msUntilExpiry / (1000 * 60 * 60 * 24);

  if (daysUntilExpiry < 0) return 'EXPIRED';
  if (daysUntilExpiry <= EXPIRING_SOON_WINDOW_DAYS) return 'EXPIRING_SOON';
  return 'VALID';
}
