import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, Spacing, FontSize, Radius } from '@/constants/theme';
import { moderateScale } from '@/constants/responsive';
import { ChevronLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';

interface Props {
  title: string;
  showBack?: boolean;
  rightIcon?: React.ReactNode;
  onRightPress?: () => void;
}

export default function ScreenHeader({ title, showBack = true, rightIcon, onRightPress }: Props) {
  const router = useRouter();
  return (
    <View style={styles.container}>
      {showBack ? (
        <TouchableOpacity activeOpacity={0.7} onPress={() => router.back()} style={styles.iconButton}>
          <ChevronLeft size={24} color={Colors.textPrimary} strokeWidth={2.5} />
        </TouchableOpacity>
      ) : (
        <View style={styles.iconButton} />
      )}
      <Text style={styles.title}>{title}</Text>
      {rightIcon ? (
        <TouchableOpacity activeOpacity={0.7} onPress={onRightPress} style={styles.iconButton}>
          {rightIcon}
        </TouchableOpacity>
      ) : (
        <View style={styles.iconButton} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.white,
  },
  title: {
    fontSize: FontSize.xl,
    fontWeight: '700',
    color: Colors.textPrimary,
    flex: 1,
    textAlign: 'center',
  },
  iconButton: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: Radius.full,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
