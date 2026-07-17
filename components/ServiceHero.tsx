import { View, Text, Image, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Spacing, FontSize, Radius, Shadow } from '@/constants/theme';
import { ServiceIcons, ServiceIconKey } from '@/constants/serviceIcons';

interface Props {
  variant: ServiceIconKey;
  gradient: [string, string];
  title: string;
  subtitle: string;
}

export default function ServiceHero({ variant, gradient, title, subtitle }: Props) {
  return (
    <View style={styles.wrap}>
      <LinearGradient colors={gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.gradient}>
        <View style={styles.textWrap}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
        <View style={styles.iconWrap}>
          <Image source={ServiceIcons[variant]} style={styles.icon} resizeMode="contain" />
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { borderRadius: Radius.xl, overflow: 'hidden', marginBottom: Spacing.xl, ...Shadow.md },
  gradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.lg,
    minHeight: 180,
  },
  textWrap: { flex: 1, paddingRight: Spacing.md },
  title: { fontSize: FontSize.xxl, fontWeight: '700', color: Colors.white },
  subtitle: { fontSize: FontSize.sm, color: 'rgba(255,255,255,0.9)', marginTop: 4 },
  iconWrap: {
    width: 110,
    height: 110,
    borderRadius: Radius.full,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: { width: '68%', height: '68%' },
});
