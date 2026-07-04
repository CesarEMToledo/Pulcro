import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors, Spacing, FontSize, Radius, Shadow } from '@/constants/theme';
import { Search, ShoppingBag, Star } from 'lucide-react-native';

const MXN = (n: number) => `${n.toLocaleString('es-MX')} MXN`;
import ScreenHeader from '@/components/ScreenHeader';
import { useState } from 'react';

const categories = ['Todos', 'Detergentes', 'Desinfectantes', 'Accesorios', 'Eco'];

const products = [
  { name: 'Detergente Pulcro Pro', price: 85, unit: '1L', image: 'https://images.pexels.com/photos/4108715/pexels-photo-4108715.jpeg?auto=compress&cs=tinysrgb&w=300', rating: 4.8, cat: 'Detergentes' },
  { name: 'Desinfectante Multiusos', price: 65, unit: '1L', image: 'https://images.pexels.com/photos/4108715/pexels-photo-4108715.jpeg?auto=compress&cs=tinysrgb&w=300', rating: 4.7, cat: 'Desinfectantes' },
  { name: 'Esponjas Premium (3pz)', price: 45, unit: 'Pack', image: 'https://images.pexels.com/photos/4108715/pexels-photo-4108715.jpeg?auto=compress&cs=tinysrgb&w=300', rating: 4.9, cat: 'Accesorios' },
  { name: 'Limpiador Ecológico Bio', price: 95, unit: '1L', image: 'https://images.pexels.com/photos/4108715/pexels-photo-4108715.jpeg?auto=compress&cs=tinysrgb&w=300', rating: 5.0, cat: 'Eco' },
  { name: 'Suavizante Floral', price: 55, unit: '1L', image: 'https://images.pexels.com/photos/4108715/pexels-photo-4108715.jpeg?auto=compress&cs=tinysrgb&w=300', rating: 4.6, cat: 'Detergentes' },
  { name: 'Cera para Pisos', price: 75, unit: '500ml', image: 'https://images.pexels.com/photos/4108715/pexels-photo-4108715.jpeg?auto=compress&cs=tinysrgb&w=300', rating: 4.5, cat: 'Accesorios' },
];

export default function ShopScreen() {
  const router = useRouter();
  const [activeCat, setActiveCat] = useState('Todos');

  const filtered = activeCat === 'Todos' ? products : products.filter((p) => p.cat === activeCat);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScreenHeader title="Tienda" showBack={false} rightIcon={<ShoppingBag size={20} color={Colors.primary} strokeWidth={2.5} />} onRightPress={() => router.push('/cart')} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.searchBar}>
          <Search size={18} color={Colors.textMuted} strokeWidth={2.5} />
          <Text style={styles.searchPlaceholder}>Buscar productos de limpieza...</Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catScroll}>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat}
              activeOpacity={0.7}
              onPress={() => setActiveCat(cat)}
              style={[styles.catChip, activeCat === cat && styles.catChipActive]}
            >
              <Text style={[styles.catText, activeCat === cat && styles.catTextActive]}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.grid}>
          {filtered.map((prod) => (
            <TouchableOpacity key={prod.name} activeOpacity={0.85} onPress={() => router.push('/cart')} style={styles.productCard}>
              <Image source={{ uri: prod.image }} style={styles.productImage} />
              <View style={styles.productInfo}>
                <Text style={styles.productName} numberOfLines={2}>{prod.name}</Text>
                <View style={styles.ratingRow}>
                  <Star size={12} color={Colors.warning} strokeWidth={2.5} fill={Colors.warning} />
                  <Text style={styles.ratingText}>{prod.rating}</Text>
                </View>
                <View style={styles.priceRow}>
                  <View>
                    <Text style={styles.price}>{MXN(prod.price)}</Text>
                    <Text style={styles.unit}>{prod.unit}</Text>
                  </View>
                  <TouchableOpacity activeOpacity={0.7} style={styles.addButton}>
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
  scrollContent: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.sm },
  searchBar: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, backgroundColor: Colors.surface, borderRadius: Radius.lg, paddingHorizontal: Spacing.md, paddingVertical: Spacing.md + 2, marginBottom: Spacing.md },
  searchPlaceholder: { fontSize: FontSize.md, color: Colors.textMuted },
  catScroll: { gap: Spacing.sm, marginBottom: Spacing.lg, paddingRight: Spacing.lg },
  catChip: { paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, borderRadius: Radius.full, backgroundColor: Colors.surface },
  catChipActive: { backgroundColor: Colors.primary },
  catText: { fontSize: FontSize.sm, fontWeight: '600', color: Colors.textSecondary },
  catTextActive: { color: Colors.white },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.md, justifyContent: 'space-between' },
  productCard: { width: '47%', backgroundColor: Colors.white, borderRadius: Radius.lg, overflow: 'hidden', ...Shadow.sm },
  productImage: { width: '100%', height: 120, resizeMode: 'cover' },
  productInfo: { padding: Spacing.sm },
  productName: { fontSize: FontSize.sm, fontWeight: '600', color: Colors.textPrimary, marginBottom: 4, minHeight: 36 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 2, marginBottom: Spacing.sm },
  ratingText: { fontSize: FontSize.xs, fontWeight: '600', color: Colors.textSecondary },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  price: { fontSize: FontSize.md, fontWeight: '700', color: Colors.primary },
  unit: { fontSize: FontSize.xs, color: Colors.textMuted },
  addButton: { width: 32, height: 32, borderRadius: Radius.full, backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center' },
});
