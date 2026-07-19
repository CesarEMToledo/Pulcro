import { DEMAND_COUNTER_ENDPOINT, DEMAND_COUNTER_SECRET, ServiceCategory } from '@/constants/dispatch';

// Fire-and-forget: never blocks order confirmation. If the endpoint isn't
// configured yet or the request fails, the event is silently dropped —
// acceptable at MVP order volume, where undercounting a handful of events
// doesn't change the demand-validation read. See CEO plan for the Apps
// Script + Sheet setup this posts to.
export function postDemandEvent(category: ServiceCategory, orderValue: number): void {
  if (!DEMAND_COUNTER_ENDPOINT) return;

  fetch(DEMAND_COUNTER_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      category,
      orderValue,
      secret: DEMAND_COUNTER_SECRET,
      timestamp: new Date().toISOString(),
    }),
  }).catch(() => {});
}
