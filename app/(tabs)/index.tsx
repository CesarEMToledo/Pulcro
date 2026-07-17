import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Spacing, FontSize, Radius, Shadow } from '@/constants/theme';
import { Search, Bell, MapPin, Star, Clock, X } from 'lucide-react-native';
import { useLanguage } from '@/contexts/LanguageContext';
import { useLocation } from '@/contexts/LocationContext';
import { useCart } from '@/contexts/CartContext';
import LanguageToggle from '@/components/LanguageToggle';
import FallbackImage from '@/components/FallbackImage';

const MXN = (n: number) => `${n.toLocaleString('es-MX')} MXN`;
import CategoryTile from '@/components/CategoryTile';
import SectionHeader from '@/components/SectionHeader';
import PromoCard from '@/components/PromoCard';

const categoriesData = [
  { key: 'laundry' as const, route: '/laundry' as const },
  { key: 'garments' as const, route: '/garments' as const },
  { key: 'house' as const, route: '/house' as const },
  { key: 'car' as const, route: '/car' as const },
  { key: 'plumbing' as const, route: '/plumbing' as const },
  { key: 'gardening' as const, route: '/gardening' as const },
  { key: 'electricity' as const, route: '/electricity' as const },
];

const popularServicesData = [
  {
    key: 'sneakers' as const,
    price: 80,
    image: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=300',
    rating: 4.9,
    time: '24 hrs',
  },
  {
    key: 'house' as const,
    price: 500,
    image: 'https://images.pexels.com/photos/4239031/pexels-photo-4239031.jpeg?auto=compress&cs=tinysrgb&w=300',
    rating: 4.8,
    time: '3 hrs',
  },
  {
    key: 'laundry5kg' as const,
    price: 150,
    image: 'https://images.pexels.com/photos/8453415/pexels-photo-8453415.jpeg?auto=compress&cs=tinysrgb&w=300',
    rating: 5.0,
    time: '48 hrs',
  },
];

