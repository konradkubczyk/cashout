import React from "react";
import { useColorScheme } from "react-native";
import { Stack } from "expo-router";
import { PaperProvider } from "react-native-paper";
import { SQLiteProvider } from "expo-sqlite";
import { StatusBar } from "expo-status-bar";
import { lightTheme, darkTheme } from "@/theme";
import { DATABASE_NAME } from "@/constants";
import { migrateDbIfNeeded } from "@/db/schema";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? darkTheme : lightTheme;

  return (
    <PaperProvider theme={theme}>
      <SQLiteProvider databaseName={DATABASE_NAME} onInit={migrateDbIfNeeded}>
        <StatusBar style="auto" />
        <Stack
          screenOptions={{
            headerStyle: {
              backgroundColor: theme.colors.surface,
            },
            headerTintColor: theme.colors.onSurface,
            headerTitleStyle: {
              fontWeight: "600",
            },
            contentStyle: {
              backgroundColor: theme.colors.background,
            },
            animation: "slide_from_right",
          }}
        >
          <Stack.Screen name="index" options={{ title: "Cashout" }} />
          <Stack.Screen
            name="scan"
            options={{
              title: "Scan Coupon",
              headerShown: false,
            }}
          />
          <Stack.Screen name="add" options={{ title: "Add Coupon" }} />
          <Stack.Screen
            name="coupon/[id]"
            options={{ title: "Coupon Details" }}
          />
        </Stack>
      </SQLiteProvider>
    </PaperProvider>
  );
}
