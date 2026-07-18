import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Colors, Spacing, FontSize, Radius, Shadow, Layout } from '@/constants/theme';
import { moderateScale } from '@/constants/responsive';
import { Minus, Plus, Truck, Shield, Leaf } from 'lucide-react-native';
import ScreenHeader from '@/components/ScreenHeader';
import PrimaryButton from '@/components/PrimaryButton';
import ServiceHero from '@/components/ServiceHero';
import BookingSummaryCard from '@/components/BookingSummaryCard';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';
import { ServiceIcons } from '@/constants/serviceIcons';
import { bookingScreenStyles as bs } from '@/constants/bookingScreenStyles';

const MXN = (n: number) => `$${n.toLocaleString('es-MX')} MXN`;

const tiers = [
  { kg: '1-5 kg', price: 30, min: 1, max: 5 },
  { kg: '6-10 kg', price: 25, min: 6, max: 10 },
  { kg: '11+ kg', price: 20, min: 11, max: Infinity },
];

function tierForKilos(k: number): number {
  if (k <= 5) return 0;
  if (k <= 10) return 1;
  return 2;
}

export default function LaundryScreen() {
  const router = useRouter();
  const { t } = useLanguage();
  const { addItem } = useCart();
  const [kilos, setKilos] = useState(5);

  const selectedTier = tierForKilos(kilos);
  const total = kilos * tiers[selectedTier].price;

  const addToCart = () => {
    addItem(
      {
        id: 'laundry-booking',
        name: t.laundry.title,
        detail: `${kilos} ${t.laundry.kg} · ${tiers[selectedTier].kg}`,
        price: total,
        image: ServiceIcons.laundry,
      },
      { replace: true }
    );
    router.push('/cart');
  };

  const decrease = () => {
    const next = Math.max(1, kilos - 1);
    setKilos(next);
  };
  const increase = () => {
    setKilos(kilos + 1);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScreenHeader title={t.laundry.title} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <ServiceHero
          variant="laundry"
          gradient={['#1A6FD4', '#4A90E2']}
          title={t.laundry.heroTitle}
          subtitle={t.laundry.heroSubtitle}
        />

        <View style={bs.section}>
          <Text style={bs.sectionTitle}>{t.laundry.howMuch}</Text>
          <View style={styles.stepperCard}>
            <TouchableOpacity activeOpacity={0.7} onPress={decrease} style={styles.stepperBtn}>
              <Minus size={24} color={Colors.primary} strokeWidth={2.5} />
            </TouchableOpacity>
            <View style={styles.stepperValue}>
              <Text style={styles.kgValue}>{kilos}</Text>
              <Text style={styles.kgLabel}>{t.laundry.kg}</Text>
            </View>
            <TouchableOpacity activeOpacity={0.7} onPress={increase} style={styles.stepperBtn}>
              <Plus size={24} color={Colors.primary} strokeWidth={2.5} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={bs.section}>
          <Text style={bs.sectionTitle}>{t.laundry.planApplied}</Text>
          {tiers.map((tier, i) => {
            const active = selectedTier === i;
            return (
              <View
                key={tier.kg}
                style={[styles.tierCard, active && styles.tierCardActive]}
              >
                <View style={styles.tierLeft}>
                  <View style={[styles.radio, active && styles.radioActive]}>
                    {active && <View style={styles.radioDot} />}
                  </View>
                  <View>
                    <Text style={[styles.tierKg, active && styles.tierKgActive]}>{tier.kg}</Text>
                    <Text style={styles.tierPrice}>${tier.price} MXN {t.laundry.perKg}</Text>
                  </View>
                </View>
                {active && (
                  <View style={styles.tierBadge}>
                    <Text style={styles.tierBadgeText}>{t.laundry.applied}</Text>
                  </View>
                )}
              </View>
            );
          })}
          <Text style={styles.tierHint}>
            {t.laundry.hint}
          </Text>
        </View>

        <View style={styles.featuresRow}>
          <View style={styles.featureItem}>
            <View style={styles.featureIcon}>
              <Truck size={20} color={Colors.primary} strokeWidth={2.5} />
            </View>
            <Text style={styles.featureText}>{t.laundry.features.pickup}</Text>
          </View>
          <View style={styles.featureItem}>
            <View style={styles.featureIcon}>
              <Shield size={20} color={Colors.secondary} strokeWidth={2.5} />
            </View>
            <Text style={styles.featureText}>{t.laundry.features.quality}</Text>
          </View>
          <View style={styles.featureItem}>
            <View style={styles.featureIcon}>
              <Leaf size={20} color={Colors.success} strokeWidth={2.5} />
            </View>
            <Text style={styles.featureText}>{t.laundry.features.eco}</Text>
          </View>
        </View>

        <BookingSummaryCard
          rows={[
            { label: `${kilos} kg × $${tiers[selectedTier].price} MXN`, value: MXN(total) },
            { label: t.common.shipping, value: t.common.free, valueStyle: { color: Colors.success, fontWeight: '700' } },
          ]}
          totalLabel={t.common.total}
          totalValue={MXN(total)}
        />

        <PrimaryButton label={t.laundry.scheduleButton} onPress={addToCart} style={{ marginTop: Spacing.lg }} />
        <View style={{ height: Spacing.xxl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  scrollContent: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.sm, width: '100%', maxWidth: Layout.maxContentWidth, alignSelf: 'center' },
  stepperCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: Colors.white, borderRadius: Radius.lg, padding: Spacing.lg, ...Shadow.sm },
  stepperBtn: { width: moderateScale(48), height: moderateScale(48), borderRadius: Radius.full, backgroundColor: Colors.surface, justifyContent: 'center', alignItems: 'center' },
  stepperValue: { alignItems: 'center' },
  kgValue: { fontSize: FontSize.xxxl, fontWeight: '800', color: Colors.textPrimary },
  kgLabel: { fontSize: FontSize.sm, color: Colors.textMuted },
  tierCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: Spacing.sm, backgroundColor: Colors.white, borderRadius: Radius.lg, padding: Spacing.md, marginBottom: Spacing.sm, borderWidth: 2, borderColor: 'transparent', ...Shadow.sm },
  tierCardActive: { borderColor: Colors.primary, backgroundColor: Colors.primary + '12' },
  tierLeft: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, flex: 1 },
  radio: { width: moderateScale(22), height: moderateScale(22), borderRadius: Radius.full, borderWidth: 2, borderColor: Colors.border, justifyContent: 'center', alignItems: 'center' },
  radioActive: { borderColor: Colors.primary },
  radioDot: { width: moderateScale(10), height: moderateScale(10), borderRadius: moderateScale(5), backgroundColor: Colors.primary },
  tierKg: { fontSize: FontSize.md, fontWeight: '600', color: Colors.textPrimary },
  tierKgActive: { color: Colors.primary },
  tierPrice: { fontSize: FontSize.sm, color: Colors.textMuted, marginTop: 2 },
  tierBadge: { backgroundColor: Colors.primary, paddingHorizontal: Spacing.sm, paddingVertical: 4, borderRadius: Radius.full },
  tierBadgeText: { fontSize: FontSize.xs, fontWeight: '700', color: Colors.white },
  tierHint: { fontSize: FontSize.xs, color: Colors.textMuted, marginTop: Spacing.sm, textAlign: 'center' },
  featuresRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: Spacing.xl },
  featureItem: { alignItems: 'center', flex: 1 },
  featureIcon: { width: moderateScale(48), height: moderateScale(48), borderRadius: Radius.md, backgroundColor: Colors.surface, justifyContent: 'center', alignItems: 'center', marginBottom: Spacing.sm },
  featureText: { fontSize: FontSize.xs, fontWeight: '500', color: Colors.textSecondary, textAlign: 'center' },
});
