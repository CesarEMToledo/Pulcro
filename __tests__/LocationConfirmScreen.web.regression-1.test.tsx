import { render, screen, fireEvent, act } from '@testing-library/react-native';
import * as Location from 'expo-location';
import { LanguageProvider } from '@/contexts/LanguageContext';
import LocationConfirmScreen from '../components/LocationConfirmScreen.web';

// Regression: ISSUE-001 — location screen hung forever with no recovery path
// Found by /qa on 2026-07-17
// Report: .gstack/qa-reports/qa-report-localhost-2026-07-17.md

jest.mock('expo-location', () => ({
  requestForegroundPermissionsAsync: jest.fn(),
  getCurrentPositionAsync: jest.fn(),
}));

function renderScreen() {
  return render(
    <LanguageProvider>
      <LocationConfirmScreen onConfirm={jest.fn()} />
    </LanguageProvider>
  );
}

describe('LocationConfirmScreen.web timeout fallback', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  it('falls back to the error state instead of hanging forever when permission never resolves', async () => {
    (Location.requestForegroundPermissionsAsync as jest.Mock).mockReturnValue(new Promise(() => {}));

    await renderScreen();
    fireEvent.press(screen.getByText('Usar mi ubicación actual'));

    await act(async () => {
      jest.advanceTimersByTime(10000);
    });

    expect(
      screen.getByText(
        'Activa el permiso de ubicación en los ajustes de tu dispositivo o mueve el mapa para elegir tu dirección manualmente.'
      )
    ).toBeTruthy();
  });
});
