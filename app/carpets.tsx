import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Spacing, FontSize, Radius, Shadow, Layout } from '@/constants/theme';
import { moderateScale } from '@/constants/responsive';
import { Clock, Home, Sparkles } from 'lucide-react-native';

const MXN = (n: number) => `${n.toLocaleString('es-MX')} MXN`;
import ScreenHeader from '@/components/ScreenHeader';
import PrimaryButton from '@/components/PrimaryButton';
import ServiceHero from '@/components/ServiceHero';
import BookingSummaryCard from '@/components/BookingSummaryCard';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';
import { ServiceIcons } from '@/constants/serviceIcons';
import { bookingScreenStyles as bs } from '@/constants/bookingScreenStyles';

const plansData = [
  {
    key: 'small' as const,
    price: 300,
    duration: '1.5 hrs',
    color: ['#1A6FD4', '#4A90E2'] as [string, string],
  },
  {
    key: 'medium' as const,
    price: 550,
    duration: '3 hrs',
    color: ['#2ABFBF', '#00D4AA'] as [string, string],
    popular: true,
  },
  {
    key: 'large' as const,
    price: 900,
    duration: '5 hrs',
    color: ['#0D4FA0', '#1A6FD4'] as [string, string],
  },
];

const extrasData = [
  { key: 'stainRemoval' as const, price: 120 },
  { key: 'sanitizing' as const, price: 90 },
  { key: 'deodorizing' as const, price: 70 },
  { key: 'quickDry' as const, price: 60 },
];

