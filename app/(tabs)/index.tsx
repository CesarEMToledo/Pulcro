import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors, Spacing, FontSize, Radius, Shadow, Layout } from '@/constants/theme';
import { moderateScale } from '@/constants/responsive';
import { useResponsive } from '@/hooks/useResponsive';
import { Search, Bell, MapPin, Star, Clock, X } from 'lucide-react-native';
import { useLanguage } from '@/contexts/LanguageContext';
import { useLocation } from '@/contexts/LocationContext';
import { useCart } from '@/contexts/CartContext';
import LanguageToggle from '@/components/LanguageToggle';
import FallbackImage from '@/components/FallbackImage';

const MXN = (n: number) => `${n.toLocaleString('es-MX')} MXN`;
import CategoryTile from '@/components/CategoryTile';
import SectionHeader from '@/components/SectionHeader';
import HeroCarousel from '@/components/HeroCarousel';

const categoriesData = [
  { key: 'laundry' as const, route: '/laundry' as const },
  { key: 'garments' as const, route: '/garments' as const },
  { key: 'house' as const, route: '/house' as const },
  { key: 'car' as const, route: '/car' as const },
  { key: 'plumbing' as const, route: '/plumbing' as const },
  { key: 'gardening' as const, route: '/gardening' as const },
  { key: 'electricity' as const, route: '/electricity' as const },
];

