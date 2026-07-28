import React from "react";
import { View, StyleSheet } from "react-native";
import { Text, useTheme } from "react-native-paper";
import type { MD3Theme } from "react-native-paper";
import { formatBarcodeType } from "@/utils/barcode";

interface BarcodeDisplayProps {
  /** The barcode value string. */
  value: string;
  /** The barcode format (e.g., 'ean13', 'code128'). */
  format?: string;
  /** Whether to display in full-screen mode. */
  fullScreen?: boolean;
}

/**
 * Renders a barcode value in a stylized, scannable-looking container.
 * Uses a large monospace font on a high-contrast white background
 * for maximum readability by POS barcode scanners.
 */
export function BarcodeDisplay({
  value,
  format,
  fullScreen = false,
}: BarcodeDisplayProps) {
  const theme = useTheme<MD3Theme>();
  const styles = makeStyles(theme, fullScreen);

  return (
    <View style={styles.container}>
      <View style={styles.barcodeArea}>
        {/* Simulated barcode lines for visual effect */}
        <View style={styles.barcodeLines}>
          {value.split("").map((char, index) => {
            // Generate pseudo-random bar widths based on character codes
            const charCode = char.charCodeAt(0);
            const thinBar = charCode % 3 === 0;
            return (
              <View
                key={`${index}-${char}`}
                style={[
                  styles.bar,
                  {
                    width: thinBar ? 1 : charCode % 2 === 0 ? 3 : 2,
                    marginHorizontal: thinBar ? 0.5 : 1,
                  },
                ]}
              />
            );
          })}
        </View>

        <Text selectable style={styles.barcodeValue}>
          {value}
        </Text>
      </View>

      {format ? (
        <Text variant="labelSmall" style={styles.formatLabel}>
          {formatBarcodeType(format)}
        </Text>
      ) : null}
    </View>
  );
}

const makeStyles = (theme: MD3Theme, fullScreen: boolean) =>
  StyleSheet.create({
    container: {
      alignItems: "center",
      padding: fullScreen ? 32 : 16,
      backgroundColor: "#FFFFFF",
      borderRadius: fullScreen ? 0 : theme.roundness,
      ...(fullScreen
        ? { flex: 1, justifyContent: "center" }
        : {
            borderWidth: 1,
            borderColor: theme.colors.outlineVariant,
          }),
    },
    barcodeArea: {
      alignItems: "center",
      width: "100%",
      paddingVertical: fullScreen ? 32 : 16,
    },
    barcodeLines: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      height: fullScreen ? 120 : 72,
      marginBottom: 12,
      paddingHorizontal: 8,
    },
    bar: {
      height: "100%",
      backgroundColor: "#000000",
    },
    barcodeValue: {
      fontFamily: "monospace",
      fontSize: fullScreen ? 28 : 18,
      letterSpacing: fullScreen ? 6 : 3,
      color: "#000000",
      fontWeight: "600",
      textAlign: "center",
    },
    formatLabel: {
      color: theme.colors.onSurfaceVariant,
      marginTop: 4,
    },
  });
