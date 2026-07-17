import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors, Spacing, FontSize, Radius, Shadow } from '@/constants/theme';
import { Package, Clock, CheckCircle, Truck, ChevronRight, X } from 'lucide-react-native';
import { useLanguage } from '@/contexts/LanguageContext';

const MXN = (n: number) => `${n.toLocaleString('es-MX')} MXN`;
import ScreenHeader from '@/components/ScreenHeader';

const ordersData = [
  {
    id: 'CLE-2024-001',
    serviceKey: 'laundryByKilos' as const,
    statusKey: 'inProgress' as const,
    statusColor: Colors.warning,
    date: '01 Jul 2026',
    total: 180,
    items: 2,
    icon: 'laundry' as const,
  },
  {
    id: 'CLE-2024-002',
    serviceKey: 'sneakersCleaning' as const,
    statusKey: 'delivered' as const,
    statusColor: Colors.success,
    date: '28 Jun 2026',
    total: 160,
    items: 2,
    icon: 'garments' as const,
  },
  {
    id: 'CLE-2024-003',
    serviceKey: 'houseCleaning' as const,
    statusKey: 'pickedUp' as const,
    statusColor: Colors.primary,
    date: '25 Jun 2026',
    total: 500,
    items: 1,
    icon: 'house' as const,
  },
];

export default function OrdersScreen() {
  const router = useRouter();
  const { t } = useLanguage();
  const [selectedOrder, setSelectedOrder] = useState<(typeof ordersData)[number] | null>(null);

  const statusSteps = [
    { labelKey: 'pickedUp' as const, icon: Package },
    { labelKey: 'inProgress' as const, icon: Clock },
    { labelKey: 'onTheWay' as const, icon: Truck },
    { labelKey: 'delivered' as const, icon: CheckCircle },
  ];

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScreenHeader title={t.orders.title} showBack={false} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.activeCard}>
          <View style={styles.activeHeader}>
            <View style={styles.activeIconWrap}>
              <Truck size={24} color={Colors.white} strokeWidth={2.5} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.activeTitle}>{t.orders.activeTitle}</Text>
              <Text style={styles.activeId}>CLE-2024-001</Text>
            </View>
            <View style={[styles.statusPill, { backgroundColor: Colors.warning + '20' }]}>
              <Text style={[styles.statusText, { color: Colors.warning }]}>{t.orders.status.inProgress}</Text>
            </View>
          </View>

          <View style={styles.stepsRow}>
            {statusSteps.map((step, i) => {
              const Icon = step.icon;
              const active = i <= 1;
              return (
                <View key={step.labelKey} style={styles.stepWrap}>
                  <View style={[styles.stepCircle, active ? styles.stepActive : styles.stepInactive]}>
                    <Icon size={16} color={active ? Colors.white : Colors.textMuted} strokeWidth={2.5} />
                  </View>
                  <Text style={[styles.stepLabel, { color: active ? Colors.primary : Colors.textMuted }]}>{t.orders.status[step.labelKey]}</Text>
                  {i < statusSteps.length - 1 && <View style={[styles.stepLine, { backgroundColor: i < 1 ? Colors.primary : Colors.border }]} />}
                </View>
              );
            })}
          </View>
        </View>

        <Text style={styles.historyTitle}>{t.orders.historyTitle}</Text>
        {ordersData.map((order) => (
          <TouchableOpacity key={order.id} activeOpacity={0.85} onPress={() => setSelectedOrder(order)} style={styles.orderCard}>
            <View style={styles.orderLeft}>
              <View style={[styles.orderIcon, { backgroundColor: order.statusColor + '15' }]}>
                <Package size={20} color={order.statusColor} strokeWidth={2.5} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.orderService}>{t.orders.services[order.serviceKey]}</Text>
                <Text style={styles.orderMeta}>{order.id} · {order.date}</Text>
                <View style={[styles.statusPillSmall, { backgroundColor: order.statusColor + '15' }]}>
                  <Text style={[styles.statusTextSmall, { color: order.statusColor }]}>{t.orders.status[order.statusKey]}</Text>
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

      {/* Order Detail Modal */}
      <Modal visible={!!selectedOrder} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t.orders.detailModal.title}</Text>
              <TouchableOpacity
                onPress={() => setSelectedOrder(null)}
                style={styles.modalClose}
                accessibilityRole="button"
                accessibilityLabel={t.common.close}
              >
                <X size={20} color={Colors.textSecondary} strokeWidth={2.5} />
              </TouchableOpacity>
            </View>
            {selectedOrder && (
              <>
                <View style={[styles.detailIconWrap, { backgroundColor: selectedOrder.statusColor + '15' }]}>
                  <Package size={28} color={selectedOrder.statusColor} strokeWidth={2.5} />
                </View>
                <Text style={styles.detailServiceName}>{t.orders.services[selectedOrder.serviceKey]}</Text>
                <View style={[styles.statusPillSmall, { backgroundColor: selectedOrder.statusColor + '15', alignSelf: 'center', marginBottom: Spacing.lg }]}>
                  <Text style={[styles.statusTextSmall, { color: selectedOrder.statusColor }]}>{t.orders.status[selectedOrder.statusKey]}</Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>{t.orders.detailModal.orderId}</Text>
                  <Text style={styles.detailValue}>{selectedOrder.id}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>{t.orders.detailModal.date}</Text>
                  <Text style={styles.detailValue}>{selectedOrder.date}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>{t.orders.detailModal.items}</Text>
                  <Text style={styles.detailValue}>{selectedOrder.items}</Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.detailRow}>
                  <Text style={styles.detailTotalLabel}>{t.common.total}</Text>
                  <Text style={styles.detailTotalValue}>{MXN(selectedOrder.total)}</Text>
                </View>
              </>
            )}
            <View style={{ height: Spacing.lg }} />
          </View>
        </View>
      </Modal>
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

  // Detail modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  modalSheet: { backgroundColor: Colors.white, borderTopLeftRadius: Radius.xl, borderTopRightRadius: Radius.xl, paddingHorizontal: Spacing.lg, paddingBottom: Spacing.xxl },
  modalHandle: { width: 40, height: 4, borderRadius: 2, backgroundColor: Colors.border, alignSelf: 'center', marginTop: Spacing.sm, marginBottom: Spacing.md },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.lg },
  modalTitle: { fontSize: FontSize.xl, fontWeight: '700', color: Colors.textPrimary },
  modalClose: { width: 32, height: 32, borderRadius: Radius.full, backgroundColor: Colors.surface, justifyContent: 'center', alignItems: 'center' },
  detailIconWrap: { width: 64, height: 64, borderRadius: Radius.full, justifyContent: 'center', alignItems: 'center', alignSelf: 'center', marginBottom: Spacing.md },
  detailServiceName: { fontSize: FontSize.lg, fontWeight: '700', color: Colors.textPrimary, textAlign: 'center', marginBottom: Spacing.sm },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: Spacing.sm },
  detailLabel: { fontSize: FontSize.md, color: Colors.textSecondary },
  detailValue: { fontSize: FontSize.md, fontWeight: '600', color: Colors.textPrimary },
  divider: { height: 1, backgroundColor: Colors.border, marginVertical: Spacing.sm },
  detailTotalLabel: { fontSize: FontSize.lg, fontWeight: '700', color: Colors.textPrimary },
  detailTotalValue: { fontSize: FontSize.xxl, fontWeight: '800', color: Colors.primary },
});
