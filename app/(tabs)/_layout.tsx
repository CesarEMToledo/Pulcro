import { Tabs } from 'expo-router';
import { Colors } from '@/constants/theme';
import { Home, ShoppingBag, ClipboardList, User } from 'lucide-react-native';

export default function TabLayout() {
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
          height: 64,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ size, color }) => <Home size={size} color={color} strokeWidth={2.5} />,
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: 'Pedidos',
          tabBarIcon: ({ size, color }) => <ClipboardList size={size} color={color} strokeWidth={2.5} />,
        }}
      />
      <Tabs.Screen
        name="shop"
        options={{
          title: 'Tienda',
          tabBarIcon: ({ size, color }) => <ShoppingBag size={size} color={color} strokeWidth={2.5} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ size, color }) => <User size={size} color={color} strokeWidth={2.5} />,
        }}
      />
    </Tabs>
  );
}
