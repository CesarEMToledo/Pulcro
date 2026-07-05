import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { LanguageProvider } from '@/contexts/LanguageContext';

export default function RootLayout() {
  useFrameworkReady();

  return (
    <LanguageProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="laundry" />
        <Stack.Screen name="garments" />
        <Stack.Screen name="house" />
        <Stack.Screen name="car" />
        <Stack.Screen name="cart" />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="dark" />
    </LanguageProvider>
  );
}