// Static data for the 4 best-offers hero carousel: reuses the same
// gradients/routes as the service categories below for visual consistency.
const heroOffersMeta = [
  {
    key: 'laundry' as const,
    image: 'https://images.pexels.com/photos/4210378/pexels-photo-4210378.jpeg?auto=compress&cs=tinysrgb&w=300',
    gradient: ['#1A6FD4', '#2ABFBF'] as [string, string],
    route: '/laundry' as const,
  },
  {
    key: 'garments' as const,
    image: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=300',
    gradient: ['#2ABFBF', '#00D4AA'] as [string, string],
    route: '/garments' as const,
  },
  {
    key: 'house' as const,
    image: 'https://images.pexels.com/photos/4239031/pexels-photo-4239031.jpeg?auto=compress&cs=tinysrgb&w=300',
    gradient: ['#1A6FD4', '#4A90E2'] as [string, string],
    route: '/house' as const,
  },
  {
    key: 'car' as const,
    image: 'https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg?auto=compress&cs=tinysrgb&w=300',
    gradient: ['#0D4FA0', '#1A6FD4'] as [string, string],
    route: '/car' as const,
  },
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
  const { address, clearAddress } = useLocation();
  const { addItem } = useCart();
  const { wp, isTablet } = useResponsive();
  const [searchQuery, setSearchQuery] = useState('');
  const [hasUnread, setHasUnread] = useState(true);

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const filteredCategories = categoriesData.filter((cat) =>
    t.home.categories[cat.key].title.toLowerCase().includes(normalizedQuery)
  );
  const filteredPopular = popularServicesData.filter((svc) =>
    t.home.popularServices[svc.key].toLowerCase().includes(normalizedQuery)
  );
  const hasNoResults = normalizedQuery.length > 0 && filteredCategories.length === 0 && filteredPopular.length === 0;

  // Dynamic sizes driven by the current window width (rule: useWindowDimensions
  // for cards/banners/images), clamped so they stay reasonable on very small
  // or very large (tablet) screens.
  const popularCardWidth = Math.max(150, Math.min(isTablet ? 240 : 200, wp(46)));

  const heroOffers = heroOffersMeta.map((offer) => ({
    key: offer.key,
    title: t.home.heroOffers[offer.key].title,
    subtitle: t.home.heroOffers[offer.key].subtitle,
    badge: t.home.heroOffers[offer.key].badge,
    image: offer.image,
    gradient: offer.gradient,
    onPress: () => router.push(offer.route),
  }));

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <Text style={styles.brandTitle}>PULCRO</Text>
            <View style={styles.headerActions}>
              <LanguageToggle />
              <TouchableOpacity
                activeOpacity={0.7}
                style={styles.bellButton}
                accessibilityRole="button"
                accessibilityLabel={t.home.notifications.title}
                onPress={() => {
                  setHasUnread(false);
                  router.push('/notifications');
                }}
              >
                <Bell size={20} color={Colors.primary} strokeWidth={2.5} />
                {hasUnread && <View style={styles.badge} />}
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.locationRowWrap}>
            <View style={styles.locationRow}>
              <MapPin size={14} color={Colors.primary} strokeWidth={2.5} />
              <Text style={styles.location} numberOfLines={1}>{address || t.home.location}</Text>
            </View>
            <TouchableOpacity activeOpacity={0.7} onPress={() => clearAddress()} style={styles.changeLocationBtn}>
              <Text style={styles.changeLocationText}>{t.common.change}</Text>
            </TouchableOpacity>
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

        <HeroCarousel offers={heroOffers} />

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
                      style={[styles.popularCard, { width: popularCardWidth }]}
                    >
                      <FallbackImage source={{ uri: svc.image }} style={styles.popularImage} />
                      <View style={styles.popularInfo}>
                        <Text style={styles.popularName} numberOfLines={1}>{t.home.popularServices[svc.key]}</Text>
                        <View style={styles.popularMeta}>
                          <View style={styles.ratingRow}>
                            <Star size={12} color={Colors.warning} strokeWidth={2.5} fill={Colors.warning} />
                            <Text style={styles.ratingText}>{svc.rating.toFixed(1)}</Text>
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  scrollContent: { paddingBottom: 20, width: '100%', maxWidth: Layout.maxContentWidth, alignSelf: 'center' },
  header: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.md },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.md },
  brandTitle: { fontSize: FontSize.xxl, fontWeight: '800', color: Colors.primary, letterSpacing: 0.5 },
  locationRowWrap: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: Spacing.md },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4, flex: 1, marginRight: Spacing.sm },
  location: { flex: 1, fontSize: FontSize.sm, color: Colors.textSecondary },
  changeLocationBtn: { paddingHorizontal: Spacing.sm, paddingVertical: 6, borderRadius: Radius.full, backgroundColor: Colors.primary + '12' },
  changeLocationText: { fontSize: FontSize.xs, fontWeight: '700', color: Colors.primary },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  bellButton: { width: moderateScale(44), height: moderateScale(44), borderRadius: Radius.full, backgroundColor: Colors.surface, justifyContent: 'center', alignItems: 'center' },
  badge: { position: 'absolute', top: moderateScale(10), right: moderateScale(10), width: moderateScale(8), height: moderateScale(8), borderRadius: moderateScale(4), backgroundColor: Colors.error },
  searchBar: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, backgroundColor: Colors.surface, borderRadius: Radius.lg, paddingHorizontal: Spacing.md, paddingVertical: Spacing.md + 2, marginBottom: Spacing.lg },
  searchInput: { flex: 1, fontSize: FontSize.md, color: Colors.textPrimary, padding: 0 },
  searchPlaceholder: { fontSize: FontSize.md, color: Colors.textMuted },
  noResults: { alignItems: 'center', justifyContent: 'center', paddingVertical: Spacing.xxl, gap: Spacing.md },
  noResultsText: { fontSize: FontSize.md, color: Colors.textMuted, textAlign: 'center', paddingHorizontal: Spacing.xl },
  section: { paddingHorizontal: Spacing.lg, marginBottom: Spacing.xl },
  categoriesGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: Spacing.lg },
  horizontalScroll: { gap: Spacing.md, paddingRight: Spacing.lg },
  popularCard: { backgroundColor: Colors.white, borderRadius: Radius.lg, overflow: 'hidden', ...Shadow.sm },
  popularImage: { width: '100%', aspectRatio: 1.5, resizeMode: 'cover' },
  popularInfo: { padding: Spacing.sm },
  popularName: { fontSize: FontSize.sm, fontWeight: '600', color: Colors.textPrimary, marginBottom: 4 },
  popularMeta: { flexDirection: 'row', gap: Spacing.sm, marginBottom: 4 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  ratingText: { fontSize: FontSize.xs, fontWeight: '600', color: Colors.textSecondary },
  timeText: { fontSize: FontSize.xs, color: Colors.textMuted },
  popularPrice: { fontSize: FontSize.md, fontWeight: '700', color: Colors.primary },
});
