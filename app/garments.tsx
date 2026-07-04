import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Colors, Spacing, FontSize, Radius, Shadow } from '@/constants/theme';
import { Plus, Minus, ShoppingBag } from 'lucide-react-native';

const MXN = (n: number) => `${n.toLocaleString('es-MX')} MXN`;
import ScreenHeader from '@/components/ScreenHeader';
import PrimaryButton from '@/components/PrimaryButton';

const garmentTypes = [
  { name: 'Tenis', price: 80, image: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=300' },
  { name: 'Zapatos', price: 60, image: 'https://images.pexels.com/photos/1456704/pexels-photo-1456704.jpeg?auto=compress&cs=tinysrgb&w=300' },
  { name: 'Botas', price: 90, image: 'https://images.pexels.com/photos/1598967/pexels-photo-1598967.jpeg?auto=compress&cs=tinysrgb&w=300' },
  { name: 'Gorras', price: 50, image: 'https://images.pexels.com/photos/1124465/pexels-photo-1124465.jpeg?auto=compress&cs=tinysrgb&w=300' },
  { name: 'Sombreros', price: 70, image: 'https://images.pexels.com/photos/459976/pexels-photo-459976.jpeg?auto=compress&cs=tinysrgb&w=300' },
  { name: 'Cinturones', price: 35, image: 'https://images.pexels.com/photos/45055/pexels-photo-45055.jpeg?auto=compress&cs=tinysrgb&w=300' },
];

export default function GarmentsScreen() {
  const router = useRouter();
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const getQty = (name: string) => quantities[name] || 0;
  const updateQty = (name: string, delta: number) => {
    setQuantities((prev) => ({ ...prev, [name]: Math.max(0, (prev[name] || 0) + delta) }));
  };

  const totalItems = Object.values(quantities).reduce((a, b) => a + b, 0);
  const totalPrice = Object.entries(quantities).reduce((sum, [name, qty]) => {
    const item = garmentTypes.find((g) => g.name === name);
    return sum + (item ? item.price * qty : 0);
  }, 0);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScreenHeader title="Limpieza de Prendas" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.introText}>Selecciona las prendas que deseas limpiar. Recogemos y entregamos en tu hogar.</Text>

        <View style={styles.grid}>
          {garmentTypes.map((item) => (
            <View key={item.name} style={styles.card}>
              <Image source={{ uri: item.image }} style={styles.cardImage} />
              <Text style={styles.cardName}>{item.name}</Text>
              <Text style={styles.cardPrice}>{MXN(item.price)}</Text>
              {getQty(item.name) === 0 ? (
                <TouchableOpacity activeOpacity={0.7} onPress={() => updateQty(item.name, 1)} style={styles.addBtn}>
                  <Plus size={18} color={Colors.white} strokeWidth={2.5} />
                  <Text style={styles.addBtnText}>Agregar</Text>
                </TouchableOpacity>
              ) : (
                <View style={styles.stepper}>
                  <TouchableOpacity activeOpacity={0.7} onPress={() => updateQty(item.name, -1)} style={styles.stepBtn}>
                    <Minus size={16} color={Colors.primary} strokeWidth={2.5} />
                  </TouchableOpacity>
                  <Text style={styles.stepValue}>{getQty(item.name)}</Text>
                  <TouchableOpacity activeOpacity={0.7} onPress={() => updateQty(item.name, 1)} style={styles.stepBtn}>
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
            <Text style={styles.bottomItems}>{totalItems} {totalItems === 1 ? 'prenda' : 'prendas'}</Text>
            <Text style={styles.bottomTotal}>{MXN(totalPrice)}</Text>
          </View>
          <PrimaryButton label="Continuar" onPress={() => router.push('/cart')} />
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
