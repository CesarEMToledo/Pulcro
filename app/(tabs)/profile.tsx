import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { Colors, Spacing, FontSize, Radius, Shadow } from '@/constants/theme';
import {
  ChevronRight,
  MapPin,
  CreditCard,
  HelpCircle,
  LogOut,
  Bell,
  Shield,
  Heart,
  X,
  Check,
  Plus,
  Trash2,
} from 'lucide-react-native';
import ScreenHeader from '@/components/ScreenHeader';
import LanguageToggle from '@/components/LanguageToggle';
import { useLanguage } from '@/contexts/LanguageContext';

type Address = { id: string; label: string; text: string };
type PaymentMethod = { id: string; label: string; last4: string };

export default function ProfileScreen() {
  const { t } = useLanguage();
  const [showAddresses, setShowAddresses] = useState(false);
  const [showPayments, setShowPayments] = useState(false);

  const INITIAL_ADDRESSES: Address[] = [
    { id: 'a1', label: t.profile.addressLabels.home, text: 'Av. Reforma 123, Col. Centro, CDMX' },
    { id: 'a2', label: t.profile.addressLabels.work, text: 'Insurgentes Sur 456, Col. Del Valle, CDMX' },
  ];

  const INITIAL_PAYMENTS: PaymentMethod[] = [
    { id: 'p1', label: 'Visa', last4: '4242' },
    { id: 'p2', label: 'Mastercard', last4: '5555' },
  ];

  const [addresses, setAddresses] = useState<Address[]>(INITIAL_ADDRESSES);
  const [newAddrLabel, setNewAddrLabel] = useState('');
  const [newAddrText, setNewAddrText] = useState('');

  const [payments, setPayments] = useState<PaymentMethod[]>(INITIAL_PAYMENTS);
  const [newPayLabel, setNewPayLabel] = useState('');
  const [newPayLast4, setNewPayLast4] = useState('');

  const addAddress = () => {
    if (!newAddrText.trim()) return;
    const id = `a${Date.now()}`;
    setAddresses((prev) => [...prev, { id, label: newAddrLabel.trim() || t.profile.addressLabels.new, text: newAddrText.trim() }]);
    setNewAddrLabel('');
    setNewAddrText('');
  };

  const removeAddress = (id: string) => setAddresses((prev) => prev.filter((a) => a.id !== id));

  const addPayment = () => {
    if (!newPayLabel.trim()) return;
    const id = `p${Date.now()}`;
    setPayments((prev) => [...prev, { id, label: newPayLabel.trim(), last4: newPayLast4.trim() }]);
    setNewPayLabel('');
    setNewPayLast4('');
  };

  const removePayment = (id: string) => setPayments((prev) => prev.filter((p) => p.id !== id));

  const menuItems = [
    { icon: MapPin, label: t.profile.menu.addresses, color: Colors.primary, action: () => setShowAddresses(true) },
    { icon: CreditCard, label: t.profile.menu.payments, color: Colors.secondary, action: () => setShowPayments(true) },
    { icon: Bell, label: t.profile.menu.notifications, color: Colors.warning, action: () => {} },
    { icon: Heart, label: t.profile.menu.favorites, color: Colors.error, action: () => {} },
    { icon: Shield, label: t.profile.menu.privacy, color: Colors.primary, action: () => {} },
    { icon: HelpCircle, label: t.profile.menu.help, color: Colors.secondary, action: () => {} },
  ];

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScreenHeader title={t.profile.title} showBack={false} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.profileCard}>
          <View style={styles.avatarWrap}>
            <Image
              source={{ uri: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200' }}
              style={styles.avatar}
            />
            <View style={styles.editBadge}>
              <Text style={styles.editText}>{t.profile.edit}</Text>
            </View>
          </View>
          <Text style={styles.name}>Carlos Mendoza</Text>
          <Text style={styles.email}>carlos.mendoza@email.com</Text>
          <Text style={styles.phone}>+52 55 1234 5678</Text>

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>12</Text>
              <Text style={styles.statLabel}>{t.profile.stats.orders}</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>4.9</Text>
              <Text style={styles.statLabel}>{t.profile.stats.rating}</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>500</Text>
              <Text style={styles.statLabel}>{t.profile.stats.points}</Text>
            </View>
          </View>
        </View>

        <View style={styles.menuSection}>
          <LanguageToggle variant="row" />
          {menuItems.map((item, i) => {
            const Icon = item.icon;
            return (
              <TouchableOpacity
                key={item.label}
                activeOpacity={0.7}
                onPress={item.action}
                style={[styles.menuItem, i === menuItems.length - 1 && { borderBottomWidth: 0 }]}
              >
                <View style={[styles.menuIcon, { backgroundColor: item.color + '15' }]}>
                  <Icon size={20} color={item.color} strokeWidth={2.5} />
                </View>
                <Text style={styles.menuLabel}>{item.label}</Text>
                <ChevronRight size={18} color={Colors.textMuted} strokeWidth={2.5} />
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity activeOpacity={0.7} onPress={() => {}} style={styles.logoutButton}>
          <LogOut size={20} color={Colors.error} strokeWidth={2.5} />
          <Text style={styles.logoutText}>{t.profile.logout}</Text>
        </TouchableOpacity>

        <Text style={styles.version}>{t.profile.version}</Text>
        <View style={{ height: Spacing.xxl }} />
      </ScrollView>

      {/* Addresses Modal */}
      <Modal visible={showAddresses} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t.profile.addressesModal.title}</Text>
              <TouchableOpacity onPress={() => setShowAddresses(false)} style={styles.modalClose}>
                <X size={20} color={Colors.textSecondary} strokeWidth={2.5} />
              </TouchableOpacity>
            </View>

            <ScrollView style={{ maxHeight: 280 }}>
              {addresses.map((addr) => (
                <View key={addr.id} style={styles.optionRow}>
                  <View style={[styles.optionIcon, { backgroundColor: Colors.primary + '15' }]}>
                    <MapPin size={18} color={Colors.primary} strokeWidth={2.5} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.optionLabel}>{addr.label}</Text>
                    <Text style={styles.optionText}>{addr.text}</Text>
                  </View>
                  <TouchableOpacity onPress={() => removeAddress(addr.id)} style={styles.trashBtn}>
                    <Trash2 size={16} color={Colors.error} strokeWidth={2.5} />
                  </TouchableOpacity>
                </View>
              ))}
              {addresses.length === 0 && (
                <Text style={styles.emptyModalText}>{t.profile.addressesModal.empty}</Text>
              )}
            </ScrollView>

            <View style={styles.newItemWrap}>
              <Text style={styles.newItemLabel}>{t.profile.addressesModal.addNew}</Text>
              <TextInput
                value={newAddrLabel}
                onChangeText={setNewAddrLabel}
                placeholder={t.profile.addressesModal.labelPlaceholder}
                placeholderTextColor={Colors.textMuted}
                style={styles.input}
              />
              <TextInput
                value={newAddrText}
                onChangeText={setNewAddrText}
                placeholder={t.profile.addressesModal.textPlaceholder}
                placeholderTextColor={Colors.textMuted}
                style={styles.input}
              />
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={addAddress}
                style={[styles.addBtn, !newAddrText.trim() && { opacity: 0.4 }]}
              >
                <Plus size={16} color={Colors.white} strokeWidth={2.5} />
                <Text style={styles.addBtnText}>{t.profile.addressesModal.addButton}</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>

      {/* Payments Modal */}
      <Modal visible={showPayments} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t.profile.paymentsModal.title}</Text>
              <TouchableOpacity onPress={() => setShowPayments(false)} style={styles.modalClose}>
                <X size={20} color={Colors.textSecondary} strokeWidth={2.5} />
              </TouchableOpacity>
            </View>

            <ScrollView style={{ maxHeight: 280 }}>
              {payments.map((pm) => (
                <View key={pm.id} style={styles.optionRow}>
                  <View style={[styles.optionIcon, { backgroundColor: Colors.primary }]}>
                    <CreditCard size={18} color={Colors.white} strokeWidth={2.5} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.optionLabel}>{pm.label}</Text>
                    {pm.last4 ? (
                      <Text style={styles.optionText}>•••• •••• •••• {pm.last4}</Text>
                    ) : (
                      <Text style={styles.optionText}>{t.profile.paymentsModal.cashInStore}</Text>
                    )}
                  </View>
                  <TouchableOpacity onPress={() => removePayment(pm.id)} style={styles.trashBtn}>
                    <Trash2 size={16} color={Colors.error} strokeWidth={2.5} />
                  </TouchableOpacity>
                </View>
              ))}
              {payments.length === 0 && (
                <Text style={styles.emptyModalText}>{t.profile.paymentsModal.empty}</Text>
              )}
            </ScrollView>

            <View style={styles.newItemWrap}>
              <Text style={styles.newItemLabel}>{t.profile.paymentsModal.addNew}</Text>
              <TextInput
                value={newPayLabel}
                onChangeText={setNewPayLabel}
                placeholder={t.profile.paymentsModal.typePlaceholder}
                placeholderTextColor={Colors.textMuted}
                style={styles.input}
              />
              <TextInput
                value={newPayLast4}
                onChangeText={setNewPayLast4}
                placeholder={t.profile.paymentsModal.last4Placeholder}
                placeholderTextColor={Colors.textMuted}
                keyboardType="numeric"
                maxLength={4}
                style={styles.input}
              />
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={addPayment}
                style={[styles.addBtn, !newPayLabel.trim() && { opacity: 0.4 }]}
              >
                <Plus size={16} color={Colors.white} strokeWidth={2.5} />
                <Text style={styles.addBtnText}>{t.profile.paymentsModal.addButton}</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  scrollContent: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.sm },
  profileCard: { backgroundColor: Colors.white, borderRadius: Radius.xl, padding: Spacing.lg, alignItems: 'center', marginBottom: Spacing.xl, ...Shadow.md },
  avatarWrap: { position: 'relative', marginBottom: Spacing.md },
  avatar: { width: 90, height: 90, borderRadius: Radius.full, resizeMode: 'cover' },
  editBadge: { position: 'absolute', bottom: 0, right: -4, backgroundColor: Colors.primary, paddingHorizontal: Spacing.sm, paddingVertical: 3, borderRadius: Radius.full, ...Shadow.sm },
  editText: { fontSize: 10, fontWeight: '700', color: Colors.white },
  name: { fontSize: FontSize.xxl, fontWeight: '700', color: Colors.textPrimary },
  email: { fontSize: FontSize.md, color: Colors.textSecondary, marginTop: 2 },
  phone: { fontSize: FontSize.sm, color: Colors.textMuted, marginTop: 2 },
  statsRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: Spacing.lg, width: '100%' },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: FontSize.xxl, fontWeight: '700', color: Colors.primary },
  statLabel: { fontSize: FontSize.xs, color: Colors.textMuted, marginTop: 2 },
  statDivider: { width: 1, height: 32, backgroundColor: Colors.border },
  menuSection: { backgroundColor: Colors.white, borderRadius: Radius.lg, paddingHorizontal: Spacing.md, marginBottom: Spacing.lg, ...Shadow.sm },
  menuItem: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, paddingVertical: Spacing.md + 2, borderBottomWidth: 1, borderBottomColor: Colors.border },
  menuIcon: { width: 40, height: 40, borderRadius: Radius.md, justifyContent: 'center', alignItems: 'center' },
  menuLabel: { flex: 1, fontSize: FontSize.md, fontWeight: '500', color: Colors.textPrimary },
  logoutButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.sm, backgroundColor: Colors.error + '10', borderRadius: Radius.lg, paddingVertical: Spacing.md, marginBottom: Spacing.md },
  logoutText: { fontSize: FontSize.md, fontWeight: '700', color: Colors.error },
  version: { textAlign: 'center', fontSize: FontSize.xs, color: Colors.textMuted },

  // Modals
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  modalSheet: { backgroundColor: Colors.white, borderTopLeftRadius: Radius.xl, borderTopRightRadius: Radius.xl, paddingHorizontal: Spacing.lg, paddingBottom: Spacing.xxl, maxHeight: '90%' },
  modalHandle: { width: 40, height: 4, borderRadius: 2, backgroundColor: Colors.border, alignSelf: 'center', marginTop: Spacing.sm, marginBottom: Spacing.md },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.md },
  modalTitle: { fontSize: FontSize.xl, fontWeight: '700', color: Colors.textPrimary },
  modalClose: { width: 32, height: 32, borderRadius: Radius.full, backgroundColor: Colors.surface, justifyContent: 'center', alignItems: 'center' },

  optionRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, paddingVertical: Spacing.md, borderBottomWidth: 1, borderBottomColor: Colors.border },
  optionIcon: { width: 40, height: 40, borderRadius: Radius.md, justifyContent: 'center', alignItems: 'center' },
  optionLabel: { fontSize: FontSize.md, fontWeight: '600', color: Colors.textPrimary },
  optionText: { fontSize: FontSize.sm, color: Colors.textMuted, marginTop: 2 },
  trashBtn: { width: 32, height: 32, borderRadius: Radius.full, backgroundColor: Colors.error + '12', justifyContent: 'center', alignItems: 'center' },
  emptyModalText: { fontSize: FontSize.md, color: Colors.textMuted, textAlign: 'center', paddingVertical: Spacing.xl },

  newItemWrap: { marginTop: Spacing.lg },
  newItemLabel: { fontSize: FontSize.sm, fontWeight: '600', color: Colors.textSecondary, marginBottom: Spacing.sm },
  input: { borderWidth: 1.5, borderColor: Colors.border, borderRadius: Radius.lg, paddingHorizontal: Spacing.md, paddingVertical: Spacing.md, fontSize: FontSize.md, color: Colors.textPrimary, marginBottom: Spacing.sm, backgroundColor: Colors.white },
  addBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.sm, backgroundColor: Colors.primary, borderRadius: Radius.lg, paddingVertical: Spacing.md },
  addBtnText: { fontSize: FontSize.md, fontWeight: '700', color: Colors.white },
});
