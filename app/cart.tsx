import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Share,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Colors, Spacing, FontSize, Radius, Shadow, Layout } from '@/constants/theme';
import { moderateScale } from '@/constants/responsive';
import {
  MapPin,
  CreditCard,
  Calendar,
  Clock,
  Trash2,
  X,
  Check,
  Plus,
  Minus,
  ChevronLeft,
  ChevronRight,
  Phone,
  Share2,
  PartyPopper,
} from 'lucide-react-native';
import ScreenHeader from '@/components/ScreenHeader';
import PrimaryButton from '@/components/PrimaryButton';
import FallbackImage from '@/components/FallbackImage';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';
import { useLocation } from '@/contexts/LocationContext';
import { categoryFromCartItemId, isDispatchable } from '@/constants/dispatch';
import { buildOrderMessage, openOrderDispatch } from '@/lib/orderDispatch';
import { postDemandEvent } from '@/lib/demandCounter';

type Address = { id: string; label: string; text: string };

type PaymentMethod = { id: string; label: string; last4: string };
const SAVED_PAYMENTS: PaymentMethod[] = [
  { id: 'p1', label: 'Visa', last4: '4242' },
  { id: 'p2', label: 'Mastercard', last4: '5555' },
  { id: 'p3', label: 'OXXO Pay', last4: '' },
];

const TIME_SLOTS = [
  '08:00 - 10:00',
  '10:00 - 12:00',
  '12:00 - 14:00',
  '14:00 - 16:00',
  '16:00 - 18:00',
  '18:00 - 20:00',
];

const MXN = (n: number) => `$${n.toLocaleString('es-MX')} MXN`;

