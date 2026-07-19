import { postDemandEvent } from '@/lib/demandCounter';

describe('postDemandEvent', () => {
  afterEach(() => {
    jest.restoreAllMocks();
    jest.resetModules();
  });

  it('does not call fetch when no endpoint is configured', () => {
    const fetchSpy = jest.spyOn(global, 'fetch').mockResolvedValue({} as Response);

    postDemandEvent('laundry', 150);

    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('posts category, order value, and secret when an endpoint is configured', () => {
    jest.resetModules();
    jest.doMock('@/constants/dispatch', () => ({
      DEMAND_COUNTER_ENDPOINT: 'https://example.com/counter',
      DEMAND_COUNTER_SECRET: 'shh',
    }));
    const fetchSpy = jest.spyOn(global, 'fetch').mockResolvedValue({} as Response);
    const { postDemandEvent: postWithEndpoint } = require('@/lib/demandCounter');

    postWithEndpoint('laundry', 150);

    expect(fetchSpy).toHaveBeenCalledWith(
      'https://example.com/counter',
      expect.objectContaining({ method: 'POST' })
    );
    const body = JSON.parse((fetchSpy.mock.calls[0][1] as RequestInit).body as string);
    expect(body).toMatchObject({ category: 'laundry', orderValue: 150, secret: 'shh' });
  });

  it('swallows network errors instead of throwing', () => {
    jest.resetModules();
    jest.doMock('@/constants/dispatch', () => ({
      DEMAND_COUNTER_ENDPOINT: 'https://example.com/counter',
      DEMAND_COUNTER_SECRET: 'shh',
    }));
    jest.spyOn(global, 'fetch').mockRejectedValue(new Error('network down'));
    const { postDemandEvent: postWithEndpoint } = require('@/lib/demandCounter');

    expect(() => postWithEndpoint('laundry', 150)).not.toThrow();
  });
});
