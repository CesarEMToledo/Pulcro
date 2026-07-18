import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Spacing, FontSize, Radius, Shadow, Layout } from '@/constants/theme';
import { Plug, Lightbulb, Gauge, PlugZap, Sparkles } from 'lucide-react-native';

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
    key: 'outlet' as const,
    price: 200,
    duration: '45 min',
    icon: Plug,
    color: ['#1A6FD4', '#4A90E2'] as [string, string],
  },
  {
    key: 'lighting' as const,
    price: 320,
    duration: '1.5 hrs',
    icon: Lightbulb,
    color: ['#2ABFBF', '#00D4AA'] as [string, string],
    popular: true,
  },
  {
    key: 'panel' as const,
    price: 450,
    duration: '2 hrs',
    icon: Gauge,
    color: ['#0D4FA0', '#1A6FD4'] as [string, string],
  },
  {
    key: 'rewiring' as const,
    price: 1500,
    duration: '6 hrs',
    icon: PlugZap,
    color: ['#1A9A9A', '#4DD9D9'] as [string, string],
  },
];

const propertyTypeData = [
  { key: 'apartment' as const, extra: 0 },
  { key: 'house' as const, extra: 100 },
];

export default function ElectricityScreen() {
  const router = useRouter();
  const { t } = useLanguage();
  const { addItem } = useCart();
  const [selectedService, setSelectedService] = useState(1);
  const [selectedProperty, setSelectedProperty] = useState(0);

  const total = servicesData[selectedService].price + propertyTypeData[selectedProperty].extra;

  const addToCart = () => {
    addItem(
      {
        id: 'electricity-booking',
        name: `${t.electricity.title} · ${t.electricity.services[servicesData[selectedService].key].name}`,
        detail: t.electricity.property[propertyTypeData[selectedProperty].key],
        price: total,
        image: ServiceIcons.electricity,
      },
      { replace: true }
    );
    router.push('/cart');
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScreenHeader title={t.electricity.title} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <ServiceHero
          variant="electricity"
          gradient={['#1A6FD4', '#4DD9D9']}
          title={t.electricity.heroTitle}
          subtitle={t.electricity.heroSubtitle}
        />

        <View style={bs.section}>
          <Text style={bs.sectionTitle}>{t.electricity.propertyType}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.propertyScroll}>
            {propertyTypeData.map((p, i) => (
              <TouchableOpacity
                key={p.key}
                activeOpacity={0.7}
                onPress={() => setSelectedProperty(i)}
                style={[styles.propertyChip, selectedProperty === i && styles.propertyChipActive]}
              >
                <Text style={[styles.propertyText, selectedProperty === i && styles.propertyTextActive]}>{t.electricity.property[p.key]}</Text>
                {p.extra > 0 && <Text style={[styles.propertyExtra, selectedProperty === i && styles.propertyExtraActive]}>+{MXN(p.extra)}</Text>}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={bs.section}>
          <Text style={bs.sectionTitle}>{t.electricity.chooseService}</Text>
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
                      <Text style={styles.svcName}>{t.electricity.services[svc.key].name}</Text>
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
                    {t.electricity.services[svc.key].features.map((feat) => (
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
              label: `${t.electricity.services[servicesData[selectedService].key].name} · ${t.electricity.property[propertyTypeData[selectedProperty].key]}`,
              value: MXN(servicesData[selectedService].price),
            },
            ...(propertyTypeData[selectedProperty].extra > 0
              ? [{ label: t.electricity.propertySurcharge, value: `+${MXN(propertyTypeData[selectedProperty].extra)}` }]
              : []),
          ]}
          totalLabel={t.common.total}
          totalValue={MXN(total)}
        />

        <PrimaryButton label={t.electricity.scheduleButton} onPress={addToCart} style={{ marginTop: Spacing.lg }} />
        <View style={{ height: Spacing.xxl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  scrollContent: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.sm, width: '100%', maxWidth: Layout.maxContentWidth, alignSelf: 'center' },
  propertyScroll: { gap: Spacing.sm, paddingRight: Spacing.lg },
  propertyChip: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: Colors.white, paddingHorizontal: Spacing.md, paddingVertical: Spacing.md, borderRadius: Radius.lg, borderWidth: 2, borderColor: 'transparent', ...Shadow.sm },
  propertyChipActive: { borderColor: Colors.primary, backgroundColor: Colors.primary + '08' },
  propertyText: { fontSize: FontSize.md, fontWeight: '600', color: Colors.textPrimary },
  propertyTextActive: { color: Colors.primary },
  propertyExtra: { fontSize: FontSize.xs, color: Colors.textMuted },
  propertyExtraActive: { color: Colors.primary },
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
