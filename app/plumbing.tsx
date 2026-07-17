import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Spacing, FontSize, Radius, Shadow } from '@/constants/theme';
import { Droplets, ShowerHead, Wrench, Flame, Sparkles } from 'lucide-react-native';

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
    key: 'unclog' as const,
    price: 250,
    duration: '45 min',
    icon: Droplets,
    color: ['#1A6FD4', '#4A90E2'] as [string, string],
  },
  {
    key: 'leak' as const,
    price: 350,
    duration: '1 hr',
    icon: ShowerHead,
    color: ['#2ABFBF', '#00D4AA'] as [string, string],
    popular: true,
  },
  {
    key: 'faucet' as const,
    price: 280,
    duration: '1 hr',
    icon: Wrench,
    color: ['#0D4FA0', '#1A6FD4'] as [string, string],
  },
  {
    key: 'heater' as const,
    price: 900,
    duration: '3 hrs',
    icon: Flame,
    color: ['#1A9A9A', '#4DD9D9'] as [string, string],
  },
];

const urgencyData = [
  { key: 'normal' as const, extra: 0 },
  { key: 'urgent' as const, extra: 150 },
];

export default function PlumbingScreen() {
  const router = useRouter();
  const { t } = useLanguage();
  const { addItem } = useCart();
  const [selectedService, setSelectedService] = useState(1);
  const [selectedUrgency, setSelectedUrgency] = useState(0);

  const total = servicesData[selectedService].price + urgencyData[selectedUrgency].extra;

  const addToCart = () => {
    addItem(
      {
        id: 'plumbing-booking',
        name: `${t.plumbing.title} · ${t.plumbing.services[servicesData[selectedService].key].name}`,
        detail: t.plumbing.urgency[urgencyData[selectedUrgency].key],
        price: total,
        image: ServiceIcons.plumbing,
      },
      { replace: true }
    );
    router.push('/cart');
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScreenHeader title={t.plumbing.title} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <ServiceHero
          variant="plumbing"
          gradient={['#0D4FA0', '#1A9A9A']}
          title={t.plumbing.heroTitle}
          subtitle={t.plumbing.heroSubtitle}
        />

        <View style={bs.section}>
          <Text style={bs.sectionTitle}>{t.plumbing.urgencyType}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.urgencyScroll}>
            {urgencyData.map((u, i) => (
              <TouchableOpacity
                key={u.key}
                activeOpacity={0.7}
                onPress={() => setSelectedUrgency(i)}
                style={[styles.urgencyChip, selectedUrgency === i && styles.urgencyChipActive]}
              >
                <Text style={[styles.urgencyText, selectedUrgency === i && styles.urgencyTextActive]}>{t.plumbing.urgency[u.key]}</Text>
                {u.extra > 0 && <Text style={[styles.urgencyExtra, selectedUrgency === i && styles.urgencyExtraActive]}>+{MXN(u.extra)}</Text>}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={bs.section}>
          <Text style={bs.sectionTitle}>{t.plumbing.chooseService}</Text>
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
                      <Text style={styles.svcName}>{t.plumbing.services[svc.key].name}</Text>
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
                    {t.plumbing.services[svc.key].features.map((feat) => (
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
              label: `${t.plumbing.services[servicesData[selectedService].key].name} · ${t.plumbing.urgency[urgencyData[selectedUrgency].key]}`,
              value: MXN(servicesData[selectedService].price),
            },
            ...(urgencyData[selectedUrgency].extra > 0
              ? [{ label: t.plumbing.urgencySurcharge, value: `+${MXN(urgencyData[selectedUrgency].extra)}` }]
              : []),
          ]}
          totalLabel={t.common.total}
          totalValue={MXN(total)}
        />

        <PrimaryButton label={t.plumbing.scheduleButton} onPress={addToCart} style={{ marginTop: Spacing.lg }} />
        <View style={{ height: Spacing.xxl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  scrollContent: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.sm },
  urgencyScroll: { gap: Spacing.sm, paddingRight: Spacing.lg },
  urgencyChip: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: Colors.white, paddingHorizontal: Spacing.md, paddingVertical: Spacing.md, borderRadius: Radius.lg, borderWidth: 2, borderColor: 'transparent', ...Shadow.sm },
  urgencyChipActive: { borderColor: Colors.primary, backgroundColor: Colors.primary + '08' },
  urgencyText: { fontSize: FontSize.md, fontWeight: '600', color: Colors.textPrimary },
  urgencyTextActive: { color: Colors.primary },
  urgencyExtra: { fontSize: FontSize.xs, color: Colors.textMuted },
  urgencyExtraActive: { color: Colors.primary },
  svcCard: { backgroundColor: Colors.white, borderRadius: Radius.lg, padding: Spacing.md, marginBottom: Spacing.md, borderWidth: 2, borderColor: 'transparent', ...Shadow.sm },
  svcCardActive: { borderColor: Colors.primary },
  svcHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  svcIcon: { width: 48, height: 48, borderRadius: Radius.md, justifyContent: 'center', alignItems: 'center' },
  svcTitleRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  svcName: { fontSize: FontSize.md, fontWeight: '700', color: Colors.textPrimary },
  svcDuration: { fontSize: FontSize.sm, color: Colors.textMuted, marginTop: 2 },
  svcPrice: { fontSize: FontSize.lg, fontWeight: '800', color: Colors.primary },
  svcFeatures: { marginTop: Spacing.md, paddingTop: Spacing.md, borderTopWidth: 1, borderTopColor: Colors.border },
});