export default function CartScreen() {
  const router = useRouter();
  const { t } = useLanguage();
  const { items, removeItem, updateQuantity, clearAll } = useCart();
  const { address: confirmedAddress } = useLocation();

  const SAVED_ADDRESSES: Address[] = [
    { id: 'a1', label: t.cart.addressLabels.home, text: 'Av. Reforma 123, Col. Centro, CDMX' },
    { id: 'a2', label: t.cart.addressLabels.work, text: 'Insurgentes Sur 456, Col. Del Valle, CDMX' },
    { id: 'a3', label: t.cart.addressLabels.other, text: 'Polanco 789, Col. Polanco, CDMX' },
  ];

  function formatDate(d: Date) {
    return `${t.cart.days[d.getDay()]}, ${String(d.getDate()).padStart(2, '0')} ${t.cart.months[d.getMonth()]}`;
  }

  const [selectedAddressId, setSelectedAddressId] = useState('a1');
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [newAddress, setNewAddress] = useState('');
  const [savedAddresses, setSavedAddresses] = useState<Address[]>(SAVED_ADDRESSES);

  const [selectedPaymentId, setSelectedPaymentId] = useState('p1');
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const [showConfirm, setShowConfirm] = useState(false);
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [showOrderSuccess, setShowOrderSuccess] = useState(false);

  // Date/time state
  const [selectedDate, setSelectedDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d;
  });
  const [selectedTime, setSelectedTime] = useState(TIME_SLOTS[1]);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [viewMonth, setViewMonth] = useState(() => {
    const d = new Date();
    d.setDate(1);
    return d;
  });

  // The "Casa" entry always mirrors the address confirmed at onboarding
  // (LocationContext), even if it resolves after this screen's first render.
  const displayAddresses = savedAddresses.map((a) =>
    a.id === 'a1' && confirmedAddress ? { ...a, text: confirmedAddress } : a
  );
  const currentAddress = displayAddresses.find((a) => a.id === selectedAddressId)!;
  const currentPayment = SAVED_PAYMENTS.find((p) => p.id === selectedPaymentId)!;

  const addNewAddress = () => {
    if (!newAddress.trim()) return;
    const id = `a${Date.now()}`;
    setSavedAddresses((prev) => [...prev, { id, label: t.cart.addressLabels.new, text: newAddress.trim() }]);
    setSelectedAddressId(id);
    setNewAddress('');
    setShowAddressModal(false);
  };

  const canConfirmOrder = items.length > 0 && contactPhone.trim().length > 0;

  const handleConfirmOrder = async () => {
    if (!canConfirmOrder) return;

    items.forEach((item) => {
      const category = categoryFromCartItemId(item.id);
      if (category) postDemandEvent(category, item.price * item.quantity);
    });

    const dispatchableItems = items.filter((item) => isDispatchable(categoryFromCartItemId(item.id)));
    if (dispatchableItems.length > 0) {
      const message = buildOrderMessage({
        name: contactName.trim(),
        phone: contactPhone.trim(),
        address: currentAddress.text,
        items: dispatchableItems,
      });
      await openOrderDispatch(message);
    }

    setShowOrderSuccess(true);
  };

  const shareApp = () => {
    Share.share({ message: t.cart.shareMessage }).catch(() => {});
  };

  const finishOrder = () => {
    setShowOrderSuccess(false);
    clearAll();
    router.push('/(tabs)/orders');
  };

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const total = subtotal;

  // Calendar helpers
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startOffset = firstDay.getDay();
    const totalDays = lastDay.getDate();
    const cells: (Date | null)[] = [];
    for (let i = 0; i < startOffset; i++) cells.push(null);
    for (let d = 1; d <= totalDays; d++) cells.push(new Date(year, month, d));
    return cells;
  };

  const calendarCells = getDaysInMonth(viewMonth);
  const canGoPrev = viewMonth.getFullYear() > today.getFullYear() || (viewMonth.getFullYear() === today.getFullYear() && viewMonth.getMonth() > today.getMonth());

  const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

  const isSelectable = (d: Date) => {
    const copy = new Date(d);
    copy.setHours(0, 0, 0, 0);
    return copy >= today;
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScreenHeader
        title={t.cart.title}
        rightIcon={<Trash2 size={20} color={Colors.error} strokeWidth={2.5} />}
        onRightPress={() => setShowConfirm(true)}
        rightAccessibilityLabel={t.cart.confirmCartTitle}
      />

      {items.length === 0 ? (
        <View style={styles.emptyState}>
          <View style={styles.emptyIcon}>
            <Trash2 size={40} color={Colors.textMuted} strokeWidth={1.5} />
          </View>
          <Text style={styles.emptyTitle}>{t.cart.empty.title}</Text>
          <Text style={styles.emptySubtitle}>{t.cart.empty.subtitle}</Text>
          <TouchableOpacity activeOpacity={0.7} onPress={() => router.push('/(tabs)')} style={styles.emptyBtn}>
            <Text style={styles.emptyBtnText}>{t.cart.empty.button}</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {items.map((item) => {
            const dispatchable = isDispatchable(categoryFromCartItemId(item.id));
            return (
            <View key={item.id} style={styles.cartItem}>
              <FallbackImage source={item.image} style={styles.itemImage} />
              <View style={styles.itemInfo}>
                <View style={styles.itemNameRow}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  {!dispatchable && (
                    <View style={styles.comingSoonBadge}>
                      <Text style={styles.comingSoonBadgeText}>{t.cart.comingSoonBadge}</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.itemDetail}>{item.detail}</Text>
                <View style={styles.itemBottomRow}>
                  <Text style={styles.itemPrice}>{MXN(item.price * item.quantity)}</Text>
                  <View style={styles.qtyStepper}>
                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={() => updateQuantity(item.id, item.quantity - 1)}
                      style={styles.qtyBtn}
                      accessibilityRole="button"
                      accessibilityLabel={t.common.decreaseQuantity}
                    >
                      <Minus size={14} color={Colors.primary} strokeWidth={2.5} />
                    </TouchableOpacity>
                    <Text style={styles.qtyValue}>{item.quantity}</Text>
                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={() => updateQuantity(item.id, item.quantity + 1)}
                      style={styles.qtyBtn}
                      accessibilityRole="button"
                      accessibilityLabel={t.common.increaseQuantity}
                    >
                      <Plus size={14} color={Colors.primary} strokeWidth={2.5} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => removeItem(item.id)}
                style={styles.removeBtn}
                accessibilityRole="button"
                accessibilityLabel={t.common.removeItem}
              >
                <Trash2 size={16} color={Colors.error} strokeWidth={2.5} />
              </TouchableOpacity>
            </View>
            );
          })}

          {/* Address */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>{t.cart.pickupAddress}</Text>
            <View style={styles.addressRow}>
              <View style={styles.addressIcon}>
                <MapPin size={18} color={Colors.primary} strokeWidth={2.5} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.addressLabel}>{currentAddress.label}</Text>
                <Text style={styles.addressText}>{currentAddress.text}</Text>
              </View>
              <TouchableOpacity activeOpacity={0.7} onPress={() => setShowAddressModal(true)} style={styles.changeBtn}>
                <Text style={styles.changeText}>{t.common.change}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Contact */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>{t.cart.phoneLabel}</Text>
            <View style={styles.contactRow}>
              <TextInput
                value={contactName}
                onChangeText={setContactName}
                placeholder={t.cart.namePlaceholder}
                placeholderTextColor={Colors.textMuted}
                style={styles.contactInput}
              />
            </View>
            <View style={styles.contactRow}>
              <View style={styles.addressIcon}>
                <Phone size={18} color={Colors.primary} strokeWidth={2.5} />
              </View>
              <TextInput
                value={contactPhone}
                onChangeText={setContactPhone}
                placeholder={t.cart.phonePlaceholder}
                placeholderTextColor={Colors.textMuted}
                keyboardType="phone-pad"
                style={styles.contactInput}
              />
            </View>
          </View>

          {/* Schedule */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>{t.cart.dateTime}</Text>
            <TouchableOpacity activeOpacity={0.7} onPress={() => setShowScheduleModal(true)} style={styles.scheduleRow}>
              <View style={styles.scheduleItem}>
                <Calendar size={18} color={Colors.secondary} strokeWidth={2.5} />
                <Text style={styles.scheduleText}>{formatDate(selectedDate)}</Text>
              </View>
              <View style={styles.scheduleItem}>
                <Clock size={18} color={Colors.secondary} strokeWidth={2.5} />
                <Text style={styles.scheduleText}>{selectedTime}</Text>
              </View>
              <Text style={styles.changeText}>{t.common.change}</Text>
            </TouchableOpacity>
          </View>

          {/* Payment */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>{t.cart.paymentMethod}</Text>
            <View style={styles.paymentRow}>
              <View style={styles.paymentIcon}>
                <CreditCard size={18} color={Colors.white} strokeWidth={2.5} />
              </View>
              <Text style={styles.paymentText}>
                {currentPayment.last4 ? `${currentPayment.label} •••• ${currentPayment.last4}` : currentPayment.label}
              </Text>
              <TouchableOpacity activeOpacity={0.7} onPress={() => setShowPaymentModal(true)} style={styles.changeBtn}>
                <Text style={styles.changeText}>{t.common.change}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Summary */}
          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>{MXN(subtotal)}</Text>
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

          {!canConfirmOrder && (
            <Text style={styles.phoneRequiredHint}>{t.cart.phoneRequired}</Text>
          )}
          <PrimaryButton
            label={t.cart.confirmOrder}
            onPress={handleConfirmOrder}
            disabled={!canConfirmOrder}
            style={{ marginTop: Spacing.sm }}
          />
          <View style={{ height: Spacing.xxl }} />
        </ScrollView>
      )}

      {/* Address Modal */}
      <Modal visible={showAddressModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t.cart.pickupAddress}</Text>
              <TouchableOpacity
                onPress={() => setShowAddressModal(false)}
                style={styles.modalClose}
                accessibilityRole="button"
                accessibilityLabel={t.common.close}
              >
                <X size={20} color={Colors.textSecondary} strokeWidth={2.5} />
              </TouchableOpacity>
            </View>

            <FlatList
              data={displayAddresses}
              keyExtractor={(a) => a.id}
              style={{ maxHeight: 220 }}
              renderItem={({ item }) => (
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => { setSelectedAddressId(item.id); setShowAddressModal(false); }}
                  style={styles.optionRow}
                >
                  <View style={[styles.optionIcon, { backgroundColor: Colors.primary + '15' }]}>
                    <MapPin size={18} color={Colors.primary} strokeWidth={2.5} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.optionLabel}>{item.label}</Text>
                    <Text style={styles.optionText}>{item.text}</Text>
                  </View>
                  {selectedAddressId === item.id && (
                    <View style={styles.checkCircle}>
                      <Check size={14} color={Colors.white} strokeWidth={2.5} />
                    </View>
                  )}
                </TouchableOpacity>
              )}
            />

            <View style={styles.newAddressWrap}>
              <Text style={styles.newAddressLabel}>{t.cart.addNewAddress}</Text>
              <TextInput
                value={newAddress}
                onChangeText={setNewAddress}
                placeholder={t.cart.addressPlaceholder}
                placeholderTextColor={Colors.textMuted}
                style={styles.input}
              />
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={addNewAddress}
                style={[styles.addAddressBtn, !newAddress.trim() && { opacity: 0.4 }]}
              >
                <Plus size={16} color={Colors.white} strokeWidth={2.5} />
                <Text style={styles.addAddressBtnText}>{t.common.add}</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>

      {/* Schedule Modal */}
      <Modal visible={showScheduleModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t.cart.dateTime}</Text>
              <TouchableOpacity
                onPress={() => setShowScheduleModal(false)}
                style={styles.modalClose}
                accessibilityRole="button"
                accessibilityLabel={t.common.close}
              >
                <X size={20} color={Colors.textSecondary} strokeWidth={2.5} />
              </TouchableOpacity>
            </View>

            {/* Calendar */}
            <View style={styles.calendarHeader}>
              <TouchableOpacity
                disabled={!canGoPrev}
                onPress={() => {
                  const d = new Date(viewMonth);
                  d.setMonth(d.getMonth() - 1);
                  setViewMonth(d);
                }}
                style={[styles.calNav, !canGoPrev && { opacity: 0.3 }]}
                accessibilityRole="button"
                accessibilityLabel={t.common.previousMonth}
              >
                <ChevronLeft size={20} color={Colors.textPrimary} strokeWidth={2.5} />
              </TouchableOpacity>
              <Text style={styles.calMonthLabel}>{t.cart.months[viewMonth.getMonth()]} {viewMonth.getFullYear()}</Text>
              <TouchableOpacity
                onPress={() => {
                  const d = new Date(viewMonth);
                  d.setMonth(d.getMonth() + 1);
                  setViewMonth(d);
                }}
                style={styles.calNav}
                accessibilityRole="button"
                accessibilityLabel={t.common.nextMonth}
              >
                <ChevronRight size={20} color={Colors.textPrimary} strokeWidth={2.5} />
              </TouchableOpacity>
            </View>

            <View style={styles.calWeekRow}>
              {t.cart.days.map((d) => (
                <Text key={d} style={styles.calWeekDay}>{d}</Text>
              ))}
            </View>

            <View style={styles.calGrid}>
              {calendarCells.map((d, i) => {
                if (!d) return <View key={`e${i}`} style={styles.calCell} />;
                const selectable = isSelectable(d);
                const isSelected = isSameDay(d, selectedDate);
                const isToday = isSameDay(d, today);
                return (
                  <TouchableOpacity
                    key={i}
                    disabled={!selectable}
                    onPress={() => setSelectedDate(d)}
                    style={[
                      styles.calCell,
                      selectable && styles.calCellSelectable,
                      isSelected && styles.calCellSelected,
                      !selectable && styles.calCellDisabled,
                    ]}
                  >
                    <Text
                      style={[
                        styles.calDayText,
                        isToday && styles.calDayToday,
                        isSelected && styles.calDaySelected,
                        !selectable && styles.calDayDisabled,
                      ]}
                    >
                      {d.getDate()}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Time slots */}
            <Text style={styles.timeSlotTitle}>{t.cart.availableTimes}</Text>
            <View style={styles.timeSlotGrid}>
              {TIME_SLOTS.map((slot) => (
                <TouchableOpacity
                  key={slot}
                  activeOpacity={0.7}
                  onPress={() => setSelectedTime(slot)}
                  style={[styles.timeSlot, selectedTime === slot && styles.timeSlotSelected]}
                >
                  <Text style={[styles.timeSlotText, selectedTime === slot && styles.timeSlotTextSelected]}>
                    {slot}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <PrimaryButton
              label={t.common.confirm}
              onPress={() => setShowScheduleModal(false)}
              style={{ marginTop: Spacing.lg }}
            />
            <View style={{ height: Spacing.lg }} />
          </View>
        </View>
      </Modal>

      {/* Payment Modal */}
      <Modal visible={showPaymentModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t.cart.paymentMethod}</Text>
              <TouchableOpacity
                onPress={() => setShowPaymentModal(false)}
                style={styles.modalClose}
                accessibilityRole="button"
                accessibilityLabel={t.common.close}
              >
                <X size={20} color={Colors.textSecondary} strokeWidth={2.5} />
              </TouchableOpacity>
            </View>

            {SAVED_PAYMENTS.map((pm) => (
              <TouchableOpacity
                key={pm.id}
                activeOpacity={0.7}
                onPress={() => { setSelectedPaymentId(pm.id); setShowPaymentModal(false); }}
                style={styles.optionRow}
              >
                <View style={[styles.optionIcon, { backgroundColor: Colors.primary }]}>
                  <CreditCard size={18} color={Colors.white} strokeWidth={2.5} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.optionLabel}>{pm.label}</Text>
                  {pm.last4 ? (
                    <Text style={styles.optionText}>•••• •••• •••• {pm.last4}</Text>
                  ) : (
                    <Text style={styles.optionText}>{t.cart.paymentCashInStore}</Text>
                  )}
                </View>
                {selectedPaymentId === pm.id && (
                  <View style={styles.checkCircle}>
                    <Check size={14} color={Colors.white} strokeWidth={2.5} />
                  </View>
                )}
              </TouchableOpacity>
            ))}

            <View style={{ height: Spacing.lg }} />
          </View>
        </View>
      </Modal>

      {/* Clear Cart Confirm Modal */}
      <Modal visible={showConfirm} animationType="fade" transparent>
        <View style={styles.confirmOverlay}>
          <View style={styles.confirmCard}>
            <View style={styles.confirmIcon}>
              <Trash2 size={28} color={Colors.error} strokeWidth={2.5} />
            </View>
            <Text style={styles.confirmTitle}>{t.cart.confirmCartTitle}</Text>
            <Text style={styles.confirmText}>{t.cart.confirmCartText}</Text>
            <View style={styles.confirmButtons}>
              <TouchableOpacity activeOpacity={0.7} onPress={() => setShowConfirm(false)} style={styles.cancelBtn}>
                <Text style={styles.cancelBtnText}>{t.common.cancel}</Text>
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={0.7} onPress={() => { clearAll(); setShowConfirm(false); }} style={styles.deleteBtn}>
                <Text style={styles.deleteBtnText}>{t.cart.deleteAll}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Order Success Modal */}
      <Modal visible={showOrderSuccess} animationType="fade" transparent>
        <View style={styles.confirmOverlay}>
          <View style={styles.confirmCard}>
            <View style={[styles.confirmIcon, { backgroundColor: Colors.success + '15' }]}>
              <PartyPopper size={28} color={Colors.success} strokeWidth={2.5} />
            </View>
            <Text style={styles.confirmTitle}>{t.cart.orderReceivedTitle}</Text>
            <Text style={styles.confirmText}>{t.cart.orderReceivedSubtitle}</Text>
            <TouchableOpacity activeOpacity={0.7} onPress={shareApp} style={styles.shareBtn}>
              <Share2 size={16} color={Colors.primary} strokeWidth={2.5} />
              <Text style={styles.shareBtnText}>{t.cart.shareButton}</Text>
            </TouchableOpacity>
            <PrimaryButton label={t.cart.continueButton} onPress={finishOrder} style={{ width: '100%', marginTop: Spacing.md }} />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  scrollContent: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.sm, width: '100%', maxWidth: Layout.maxContentWidth, alignSelf: 'center' },

  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: Spacing.xxl },
  emptyIcon: { width: moderateScale(88), height: moderateScale(88), borderRadius: Radius.xl, backgroundColor: Colors.surface, justifyContent: 'center', alignItems: 'center', marginBottom: Spacing.lg },
  emptyTitle: { fontSize: FontSize.xl, fontWeight: '700', color: Colors.textPrimary, marginBottom: Spacing.sm },
  emptySubtitle: { fontSize: FontSize.md, color: Colors.textMuted, textAlign: 'center', marginBottom: Spacing.xl },
  emptyBtn: { backgroundColor: Colors.primary, paddingHorizontal: Spacing.xl, paddingVertical: Spacing.md, borderRadius: Radius.lg },
  emptyBtnText: { fontSize: FontSize.md, fontWeight: '700', color: Colors.white },

  cartItem: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, backgroundColor: Colors.white, borderRadius: Radius.lg, padding: Spacing.md, marginBottom: Spacing.sm, ...Shadow.sm },
  itemImage: { width: moderateScale(64), height: moderateScale(64), borderRadius: Radius.md, resizeMode: 'cover' },
  itemInfo: { flex: 1 },
  itemNameRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  itemName: { fontSize: FontSize.md, fontWeight: '600', color: Colors.textPrimary },
  comingSoonBadge: { paddingHorizontal: Spacing.sm, paddingVertical: 2, borderRadius: Radius.full, backgroundColor: Colors.warning + '18' },
  comingSoonBadgeText: { fontSize: FontSize.xs - 1, fontWeight: '700', color: Colors.warning },
  itemDetail: { fontSize: FontSize.sm, color: Colors.textMuted, marginTop: 2 },
  itemBottomRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 },
  itemPrice: { fontSize: FontSize.md, fontWeight: '700', color: Colors.primary },
  qtyStepper: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, backgroundColor: Colors.surface, paddingHorizontal: Spacing.sm, paddingVertical: 4, borderRadius: Radius.full },
  qtyBtn: { width: 24, height: 24, borderRadius: Radius.full, backgroundColor: Colors.white, justifyContent: 'center', alignItems: 'center' },
  qtyValue: { fontSize: FontSize.sm, fontWeight: '700', color: Colors.textPrimary, minWidth: 16, textAlign: 'center' },
  removeBtn: { width: moderateScale(36), height: moderateScale(36), borderRadius: Radius.full, backgroundColor: Colors.error + '12', justifyContent: 'center', alignItems: 'center' },

  sectionCard: { backgroundColor: Colors.white, borderRadius: Radius.lg, padding: Spacing.md, marginBottom: Spacing.md, ...Shadow.sm },
  sectionTitle: { fontSize: FontSize.md, fontWeight: '700', color: Colors.textPrimary, marginBottom: Spacing.md },

  addressRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  addressIcon: { width: moderateScale(40), height: moderateScale(40), borderRadius: Radius.md, backgroundColor: Colors.primary + '15', justifyContent: 'center', alignItems: 'center' },
  addressLabel: { fontSize: FontSize.sm, fontWeight: '600', color: Colors.textPrimary },
  addressText: { fontSize: FontSize.sm, color: Colors.textMuted, marginTop: 2 },
  changeBtn: { paddingHorizontal: Spacing.sm, paddingVertical: 6, borderRadius: Radius.full, backgroundColor: Colors.primary + '12' },
  changeText: { fontSize: FontSize.xs, fontWeight: '700', color: Colors.primary },

  scheduleRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.lg },
  scheduleItem: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  scheduleText: { fontSize: FontSize.md, fontWeight: '500', color: Colors.textPrimary },

  paymentRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  paymentIcon: { width: moderateScale(40), height: moderateScale(40), borderRadius: Radius.md, backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center' },
  paymentText: { flex: 1, fontSize: FontSize.md, fontWeight: '500', color: Colors.textPrimary },

  contactRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, marginBottom: Spacing.sm },
  contactInput: { flex: 1, fontSize: FontSize.md, color: Colors.textPrimary, paddingVertical: Spacing.sm, borderBottomWidth: 1, borderBottomColor: Colors.border },
  phoneRequiredHint: { fontSize: FontSize.xs, color: Colors.error, textAlign: 'center', marginTop: Spacing.sm },

  shareBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.sm, paddingVertical: Spacing.sm, marginTop: Spacing.sm },
  shareBtnText: { fontSize: FontSize.sm, fontWeight: '700', color: Colors.primary },

  summaryCard: { backgroundColor: Colors.white, borderRadius: Radius.lg, padding: Spacing.lg, ...Shadow.sm },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: Spacing.sm },
  summaryLabel: { fontSize: FontSize.md, color: Colors.textSecondary, flex: 1 },
  summaryValue: { fontSize: FontSize.md, fontWeight: '600', color: Colors.textPrimary },
  summaryValueFree: { fontSize: FontSize.md, fontWeight: '700', color: Colors.success },
  discountValue: { fontSize: FontSize.md, fontWeight: '700', color: Colors.success },
  divider: { height: 1, backgroundColor: Colors.border, marginVertical: Spacing.md },
  totalLabel: { fontSize: FontSize.lg, fontWeight: '700', color: Colors.textPrimary },
  totalValue: { fontSize: FontSize.xxl, fontWeight: '800', color: Colors.primary },

  // Modals shared
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  modalSheet: { backgroundColor: Colors.white, borderTopLeftRadius: Radius.xl, borderTopRightRadius: Radius.xl, paddingHorizontal: Spacing.lg, paddingBottom: Spacing.xxl, maxHeight: '90%' },
  modalHandle: { width: moderateScale(40), height: 4, borderRadius: 2, backgroundColor: Colors.border, alignSelf: 'center', marginTop: Spacing.sm, marginBottom: Spacing.md },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.md },
  modalTitle: { fontSize: FontSize.xl, fontWeight: '700', color: Colors.textPrimary, flex: 1 },
  modalClose: { width: moderateScale(32), height: moderateScale(32), borderRadius: Radius.full, backgroundColor: Colors.surface, justifyContent: 'center', alignItems: 'center' },

  optionRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, paddingVertical: Spacing.md, borderBottomWidth: 1, borderBottomColor: Colors.border },
  optionIcon: { width: moderateScale(40), height: moderateScale(40), borderRadius: Radius.md, justifyContent: 'center', alignItems: 'center' },
  optionLabel: { fontSize: FontSize.md, fontWeight: '600', color: Colors.textPrimary },
  optionText: { fontSize: FontSize.sm, color: Colors.textMuted, marginTop: 2 },
  checkCircle: { width: moderateScale(24), height: moderateScale(24), borderRadius: Radius.full, backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center' },

  newAddressWrap: { marginTop: Spacing.lg },
  newAddressLabel: { fontSize: FontSize.sm, fontWeight: '600', color: Colors.textSecondary, marginBottom: Spacing.sm },
  input: { borderWidth: 1.5, borderColor: Colors.border, borderRadius: Radius.lg, paddingHorizontal: Spacing.md, paddingVertical: Spacing.md, fontSize: FontSize.md, color: Colors.textPrimary, marginBottom: Spacing.sm, backgroundColor: Colors.white },
  addAddressBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.sm, backgroundColor: Colors.primary, borderRadius: Radius.lg, paddingVertical: Spacing.md },
  addAddressBtnText: { fontSize: FontSize.md, fontWeight: '700', color: Colors.white },

  // Calendar
  calendarHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: Spacing.md },
  calNav: { width: moderateScale(36), height: moderateScale(36), borderRadius: Radius.full, backgroundColor: Colors.surface, justifyContent: 'center', alignItems: 'center' },
  calMonthLabel: { fontSize: FontSize.lg, fontWeight: '700', color: Colors.textPrimary },
  calWeekRow: { flexDirection: 'row', marginBottom: Spacing.sm },
  calWeekDay: { flex: 1, textAlign: 'center', fontSize: FontSize.xs, fontWeight: '600', color: Colors.textMuted },
  calGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  calCell: { width: '14.28%', aspectRatio: 1, justifyContent: 'center', alignItems: 'center', borderRadius: Radius.sm },
  calCellSelectable: {},
  calCellSelected: { backgroundColor: Colors.primary, borderRadius: Radius.full },
  calCellDisabled: { opacity: 0.3 },
  calDayText: { fontSize: FontSize.sm, fontWeight: '500', color: Colors.textPrimary },
  calDayToday: { fontWeight: '700', color: Colors.secondary },
  calDaySelected: { color: Colors.white, fontWeight: '700' },
  calDayDisabled: { color: Colors.textMuted },

  // Time slots
  timeSlotTitle: { fontSize: FontSize.md, fontWeight: '700', color: Colors.textPrimary, marginTop: Spacing.lg, marginBottom: Spacing.sm },
  timeSlotGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  timeSlot: { paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, borderRadius: Radius.lg, backgroundColor: Colors.surface, borderWidth: 1.5, borderColor: 'transparent' },
  timeSlotSelected: { backgroundColor: Colors.primary + '12', borderColor: Colors.primary },
  timeSlotText: { fontSize: FontSize.sm, fontWeight: '500', color: Colors.textSecondary },
  timeSlotTextSelected: { color: Colors.primary, fontWeight: '700' },

  // Clear cart confirm
  confirmOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'center', alignItems: 'center', paddingHorizontal: Spacing.xl },
  confirmCard: { backgroundColor: Colors.white, borderRadius: Radius.xl, padding: Spacing.xl, width: '100%', alignItems: 'center', ...Shadow.lg },
  confirmIcon: { width: moderateScale(64), height: moderateScale(64), borderRadius: Radius.full, backgroundColor: Colors.error + '12', justifyContent: 'center', alignItems: 'center', marginBottom: Spacing.md },
  confirmTitle: { fontSize: FontSize.xl, fontWeight: '700', color: Colors.textPrimary, marginBottom: Spacing.sm },
  confirmText: { fontSize: FontSize.md, color: Colors.textSecondary, textAlign: 'center', lineHeight: 22, marginBottom: Spacing.xl },
  confirmButtons: { flexDirection: 'row', gap: Spacing.md, width: '100%' },
  cancelBtn: { flex: 1, paddingVertical: Spacing.md, borderRadius: Radius.lg, backgroundColor: Colors.surface, alignItems: 'center' },
  cancelBtnText: { fontSize: FontSize.md, fontWeight: '700', color: Colors.textSecondary },
  deleteBtn: { flex: 1, paddingVertical: Spacing.md, borderRadius: Radius.lg, backgroundColor: Colors.error, alignItems: 'center' },
  deleteBtnText: { fontSize: FontSize.md, fontWeight: '700', color: Colors.white },
});
