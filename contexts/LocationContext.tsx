import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@pulcro/confirmed_address';

interface LocationContextValue {
  address: string | null;
  isReady: boolean;
  confirmLocation: (address: string) => Promise<void>;
  clearAddress: () => Promise<void>;
}

const LocationContext = createContext<LocationContextValue | undefined>(undefined);

export function LocationProvider({ children }: { children: ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((stored) => setAddress(stored))
      .finally(() => setIsReady(true));
  }, []);

  const confirmLocation = async (next: string) => {
    setAddress(next);
    await AsyncStorage.setItem(STORAGE_KEY, next);
  };

  // Lets the user re-open the full-screen location picker (e.g. from a
  // "change address" button) by clearing the confirmed address — the root
  // navigator already falls back to <LocationConfirmScreen> whenever
  // `address` is null.
  const clearAddress = async () => {
    setAddress(null);
    await AsyncStorage.removeItem(STORAGE_KEY);
  };

  const value = useMemo<LocationContextValue>(
    () => ({ address, isReady, confirmLocation, clearAddress }),
    [address, isReady]
  );

  return <LocationContext.Provider value={value}>{children}</LocationContext.Provider>;
}

export function useLocation() {
  const ctx = useContext(LocationContext);
  if (!ctx) throw new Error('useLocation must be used within a LocationProvider');
  return ctx;
}
