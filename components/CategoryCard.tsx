import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Radius, Spacing, FontSize, Shadow } from '@/constants/theme';
import { ChevronRight } from 'lucide-react-native';
import { useLanguage } from '@/contexts/LanguageContext';
import { useResponsive } from '@/hooks/useResponsive';

interface Props {
  title: string;
  description: string;
  icon: React.ReactNode;
  gradient: [string, string];
  onPress: () => void;
}

// The icon components (LaundryIcon, GarmentsIcon, etc.) are drawn at this
// intrinsic size by default; we scale them visually via transform so they
// stay crisp vector SVGs at any device width.
const BASE_ICON_SIZE = 92;

export default function CategoryCard({ title, description, icon, gradient, onPress }: Props) {
  const { t } = useLanguage();
  const { wp, isTablet } = useResponsive();

  const iconSize = Math.max(72, Math.min(isTablet ? 132 : 104, wp(24)));
  const iconScale = iconSize / BASE_ICON_SIZE;

  return (
    <TouchableOpacity activeOpacity={0.85} onPress={onPress} style={styles.container}>
      <LinearGradient colors={gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.card}>
        <View style={styles.content}>
          <View style={styles.textWrap}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.description}>{description}</Text>
            <View style={styles.cta}>
              <Text style={styles.ctaText}>{t.categoryCard.viewMore}</Text>
              <ChevronRight size={16} color={Colors.white} strokeWidth={2.5} />
            </View>
          </View>
          <View style={[styles.iconWrap, { width: iconSize, height: iconSize }]}>
            <View style={{ transform: [{ scale: iconScale }] }}>{icon}</View>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.md,
    borderRadius: Radius.lg,
    overflow: 'hidden',
    ...Shadow.md,
  },
  card: {
    borderRadius: Radius.lg,
    padding: Spacing.lg,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textWrap: {
    flex: 1,
    paddingRight: Spacing.md,
  },
  title: {
    fontSize: FontSize.xl,
    fontWeight: '700',
    color: Colors.white,
    marginBottom: Spacing.xs,
  },
  description: {
    fontSize: FontSize.sm,
    color: 'rgba(255,255,255,0.85)',
    lineHeight: 20,
    marginBottom: Spacing.md,
  },
  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ctaText: {
    fontSize: FontSize.sm,
    fontWeight: '600',
    color: Colors.white,
  },
  iconWrap: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
