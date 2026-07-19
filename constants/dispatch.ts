// Business config for the manual-dispatch MVP (see CEO plan:
// ~/.gstack/projects/CesarEMToledo-Pulcro/ceo-plans/2026-07-19-mvp-scope-validation.md).
// Replace these placeholders with the real values before shipping.
export const BUSINESS_WHATSAPP_NUMBER = '5215555555555';
export const BUSINESS_PHONE_DISPLAY = '+52 1 55 5555 5555';
export const DEMAND_COUNTER_ENDPOINT = '';
export const DEMAND_COUNTER_SECRET = '';

export type ServiceCategory =
  | 'laundry'
  | 'garments'
  | 'house'
  | 'car'
  | 'plumbing'
  | 'gardening'
  | 'electricity'
  | 'carpets'
  | 'shop';

// Only laundry has a real fulfillment channel (the WhatsApp/SMS handoff below);
// every other category is demo-only until Approach B.
export const DISPATCHABLE_CATEGORIES: ServiceCategory[] = ['laundry'];

const POPULAR_ID_CATEGORY: Record<string, ServiceCategory> = {
  'popular-laundry5kg': 'laundry',
  'popular-sneakers': 'garments',
  'popular-house': 'house',
};

// Cart items don't carry an explicit category field; it's derived from the id
// prefix each screen already uses (laundry-booking, garment-x, product-x, ...)
// to avoid touching every service screen just to tag a category.
export function categoryFromCartItemId(id: string): ServiceCategory | null {
  if (id in POPULAR_ID_CATEGORY) return POPULAR_ID_CATEGORY[id];
  if (id.startsWith('laundry')) return 'laundry';
  if (id.startsWith('garment')) return 'garments';
  if (id.startsWith('house')) return 'house';
  if (id.startsWith('carpets')) return 'carpets';
  if (id.startsWith('car')) return 'car';
  if (id.startsWith('plumbing')) return 'plumbing';
  if (id.startsWith('gardening')) return 'gardening';
  if (id.startsWith('electricity')) return 'electricity';
  if (id.startsWith('product')) return 'shop';
  return null;
}

export function isDispatchable(category: ServiceCategory | null): boolean {
  return category !== null && DISPATCHABLE_CATEGORIES.includes(category);
}
