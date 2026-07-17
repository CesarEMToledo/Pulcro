
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Colors, Spacing, FontSize, Radius, Shadow } from '@/constants/theme';
import { Plus, Minus, ShoppingBag } from 'lucide-react-native';

const MXN = (n: number) => `${n.toLocaleString('es-MX')} MXN`;
import ScreenHeader from '@/components/ScreenHeader';
import PrimaryButton from '@/components/PrimaryButton';
import FallbackImage from '@/components/FallbackImage';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';

const garmentTypesData = [
  { key: 'sneakers' as const, price: 80, image: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=300' },
  { key: 'shoes' as const, price: 60, image: 'https://images.pexels.com/photos/15557047/pexels-photo-15557047.jpeg?auto=compress&cs=tinysrgb&w=300' },
  { key: 'boots' as const, price: 90, image: 'https://images.pexels.com/photos/35240168/pexels-photo-35240168.jpeg?auto=compress&cs=tinysrgb&w=300' },
  { key: 'caps' as const, price: 50, image: 'https://images.pexels.com/photos/1124465/pexels-photo-1124465.jpeg?auto=compress&cs=tinysrgb&w=300' },
  { key: 'hats' as const, price: 70, image: 'https://images.pexels.com/photos/38138842/pexels-photo-38138842.jpeg?auto=compress&cs=tinysrgb&w=300' },
  { key: 'belts' as const, price: 35, image: 'https://images.pexels.com/photos/28226522/pexels-photo-28226522.jpeg?auto=compress&cs=tinysrgb&w=300' },
];

export default function GarmentsScreen() {
  const router = useRouter();
  const { t } = useLanguage();
  const { addItem } = useCart();
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const getQty = (key: string) => quantities[key] || 0;
  const updateQty = (key: string, delta: number) => {
    setQuantities((prev) => ({ ...prev, [key]: Math.max(0, (prev[key] || 0) + delta) }));
  };

  const totalItems = Object.values(quantities).reduce((a, b) => a + b, 0);
  const totalPrice = Object.entries(quantities).reduce((sum, [key, qty]) => {
    const item = garmentTypesData.find((g) => g.key === key);
    return sum + (item ? item.price * qty : 0);
  }, 0);

  const addToCart = () => {
    Object.entries(quantities).forEach(([key, qty]) => {
      if (qty <= 0) return;
      const item = garmentTypesData.find((g) => g.key === key);
      if (!item) return;
      addItem(
        {
          id: `garment-${key}`,
          name: t.garments.items[key as keyof typeof t.garments.items],
          detail: t.garments.title,
          price: item.price,
          image: { uri: item.image },
        },
        { quantity: qty, replace: true }
      );
    });
    router.push('/cart');
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScreenHeader title={t.garments.title} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.introText}>{t.garments.intro}</Text>

        <View style={styles.grid}>
          {garmentTypesData.map((item) => (
            <View key={item.key} style={styles.card}>
              <FallbackImage source={{ uri: item.image }} style={styles.cardImage} />
              <Text style={styles.cardName}>{t.garments.items[item.key]}</Text>
              <Text style={styles.cardPrice}>{MXN(item.price)}</Text>
              {getQty(item.key) === 0 ? (
                <TouchableOpacity activeOpacity={0.7} onPress={() => updateQty(item.key, 1)} style={styles.addBtn}>
                  <Plus size={18} color={Colors.white} strokeWidth={2.5} />
                  <Text style={styles.addBtnText}>{t.common.add}</Text>
                </TouchableOpacity>
              ) : (
                <View style={styles.stepper}>
                  <TouchableOpacity activeOpacity={0.7} onPress={() => updateQty(item.key, -1)} style={styles.stepBtn}>
                    <Minus size={16} color={Colors.primary} strokeWidth={2.5} />
                  </TouchableOpacity>
                  <Text style={styles.stepValue}>{getQty(item.key)}</Text>
                  <TouchableOpacity activeOpacity={0.7} onPress={() => updateQty(item.key, 1)} style={styles.stepBtn}>
                    <Plus size={16} color={Colors.primary} strokeWidth={2.5} />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ))}
        </View>

        <View style={{ height: Spacing.xxl }} />
      </ScrollView>
      {totalItems > 0 && (
        <View style={styles.bottomBar}>
          <View>
            <Text style={styles.bottomItems}>{totalItems} {totalItems === 1 ? t.garments.item : t.garments.itemsPlural}</Text>
            <Text style={styles.bottomTotal}>{MXN(totalPrice)}</Text>
          </View>
          <PrimaryButton label={t.garments.continueButton} onPress={addToCart} />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  scrollContent: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.sm, paddingBottom: 100 },
  introText: { fontSize: FontSize.md, color: Colors.textSecondary, marginBottom: Spacing.lg, lineHeight: 22 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.md, justifyContent: 'space-between' },
  card: { width: '47%', backgroundColor: Colors.white, borderRadius: Radius.lg, padding: Spacing.sm, marginBottom: 0, alignItems: 'center', ...Shadow.sm },
  cardImage: { width: '100%', height: 100, borderRadius: Radius.md, resizeMode: 'cover', marginBottom: Spacing.sm },
  cardName: { fontSize: FontSize.md, fontWeight: '600', color: Colors.textPrimary },
  cardPrice: { fontSize: FontSize.md, fontWeight: '700', color: Colors.primary, marginTop: 2, marginBottom: Spacing.sm },
  addBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: Colors.primary, paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, borderRadius: Radius.full },
  addBtnText: { fontSize: FontSize.sm, fontWeight: '600', color: Colors.white },
  stepper: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, backgroundColor: Colors.surface, paddingHorizontal: Spacing.sm, paddingVertical: 4, borderRadius: Radius.full },
  stepBtn: { width: 28, height: 28, borderRadius: Radius.full, backgroundColor: Colors.white, justifyContent: 'center', alignItems: 'center' },
  stepValue: { fontSize: FontSize.md, fontWeight: '700', color: Colors.textPrimary, minWidth: 20, textAlign: 'center' },
  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: Colors.white, paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md, borderTopWidth: 1, borderTopColor: Colors.border },
  bottomItems: { fontSize: FontSize.sm, color: Colors.textMuted },
  bottomTotal: { fontSize: FontSize.xl, fontWeight: '700', color: Colors.primary },
});
