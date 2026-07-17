import { View, StyleSheet } from 'react-native';
import { Colors } from '@/constants/theme';
import LoadingAnimation from '@/components/LoadingAnimation';

export default function LoadingScreen() {
  return (
    <View style={styles.container}>
      <LoadingAnimation />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
