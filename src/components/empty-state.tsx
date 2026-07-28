import React from "react";
import { View, StyleSheet } from "react-native";
import { Text, Button, useTheme } from "react-native-paper";
import type { MD3Theme } from "react-native-paper";

interface EmptyStateProps {
  /** Primary message to display. */
  message: string;
  /** Secondary description text. */
  description?: string;
  /** Label for the action button. */
  actionLabel?: string;
  /** Callback when the action button is pressed. */
  onAction?: () => void;
  /** Optional icon name (Material Design Icons). */
  icon?: string;
}

/**
 * Empty state placeholder component.
 * Displays a centered message with an optional CTA button.
 */
export function EmptyState({
  message,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  const theme = useTheme<MD3Theme>();
  const styles = makeStyles(theme);

  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>📱</Text>
      <Text variant="headlineSmall" style={styles.message}>
        {message}
      </Text>
      {description ? (
        <Text variant="bodyMedium" style={styles.description}>
          {description}
        </Text>
      ) : null}
      {actionLabel && onAction ? (
        <Button
          mode="contained"
          onPress={onAction}
          style={styles.button}
          icon="barcode-scan"
        >
          {actionLabel}
        </Button>
      ) : null}
    </View>
  );
}

const makeStyles = (theme: MD3Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 32,
      paddingVertical: 48,
    },
    emoji: {
      fontSize: 64,
      marginBottom: 16,
    },
    message: {
      textAlign: "center",
      color: theme.colors.onSurface,
      marginBottom: 8,
    },
    description: {
      textAlign: "center",
      color: theme.colors.onSurfaceVariant,
      marginBottom: 24,
      lineHeight: 22,
    },
    button: {
      borderRadius: theme.roundness,
    },
  });
