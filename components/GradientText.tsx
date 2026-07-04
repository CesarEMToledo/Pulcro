import { Text, StyleSheet, TextStyle } from 'react-native';
import { Colors, FontSize } from '@/constants/theme';

interface Props {
  children: string;
  style?: TextStyle;
  size?: number;
  weight?: TextStyle['fontWeight'];
}

export default function GradientText({ children, style, size = FontSize.lg, weight = '700' }: Props) {
  return (
    <Text style={[styles.text, { fontSize: size, fontWeight: weight }, style]}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  text: {
    color: Colors.primary,
  },
});
