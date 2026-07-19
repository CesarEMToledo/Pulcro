import { render, screen } from '@testing-library/react-native';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { LocationProvider } from '@/contexts/LocationContext';
import { CartProvider } from '@/contexts/CartContext';
import HomeScreen from '../app/(tabs)/index';
import ShopScreen from '../app/shop';

// Regression: ISSUE-005 — rating format inconsistency. Whole-number ratings
// (5.0) rendered as "5" while others rendered as "4.9"/"4.8", because the
// raw number was interpolated directly instead of formatted to one decimal.
// Carried forward from the 2026-07-17 QA baseline, fixed 2026-07-18.

jest.mock('expo-router', () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

function renderWithProviders(children: React.ReactElement) {
  return render(
    <LanguageProvider>
      <LocationProvider>
        <CartProvider>{children}</CartProvider>
      </LocationProvider>
    </LanguageProvider>
  );
}

describe('rating format', () => {
  it('HomeScreen shows whole-number ratings with one decimal place', async () => {
    await renderWithProviders(<HomeScreen />);

    expect(await screen.findByText('5.0')).toBeTruthy();
    expect(screen.queryByText('5')).toBeNull();
  });

  it('ShopScreen shows whole-number ratings with one decimal place', async () => {
    await renderWithProviders(<ShopScreen />);

    expect(await screen.findByText('5.0')).toBeTruthy();
    expect(screen.queryByText('5')).toBeNull();
  });
});
