import { Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, FontSize } from '@/constants/theme';
import { moderateScale } from '@/constants/responsive';
import { Home, ClipboardList, User } from 'lucide-react-native';
import { useLanguage } from '@/contexts/LanguageContext';

export default function TabLayout() {
  const { t } = useLanguage();
  const insets = useSafeAreaInsets();
  const tabBarBaseHeight = moderateScale(56);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarStyle: {
          backgroundColor: Colors.white,
          borderTopColor: Colors.border,
          borderTopWidth: 1,
          height: tabBarBaseHeight + insets.bottom,
          paddingBottom: Math.max(insets.bottom, moderateScale(8)),
          paddingTop: moderateScale(8),
        },
        tabBarLabelStyle: {
          fontSize: FontSize.xs,
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t.tabs.home,
          tabBarIcon: ({ size, color }) => <Home size={size} color={color} strokeWidth={2.5} />,
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: t.tabs.orders,
          tabBarIcon: ({ size, color }) => <ClipboardList size={size} color={color} strokeWidth={2.5} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t.tabs.profile,
          tabBarIcon: ({ size, color }) => <User size={size} color={color} strokeWidth={2.5} />,
        }}
      />
    </Tabs>
  );
}
