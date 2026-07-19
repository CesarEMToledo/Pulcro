import { Linking } from 'react-native';
import { buildMapsLink, buildOrderMessage, openOrderDispatch } from '@/lib/orderDispatch';
import { BUSINESS_WHATSAPP_NUMBER } from '@/constants/dispatch';

describe('buildMapsLink', () => {
  it('URL-encodes the address into a Google Maps search link', () => {
    expect(buildMapsLink('Av. Reforma 123, CDMX')).toBe(
      'https://maps.google.com/?q=Av.%20Reforma%20123%2C%20CDMX'
    );
  });
});

describe('buildOrderMessage', () => {
  it('includes contact info, address, maps link, and item details', () => {
    const message = buildOrderMessage({
      name: 'Ana',
      phone: '5512345678',
      address: 'Av. Reforma 123',
      items: [{ detail: '5 kg', quantity: 1 }],
    });

    expect(message).toContain('Ana');
    expect(message).toContain('5512345678');
    expect(message).toContain('Av. Reforma 123');
    expect(message).toContain('maps.google.com');
    expect(message).toContain('5 kg x1');
  });

  it('joins multiple items with a comma', () => {
    const message = buildOrderMessage({
      name: 'Ana',
      phone: '5512345678',
      address: 'Av. Reforma 123',
      items: [
        { detail: '5 kg', quantity: 1 },
        { detail: '10 kg', quantity: 2 },
      ],
    });

    expect(message).toContain('5 kg x1, 10 kg x2');
  });
});

describe('openOrderDispatch', () => {
  const message = 'Nuevo pedido de prueba';

  it('opens WhatsApp when it is installed', async () => {
    Linking.canOpenURL = jest.fn((url: string) => Promise.resolve(url.startsWith('https://wa.me/')));
    Linking.openURL = jest.fn(() => Promise.resolve(true));

    const channel = await openOrderDispatch(message);

    expect(channel).toBe('whatsapp');
    expect(Linking.openURL).toHaveBeenCalledWith(
      expect.stringContaining(`https://wa.me/${BUSINESS_WHATSAPP_NUMBER}`)
    );
    expect(Linking.openURL).toHaveBeenCalledTimes(1);
  });

  it('falls back to SMS when WhatsApp is not installed', async () => {
    Linking.canOpenURL = jest.fn((url: string) => Promise.resolve(url.startsWith('sms:')));
    Linking.openURL = jest.fn(() => Promise.resolve(true));

    const channel = await openOrderDispatch(message);

    expect(channel).toBe('sms');
    expect(Linking.openURL).toHaveBeenCalledWith(expect.stringContaining('sms:'));
    expect(Linking.openURL).toHaveBeenCalledTimes(1);
  });

  it('returns "none" when neither WhatsApp nor SMS can be opened', async () => {
    Linking.canOpenURL = jest.fn(() => Promise.resolve(false));
    Linking.openURL = jest.fn(() => Promise.resolve(true));

    const channel = await openOrderDispatch(message);

    expect(channel).toBe('none');
    expect(Linking.openURL).not.toHaveBeenCalled();
  });
});
