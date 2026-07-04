import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Colors, Radius, Spacing, FontSize, Shadow } from '@/constants/theme';
import { Plus } from 'lucide-react-native';

interface Props {
  name: string;
  price: string;
  unit?: string;
  image: string;
  onAdd: () => void;
}

export default function ServiceCard({ name, price, unit, image, onAdd }: Props) {
  return (
    <View style={styles.container}>
      <Image source={{ uri: image }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={2}>{name}</Text>
        <View style={styles.priceRow}>
          <View>
            <Text style={styles.price}>{price}</Text>
            {unit && <Text style={styles.unit}>{unit}</Text>}
          </View>
          <TouchableOpacity activeOpacity={0.7} onPress={onAdd} style={styles.addButton}>
            <Plus size={20} color={Colors.white} strokeWidth={2.5} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    overflow: 'hidden',
    marginBottom: Spacing.md,
    ...Shadow.sm,
  },
  image: {
    width: '100%',
    height: 140,
    resizeMode: 'cover',
  },
  info: {
    padding: Spacing.md,
  },
  name: {
    fontSize: FontSize.md,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  price: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    color: Colors.primary,
  },
  unit: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    marginTop: 2,
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: Radius.full,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
