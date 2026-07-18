import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Spacing, FontSize, Radius, Shadow, Layout } from '@/constants/theme';
import { moderateScale } from '@/constants/responsive';
import { Car, Sparkles, Droplets, Wind } from 'lucide-react-native';

const MXN = (n: number) => `${n.toLocaleString('es-MX')} MXN`;
import ScreenHeader from '@/components/ScreenHeader';
import PrimaryButton from '@/components/PrimaryButton';
import ServiceHero from '@/components/ServiceHero';
import BookingSummaryCard from '@/components/BookingSummaryCard';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';
import { ServiceIcons } from '@/constants/serviceIcons';
import { bookingScreenStyles as bs } from '@/constants/bookingScreenStyles';

const servicesData = [
  {
    key: 'exterior' as const,
    price: 120,
    duration: '45 min',
    icon: Droplets,
    color: ['#1A6FD4', '#4A90E2'] as [string, string],
  },
  {
    key: 'full' as const,
    price: 250,
    duration: '1.5 hrs',
    icon: Car,
    color: ['#2ABFBF', '#00D4AA'] as [string, string],
    popular: true,
  },
  {
    key: 'premium' as const,
    price: 600,
    duration: '4 hrs',
    icon: Sparkles,
    color: ['#0D4FA0', '#1A6FD4'] as [string, string],
  },
];

const vehicleTypesData = [
  { key: 'sedan' as const, extra: 0 },
  { key: 'suv' as const, extra: 50 },
  { key: 'pickup' as const, extra: 80 },
  { key: 'van' as const, extra: 100 },
];

export default function CarScreen() {
  const router = useRouter();
  const { t } = useLanguage();
  const { addItem } = useCart();
  const [selectedService, setSelectedService] = useState(1);
  const [selectedVehicle, setSelectedVehicle] = useState(0);

  const total = servicesData[selectedService].price + vehicleTypesData[selectedVehicle].extra;

  const addToCart = () => {
    addItem(
      {
        id: 'car-booking',
        name: `${t.car.title} · ${t.car.services[servicesData[selectedService].key].name}`,
        detail: t.car.vehicles[vehicleTypesData[selectedVehicle].key],
        price: total,
        image: ServiceIcons.car,
      },
      { replace: true }
    );
    router.push('/cart');
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScreenHeader title={t.car.title} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <ServiceHero
          variant="car"
          gradient={['#0D4FA0', '#1A6FD4']}
          title={t.car.heroTitle}
          subtitle={t.car.heroSubtitle}
        />

        <View style={bs.section}>
          <Text style={bs.sectionTitle}>{t.car.vehicleType}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.vehicleScroll}>
            {vehicleTypesData.map((v, i) => (
              <TouchableOpacity
                key={v.key}
                activeOpacity={0.7}
                onPress={() => setSelectedVehicle(i)}
                style={[styles.vehicleChip, selectedVehicle === i && styles.vehicleChipActive]}
              >
                <Text style={[styles.vehicleText, selectedVehicle === i && styles.vehicleTextActive]}>{t.car.vehicles[v.key]}</Text>
                {v.extra > 0 && <Text style={[styles.vehicleExtra, selectedVehicle === i && styles.vehicleExtraActive]}>+{MXN(v.extra)}</Text>}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={bs.section}>
          <Text style={bs.sectionTitle}>{t.car.chooseService}</Text>
          {servicesData.map((svc, i) => {
            const Icon = svc.icon;
            return (
              <TouchableOpacity
                key={svc.key}
                activeOpacity={0.7}
                onPress={() => setSelectedService(i)}
                style={[styles.svcCard, selectedService === i && styles.svcCardActive]}
              >
                <View style={styles.svcHeader}>
                  <LinearGradient colors={svc.color} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.svcIcon}>
                    <Icon size={24} color={Colors.white} strokeWidth={2.5} />
                  </LinearGradient>
                  <View style={{ flex: 1 }}>
                    <View style={styles.svcTitleRow}>
                      <Text style={styles.svcName}>{t.car.services[svc.key].name}</Text>
                      {svc.popular && (
                        <View style={bs.popularBadgeOnCard}>
                          <Sparkles size={10} color={Colors.white} strokeWidth={2.5} />
                          <Text style={bs.popularText}>{t.common.popular}</Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.svcDuration}>{svc.duration}</Text>
                  </View>
                  <Text style={styles.svcPrice}>{MXN(svc.price)}</Text>
                </View>
                {selectedService === i && (
                  <View style={styles.svcFeatures}>
                    {t.car.services[svc.key].features.map((feat) => (
                      <View key={feat} style={bs.featureRow}>
                        <View style={bs.featureDot} />
                        <Text style={bs.featureText}>{feat}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        <BookingSummaryCard
          rows={[
            {
              label: `${t.car.services[servicesData[selectedService].key].name} · ${t.car.vehicles[vehicleTypesData[selectedVehicle].key]}`,
              value: MXN(servicesData[selectedService].price),
            },
            ...(vehicleTypesData[selectedVehicle].extra > 0
              ? [{ label: t.car.vehicleSurcharge, value: `+${MXN(vehicleTypesData[selectedVehicle].extra)}` }]
              : []),
          ]}
          totalLabel={t.common.total}
          totalValue={MXN(total)}
        />

        <PrimaryButton label={t.car.scheduleButton} onPress={addToCart} style={{ marginTop: Spacing.lg }} />
        <View style={{ height: Spacing.xxl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  scrollContent: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.sm, width: '100%', maxWidth: Layout.maxContentWidth, alignSelf: 'center' },
  vehicleScroll: { gap: Spacing.sm, paddingRight: Spacing.lg },
  vehicleChip: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: Colors.white, paddingHorizontal: Spacing.md, paddingVertical: Spacing.md, borderRadius: Radius.lg, borderWidth: 2, borderColor: 'transparent', ...Shadow.sm },
  vehicleChipActive: { borderColor: Colors.primary, backgroundColor: Colors.primary + '12' },
  vehicleText: { fontSize: FontSize.md, fontWeight: '600', color: Colors.textPrimary },
  vehicleTextActive: { color: Colors.primary },
  vehicleExtra: { fontSize: FontSize.xs, color: Colors.textMuted },
  vehicleExtraActive: { color: Colors.primary },
  svcCard: { backgroundColor: Colors.white, borderRadius: Radius.lg, padding: Spacing.md, marginBottom: Spacing.md, borderWidth: 2, borderColor: 'transparent', ...Shadow.sm },
  svcCardActive: { borderColor: Colors.primary, backgroundColor: Colors.primary + '10' },
  svcHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  svcIcon: { width: moderateScale(48), height: moderateScale(48), borderRadius: Radius.md, justifyContent: 'center', alignItems: 'center' },
  svcTitleRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  svcName: { fontSize: FontSize.md, fontWeight: '700', color: Colors.textPrimary, flexShrink: 1 },
  svcDuration: { fontSize: FontSize.sm, color: Colors.textMuted, marginTop: 2 },
  svcPrice: { fontSize: FontSize.lg, fontWeight: '800', color: Colors.primary },
  svcFeatures: { marginTop: Spacing.md, paddingTop: Spacing.md, borderTopWidth: 1, borderTopColor: Colors.border },
});
