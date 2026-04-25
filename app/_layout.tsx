import { Stack } from "expo-router";
import { useColorScheme } from 'react-native';
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Colors } from '../constants/theme';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: theme.background }}>
      <Stack
        screenOptions={{
          contentStyle: { backgroundColor: theme.background },
          headerStyle: { backgroundColor: theme.background },
          headerTintColor: theme.text,
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(modals)/modal" options={{ presentation: "modal" }} />
      </Stack>
    </GestureHandlerRootView>
  );
}
