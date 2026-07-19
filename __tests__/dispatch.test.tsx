import { categoryFromCartItemId, isDispatchable } from '@/constants/dispatch';

describe('categoryFromCartItemId', () => {
  it('maps booking-style ids to their category', () => {
    expect(categoryFromCartItemId('laundry-booking')).toBe('laundry');
    expect(categoryFromCartItemId('house-booking')).toBe('house');
    expect(categoryFromCartItemId('car-booking')).toBe('car');
    expect(categoryFromCartItemId('plumbing-booking')).toBe('plumbing');
    expect(categoryFromCartItemId('gardening-booking')).toBe('gardening');
    expect(categoryFromCartItemId('electricity-booking')).toBe('electricity');
    expect(categoryFromCartItemId('carpets-booking')).toBe('carpets');
  });

  it('maps keyed ids (garment-x, product-x) to their category', () => {
    expect(categoryFromCartItemId('garment-sneakers')).toBe('garments');
    expect(categoryFromCartItemId('product-detergentPro')).toBe('shop');
  });

  it('maps popular-tile ids to their underlying category, not "popular"', () => {
    expect(categoryFromCartItemId('popular-laundry5kg')).toBe('laundry');
    expect(categoryFromCartItemId('popular-sneakers')).toBe('garments');
    expect(categoryFromCartItemId('popular-house')).toBe('house');
  });

  it('returns null for unrecognized ids', () => {
    expect(categoryFromCartItemId('unknown-id')).toBeNull();
  });
});

describe('isDispatchable', () => {
  it('is true only for laundry', () => {
    expect(isDispatchable('laundry')).toBe(true);
    expect(isDispatchable('house')).toBe(false);
    expect(isDispatchable('shop')).toBe(false);
    expect(isDispatchable(null)).toBe(false);
  });
});
