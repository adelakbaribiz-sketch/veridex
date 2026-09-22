import { describe, expect, it } from 'vitest';
import { computeDocumentStatus } from './document-status.util.js';

describe('computeDocumentStatus', () => {
  const now = new Date('2026-01-01T00:00:00.000Z');

  it('returns EXPIRED for a date in the past', () => {
    expect(computeDocumentStatus(new Date('2025-12-31T00:00:00.000Z'), now)).toBe('EXPIRED');
  });

  it('returns EXPIRING_SOON within the 30-day window', () => {
    expect(computeDocumentStatus(new Date('2026-01-15T00:00:00.000Z'), now)).toBe('EXPIRING_SOON');
  });

  it('returns VALID just past the 30-day window', () => {
    expect(computeDocumentStatus(new Date('2026-02-05T00:00:00.000Z'), now)).toBe('VALID');
  });

  it('returns EXPIRING_SOON at the exact boundary', () => {
    const boundary = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    expect(computeDocumentStatus(boundary, now)).toBe('EXPIRING_SOON');
  });
});
