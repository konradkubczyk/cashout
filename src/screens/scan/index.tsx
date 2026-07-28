import React, { useRef, useCallback } from "react";
import { View, StyleSheet } from "react-native";
import {
  Text,
  Button,
  IconButton,
  useTheme,
  MD3Theme,
} from "react-native-paper";
import {
  CameraView,
  useCameraPermissions,
  BarcodeScanningResult,
} from "expo-camera";
import { useRouter, Stack } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export function ScanScreen() {
  const theme = useTheme<MD3Theme>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [permission, requestPermission] = useCameraPermissions();
  const scanned = useRef(false);

  const handleBarcodeScanned = useCallback(
    (result: BarcodeScanningResult) => {
      if (scanned.current) return;
      scanned.current = true;

      // Slight delay for better UX
      setTimeout(() => {
        router.replace(
          `/add?barcodeValue=${encodeURIComponent(result.data)}&barcodeFormat=${result.type}`,
        );
      }, 500);
    },
    [router],
  );

  if (!permission) {
    // Camera permissions are still loading
    return (
      <View
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      />
    );
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <View
        style={[
          styles.permissionContainer,
          { backgroundColor: theme.colors.background },
        ]}
      >
        <Text
          variant="headlineSmall"
          style={{
            marginBottom: 16,
            textAlign: "center",
            color: theme.colors.onSurface,
          }}
        >
          Camera Permission Required
        </Text>
        <Text
          variant="bodyMedium"
          style={{
            marginBottom: 24,
            textAlign: "center",
            color: theme.colors.onSurfaceVariant,
          }}
        >
          We need access to your camera to scan bottle deposit coupons. If
          denied previously, please enable it in your device settings.
        </Text>
        <Button mode="contained" onPress={requestPermission}>
          Grant Permission
        </Button>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <CameraView
        style={styles.camera}
        barcodeScannerSettings={{
          barcodeTypes: [
            "ean13",
            "ean8",
            "code128",
            "code39",
            "qr",
            "upc_a",
            "upc_e",
            "codabar",
            "itf14",
          ],
        }}
        onBarcodeScanned={handleBarcodeScanned}
      >
        <View style={styles.overlay}>
          <View style={styles.topOverlay} />
          <View style={styles.middleRow}>
            <View style={styles.sideOverlay} />
            <View
              style={[styles.scanWindow, { borderColor: theme.colors.primary }]}
            />
            <View style={styles.sideOverlay} />
          </View>
          <View style={styles.bottomOverlay}>
            <Text style={styles.instructionText}>
              Position barcode within the frame
            </Text>
            <Button
              mode="contained-tonal"
              onPress={() => router.push("/add")}
              style={styles.manualButton}
            >
              Enter manually
            </Button>
          </View>
        </View>

        <IconButton
          icon="arrow-left"
          iconColor="white"
          size={24}
          style={[styles.backButton, { top: Math.max(insets.top, 16) }]}
          onPress={() => router.back()}
        />
      </CameraView>
    </View>
  );
}

const overlayColor = "rgba(0, 0, 0, 0.6)";

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    ...(StyleSheet.absoluteFill as object),
  },
  topOverlay: {
    flex: 1,
    backgroundColor: overlayColor,
  },
  middleRow: {
    flexDirection: "row",
    height: 250, // Height of the transparent scanning window
  },
  sideOverlay: {
    flex: 1,
    backgroundColor: overlayColor,
  },
  scanWindow: {
    flex: 4, // Controls the width of the transparent window relative to side overlays
    borderWidth: 2,
    backgroundColor: "transparent",
    borderRadius: 8,
  },
  bottomOverlay: {
    flex: 2,
    backgroundColor: overlayColor,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  instructionText: {
    color: "white",
    fontSize: 16,
    marginBottom: 24,
    textAlign: "center",
  },
  manualButton: {
    marginTop: 16,
  },
  backButton: {
    position: "absolute",
    left: 8,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
});
