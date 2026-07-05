import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Spacing, FontSize, Radius, Shadow } from '@/constants/theme';
import { Clock, Home, Sparkles, Users, Calendar } from 'lucide-react-native';

const MXN = (n: number) => `${n.toLocaleString('es-MX')} MXN`;
import ScreenHeader from '@/components/ScreenHeader';
import PrimaryButton from '@/components/PrimaryButton';
import { useLanguage } from '@/contexts/LanguageContext';

const plansData = [
  {
    key: 'basic' as const,
    price: 500,
    duration: '3 hrs',
    color: ['#1A6FD4', '#4A90E2'] as [string, string],
  },
  {
    key: 'deep' as const,
    price: 850,
    duration: '5 hrs',
    color: ['#2ABFBF', '#00D4AA'] as [string, string],
    popular: true,
  },
  {
    key: 'premium' as const,
    price: 1200,
    duration: '8 hrs',
    color: ['#0D4FA0', '#1A6FD4'] as [string, string],
  },
];

const extrasData = [
  { key: 'oven' as const, price: 80 },
  { key: 'fridge' as const, price: 100 },
  { key: 'windows' as const, price: 60 },
  { key: 'ironing' as const, price: 120 },
];

export default function HouseScreen() {
  const router = useRouter();
  const { t } = useLanguage();
  const [selectedPlan, setSelectedPlan] = useState(1);
  const [extrasSel, setExtrasSel] = useState<string[]>([]);

  const toggleExtra = (key: string) => {
    setExtrasSel((prev) => (prev.includes(key) ? prev.filter((e) => e !== key) : [...prev, key]));
  };

  const extrasTotal = extrasSel.reduce((sum, key) => sum + (extrasData.find((e) => e.key === key)?.price || 0), 0);
  const total = plansData[selectedPlan].price + extrasTotal;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScreenHeader title={t.house.title} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.heroWrap}>
          <Image
            source={{ uri: 'https://images.pexels.com/photos/4239031/pexels-photo-4239031.jpeg?auto=compress&cs=tinysrgb&w=600' }}
            style={styles.heroImage}
          />
          <LinearGradient colors={['transparent', 'rgba(0,0,0,0.6)']} style={styles.heroOverlay}>
            <Text style={styles.heroTitle}>{t.house.heroTitle}</Text>
            <Text style={styles.heroSubtitle}>{t.house.heroSubtitle}</Text>
          </LinearGradient>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t.house.choosePlan}</Text>
          {plansData.map((plan, i) => (
            <TouchableOpacity
              key={plan.key}
              activeOpacity={0.7}
              onPress={() => setSelectedPlan(i)}
              style={[styles.planCard, selectedPlan === i && styles.planCardActive]}
            >
              <LinearGradient colors={plan.color} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.planHeader}>
                <View style={styles.planHeaderLeft}>
                  <Text style={styles.planName}>{t.house.plans[plan.key].name}</Text>
                  {plan.popular && (
                    <View style={styles.popularBadge}>
                      <Sparkles size={10} color={Colors.white} strokeWidth={2.5} />
                      <Text style={styles.popularText}>{t.common.popular}</Text>
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
                    <Text style={styles.planMetaText}>{t.house.plans[plan.key].rooms}</Text>
                  </View>
                </View>
                {t.house.plans[plan.key].features.map((feat) => (
                  <View key={feat} style={styles.featureRow}>
                    <View style={styles.featureDot} />
                    <Text style={styles.featureText}>{feat}</Text>
                  </View>
                ))}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t.house.extraServices}</Text>
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
                <Text style={styles.extraName}>{t.house.extras[extra.key]}</Text>
              </View>
              <Text style={styles.extraPrice}>+{MXN(extra.price)}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>{t.house.planLabel} {t.house.plans[plansData[selectedPlan].key].name}</Text>
            <Text style={styles.summaryValue}>{MXN(plansData[selectedPlan].price)}</Text>
          </View>
          {extrasSel.length > 0 && (
            <View style={[styles.summaryRow, { marginTop: Spacing.sm }]}>
              <Text style={styles.summaryLabel}>{t.house.extrasLabel} ({extrasSel.length})</Text>
              <Text style={styles.summaryValue}>{MXN(extrasTotal)}</Text>
            </View>
          )}
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>{t.common.total}</Text>
            <Text style={styles.totalValue}>{MXN(total)}</Text>
          </View>
        </View>

        <PrimaryButton label={t.house.scheduleButton} onPress={() => router.push('/cart')} style={{ marginTop: Spacing.lg }} />
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
  planCard: { borderRadius: Radius.lg, overflow: 'hidden', marginBottom: Spacing.md, borderWidth: 2, borderColor: 'transparent', ...Shadow.sm },
  planCardActive: { borderColor: Colors.primary },
  planHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: Spacing.md },
  planHeaderLeft: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  planName: { fontSize: FontSize.lg, fontWeight: '700', color: Colors.white },
  popularBadge: { flexDirection: 'row', alignItems: 'center', gap: 2, backgroundColor: 'rgba(255,255,255,0.25)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: Radius.full },
  popularText: { fontSize: 10, fontWeight: '700', color: Colors.white },
  planPrice: { fontSize: FontSize.xl, fontWeight: '800', color: Colors.white },
  planBody: { backgroundColor: Colors.white, padding: Spacing.md },
  planMetaRow: { flexDirection: 'row', gap: Spacing.lg, marginBottom: Spacing.md },
  planMetaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  planMetaText: { fontSize: FontSize.sm, color: Colors.textMuted },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: 6 },
  featureDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.secondary },
  featureText: { fontSize: FontSize.sm, color: Colors.textSecondary },
  extraCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: Colors.white, borderRadius: Radius.lg, padding: Spacing.md, marginBottom: Spacing.sm, borderWidth: 2, borderColor: 'transparent', ...Shadow.sm },
  extraCardActive: { borderColor: Colors.secondary },
  extraLeft: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  checkbox: { width: 22, height: 22, borderRadius: 6, borderWidth: 2, borderColor: Colors.border, justifyContent: 'center', alignItems: 'center' },
  checkboxActive: { backgroundColor: Colors.secondary, borderColor: Colors.secondary },
  checkText: { color: Colors.white, fontWeight: '700', fontSize: 14 },
  extraName: { fontSize: FontSize.md, fontWeight: '500', color: Colors.textPrimary },
  extraPrice: { fontSize: FontSize.md, fontWeight: '700', color: Colors.secondary },
  summaryCard: { backgroundColor: Colors.white, borderRadius: Radius.lg, padding: Spacing.lg, ...Shadow.sm },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  summaryLabel: { fontSize: FontSize.md, color: Colors.textSecondary },
  summaryValue: { fontSize: FontSize.md, fontWeight: '600', color: Colors.textPrimary },
  divider: { height: 1, backgroundColor: Colors.border, marginVertical: Spacing.md },
  totalLabel: { fontSize: FontSize.lg, fontWeight: '700', color: Colors.textPrimary },
  totalValue: { fontSize: FontSize.xxl, fontWeight: '800', color: Colors.primary },
});
