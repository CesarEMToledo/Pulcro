import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Spacing, FontSize, Radius, Shadow } from '@/constants/theme';
import { Car, Sparkles, Droplets, Wind } from 'lucide-react-native';

const MXN = (n: number) => `${n.toLocaleString('es-MX')} MXN`;
import ScreenHeader from '@/components/ScreenHeader';
import PrimaryButton from '@/components/PrimaryButton';

const services = [
  {
    name: 'Lavado Exterior',
    price: 120,
    duration: '45 min',
    icon: Droplets,
    color: ['#1A6FD4', '#4A90E2'] as [string, string],
    features: ['Lavado de carrocería', 'Secado con microfibra', 'Limpieza de llantas', 'Limpieza de cristales'],
  },
  {
    name: 'Lavado Completo',
    price: 250,
    duration: '1.5 hrs',
    icon: Car,
    color: ['#2ABFBF', '#00D4AA'] as [string, string],
    features: ['Todo lo del Exterior', 'Aspirado interior', 'Limpieza de tablero', 'Limpieza de puertas', 'Aromatizante'],
    popular: true,
  },
  {
    name: 'Detallado Premium',
    price: 600,
    duration: '4 hrs',
    icon: Sparkles,
    color: ['#0D4FA0', '#1A6FD4'] as [string, string],
    features: ['Todo lo del Completo', 'Pulido de pintura', 'Encerado profundo', 'Limpieza de motor', 'Tratamiento de cuero', 'Desinfección ozone'],
  },
];

const vehicleTypes = [
  { name: 'Sedán', extra: 0 },
  { name: 'SUV', extra: 50 },
  { name: 'Pickup', extra: 80 },
  { name: 'Van', extra: 100 },
];

export default function CarScreen() {
  const router = useRouter();
  const [selectedService, setSelectedService] = useState(1);
  const [selectedVehicle, setSelectedVehicle] = useState(0);

  const total = services[selectedService].price + vehicleTypes[selectedVehicle].extra;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScreenHeader title="Limpieza de Carros" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.heroWrap}>
          <Image
            source={{ uri: 'https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg?auto=compress&cs=tinysrgb&w=600' }}
            style={styles.heroImage}
          />
          <LinearGradient colors={['transparent', 'rgba(0,0,0,0.6)']} style={styles.heroOverlay}>
            <Text style={styles.heroTitle}>Detallado a domicilio</Text>
            <Text style={styles.heroSubtitle}>Vamos hasta donde estés</Text>
          </LinearGradient>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tipo de vehículo</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.vehicleScroll}>
            {vehicleTypes.map((v, i) => (
              <TouchableOpacity
                key={v.name}
                activeOpacity={0.7}
                onPress={() => setSelectedVehicle(i)}
                style={[styles.vehicleChip, selectedVehicle === i && styles.vehicleChipActive]}
              >
                <Text style={[styles.vehicleText, selectedVehicle === i && styles.vehicleTextActive]}>{v.name}</Text>
                {v.extra > 0 && <Text style={[styles.vehicleExtra, selectedVehicle === i && styles.vehicleExtraActive]}>+{MXN(v.extra)}</Text>}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Elige el servicio</Text>
          {services.map((svc, i) => {
            const Icon = svc.icon;
            return (
              <TouchableOpacity
                key={svc.name}
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
                      <Text style={styles.svcName}>{svc.name}</Text>
                      {svc.popular && (
                        <View style={styles.popularBadge}>
                          <Sparkles size={10} color={Colors.white} strokeWidth={2.5} />
                          <Text style={styles.popularText}>Popular</Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.svcDuration}>{svc.duration}</Text>
                  </View>
                  <Text style={styles.svcPrice}>{MXN(svc.price)}</Text>
                </View>
                {selectedService === i && (
                  <View style={styles.svcFeatures}>
                    {svc.features.map((feat) => (
                      <View key={feat} style={styles.featureRow}>
                        <View style={styles.featureDot} />
                        <Text style={styles.featureText}>{feat}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>{services[selectedService].name} · {vehicleTypes[selectedVehicle].name}</Text>
            <Text style={styles.summaryValue}>{MXN(services[selectedService].price)}</Text>
          </View>
          {vehicleTypes[selectedVehicle].extra > 0 && (
            <View style={[styles.summaryRow, { marginTop: Spacing.sm }]}>
              <Text style={styles.summaryLabel}>Cargo por vehículo</Text>
              <Text style={styles.summaryValue}>+{MXN(vehicleTypes[selectedVehicle].extra)}</Text>
            </View>
          )}
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>{MXN(total)}</Text>
          </View>
        </View>

        <PrimaryButton label="Agendar lavado" onPress={() => router.push('/cart')} style={{ marginTop: Spacing.lg }} />
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
  vehicleScroll: { gap: Spacing.sm, paddingRight: Spacing.lg },
  vehicleChip: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: Colors.white, paddingHorizontal: Spacing.md, paddingVertical: Spacing.md, borderRadius: Radius.lg, borderWidth: 2, borderColor: 'transparent', ...Shadow.sm },
  vehicleChipActive: { borderColor: Colors.primary, backgroundColor: Colors.primary + '08' },
  vehicleText: { fontSize: FontSize.md, fontWeight: '600', color: Colors.textPrimary },
  vehicleTextActive: { color: Colors.primary },
  vehicleExtra: { fontSize: FontSize.xs, color: Colors.textMuted },
  vehicleExtraActive: { color: Colors.primary },
  svcCard: { backgroundColor: Colors.white, borderRadius: Radius.lg, padding: Spacing.md, marginBottom: Spacing.md, borderWidth: 2, borderColor: 'transparent', ...Shadow.sm },
  svcCardActive: { borderColor: Colors.primary },
  svcHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  svcIcon: { width: 48, height: 48, borderRadius: Radius.md, justifyContent: 'center', alignItems: 'center' },
  svcTitleRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  svcName: { fontSize: FontSize.md, fontWeight: '700', color: Colors.textPrimary },
  popularBadge: { flexDirection: 'row', alignItems: 'center', gap: 2, backgroundColor: Colors.secondary, paddingHorizontal: 6, paddingVertical: 2, borderRadius: Radius.full },
  popularText: { fontSize: 10, fontWeight: '700', color: Colors.white },
  svcDuration: { fontSize: FontSize.sm, color: Colors.textMuted, marginTop: 2 },
  svcPrice: { fontSize: FontSize.lg, fontWeight: '800', color: Colors.primary },
  svcFeatures: { marginTop: Spacing.md, paddingTop: Spacing.md, borderTopWidth: 1, borderTopColor: Colors.border },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: 6 },
  featureDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.secondary },
  featureText: { fontSize: FontSize.sm, color: Colors.textSecondary },
  summaryCard: { backgroundColor: Colors.white, borderRadius: Radius.lg, padding: Spacing.lg, ...Shadow.sm },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  summaryLabel: { fontSize: FontSize.md, color: Colors.textSecondary, flex: 1 },
  summaryValue: { fontSize: FontSize.md, fontWeight: '600', color: Colors.textPrimary },
  divider: { height: 1, backgroundColor: Colors.border, marginVertical: Spacing.md },
  totalLabel: { fontSize: FontSize.lg, fontWeight: '700', color: Colors.textPrimary },
  totalValue: { fontSize: FontSize.xxl, fontWeight: '800', color: Colors.primary },
});
