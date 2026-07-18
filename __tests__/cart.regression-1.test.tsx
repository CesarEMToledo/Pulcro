import { useEffect } from 'react';
import { render, screen } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { LocationProvider } from '@/contexts/LocationContext';
import { CartProvider, useCart } from '@/contexts/CartContext';
import CartScreen from '../app/cart';

// Regression: ISSUE-005 — cart pickup address ignored the user's confirmed location
// Found by /qa on 2026-07-18
// Report: .gstack/qa-reports/qa-report-localhost-2026-07-18.md

jest.mock('expo-router', () => ({
  useRouter: () => ({ push: jest.fn(), back: jest.fn() }),
}));

const CONFIRMED_ADDRESS = 'Av. Insurgentes Sur 123, CDMX';

function Seed() {
  const { addItem } = useCart();
  useEffect(() => {
    addItem(
      { id: 'plumbing-1', name: 'Plomería · Destape de drenaje', detail: 'Normal', price: 250, image: { uri: 'test' } },
      { replace: true }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}

function renderCart() {
  return render(
    <LanguageProvider>
      <LocationProvider>
        <CartProvider>
          <Seed />
          <CartScreen />
        </CartProvider>
      </LocationProvider>
    </LanguageProvider>
  );
}

describe('CartScreen pickup address', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  it('uses the address confirmed at onboarding instead of the hardcoded mock address', async () => {
    await AsyncStorage.setItem('@cleano/confirmed_address', CONFIRMED_ADDRESS);

    await renderCart();

    expect(await screen.findByText(CONFIRMED_ADDRESS)).toBeTruthy();
    expect(screen.queryByText('Av. Reforma 123, Col. Centro, CDMX')).toBeNull();
  });
});
