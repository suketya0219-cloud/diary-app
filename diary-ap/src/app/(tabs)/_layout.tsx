import { Tabs } from 'expo-router';
import { useColorScheme, Text } from 'react-native';
import { Colors } from '@/constants/theme';

function TabIcon({ emoji }: { emoji: string }) {
  return <Text style={{ fontSize: 20 }}>{emoji}</Text>;
}

export default function TabLayout() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.text,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: { backgroundColor: colors.background, borderTopColor: colors.backgroundElement },
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.text,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'ホーム',
          headerShown: false,
          tabBarIcon: ({ focused }) => <TabIcon emoji={focused ? '🏠' : '⌂'} />,
        }}
      />
      <Tabs.Screen
        name="events"
        options={{
          title: '予定',
          tabBarIcon: ({ focused }) => <TabIcon emoji={focused ? '📅' : '□'} />,
        }}
      />
      <Tabs.Screen
        name="activity"
        options={{
          title: '出来事',
          tabBarIcon: ({ focused }) => <TabIcon emoji={focused ? '📋' : '▢'} />,
        }}
      />
      <Tabs.Screen
        name="diary"
        options={{
          title: '日記',
          tabBarIcon: ({ focused }) => <TabIcon emoji={focused ? '📖' : '✎'} />,
        }}
      />
      <Tabs.Screen
        name="line"
        options={{
          title: 'LINE',
          tabBarIcon: () => <TabIcon emoji="💬" />,
        }}
      />
      <Tabs.Screen
        name="browser"
        options={{
          title: 'ブラウザ',
          tabBarIcon: () => <TabIcon emoji="🌐" />,
        }}
      />
      <Tabs.Screen
        name="ai-chat"
        options={{
          title: 'AI',
          tabBarIcon: () => <TabIcon emoji="🤖" />,
        }}
      />
    </Tabs>
  );
}
