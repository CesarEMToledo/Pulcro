import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Spacing, FontSize, Radius, Shadow } from '@/constants/theme';
import { Search, Bell, MapPin, Star, Clock } from 'lucide-react-native';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageToggle from '@/components/LanguageToggle';

const MXN = (n: number) => `${n.toLocaleString('es-MX')} MXN`;
import CategoryCard from '@/components/CategoryCard';
import SectionHeader from '@/components/SectionHeader';

const categoriesData = [
  {
    key: 'laundry' as const,
    image: 'https://images.pexels.com/photos/6210755/pexels-photo-6210755.jpeg?auto=compress&cs=tinysrgb&w=400',
    gradient: ['#1A6FD4', '#4A90E2'] as [string, string],
    route: '/laundry' as const,
  },
  {
    key: 'garments' as const,
    image: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=400',
    gradient: ['#2ABFBF', '#00D4AA'] as [string, string],
    route: '/garments' as const,
  },
  {
    key: 'house' as const,
    image: 'https://images.pexels.com/photos/4239031/pexels-photo-4239031.jpeg?auto=compress&cs=tinysrgb&w=400',
    gradient: ['#1A6FD4', '#2ABFBF'] as [string, string],
    route: '/house' as const,
  },
  {
    key: 'car' as const,
    image: 'https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg?auto=compress&cs=tinysrgb&w=400',
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
    image: 'https://images.pexels.com/photos/6210755/pexels-photo-6210755.jpeg?auto=compress&cs=tinysrgb&w=300',
    rating: 5.0,
    time: '48 hrs',
  },
];

export default function HomeScreen() {
  const router = useRouter();
  const { t } = useLanguage();

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.greeting}>{t.home.greeting}</Text>
              <View style={styles.locationRow}>
                <MapPin size={14} color={Colors.primary} strokeWidth={2.5} />
                <Text style={styles.location}>{t.home.location}</Text>
              </View>
            </View>
            <View style={styles.headerActions}>
              <LanguageToggle />
              <TouchableOpacity activeOpacity={0.7} style={styles.bellButton}>
                <Bell size={20} color={Colors.primary} strokeWidth={2.5} />
                <View style={styles.badge} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.searchBar}>
            <Search size={18} color={Colors.textMuted} strokeWidth={2.5} />
            <Text style={styles.searchPlaceholder}>{t.home.searchPlaceholder}</Text>
          </View>
        </View>

        <View style={styles.heroCard}>
          <LinearGradient colors={['#1A6FD4', '#2ABFBF']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.heroGradient}>
            <View style={styles.heroContent}>
              <Text style={styles.heroTitle}>PULCRO</Text>
              <Text style={styles.heroSubtitle}>{t.home.heroSubtitle}</Text>
              <View style={styles.heroBadge}>
                <Text style={styles.heroBadgeText}>{t.home.heroBadge}</Text>
              </View>
            </View>
            <Image
              source={{ uri: 'https://images.pexels.com/photos/6210766/pexels-photo-6210766.jpeg?auto=compress&cs=tinysrgb&w=300' }}
              style={styles.heroImage}
            />
          </LinearGradient>
        </View>

        <View style={styles.section}>
          <SectionHeader title={t.home.servicesTitle} subtitle={t.home.servicesSubtitle} />
          {categoriesData.map((cat) => (
            <CategoryCard
              key={cat.key}
              title={t.home.categories[cat.key].title}
              description={t.home.categories[cat.key].description}
              image={cat.image}
              gradient={cat.gradient}
              onPress={() => router.push(cat.route)}
            />
          ))}
        </View>

        <View style={styles.section}>
          <SectionHeader title={t.home.popularTitle} actionText={t.home.viewAll} onAction={() => router.push('/shop')} />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
            {popularServicesData.map((svc) => (
              <TouchableOpacity key={svc.key} activeOpacity={0.85} style={styles.popularCard}>
                <Image source={{ uri: svc.image }} style={styles.popularImage} />
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

        <View style={{ height: Spacing.xxl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  scrollContent: { paddingBottom: 20 },
  header: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.md },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: Spacing.md },
  greeting: { fontSize: FontSize.xxl, fontWeight: '700', color: Colors.textPrimary },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  location: { fontSize: FontSize.sm, color: Colors.textSecondary },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  bellButton: { width: 44, height: 44, borderRadius: Radius.full, backgroundColor: Colors.surface, justifyContent: 'center', alignItems: 'center' },
  badge: { position: 'absolute', top: 10, right: 10, width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.error },
  searchBar: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, backgroundColor: Colors.surface, borderRadius: Radius.lg, paddingHorizontal: Spacing.md, paddingVertical: Spacing.md + 2, marginBottom: Spacing.lg },
  searchPlaceholder: { fontSize: FontSize.md, color: Colors.textMuted },
  heroCard: { marginHorizontal: Spacing.lg, marginBottom: Spacing.xl, borderRadius: Radius.xl, overflow: 'hidden', ...Shadow.lg },
  heroGradient: { flexDirection: 'row', alignItems: 'center', padding: Spacing.lg, borderRadius: Radius.xl },
  heroContent: { flex: 1 },
  heroTitle: { fontSize: FontSize.xxxl, fontWeight: '800', color: Colors.white, letterSpacing: 1 },
  heroSubtitle: { fontSize: FontSize.sm, color: 'rgba(255,255,255,0.9)', marginTop: 4, marginBottom: Spacing.sm },
  heroBadge: { alignSelf: 'flex-start', backgroundColor: 'rgba(255,255,255,0.25)', paddingHorizontal: Spacing.sm, paddingVertical: 4, borderRadius: Radius.full },
  heroBadgeText: { fontSize: FontSize.xs, fontWeight: '600', color: Colors.white },
  heroImage: { width: 100, height: 100, borderRadius: Radius.md, resizeMode: 'cover' },
  section: { paddingHorizontal: Spacing.lg, marginBottom: Spacing.xl },
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