export default function HomeScreen() {
  const router = useRouter();
  const { t } = useLanguage();
  const { address } = useLocation();
  const { addItem } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const filteredCategories = categoriesData.filter((cat) =>
    t.home.categories[cat.key].title.toLowerCase().includes(normalizedQuery)
  );
  const filteredPopular = popularServicesData.filter((svc) =>
    t.home.popularServices[svc.key].toLowerCase().includes(normalizedQuery)
  );
  const hasNoResults = normalizedQuery.length > 0 && filteredCategories.length === 0 && filteredPopular.length === 0;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.headerTextWrap}>
              <Text style={styles.greeting}>{t.home.greeting}</Text>
              <View style={styles.locationRow}>
                <MapPin size={14} color={Colors.primary} strokeWidth={2.5} />
                <Text style={styles.location} numberOfLines={1}>{address || t.home.location}</Text>
              </View>
            </View>
            <View style={styles.headerActions}>
              <LanguageToggle />
              <TouchableOpacity
                activeOpacity={0.7}
                style={styles.bellButton}
                accessibilityRole="button"
                accessibilityLabel={t.home.notifications.title}
                onPress={() => {
                  setShowNotifications(true);
                  setHasUnread(false);
                }}
              >
                <Bell size={20} color={Colors.primary} strokeWidth={2.5} />
                {hasUnread && <View style={styles.badge} />}
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.searchBar}>
            <Search size={18} color={Colors.textMuted} strokeWidth={2.5} />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder={t.home.searchPlaceholder}
              placeholderTextColor={Colors.textMuted}
              style={styles.searchInput}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setSearchQuery('')}
                accessibilityRole="button"
                accessibilityLabel={t.common.clearSearch}
              >
                <X size={16} color={Colors.textMuted} strokeWidth={2.5} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={styles.heroCard}>
          <LinearGradient colors={['#1A6FD4', '#2ABFBF']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.heroGradient}>
            <View style={styles.heroContent}>
              <Text style={styles.heroTitle}>CLEANO</Text>
              <Text style={styles.heroSubtitle}>{t.home.heroSubtitle}</Text>
              <View style={styles.heroBadge}>
                <Text style={styles.heroBadgeText}>{t.home.heroBadge}</Text>
              </View>
            </View>
            <FallbackImage
              source={{ uri: 'https://images.pexels.com/photos/4210378/pexels-photo-4210378.jpeg?auto=compress&cs=tinysrgb&w=300' }}
              style={styles.heroImage}
            />
          </LinearGradient>
        </View>

        <PromoCard
          badge={t.home.promo.badge}
          title={t.home.promo.title}
          description={t.home.promo.description}
          ctaText={t.home.promo.cta}
          onPress={() => router.push('/shop')}
        />

        {hasNoResults ? (
          <View style={styles.noResults}>
            <Search size={32} color={Colors.textMuted} strokeWidth={1.5} />
            <Text style={styles.noResultsText}>{t.home.searchNoResults}</Text>
          </View>
        ) : (
          <>
            {filteredCategories.length > 0 && (
              <View style={styles.section}>
                <SectionHeader title={t.home.servicesTitle} subtitle={t.home.servicesSubtitle} />
                <View style={styles.categoriesGrid}>
                  {filteredCategories.map((cat) => (
                    <CategoryTile
                      key={cat.key}
                      variant={cat.key}
                      title={t.home.categories[cat.key].title}
                      onPress={() => router.push(cat.route)}
                    />
                  ))}
                </View>
              </View>
            )}

            {filteredPopular.length > 0 && (
              <View style={styles.section}>
                <SectionHeader title={t.home.popularTitle} actionText={t.home.viewAll} onAction={() => router.push('/shop')} />
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
                  {filteredPopular.map((svc) => (
                    <TouchableOpacity
                      key={svc.key}
                      activeOpacity={0.85}
                      onPress={() => {
                        addItem({
                          id: `popular-${svc.key}`,
                          name: t.home.popularServices[svc.key],
                          detail: svc.time,
                          price: svc.price,
                          image: { uri: svc.image },
                        });
                        router.push('/cart');
                      }}
                      style={styles.popularCard}
                    >
                      <FallbackImage source={{ uri: svc.image }} style={styles.popularImage} />
                      <View style={styles.popularInfo}>
                        <Text style={styles.popularName} numberOfLines={1}>{t.home.popularServices[svc.key]}</Text>
                        <View style={styles.popularMeta}>
                          <View style={styles.ratingRow}>
                            <Star size={12} color={Colors.warning} strokeWidth={2.5} fill={Colors.warning} />
                            <Text style={styles.ratingText}>{svc.rating}</Text>
                          </View>
                          <View style={styles.ratingRow}>
                            <Clock size={12} color={Colors.textMuted} strokeWidth={2.5} />
                            <Text style={styles.timeText}>{svc.time}</Text>
                          </View>
                        </View>
                        <Text style={styles.popularPrice}>{MXN(svc.price)}</Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}
          </>
        )}

        <View style={{ height: Spacing.xxl }} />
      </ScrollView>

      <Modal visible={showNotifications} animationType="fade" transparent>
        <View style={styles.notifOverlay}>
          <View style={styles.notifCard}>
            <View style={styles.notifHeader}>
              <Text style={styles.notifTitle}>{t.home.notifications.title}</Text>
              <TouchableOpacity
                onPress={() => setShowNotifications(false)}
                style={styles.notifClose}
                accessibilityRole="button"
                accessibilityLabel={t.common.close}
              >
                <X size={20} color={Colors.textSecondary} strokeWidth={2.5} />
              </TouchableOpacity>
            </View>
            <View style={styles.notifEmpty}>
              <Bell size={32} color={Colors.textMuted} strokeWidth={1.5} />
              <Text style={styles.notifEmptyText}>{t.home.notifications.empty}</Text>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  scrollContent: { paddingBottom: 20 },
  header: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.md },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: Spacing.md },
  headerTextWrap: { flex: 1, marginRight: Spacing.sm },
  greeting: { fontSize: FontSize.xxl, fontWeight: '700', color: Colors.textPrimary },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  location: { flex: 1, fontSize: FontSize.sm, color: Colors.textSecondary },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  bellButton: { width: 44, height: 44, borderRadius: Radius.full, backgroundColor: Colors.surface, justifyContent: 'center', alignItems: 'center' },
  badge: { position: 'absolute', top: 10, right: 10, width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.error },
  searchBar: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, backgroundColor: Colors.surface, borderRadius: Radius.lg, paddingHorizontal: Spacing.md, paddingVertical: Spacing.md + 2, marginBottom: Spacing.lg },
  searchInput: { flex: 1, fontSize: FontSize.md, color: Colors.textPrimary, padding: 0 },
  noResults: { alignItems: 'center', justifyContent: 'center', paddingVertical: Spacing.xxl, gap: Spacing.md },
  noResultsText: { fontSize: FontSize.md, color: Colors.textMuted, textAlign: 'center', paddingHorizontal: Spacing.xl },
  notifOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center', paddingHorizontal: Spacing.xl },
  notifCard: { width: '100%', backgroundColor: Colors.white, borderRadius: Radius.xl, padding: Spacing.lg, ...Shadow.lg },
  notifHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.md },
  notifTitle: { fontSize: FontSize.xl, fontWeight: '700', color: Colors.textPrimary },
  notifClose: { width: 32, height: 32, borderRadius: Radius.full, backgroundColor: Colors.surface, justifyContent: 'center', alignItems: 'center' },
  notifEmpty: { alignItems: 'center', justifyContent: 'center', paddingVertical: Spacing.xl, gap: Spacing.md },
  notifEmptyText: { fontSize: FontSize.md, color: Colors.textMuted, textAlign: 'center' },
  heroCard: { marginHorizontal: Spacing.lg, marginBottom: Spacing.xl, borderRadius: Radius.xl, overflow: 'hidden', ...Shadow.lg },
  heroGradient: { flexDirection: 'row', alignItems: 'center', padding: Spacing.lg, borderRadius: Radius.xl },
  heroContent: { flex: 1 },
  heroTitle: { fontSize: FontSize.xxxl, fontWeight: '800', color: Colors.white, letterSpacing: 1 },
  heroSubtitle: { fontSize: FontSize.sm, color: 'rgba(255,255,255,0.9)', marginTop: 4, marginBottom: Spacing.sm },
  heroBadge: { alignSelf: 'flex-start', backgroundColor: 'rgba(255,255,255,0.25)', paddingHorizontal: Spacing.sm, paddingVertical: 4, borderRadius: Radius.full },
  heroBadgeText: { fontSize: FontSize.xs, fontWeight: '600', color: Colors.white },
  heroImage: { width: 100, height: 100, borderRadius: Radius.md, resizeMode: 'cover' },
  section: { paddingHorizontal: Spacing.lg, marginBottom: Spacing.xl },
  categoriesGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: Spacing.lg },
  horizontalScroll: { gap: Spacing.md, paddingRight: Spacing.lg },
  popularCard: { width: 180, backgroundColor: Colors.white, borderRadius: Radius.lg, overflow: 'hidden', ...Shadow.sm },
  popularImage: { width: '100%', height: 120, resizeMode: 'cover' },
  popularInfo: { padding: Spacing.sm },
  popularName: { fontSize: FontSize.sm, fontWeight: '600', color: Colors.textPrimary, marginBottom: 4 },
  popularMeta: { flexDirection: 'row', gap: Spacing.sm, marginBottom: 4 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  ratingText: { fontSize: FontSize.xs, fontWeight: '600', color: Colors.textSecondary },
  timeText: { fontSize: FontSize.xs, color: Colors.textMuted },
  popularPrice: { fontSize: FontSize.md, fontWeight: '700', color: Colors.primary },
});
