import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { LocationProvider, useLocation } from '@/contexts/LocationContext';
import { CartProvider } from '@/contexts/CartContext';
import LocationConfirmScreen from '@/components/LocationConfirmScreen';
import LoadingScreen from '@/components/LoadingScreen';

const MIN_LOADING_TIME = 1800;

function RootNavigator() {
  const { isReady, address, confirmLocation } = useLocation();
  const [minTimeElapsed, setMinTimeElapsed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMinTimeElapsed(true), MIN_LOADING_TIME);
    return () => clearTimeout(timer);
  }, []);

  if (!isReady || !minTimeElapsed) {
    return <LoadingScreen />;
  }

  if (!address) {
    return <LocationConfirmScreen onConfirm={confirmLocation} />;
  }

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="shop" />
        <Stack.Screen name="laundry" />
        <Stack.Screen name="garments" />
        <Stack.Screen name="house" />
        <Stack.Screen name="carpets" />
        <Stack.Screen name="car" />
        <Stack.Screen name="plumbing" />
        <Stack.Screen name="gardening" />
        <Stack.Screen name="electricity" />
        <Stack.Screen name="cart" />
        <Stack.Screen name="notifications" />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="dark" />
    </>
  );
}

export default function RootLayout() {
  useFrameworkReady();

  return (
    <LanguageProvider>
      <LocationProvider>
        <CartProvider>
          <RootNavigator />
        </CartProvider>
      </LocationProvider>
    </LanguageProvider>
  );
}
