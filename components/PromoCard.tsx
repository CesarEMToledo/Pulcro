import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Tag, ArrowRight } from 'lucide-react-native';
import { Colors, Spacing, FontSize, Radius, Shadow } from '@/constants/theme';

interface PromoCardProps {
  badge: string;
  title: string;
  description: string;
  ctaText: string;
  onPress?: () => void;
}

export default function PromoCard({ badge, title, description, ctaText, onPress }: PromoCardProps) {
  return (
    <TouchableOpacity activeOpacity={0.9} onPress={onPress} style={styles.card}>
      <LinearGradient
        colors={[Colors.secondary, Colors.accent]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <View style={styles.iconWrap}>
          <Tag size={20} color={Colors.white} strokeWidth={2.5} />
        </View>
        <View style={styles.textWrap}>
          <Text style={styles.badge}>{badge}</Text>
          <Text style={styles.title} numberOfLines={1}>{title}</Text>
          <Text style={styles.description} numberOfLines={2}>{description}</Text>
        </View>
        <View style={styles.ctaWrap}>
          <Text style={styles.ctaText}>{ctaText}</Text>
          <ArrowRight size={16} color={Colors.white} strokeWidth={2.5} />
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.xl,
    borderRadius: Radius.xl,
    overflow: 'hidden',
    ...Shadow.md,
  },
  gradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: Radius.full,
    backgroundColor: 'rgba(255,255,255,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textWrap: { flex: 1 },
  badge: {
    fontSize: FontSize.xs,
    fontWeight: '700',
    color: Colors.white,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Radius.full,
    marginBottom: 4,
    overflow: 'hidden',
  },
  title: { fontSize: FontSize.md, fontWeight: '700', color: Colors.white, marginBottom: 2 },
  description: { fontSize: FontSize.xs, color: 'rgba(255,255,255,0.9)' },
  ctaWrap: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  ctaText: { fontSize: FontSize.xs, fontWeight: '700', color: Colors.white },
});
