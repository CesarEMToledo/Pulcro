import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, FontSize, Radius, Shadow, Layout } from '@/constants/theme';
import { moderateScale } from '@/constants/responsive';
import { Package, Clock, CheckCircle, Truck, Tag, CheckCheck, BellOff } from 'lucide-react-native';
import { useLanguage } from '@/contexts/LanguageContext';
import ScreenHeader from '@/components/ScreenHeader';

type OrderNotification = {
  id: string;
  kind: 'order';
  orderId: string;
  serviceKey: 'laundryByKilos' | 'sneakersCleaning' | 'houseCleaning';
  statusKey: 'pickedUp' | 'inProgress' | 'onTheWay' | 'delivered';
  color: string;
  time: string;
  read: boolean;
};

type PromoNotification = {
  id: string;
  kind: 'promo';
  time: string;
  read: boolean;
};

type NotificationItem = OrderNotification | PromoNotification;

const statusIcons = {
  pickedUp: Package,
  inProgress: Clock,
  onTheWay: Truck,
  delivered: CheckCircle,
};

const initialNotifications: NotificationItem[] = [
  { id: 'n1', kind: 'order', orderId: 'PUL-2024-001', serviceKey: 'laundryByKilos', statusKey: 'inProgress', color: Colors.warning, time: '10 min', read: false },
  { id: 'n2', kind: 'order', orderId: 'PUL-2024-001', serviceKey: 'laundryByKilos', statusKey: 'pickedUp', color: Colors.primary, time: '3 h', read: false },
  { id: 'n3', kind: 'promo', time: '5 h', read: false },
  { id: 'n4', kind: 'order', orderId: 'PUL-2024-002', serviceKey: 'sneakersCleaning', statusKey: 'delivered', color: Colors.success, time: '1 d', read: true },
  { id: 'n5', kind: 'order', orderId: 'PUL-2024-003', serviceKey: 'houseCleaning', statusKey: 'onTheWay', color: Colors.primary, time: '2 d', read: true },
  { id: 'n6', kind: 'order', orderId: 'PUL-2024-003', serviceKey: 'houseCleaning', statusKey: 'pickedUp', color: Colors.primary, time: '2 d', read: true },
];

export default function NotificationsScreen() {
  const { t } = useLanguage();
  const [items, setItems] = useState<NotificationItem[]>(initialNotifications);

  const unreadCount = items.filter((n) => !n.read).length;

  const markAllRead = () => {
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markOneRead = (id: string) => {
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScreenHeader
        title={t.notifications.title}
        rightIcon={unreadCount > 0 ? <CheckCheck size={18} color={Colors.primary} strokeWidth={2.5} /> : undefined}
        onRightPress={markAllRead}
      />
      {items.length === 0 ? (
        <View style={styles.emptyWrap}>
          <View style={styles.emptyIcon}>
            <BellOff size={32} color={Colors.textMuted} strokeWidth={2} />
          </View>
          <Text style={styles.emptyTitle}>{t.notifications.emptyTitle}</Text>
          <Text style={styles.emptySubtitle}>{t.notifications.emptySubtitle}</Text>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {unreadCount > 0 && (
            <TouchableOpacity activeOpacity={0.7} onPress={markAllRead} style={styles.markAllRow}>
              <Text style={styles.markAllText}>{t.notifications.markAllRead}</Text>
            </TouchableOpacity>
          )}
          {items.map((item) => {
            if (item.kind === 'promo') {
              return (
                <TouchableOpacity
                  key={item.id}
                  activeOpacity={0.85}
                  onPress={() => markOneRead(item.id)}
                  style={[styles.card, !item.read && styles.cardUnread]}
                >
                  {!item.read && <View style={styles.unreadDot} />}
                  <View style={[styles.iconWrap, { backgroundColor: Colors.accent + '15' }]}>
                    <Tag size={20} color={Colors.accent} strokeWidth={2.5} />
                  </View>
                  <View style={styles.cardBody}>
                    <Text style={styles.cardTitle}>{t.notifications.promo.title}</Text>
                    <Text style={styles.cardMessage}>{t.notifications.promo.message}</Text>
                    <Text style={styles.cardTime}>{item.time}</Text>
                  </View>
                </TouchableOpacity>
              );
            }

            const Icon = statusIcons[item.statusKey];
            return (
              <TouchableOpacity
                key={item.id}
                activeOpacity={0.85}
                onPress={() => markOneRead(item.id)}
                style={[styles.card, !item.read && styles.cardUnread]}
              >
                {!item.read && <View style={styles.unreadDot} />}
                <View style={[styles.iconWrap, { backgroundColor: item.color + '15' }]}>
                  <Icon size={20} color={item.color} strokeWidth={2.5} />
                </View>
                <View style={styles.cardBody}>
                  <Text style={styles.cardTitle}>{t.orders.services[item.serviceKey]}</Text>
                  <Text style={styles.cardMessage}>{t.notifications.statusMessages[item.statusKey]}</Text>
                  <View style={styles.cardMetaRow}>
                    <Text style={styles.cardOrderId}>{item.orderId}</Text>
                    <Text style={styles.cardTime}>· {item.time}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
          <View style={{ height: Spacing.xxl }} />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  scrollContent: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.sm, width: '100%', maxWidth: Layout.maxContentWidth, alignSelf: 'center' },
  markAllRow: { alignSelf: 'flex-end', marginBottom: Spacing.sm },
  markAllText: { fontSize: FontSize.sm, fontWeight: '600', color: Colors.primary },
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadow.sm,
    position: 'relative',
  },
  cardUnread: { backgroundColor: Colors.primary + '08' },
  unreadDot: { position: 'absolute', top: Spacing.md, right: Spacing.md, width: moderateScale(8), height: moderateScale(8), borderRadius: moderateScale(4), backgroundColor: Colors.primary },
  iconWrap: { width: moderateScale(44), height: moderateScale(44), borderRadius: Radius.md, justifyContent: 'center', alignItems: 'center' },
  cardBody: { flex: 1, paddingRight: Spacing.md },
  cardTitle: { fontSize: FontSize.md, fontWeight: '700', color: Colors.textPrimary, marginBottom: 2 },
  cardMessage: { fontSize: FontSize.sm, color: Colors.textSecondary, lineHeight: 19, marginBottom: 6 },
  cardMetaRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  cardOrderId: { fontSize: FontSize.xs, color: Colors.textMuted, fontWeight: '600' },
  cardTime: { fontSize: FontSize.xs, color: Colors.textMuted },
  emptyWrap: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: Spacing.xl },
  emptyIcon: { width: moderateScale(72), height: moderateScale(72), borderRadius: Radius.full, backgroundColor: Colors.surface, justifyContent: 'center', alignItems: 'center', marginBottom: Spacing.md },
  emptyTitle: { fontSize: FontSize.lg, fontWeight: '700', color: Colors.textPrimary, marginBottom: 4, textAlign: 'center' },
  emptySubtitle: { fontSize: FontSize.sm, color: Colors.textMuted, textAlign: 'center' },
});
