import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, Spacing, FontSize, Radius, Shadow } from '@/constants/theme';
import { Globe } from 'lucide-react-native';
import { useLanguage } from '@/contexts/LanguageContext';

interface Props {
  variant?: 'chip' | 'row';
}

export default function LanguageToggle({ variant = 'chip' }: Props) {
  const { language, toggleLanguage } = useLanguage();
  const nextLanguage = language === 'es' ? 'EN' : 'ES';

  if (variant === 'row') {
    return (
      <TouchableOpacity activeOpacity={0.7} onPress={toggleLanguage} style={styles.row}>
        <View style={styles.rowLeft}>
          <View style={[styles.rowIcon, { backgroundColor: Colors.secondary + '15' }]}>
            <Globe size={20} color={Colors.secondary} strokeWidth={2.5} />
          </View>
          <Text style={styles.rowLabel}>{language === 'es' ? 'Idioma' : 'Language'}</Text>
        </View>
        <View style={styles.valuePill}>
          <Text style={styles.valuePillText}>{language.toUpperCase()}</Text>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity activeOpacity={0.7} onPress={toggleLanguage} style={styles.chip}>
      <Globe size={16} color={Colors.primary} strokeWidth={2.5} />
      <Text style={styles.chipText}>{language.toUpperCase()}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    height: 44,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.full,
    backgroundColor: Colors.surface,
    ...Shadow.sm,
  },
  chipText: {
    fontSize: FontSize.sm,
    fontWeight: '700',
    color: Colors.primary,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.md,
    paddingVertical: Spacing.md + 2,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  rowIcon: {
    width: 40,
    height: 40,
    borderRadius: Radius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rowLabel: {
    fontSize: FontSize.md,
    fontWeight: '500',
    color: Colors.textPrimary,
  },
  valuePill: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: Radius.full,
    backgroundColor: Colors.secondary + '15',
  },
  valuePillText: {
    fontSize: FontSize.xs,
    fontWeight: '700',
    color: Colors.secondary,
  },
});
