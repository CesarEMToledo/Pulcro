import { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Region } from 'react-native-maps';
import * as Location from 'expo-location';
import { MapPin, LocateFixed, CircleAlert } from 'lucide-react-native';
import { Colors, Spacing, FontSize, Radius, Shadow } from '@/constants/theme';
import { moderateScale } from '@/constants/responsive';
import { useLanguage } from '@/contexts/LanguageContext';
import PrimaryButton from '@/components/PrimaryButton';

const DEFAULT_REGION: Region = {
  latitude: 19.4326,
  longitude: -99.1332,
  latitudeDelta: 0.01,
  longitudeDelta: 0.01,
};

interface Props {
  onConfirm: (address: string) => void;
}

export default function LocationConfirmScreen({ onConfirm }: Props) {
  const { t } = useLanguage();
  const mapRef = useRef<MapView>(null);
  const geocodeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [region, setRegion] = useState<Region>(DEFAULT_REGION);
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(true);
  const [locating, setLocating] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);

  const reverseGeocode = async (coords: { latitude: number; longitude: number }) => {
    try {
      const [result] = await Location.reverseGeocodeAsync(coords);
      if (result) {
        const parts = [
          [result.street, result.streetNumber].filter(Boolean).join(' '),
          result.district || result.subregion,
          result.city,
        ].filter(Boolean);
        setAddress(parts.join(', ') || t.location.locatingError);
      } else {
        setAddress(t.location.locatingError);
      }
    } catch {
      setAddress(t.location.locatingError);
    }
  };

  const locateDevice = async () => {
    setLocating(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setPermissionDenied(true);
        setLoading(false);
        setLocating(false);
        return;
      }
      setPermissionDenied(false);
      const position = await Location.getCurrentPositionAsync({});
      const nextRegion: Region = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };
      setRegion(nextRegion);
      mapRef.current?.animateToRegion(nextRegion, 400);
      await reverseGeocode(nextRegion);
    } catch {
      setPermissionDenied(true);
    } finally {
      setLoading(false);
      setLocating(false);
    }
  };

  useEffect(() => {
    locateDevice();
    return () => {
      if (geocodeTimeout.current) clearTimeout(geocodeTimeout.current);
    };
  }, []);

  const handleRegionChangeComplete = (nextRegion: Region) => {
    setRegion(nextRegion);
    if (geocodeTimeout.current) clearTimeout(geocodeTimeout.current);
    geocodeTimeout.current = setTimeout(() => {
      reverseGeocode(nextRegion);
    }, 500);
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFillObject}
        initialRegion={region}
        onRegionChangeComplete={handleRegionChangeComplete}
        showsUserLocation
        showsMyLocationButton={false}
      />

      <View pointerEvents="none" style={styles.pinWrap}>
        <MapPin size={40} color={Colors.primary} strokeWidth={2.5} fill={Colors.primary + '30'} />
        <View style={styles.pinShadow} />
      </View>

      <SafeAreaView style={styles.topOverlay} edges={['top']} pointerEvents="box-none">
        <View style={styles.headerCard}>
          <Text style={styles.title}>{t.location.title}</Text>
          <Text style={styles.subtitle}>{t.location.subtitle}</Text>
        </View>
      </SafeAreaView>

      <SafeAreaView style={styles.bottomOverlay} edges={['bottom']} pointerEvents="box-none">
        <View style={styles.bottomCard}>
          {permissionDenied && (
            <View style={styles.warningRow}>
              <CircleAlert size={16} color={Colors.warning} strokeWidth={2.5} />
              <Text style={styles.warningText}>{t.location.permissionDeniedText}</Text>
            </View>
          )}

          <View style={styles.addressRow}>
            <View style={styles.addressIcon}>
              <MapPin size={18} color={Colors.primary} strokeWidth={2.5} />
            </View>
            {loading ? (
              <View style={styles.addressLoadingRow}>
                <ActivityIndicator size="small" color={Colors.primary} />
                <Text style={styles.addressLoadingText}>{t.location.detecting}</Text>
              </View>
            ) : (
              <Text style={styles.addressText} numberOfLines={2}>{address}</Text>
            )}
          </View>

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
            onPress={() => onConfirm(address || t.location.locatingError)}
            disabled={loading}
            style={{ marginTop: Spacing.md }}
          />
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.surface },
  pinWrap: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -20,
    marginTop: -52,
    alignItems: 'center',
  },
  pinShadow: {
    width: 10,
    height: 4,
    borderRadius: 5,
    backgroundColor: 'rgba(0,0,0,0.25)',
    marginTop: 2,
  },
  topOverlay: { position: 'absolute', top: 0, left: 0, right: 0 },
  headerCard: {
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.sm,
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    ...Shadow.md,
  },
  title: { fontSize: FontSize.lg, fontWeight: '700', color: Colors.textPrimary },
  subtitle: { fontSize: FontSize.sm, color: Colors.textSecondary, marginTop: 2 },
  bottomOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0 },
  bottomCard: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    padding: Spacing.lg,
    ...Shadow.lg,
  },
  warningRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.warning + '15',
    borderRadius: Radius.md,
    padding: Spacing.sm,
    marginBottom: Spacing.md,
  },
  warningText: { flex: 1, fontSize: FontSize.xs, color: Colors.textSecondary },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  addressIcon: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: Radius.md,
    backgroundColor: Colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addressText: { flex: 1, fontSize: FontSize.md, fontWeight: '600', color: Colors.textPrimary },
  addressLoadingRow: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  addressLoadingText: { fontSize: FontSize.md, color: Colors.textMuted },
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
