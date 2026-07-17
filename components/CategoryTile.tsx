import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, Spacing, FontSize, Radius } from '@/constants/theme';
import { ServiceIcons, ServiceIconKey } from '@/constants/serviceIcons';

interface Props {
  variant: ServiceIconKey;
  title: string;
  onPress: () => void;
}

export default function CategoryTile({ variant, title, onPress }: Props) {
  return (
    <TouchableOpacity activeOpacity={0.7} onPress={onPress} style={styles.container}>
      <View style={styles.tile}>
        <Image source={ServiceIcons[variant]} style={styles.icon} resizeMode="contain" />
      </View>
      <Text style={styles.title} numberOfLines={2}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { width: '31%', alignItems: 'center' },
  tile: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: Radius.lg,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  icon: { width: '62%', height: '62%' },
  title: { fontSize: FontSize.sm, fontWeight: '600', color: Colors.textPrimary, textAlign: 'center' },
});
