import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Radius, Spacing, FontSize, Shadow } from '@/constants/theme';
import { ChevronRight } from 'lucide-react-native';
import { useLanguage } from '@/contexts/LanguageContext';

interface Props {
  title: string;
  description: string;
  image: string;
  gradient: [string, string];
  onPress: () => void;
}

export default function CategoryCard({ title, description, image, gradient, onPress }: Props) {
  const { t } = useLanguage();
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
          <Image source={{ uri: image }} style={styles.image} />
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
  image: {
    width: 90,
    height: 90,
    borderRadius: Radius.md,
    resizeMode: 'cover',
  },
});
