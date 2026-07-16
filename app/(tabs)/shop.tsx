import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors, Spacing, FontSize, Radius, Shadow, Layout } from '@/constants/theme';
import { moderateScale } from '@/constants/responsive';
import { Search, ShoppingBag, Star } from 'lucide-react-native';
import { useLanguage } from '@/contexts/LanguageContext';

const MXN = (n: number) => `${n.toLocaleString('es-MX')} MXN`;
import ScreenHeader from '@/components/ScreenHeader';
import { useState } from 'react';

const categoryKeys = ['all', 'detergents', 'disinfectants', 'accessories', 'eco'] as const;

const productsData = [
  { key: 'detergentPro' as const, price: 85, unit: '1L', image: 'https://images.pexels.com/photos/4108715/pexels-photo-4108715.jpeg?auto=compress&cs=tinysrgb&w=300', rating: 4.8, cat: 'detergents' as const },
  { key: 'disinfectant' as const, price: 65, unit: '1L', image: 'https://images.pexels.com/photos/4108715/pexels-photo-4108715.jpeg?auto=compress&cs=tinysrgb&w=300', rating: 4.7, cat: 'disinfectants' as const },
  { key: 'sponges' as const, price: 45, unit: 'Pack', image: 'https://images.pexels.com/photos/4108715/pexels-photo-4108715.jpeg?auto=compress&cs=tinysrgb&w=300', rating: 4.9, cat: 'accessories' as const },
  { key: 'ecoCleaner' as const, price: 95, unit: '1L', image: 'https://images.pexels.com/photos/4108715/pexels-photo-4108715.jpeg?auto=compress&cs=tinysrgb&w=300', rating: 5.0, cat: 'eco' as const },
  { key: 'softener' as const, price: 55, unit: '1L', image: 'https://images.pexels.com/photos/4108715/pexels-photo-4108715.jpeg?auto=compress&cs=tinysrgb&w=300', rating: 4.6, cat: 'detergents' as const },
  { key: 'floorWax' as const, price: 75, unit: '500ml', image: 'https://images.pexels.com/photos/4108715/pexels-photo-4108715.jpeg?auto=compress&cs=tinysrgb&w=300', rating: 4.5, cat: 'accessories' as const },
];

export default function ShopScreen() {
  const router = useRouter();
  const { t } = useLanguage();
  const [activeCat, setActiveCat] = useState<typeof categoryKeys[number]>('all');

  const filtered = activeCat === 'all' ? productsData : productsData.filter((p) => p.cat === activeCat);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScreenHeader title={t.shop.title} showBack={false} rightIcon={<ShoppingBag size={20} color={Colors.primary} strokeWidth={2.5} />} onRightPress={() => router.push('/cart')} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.searchBar}>
          <Search size={18} color={Colors.textMuted} strokeWidth={2.5} />
          <Text style={styles.searchPlaceholder}>{t.shop.searchPlaceholder}</Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catScroll}>
          {categoryKeys.map((cat) => (
            <TouchableOpacity
              key={cat}
              activeOpacity={0.7}
              onPress={() => setActiveCat(cat)}
              style={[styles.catChip, activeCat === cat && styles.catChipActive]}
            >
              <Text style={[styles.catText, activeCat === cat && styles.catTextActive]}>{t.shop.categories[cat]}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.grid}>
          {filtered.map((prod) => (
            <TouchableOpacity key={prod.key} activeOpacity={0.85} onPress={() => router.push('/cart')} style={styles.productCard}>
              <Image source={{ uri: prod.image }} style={styles.productImage} />
              <View style={styles.productInfo}>
                <Text style={styles.productName} numberOfLines={2}>{t.shop.products[prod.key]}</Text>
                <View style={styles.ratingRow}>
                  <Star size={12} color={Colors.warning} strokeWidth={2.5} fill={Colors.warning} />
                  <Text style={styles.ratingText}>{prod.rating}</Text>
                </View>
                <View style={styles.priceRow}>
                  <View>
                    <Text style={styles.price}>{MXN(prod.price)}</Text>
                    <Text style={styles.unit}>{prod.unit === 'Pack' ? t.shop.unitPack : prod.unit}</Text>
                  </View>
                  <TouchableOpacity activeOpacity={0.7} onPress={() => router.push('/cart')} style={styles.addButton}>
                    <ShoppingBag size={16} color={Colors.white} strokeWidth={2.5} />
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
        <View style={{ height: Spacing.xxl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  scrollContent: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.sm, width: '100%', maxWidth: Layout.maxContentWidth, alignSelf: 'center' },
  searchBar: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, backgroundColor: Colors.surface, borderRadius: Radius.lg, paddingHorizontal: Spacing.md, paddingVertical: Spacing.md + 2, marginBottom: Spacing.md },
  searchPlaceholder: { fontSize: FontSize.md, color: Colors.textMuted },
  catScroll: { gap: Spacing.sm, marginBottom: Spacing.lg, paddingRight: Spacing.lg },
  catChip: { paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, borderRadius: Radius.full, backgroundColor: Colors.surface },
  catChipActive: { backgroundColor: Colors.primary },
  catText: { fontSize: FontSize.sm, fontWeight: '600', color: Colors.textSecondary },
  catTextActive: { color: Colors.white },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.md, justifyContent: 'space-between' },
  productCard: { width: '47%', backgroundColor: Colors.white, borderRadius: Radius.lg, overflow: 'hidden', ...Shadow.sm },
  productImage: { width: '100%', aspectRatio: 1.3, resizeMode: 'cover' },
  productInfo: { padding: Spacing.sm },
  productName: { fontSize: FontSize.sm, fontWeight: '600', color: Colors.textPrimary, marginBottom: 4, minHeight: moderateScale(36) },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 2, marginBottom: Spacing.sm },
  ratingText: { fontSize: FontSize.xs, fontWeight: '600', color: Colors.textSecondary },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  price: { fontSize: FontSize.md, fontWeight: '700', color: Colors.primary },
  unit: { fontSize: FontSize.xs, color: Colors.textMuted },
  addButton: { width: moderateScale(32), height: moderateScale(32), borderRadius: Radius.full, backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center' },
});
