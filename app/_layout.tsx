import { View } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { LocationProvider, useLocation } from '@/contexts/LocationContext';
import { Colors } from '@/constants/theme';
import LocationConfirmScreen from '@/components/LocationConfirmScreen';

function RootNavigator() {
  const { isReady, address, confirmLocation } = useLocation();

  if (!isReady) {
    return <View style={{ flex: 1, backgroundColor: Colors.background }} />;
  }

  if (!address) {
    return <LocationConfirmScreen onConfirm={confirmLocation} />;
  }

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="laundry" />
        <Stack.Screen name="garments" />
        <Stack.Screen name="house" />
        <Stack.Screen name="car" />
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
        <RootNavigator />
      </LocationProvider>
    </LanguageProvider>
  );
}
