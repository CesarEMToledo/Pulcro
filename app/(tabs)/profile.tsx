import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Colors, Spacing, FontSize, Radius, Shadow, Layout } from '@/constants/theme';
import { moderateScale } from '@/constants/responsive';
import {
  ChevronRight,
  MapPin,
  CreditCard,
  HelpCircle,
  Bell,
  Shield,
  Heart,
  X,
  Plus,
  Trash2,
  User,
  Check,
  Image as ImageIcon,
} from 'lucide-react-native';
import ScreenHeader from '@/components/ScreenHeader';
import LanguageToggle from '@/components/LanguageToggle';
import InfoModal from '@/components/InfoModal';
import FallbackImage from '@/components/FallbackImage';
import { useLanguage } from '@/contexts/LanguageContext';

type Address = { id: string; label: string; text: string };
type PaymentMethod = { id: string; label: string; last4: string };

export default function ProfileScreen() {
  const router = useRouter();
  const { t } = useLanguage();
  const [showAddresses, setShowAddresses] = useState(false);
  const [showPayments, setShowPayments] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);

  const [profile, setProfile] = useState({
    name: 'Carlos Mendoza',
    email: 'carlos.mendoza@email.com',
    phone: '+52 55 1234 5678',
    photoUri: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200' as string | null,
  });
  const [editName, setEditName] = useState(profile.name);
  const [editPhotoUri, setEditPhotoUri] = useState<string | null>(profile.photoUri);
  const [photoPermissionDenied, setPhotoPermissionDenied] = useState(false);

  const openEditProfile = () => {
    setEditName(profile.name);
    setEditPhotoUri(profile.photoUri);
    setPhotoPermissionDenied(false);
    setShowEditProfile(true);
  };

  const pickProfilePhoto = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      setPhotoPermissionDenied(true);
      return;
    }
    setPhotoPermissionDenied(false);
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled && result.assets && result.assets[0]) {
      setEditPhotoUri(result.assets[0].uri);
    }
  };

  const removeProfilePhoto = () => setEditPhotoUri(null);

  const saveProfile = () => {
    if (!editName.trim()) return;
    setProfile((prev) => ({ ...prev, name: editName.trim(), photoUri: editPhotoUri }));
    setShowEditProfile(false);
  };

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
    { icon: Bell, label: t.profile.menu.notifications, color: Colors.warning, action: () => router.push('/notifications') },
    { icon: Heart, label: t.profile.menu.favorites, color: Colors.error, action: () => setShowFavorites(true) },
    { icon: Shield, label: t.profile.menu.privacy, color: Colors.primary, action: () => setShowPrivacy(true) },
    { icon: HelpCircle, label: t.profile.menu.help, color: Colors.secondary, action: () => setShowHelp(true) },
  ];

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScreenHeader title={t.profile.title} showBack={false} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.profileCard}>
          <View style={styles.avatarWrap}>
            {profile.photoUri ? (
              <FallbackImage source={{ uri: profile.photoUri }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <User size={36} color={Colors.textMuted} strokeWidth={2} />
              </View>
            )}
            <TouchableOpacity activeOpacity={0.7} onPress={openEditProfile} style={styles.editBadge}>
              <Text style={styles.editText}>{t.profile.edit}</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.name}>{profile.name}</Text>
          <Text style={styles.email}>{profile.email}</Text>
          <Text style={styles.phone}>{profile.phone}</Text>

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
              <TouchableOpacity
                onPress={() => setShowAddresses(false)}
                style={styles.modalClose}
                accessibilityRole="button"
                accessibilityLabel={t.common.close}
              >
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
                  <TouchableOpacity
                    onPress={() => removeAddress(addr.id)}
                    style={styles.trashBtn}
                    accessibilityRole="button"
                    accessibilityLabel={t.common.removeItem}
                  >
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
              <TouchableOpacity
                onPress={() => setShowPayments(false)}
                style={styles.modalClose}
                accessibilityRole="button"
                accessibilityLabel={t.common.close}
              >
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
                  <TouchableOpacity
                    onPress={() => removePayment(pm.id)}
                    style={styles.trashBtn}
                    accessibilityRole="button"
                    accessibilityLabel={t.common.removeItem}
                  >
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

      <InfoModal
        visible={showFavorites}
        onClose={() => setShowFavorites(false)}
        title={t.profile.favoritesModal.title}
        message={t.profile.favoritesModal.empty}
        icon={Heart}
      />

      <InfoModal
        visible={showHelp}
        onClose={() => setShowHelp(false)}
        title={t.profile.helpModal.title}
        message={t.profile.helpModal.message}
        icon={HelpCircle}
      />

      {/* Privacy Modal */}
      <Modal visible={showPrivacy} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t.profile.privacyModal.title}</Text>
              <TouchableOpacity
                onPress={() => setShowPrivacy(false)}
                style={styles.modalClose}
                accessibilityRole="button"
                accessibilityLabel={t.common.close}
              >
                <X size={20} color={Colors.textSecondary} strokeWidth={2.5} />
              </TouchableOpacity>
            </View>
            <ScrollView style={{ maxHeight: 340 }}>
              {t.profile.privacyModal.content.map((paragraph, i) => (
                <Text key={i} style={styles.privacyParagraph}>{paragraph}</Text>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Edit Profile Modal */}
      <Modal visible={showEditProfile} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t.profile.editModal.title}</Text>
              <TouchableOpacity onPress={() => setShowEditProfile(false)} style={styles.modalClose}>
                <X size={20} color={Colors.textSecondary} strokeWidth={2.5} />
              </TouchableOpacity>
            </View>

            <View style={styles.editAvatarSection}>
              {editPhotoUri ? (
                <Image source={{ uri: editPhotoUri }} style={styles.editAvatarImg} />
              ) : (
                <View style={styles.editAvatarPlaceholder}>
                  <User size={36} color={Colors.textMuted} strokeWidth={2} />
                </View>
              )}
              <View style={styles.editAvatarActions}>
                <TouchableOpacity activeOpacity={0.7} onPress={pickProfilePhoto} style={styles.avatarActionBtn}>
                  <ImageIcon size={16} color={Colors.primary} strokeWidth={2.5} />
                  <Text style={styles.avatarActionText}>{t.profile.editModal.changePhoto}</Text>
                </TouchableOpacity>
                {editPhotoUri && (
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={removeProfilePhoto}
                    style={[styles.avatarActionBtn, styles.avatarActionBtnDanger]}
                  >
                    <Trash2 size={16} color={Colors.error} strokeWidth={2.5} />
                    <Text style={[styles.avatarActionText, { color: Colors.error }]}>{t.profile.editModal.removePhoto}</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
            {photoPermissionDenied && (
              <Text style={styles.permissionText}>{t.profile.editModal.permissionDenied}</Text>
            )}

            <View style={styles.newItemWrap}>
              <Text style={styles.newItemLabel}>{t.profile.editModal.nameLabel}</Text>
              <TextInput
                value={editName}
                onChangeText={setEditName}
                placeholder={t.profile.editModal.namePlaceholder}
                placeholderTextColor={Colors.textMuted}
                style={styles.input}
              />
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={saveProfile}
                style={[styles.addBtn, !editName.trim() && { opacity: 0.4 }]}
              >
                <Check size={16} color={Colors.white} strokeWidth={2.5} />
                <Text style={styles.addBtnText}>{t.profile.editModal.saveButton}</Text>
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
  scrollContent: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.sm, width: '100%', maxWidth: Layout.maxContentWidth, alignSelf: 'center' },
  profileCard: { backgroundColor: Colors.white, borderRadius: Radius.xl, padding: Spacing.lg, alignItems: 'center', marginBottom: Spacing.xl, ...Shadow.md },
  avatarWrap: { position: 'relative', marginBottom: Spacing.md },
  avatar: { width: moderateScale(90), height: moderateScale(90), borderRadius: Radius.full, resizeMode: 'cover' },
  avatarPlaceholder: { width: moderateScale(90), height: moderateScale(90), borderRadius: Radius.full, backgroundColor: Colors.surface, justifyContent: 'center', alignItems: 'center' },
  editBadge: { position: 'absolute', bottom: 0, right: -4, backgroundColor: Colors.primary, paddingHorizontal: Spacing.sm, paddingVertical: 3, borderRadius: Radius.full, ...Shadow.sm },
  editText: { fontSize: FontSize.xs - 1, fontWeight: '700', color: Colors.white },
  name: { fontSize: FontSize.xxl, fontWeight: '700', color: Colors.textPrimary },
  email: { fontSize: FontSize.md, color: Colors.textSecondary, marginTop: 2 },
  phone: { fontSize: FontSize.sm, color: Colors.textMuted, marginTop: 2 },
  statsRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: Spacing.lg, width: '100%' },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: FontSize.xxl, fontWeight: '700', color: Colors.primary },
  statLabel: { fontSize: FontSize.xs, color: Colors.textMuted, marginTop: 2 },
  statDivider: { width: 1, height: moderateScale(32), backgroundColor: Colors.border },
  menuSection: { backgroundColor: Colors.white, borderRadius: Radius.lg, paddingHorizontal: Spacing.md, marginBottom: Spacing.lg, ...Shadow.sm },
  menuItem: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, paddingVertical: Spacing.md + 2, borderBottomWidth: 1, borderBottomColor: Colors.border },
  menuIcon: { width: moderateScale(40), height: moderateScale(40), borderRadius: Radius.md, justifyContent: 'center', alignItems: 'center' },
  menuLabel: { flex: 1, fontSize: FontSize.md, fontWeight: '500', color: Colors.textPrimary },
  version: { textAlign: 'center', fontSize: FontSize.xs, color: Colors.textMuted, marginTop: Spacing.md },

  // Modals
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
  trashBtn: { width: moderateScale(32), height: moderateScale(32), borderRadius: Radius.full, backgroundColor: Colors.error + '12', justifyContent: 'center', alignItems: 'center' },
  emptyModalText: { fontSize: FontSize.md, color: Colors.textMuted, textAlign: 'center', paddingVertical: Spacing.xl },

  editAvatarSection: { flexDirection: 'row', alignItems: 'center', gap: Spacing.lg, marginBottom: Spacing.md },
  editAvatarImg: { width: moderateScale(80), height: moderateScale(80), borderRadius: Radius.full, resizeMode: 'cover' },
  editAvatarPlaceholder: { width: moderateScale(80), height: moderateScale(80), borderRadius: Radius.full, backgroundColor: Colors.surface, justifyContent: 'center', alignItems: 'center' },
  editAvatarActions: { flex: 1, gap: Spacing.sm },
  avatarActionBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.sm, backgroundColor: Colors.primary + '12', borderRadius: Radius.lg, paddingVertical: Spacing.sm + 2 },
  avatarActionBtnDanger: { backgroundColor: Colors.error + '10' },
  avatarActionText: { fontSize: FontSize.sm, fontWeight: '700', color: Colors.primary },
  permissionText: { fontSize: FontSize.xs, color: Colors.error, marginBottom: Spacing.md },
  newItemWrap: { marginTop: Spacing.lg },
  newItemLabel: { fontSize: FontSize.sm, fontWeight: '600', color: Colors.textSecondary, marginBottom: Spacing.sm },
  input: { borderWidth: 1.5, borderColor: Colors.border, borderRadius: Radius.lg, paddingHorizontal: Spacing.md, paddingVertical: Spacing.md, fontSize: FontSize.md, color: Colors.textPrimary, marginBottom: Spacing.sm, backgroundColor: Colors.white },
  addBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.sm, backgroundColor: Colors.primary, borderRadius: Radius.lg, paddingVertical: Spacing.md },
  addBtnText: { fontSize: FontSize.md, fontWeight: '700', color: Colors.white },
  privacyParagraph: { fontSize: FontSize.md, color: Colors.textSecondary, lineHeight: 22, marginBottom: Spacing.md },
});
