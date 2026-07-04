import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, Spacing, FontSize } from '@/constants/theme';
import { ChevronRight } from 'lucide-react-native';

interface Props {
  title: string;
  subtitle?: string;
  actionText?: string;
  onAction?: () => void;
}

export default function SectionHeader({ title, subtitle, actionText, onAction }: Props) {
  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
      {actionText && (
        <TouchableOpacity activeOpacity={0.7} onPress={onAction} style={styles.action}>
          <Text style={styles.actionText}>{actionText}</Text>
          <ChevronRight size={16} color={Colors.primary} strokeWidth={2.5} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: FontSize.xl,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  subtitle: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    marginTop: 2,
  },
  action: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  actionText: {
    fontSize: FontSize.sm,
    fontWeight: '600',
    color: Colors.primary,
  },
});
