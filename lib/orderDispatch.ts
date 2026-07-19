import { Linking } from 'react-native';
import { BUSINESS_WHATSAPP_NUMBER } from '@/constants/dispatch';
import type { CartItem } from '@/contexts/CartContext';

export function buildMapsLink(address: string): string {
  return `https://maps.google.com/?q=${encodeURIComponent(address)}`;
}

export function buildOrderMessage(params: {
  name: string;
  phone: string;
  address: string;
  items: Pick<CartItem, 'detail' | 'quantity'>[];
}): string {
  const { name, phone, address, items } = params;
  const details = items.map((i) => `${i.detail} x${i.quantity}`).join(', ');
  return `Nuevo pedido: ${name}, ${phone}, recoger en ${address} (${buildMapsLink(address)}), ${details}.`;
}

export type DispatchChannel = 'whatsapp' | 'sms' | 'none';

// wa.me/sms handoff is customer-initiated (the user taps "send" themselves) —
// canOpenURL reliably tells us whether an app is installed before we try to
// open it, but nothing can tell us the customer actually finished sending the
// message once it's open. That gap is an accepted tradeoff at MVP order volume.
export async function openOrderDispatch(message: string): Promise<DispatchChannel> {
  const waUrl = `https://wa.me/${BUSINESS_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  const canWhatsApp = await Linking.canOpenURL(waUrl);
  if (canWhatsApp) {
    await Linking.openURL(waUrl);
    return 'whatsapp';
  }

  const smsUrl = `sms:${BUSINESS_WHATSAPP_NUMBER}?body=${encodeURIComponent(message)}`;
  const canSms = await Linking.canOpenURL(smsUrl);
  if (canSms) {
    await Linking.openURL(smsUrl);
    return 'sms';
  }

  return 'none';
}
