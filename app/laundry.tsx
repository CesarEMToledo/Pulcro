import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Spacing, FontSize, Radius, Shadow } from '@/constants/theme';
import { Minus, Plus, Truck, Shield, Leaf } from 'lucide-react-native';
import ScreenHeader from '@/components/ScreenHeader';
import PrimaryButton from '@/components/PrimaryButton';
import { useLanguage } from '@/contexts/LanguageContext';

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
  const [kilos, setKilos] = useState(5);

  const selectedTier = tierForKilos(kilos);
  const total = kilos * tiers[selectedTier].price;

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
        <View style={styles.heroWrap}>
          <Image
            source={{ uri: 'https://images.pexels.com/photos/7989576/pexels-photo-7989576.jpeg?auto=compress&cs=tinysrgb&w=600' }}
            style={styles.heroImage}
          />
          <LinearGradient colors={['transparent', 'rgba(0,0,0,0.6)']} style={styles.heroOverlay}>
            <Text style={styles.heroTitle}>{t.laundry.heroTitle}</Text>
            <Text style={styles.heroSubtitle}>{t.laundry.heroSubtitle}</Text>
          </LinearGradient>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t.laundry.howMuch}</Text>
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

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t.laundry.planApplied}</Text>
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

        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>{kilos} kg × ${tiers[selectedTier].price} MXN</Text>
            <Text style={styles.summaryValue}>{MXN(total)}</Text>
          </View>
          <View style={[styles.summaryRow, { marginTop: Spacing.sm }]}>
            <Text style={styles.summaryLabel}>{t.common.shipping}</Text>
            <Text style={styles.summaryValueFree}>{t.common.free}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>{t.common.total}</Text>
            <Text style={styles.totalValue}>{MXN(total)}</Text>
          </View>
        </View>

        <PrimaryButton label={t.laundry.scheduleButton} onPress={() => router.push('/cart')} style={{ marginTop: Spacing.lg }} />
        <View style={{ height: Spacing.xxl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  scrollContent: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.sm },
  heroWrap: { borderRadius: Radius.xl, overflow: 'hidden', marginBottom: Spacing.xl, ...Shadow.md },
  heroImage: { width: '100%', height: 180, resizeMode: 'cover' },
  heroOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: Spacing.lg, justifyContent: 'flex-end' },
  heroTitle: { fontSize: FontSize.xxl, fontWeight: '700', color: Colors.white },
  heroSubtitle: { fontSize: FontSize.sm, color: 'rgba(255,255,255,0.9)', marginTop: 4 },
  section: { marginBottom: Spacing.xl },
  sectionTitle: { fontSize: FontSize.lg, fontWeight: '700', color: Colors.textPrimary, marginBottom: Spacing.md },
  stepperCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: Colors.white, borderRadius: Radius.lg, padding: Spacing.lg, ...Shadow.sm },
  stepperBtn: { width: 48, height: 48, borderRadius: Radius.full, backgroundColor: Colors.surface, justifyContent: 'center', alignItems: 'center' },
  stepperValue: { alignItems: 'center' },
  kgValue: { fontSize: FontSize.xxxl, fontWeight: '800', color: Colors.textPrimary },
  kgLabel: { fontSize: FontSize.sm, color: Colors.textMuted },
  tierCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: Colors.white, borderRadius: Radius.lg, padding: Spacing.md, marginBottom: Spacing.sm, borderWidth: 2, borderColor: 'transparent', ...Shadow.sm },
  tierCardActive: { borderColor: Colors.primary, backgroundColor: Colors.primary + '08' },
  tierLeft: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  radio: { width: 22, height: 22, borderRadius: Radius.full, borderWidth: 2, borderColor: Colors.border, justifyContent: 'center', alignItems: 'center' },
  radioActive: { borderColor: Colors.primary },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.primary },
  tierKg: { fontSize: FontSize.md, fontWeight: '600', color: Colors.textPrimary },
  tierKgActive: { color: Colors.primary },
  tierPrice: { fontSize: FontSize.sm, color: Colors.textMuted, marginTop: 2 },
  tierBadge: { backgroundColor: Colors.primary, paddingHorizontal: Spacing.sm, paddingVertical: 4, borderRadius: Radius.full },
  tierBadgeText: { fontSize: FontSize.xs, fontWeight: '700', color: Colors.white },
  tierHint: { fontSize: FontSize.xs, color: Colors.textMuted, marginTop: Spacing.sm, textAlign: 'center' },
  featuresRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: Spacing.xl },
  featureItem: { alignItems: 'center', flex: 1 },
  featureIcon: { width: 48, height: 48, borderRadius: Radius.md, backgroundColor: Colors.surface, justifyContent: 'center', alignItems: 'center', marginBottom: Spacing.sm },
  featureText: { fontSize: FontSize.xs, fontWeight: '500', color: Colors.textSecondary, textAlign: 'center' },
  summaryCard: { backgroundColor: Colors.white, borderRadius: Radius.lg, padding: Spacing.lg, ...Shadow.sm },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  summaryLabel: { fontSize: FontSize.md, color: Colors.textSecondary },
  summaryValue: { fontSize: FontSize.md, fontWeight: '600', color: Colors.textPrimary },
  summaryValueFree: { fontSize: FontSize.md, fontWeight: '700', color: Colors.success },
  divider: { height: 1, backgroundColor: Colors.border, marginVertical: Spacing.md },
  totalLabel: { fontSize: FontSize.lg, fontWeight: '700', color: Colors.textPrimary },
  totalValue: { fontSize: FontSize.xxl, fontWeight: '800', color: Colors.primary },
});
