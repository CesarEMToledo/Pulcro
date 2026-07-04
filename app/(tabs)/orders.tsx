import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors, Spacing, FontSize, Radius, Shadow } from '@/constants/theme';
import { Package, Clock, CheckCircle, Truck, ChevronRight } from 'lucide-react-native';

const MXN = (n: number) => `${n.toLocaleString('es-MX')} MXN`;
import ScreenHeader from '@/components/ScreenHeader';

const orders = [
  {
    id: 'PUL-2024-001',
    service: 'Lavado de Ropa por Kilos',
    status: 'En proceso',
    statusColor: Colors.warning,
    date: '01 Jul 2026',
    total: 180,
    items: 2,
    icon: 'laundry' as const,
  },
  {
    id: 'PUL-2024-002',
    service: 'Limpieza de Tenis',
    status: 'Entregado',
    statusColor: Colors.success,
    date: '28 Jun 2026',
    total: 160,
    items: 2,
    icon: 'garments' as const,
  },
  {
    id: 'PUL-2024-003',
    service: 'Limpieza de Casa',
    status: 'Recogido',
    statusColor: Colors.primary,
    date: '25 Jun 2026',
    total: 500,
    items: 1,
    icon: 'house' as const,
  },
];

const statusSteps = [
  { label: 'Recogido', icon: Package },
  { label: 'En proceso', icon: Clock },
  { label: 'En camino', icon: Truck },
  { label: 'Entregado', icon: CheckCircle },
];

export default function OrdersScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScreenHeader title="Mis Pedidos" showBack={false} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.activeCard}>
          <View style={styles.activeHeader}>
            <View style={styles.activeIconWrap}>
              <Truck size={24} color={Colors.white} strokeWidth={2.5} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.activeTitle}>Pedido en curso</Text>
              <Text style={styles.activeId}>PUL-2024-001</Text>
            </View>
            <View style={[styles.statusPill, { backgroundColor: Colors.warning + '20' }]}>
              <Text style={[styles.statusText, { color: Colors.warning }]}>En proceso</Text>
            </View>
          </View>

          <View style={styles.stepsRow}>
            {statusSteps.map((step, i) => {
              const Icon = step.icon;
              const active = i <= 1;
              return (
                <View key={step.label} style={styles.stepWrap}>
                  <View style={[styles.stepCircle, active ? styles.stepActive : styles.stepInactive]}>
                    <Icon size={16} color={active ? Colors.white : Colors.textMuted} strokeWidth={2.5} />
                  </View>
                  <Text style={[styles.stepLabel, { color: active ? Colors.primary : Colors.textMuted }]}>{step.label}</Text>
                  {i < statusSteps.length - 1 && <View style={[styles.stepLine, { backgroundColor: i < 1 ? Colors.primary : Colors.border }]} />}
                </View>
              );
            })}
          </View>
        </View>

        <Text style={styles.historyTitle}>Historial</Text>
        {orders.map((order) => (
          <TouchableOpacity key={order.id} activeOpacity={0.85} onPress={() => {}} style={styles.orderCard}>
            <View style={styles.orderLeft}>
              <View style={[styles.orderIcon, { backgroundColor: order.statusColor + '15' }]}>
                <Package size={20} color={order.statusColor} strokeWidth={2.5} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.orderService}>{order.service}</Text>
                <Text style={styles.orderMeta}>{order.id} · {order.date}</Text>
                <View style={[styles.statusPillSmall, { backgroundColor: order.statusColor + '15' }]}>
                  <Text style={[styles.statusTextSmall, { color: order.statusColor }]}>{order.status}</Text>
                </View>
              </View>
            </View>
            <View style={styles.orderRight}>
              <Text style={styles.orderTotal}>{MXN(order.total)}</Text>
              <ChevronRight size={18} color={Colors.textMuted} strokeWidth={2.5} />
            </View>
          </TouchableOpacity>
        ))}
        <View style={{ height: Spacing.xxl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  scrollContent: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.sm },
  activeCard: { backgroundColor: Colors.white, borderRadius: Radius.xl, padding: Spacing.lg, marginBottom: Spacing.xl, ...Shadow.md },
  activeHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, marginBottom: Spacing.lg },
  activeIconWrap: { width: 48, height: 48, borderRadius: Radius.md, backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center' },
  activeTitle: { fontSize: FontSize.lg, fontWeight: '700', color: Colors.textPrimary },
  activeId: { fontSize: FontSize.sm, color: Colors.textMuted, marginTop: 2 },
  statusPill: { paddingHorizontal: Spacing.sm, paddingVertical: 4, borderRadius: Radius.full },
  statusText: { fontSize: FontSize.xs, fontWeight: '700' },
  stepsRow: { flexDirection: 'row', justifyContent: 'space-between', position: 'relative' },
  stepWrap: { alignItems: 'center', flex: 1, position: 'relative' },
  stepCircle: { width: 36, height: 36, borderRadius: Radius.full, justifyContent: 'center', alignItems: 'center', marginBottom: 6 },
  stepActive: { backgroundColor: Colors.primary },
  stepInactive: { backgroundColor: Colors.surface },
  stepLabel: { fontSize: 10, fontWeight: '600', textAlign: 'center' },
  stepLine: { position: 'absolute', top: 18, left: '70%', right: '-30%', height: 2, zIndex: -1 },
  historyTitle: { fontSize: FontSize.xl, fontWeight: '700', color: Colors.textPrimary, marginBottom: Spacing.md },
  orderCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: Colors.white, borderRadius: Radius.lg, padding: Spacing.md, marginBottom: Spacing.md, ...Shadow.sm },
  orderLeft: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, flex: 1 },
  orderIcon: { width: 44, height: 44, borderRadius: Radius.md, justifyContent: 'center', alignItems: 'center' },
  orderService: { fontSize: FontSize.md, fontWeight: '600', color: Colors.textPrimary },
  orderMeta: { fontSize: FontSize.xs, color: Colors.textMuted, marginTop: 2, marginBottom: 6 },
  statusPillSmall: { alignSelf: 'flex-start', paddingHorizontal: Spacing.sm, paddingVertical: 2, borderRadius: Radius.full },
  statusTextSmall: { fontSize: 10, fontWeight: '700' },
  orderRight: { alignItems: 'flex-end', gap: Spacing.xs },
  orderTotal: { fontSize: FontSize.lg, fontWeight: '700', color: Colors.primary },
});
