import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, Radius, Spacing, FontSize } from '@/constants/theme';
import { Minus, Plus } from 'lucide-react-native';

interface Props {
  value: number;
  onDecrease: () => void;
  onIncrease: () => void;
}

export default function QuantityStepper({ value, onDecrease, onIncrease }: Props) {
  return (
    <View style={styles.container}>
      <TouchableOpacity activeOpacity={0.7} onPress={onDecrease} style={styles.button}>
        <Minus size={18} color={Colors.primary} strokeWidth={2.5} />
      </TouchableOpacity>
      <Text style={styles.value}>{value}</Text>
      <TouchableOpacity activeOpacity={0.7} onPress={onIncrease} style={styles.button}>
        <Plus size={18} color={Colors.primary} strokeWidth={2.5} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radius.full,
    padding: Spacing.xs,
    gap: Spacing.sm,
  },
  button: {
    width: 32,
    height: 32,
    borderRadius: Radius.full,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  value: {
    fontSize: FontSize.md,
    fontWeight: '700',
    color: Colors.textPrimary,
    minWidth: 24,
    textAlign: 'center',
  },
});
