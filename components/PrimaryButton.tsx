import { Text, StyleSheet, TouchableOpacity, TextStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Radius, Spacing, FontSize, Shadow } from '@/constants/theme';

interface Props {
  label: string;
  onPress: () => void;
  style?: TextStyle;
  disabled?: boolean;
  icon?: React.ReactNode;
}

export default function PrimaryButton({ label, onPress, style, disabled, icon }: Props) {
  return (
    <TouchableOpacity activeOpacity={0.85} onPress={onPress} disabled={disabled} style={[styles.wrapper, style]}>
      <LinearGradient
        colors={[Colors.gradientStart, Colors.gradientEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[styles.button, disabled && styles.disabled]}
      >
        {icon}
        <Text style={styles.label}>{label}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: Radius.lg,
    overflow: 'hidden',
    ...Shadow.md,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.md + 2,
    borderRadius: Radius.lg,
  },
  disabled: {
    opacity: 0.5,
  },
  label: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    color: Colors.white,
  },
});
