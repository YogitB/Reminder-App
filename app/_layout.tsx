import { Inter_400Regular, Inter_600SemiBold, Inter_700Bold, useFonts } from '@expo-google-fonts/inter';
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { useColorScheme } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Colors } from "../constants/theme";
SplashScreen.preventAutoHideAsync();
declare module '@react-navigation/native'{
  export type Theme={
    dark:boolean;
    colors: {
      primary: string;
      background: string;
      card: string;
      text: string;
      border: string;
      notification: string;
      icon: string;
      tint: string;

    }
  }
}
export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  // ✅ useColorScheme must be before any early return
  const colorScheme = useColorScheme();

  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded]);

  // ✅ early return goes after all hooks
  if (!fontsLoaded) return null;

  const baseTheme = colorScheme === "dark" ? DarkTheme : DefaultTheme;
  const theme = {
    ...baseTheme,
    colors: {
      ...baseTheme.colors,
      ...Colors[colorScheme ?? "light"],
      primary: Colors[colorScheme ?? "light"].tint,
      notification: Colors[colorScheme ?? "light"].tint,
      border: "transparent",
    },
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={theme}>
        <Stack
          screenOptions={{
            contentStyle: { backgroundColor: theme.colors.background },
            headerStyle: { backgroundColor: theme.colors.background },
            headerTintColor: theme.colors.text,
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="(modals)/modal" options={{ presentation: "modal" }} />
        </Stack>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}