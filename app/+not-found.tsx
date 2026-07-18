import { Link, Stack } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { useLanguage } from '@/contexts/LanguageContext';
import { Spacing, FontSize } from '@/constants/theme';

export default function NotFoundScreen() {
  const { t } = useLanguage();

  return (
    <>
      <Stack.Screen options={{ title: t.notFound.title }} />
      <View style={styles.container}>
        <Text style={styles.text}>{t.notFound.message}</Text>
        <Link href="/" style={styles.link}>
          <Text>{t.notFound.link}</Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.lg,
  },
  text: {
    fontSize: FontSize.xl,
    fontWeight: 600,
  },
  link: {
    marginTop: Spacing.md,
    paddingVertical: Spacing.md,
  },
});
