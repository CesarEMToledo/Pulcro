import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Location from 'expo-location';
import { MapPin, LocateFixed } from 'lucide-react-native';
import { Colors, Spacing, FontSize, Radius, Shadow } from '@/constants/theme';
import { useLanguage } from '@/contexts/LanguageContext';
import PrimaryButton from '@/components/PrimaryButton';

interface Props {
  onConfirm: (address: string) => void;
}

const LOCATION_TIMEOUT_MS = 10000;

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('Location request timed out')), ms);
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (error) => {
        clearTimeout(timer);
        reject(error);
      }
    );
  });
}

export default function LocationConfirmScreen({ onConfirm }: Props) {
  const { t } = useLanguage();
  const [address, setAddress] = useState('');
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState(false);

  const locateDevice = async () => {
    setLocating(true);
    setError(false);
    try {
      const { status } = await withTimeout(
        Location.requestForegroundPermissionsAsync(),
        LOCATION_TIMEOUT_MS
      );
      if (status !== 'granted') {
        setError(true);
        return;
      }
      const position = await withTimeout(
        Location.getCurrentPositionAsync({}),
        LOCATION_TIMEOUT_MS
      );
      const { latitude, longitude } = position.coords;
      setAddress(`${latitude.toFixed(5)}, ${longitude.toFixed(5)}`);
    } catch {
      setError(true);
    } finally {
      setLocating(false);
    }
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <View style={styles.headerCard}>
          <View style={styles.iconCircle}>
            <MapPin size={28} color={Colors.primary} strokeWidth={2.5} />
          </View>
          <Text style={styles.title}>{t.location.title}</Text>
          <Text style={styles.subtitle}>{t.location.subtitle}</Text>
        </View>

        <View style={styles.bottomCard}>
          {error && <Text style={styles.errorText}>{t.location.permissionDeniedText}</Text>}

          <Text style={styles.inputLabel}>{t.location.pinHint}</Text>
          <TextInput
            value={address}
            onChangeText={setAddress}
            placeholder={t.location.addressPlaceholder}
            placeholderTextColor={Colors.textMuted}
            style={styles.input}
          />

          <TouchableOpacity activeOpacity={0.7} onPress={locateDevice} style={styles.locateBtn} disabled={locating}>
            {locating ? (
              <ActivityIndicator size="small" color={Colors.primary} />
            ) : (
              <LocateFixed size={16} color={Colors.primary} strokeWidth={2.5} />
            )}
            <Text style={styles.locateBtnText}>{t.location.useCurrentLocation}</Text>
          </TouchableOpacity>

          <PrimaryButton
            label={t.location.confirmButton}
            onPress={() => onConfirm(address.trim())}
            disabled={!address.trim()}
            style={{ marginTop: Spacing.md }}
          />
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.surface },
  safe: { flex: 1, justifyContent: 'space-between' },
  headerCard: { alignItems: 'center', paddingHorizontal: Spacing.xl, paddingTop: Spacing.xxl },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: Radius.full,
    backgroundColor: Colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  title: { fontSize: FontSize.xxl, fontWeight: '700', color: Colors.textPrimary, textAlign: 'center' },
  subtitle: { fontSize: FontSize.md, color: Colors.textSecondary, textAlign: 'center', marginTop: Spacing.sm },
  bottomCard: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    padding: Spacing.lg,
    ...Shadow.lg,
  },
  errorText: { fontSize: FontSize.xs, color: Colors.error, marginBottom: Spacing.sm },
  inputLabel: { fontSize: FontSize.sm, fontWeight: '600', color: Colors.textSecondary, marginBottom: Spacing.sm },
  input: {
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: Radius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
    backgroundColor: Colors.white,
  },
  locateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.lg,
    backgroundColor: Colors.primary + '12',
  },
  locateBtnText: { fontSize: FontSize.sm, fontWeight: '700', color: Colors.primary },
});