export default function CarpetsScreen() {
  const router = useRouter();
  const { t } = useLanguage();
  const { addItem } = useCart();
  const [selectedPlan, setSelectedPlan] = useState(1);
  const [extrasSel, setExtrasSel] = useState<string[]>([]);

  const toggleExtra = (key: string) => {
    setExtrasSel((prev) => (prev.includes(key) ? prev.filter((e) => e !== key) : [...prev, key]));
  };

  const extrasTotal = extrasSel.reduce((sum, key) => sum + (extrasData.find((e) => e.key === key)?.price || 0), 0);
  const total = plansData[selectedPlan].price + extrasTotal;

  const addToCart = () => {
    const planName = t.carpets.plans[plansData[selectedPlan].key].name;
    const detail = extrasSel.length > 0 ? `${t.carpets.extrasLabel} (${extrasSel.length})` : plansData[selectedPlan].duration;
    addItem(
      {
        id: 'carpets-booking',
        name: `${t.carpets.title} · ${planName}`,
        detail,
        price: total,
        image: ServiceIcons.carpets,
      },
      { replace: true }
    );
    router.push('/cart');
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScreenHeader title={t.carpets.title} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <ServiceHero
          variant="carpets"
          gradient={['#4A90E2', '#2ABFBF']}
          title={t.carpets.heroTitle}
          subtitle={t.carpets.heroSubtitle}
        />

        <View style={bs.section}>
          <Text style={bs.sectionTitle}>{t.carpets.choosePlan}</Text>
          {plansData.map((plan, i) => (
            <TouchableOpacity
              key={plan.key}
              activeOpacity={0.7}
              onPress={() => setSelectedPlan(i)}
              style={[styles.planCard, selectedPlan === i && styles.planCardActive]}
            >
              <LinearGradient colors={plan.color} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.planHeader}>
                <View style={styles.planHeaderLeft}>
                  <Text style={styles.planName}>{t.carpets.plans[plan.key].name}</Text>
                  {plan.popular && (
                    <View style={bs.popularBadgeOnGradient}>
                      <Sparkles size={10} color={Colors.white} strokeWidth={2.5} />
                      <Text style={bs.popularText}>{t.common.popular}</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.planPrice}>{MXN(plan.price)}</Text>
              </LinearGradient>
              <View style={styles.planBody}>
                <View style={styles.planMetaRow}>
                  <View style={styles.planMetaItem}>
                    <Clock size={14} color={Colors.textMuted} strokeWidth={2.5} />
                    <Text style={styles.planMetaText}>{plan.duration}</Text>
                  </View>
                  <View style={styles.planMetaItem}>
                    <Home size={14} color={Colors.textMuted} strokeWidth={2.5} />
                    <Text style={styles.planMetaText}>{t.carpets.plans[plan.key].rooms}</Text>
                  </View>
                </View>
                {t.carpets.plans[plan.key].features.map((feat) => (
                  <View key={feat} style={bs.featureRow}>
                    <View style={bs.featureDot} />
                    <Text style={bs.featureText}>{feat}</Text>
                  </View>
                ))}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={bs.section}>
          <Text style={bs.sectionTitle}>{t.carpets.extraServices}</Text>
          {extrasData.map((extra) => (
            <TouchableOpacity
              key={extra.key}
              activeOpacity={0.7}
              onPress={() => toggleExtra(extra.key)}
              style={[styles.extraCard, extrasSel.includes(extra.key) && styles.extraCardActive]}
            >
              <View style={styles.extraLeft}>
                <View style={[styles.checkbox, extrasSel.includes(extra.key) && styles.checkboxActive]}>
                  {extrasSel.includes(extra.key) && <Text style={styles.checkText}>✓</Text>}
                </View>
                <Text style={styles.extraName}>{t.carpets.extras[extra.key]}</Text>
              </View>
              <Text style={styles.extraPrice} numberOfLines={1}>+{MXN(extra.price)}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <BookingSummaryCard
          rows={[
            { label: `${t.carpets.planLabel} ${t.carpets.plans[plansData[selectedPlan].key].name}`, value: MXN(plansData[selectedPlan].price) },
            ...(extrasSel.length > 0
              ? [{ label: `${t.carpets.extrasLabel} (${extrasSel.length})`, value: MXN(extrasTotal) }]
              : []),
          ]}
          totalLabel={t.common.total}
          totalValue={MXN(total)}
        />

        <PrimaryButton label={t.carpets.scheduleButton} onPress={addToCart} style={{ marginTop: Spacing.lg }} />
        <View style={{ height: Spacing.xxl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  scrollContent: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.sm, width: '100%', maxWidth: Layout.maxContentWidth, alignSelf: 'center' },
  planCard: { borderRadius: Radius.lg, overflow: 'hidden', marginBottom: Spacing.md, borderWidth: 2, borderColor: 'transparent', ...Shadow.sm },
  planCardActive: { borderColor: Colors.primary },
  planHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: Spacing.md },
  planHeaderLeft: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, flex: 1, marginRight: Spacing.sm },
  planName: { fontSize: FontSize.lg, fontWeight: '700', color: Colors.white, flexShrink: 1 },
  planPrice: { fontSize: FontSize.xl, fontWeight: '800', color: Colors.white },
  planBody: { backgroundColor: Colors.white, padding: Spacing.md },
  planMetaRow: { flexDirection: 'row', gap: Spacing.lg, marginBottom: Spacing.md },
  planMetaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  planMetaText: { fontSize: FontSize.sm, color: Colors.textMuted },
  extraCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: Spacing.sm, backgroundColor: Colors.white, borderRadius: Radius.lg, padding: Spacing.md, marginBottom: Spacing.sm, borderWidth: 2, borderColor: 'transparent', ...Shadow.sm },
  extraCardActive: { borderColor: Colors.secondary, backgroundColor: Colors.secondary + '10' },
  extraLeft: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, flex: 1 },
  checkbox: { width: moderateScale(22), height: moderateScale(22), borderRadius: moderateScale(6), borderWidth: 2, borderColor: Colors.border, justifyContent: 'center', alignItems: 'center' },
  checkboxActive: { backgroundColor: Colors.secondary, borderColor: Colors.secondary },
  checkText: { color: Colors.white, fontWeight: '700', fontSize: FontSize.sm - 1 },
  extraName: { fontSize: FontSize.md, fontWeight: '500', color: Colors.textPrimary, flex: 1, flexShrink: 1 },
  extraPrice: { fontSize: FontSize.md, fontWeight: '700', color: Colors.secondary, flexShrink: 0 },
});
