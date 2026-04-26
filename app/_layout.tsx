import { DarkTheme, DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { Stack } from "expo-router";
import { useColorScheme } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Colors } from "../constants/theme";
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
  const colorScheme = useColorScheme();

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
      <NavigationContainer theme={theme}>
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
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
