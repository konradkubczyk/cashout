import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { Snackbar, useTheme } from "react-native-paper";
import type { MD3Theme } from "react-native-paper";

import { useCoupon } from "@/hooks/use-coupon";
import { CouponForm } from "@/components/coupon-form";
import { insertCoupon } from "@/db/coupon-repository";
import { parseToCents } from "@/utils/money";

interface FormData {
  barcodeValue: string;
  barcodeFormat: string;
  amount: string;
  storeName: string;
  expiresAt: string;
  notes: string;
}

/**
 * Add/Edit coupon screen.
 * Handles both new coupon creation (optionally prefilled from scanner)
 * and editing existing coupons.
 */
export function AddCouponScreen() {
  const params = useLocalSearchParams<{
    barcodeValue?: string;
    barcodeFormat?: string;
    couponId?: string;
  }>();

  const theme = useTheme<MD3Theme>();
  const router = useRouter();
  const db = useSQLiteContext();

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEditMode = !!params.couponId;

  // Only call useCoupon when we actually have a couponId
  // Pass empty string as fallback — hook will just return null coupon
  const {
    coupon,
    update,
    loading: isFetchingCoupon,
  } = useCoupon(params.couponId ?? "");

  const initialValues =
    isEditMode && coupon
      ? {
          barcodeValue: coupon.barcode_value,
          barcodeFormat: coupon.barcode_format,
          amount: (coupon.amount_cents / 100).toFixed(2),
          storeName: coupon.store_name ?? "",
          expiresAt: coupon.expires_at ? coupon.expires_at.split("T")[0] : "",
          notes: coupon.notes ?? "",
        }
      : {
          barcodeValue: params.barcodeValue ?? "",
          barcodeFormat: params.barcodeFormat ?? "code128",
          amount: "",
          storeName: "",
          expiresAt: "",
          notes: "",
        };

  const barcodeReadOnly = !isEditMode && !!params.barcodeValue;

  const handleSubmit = async (data: FormData) => {
    setIsSaving(true);
    setError(null);

    try {
      const amountCents = parseToCents(data.amount);
      if (amountCents === null) {
        throw new Error(
          "Invalid amount. Please enter a valid number (e.g., 1.25)",
        );
      }

      const expiresAt = data.expiresAt
        ? new Date(data.expiresAt + "T23:59:59.999Z").toISOString()
        : null;

      if (isEditMode) {
        await update({
          barcode_value: data.barcodeValue,
          barcode_format: data.barcodeFormat,
          amount_cents: amountCents,
          store_name: data.storeName || null,
          expires_at: expiresAt,
          notes: data.notes || null,
        });
      } else {
        await insertCoupon(db, {
          barcode_value: data.barcodeValue,
          barcode_format: data.barcodeFormat,
          amount_cents: amountCents,
          store_name: data.storeName || null,
          expires_at: expiresAt,
          notes: data.notes || null,
        });
      }

      router.back();
    } catch (e) {
      const message = e instanceof Error ? e.message : "Failed to save coupon";
      setError(message);
    } finally {
      setIsSaving(false);
    }
  };

  const styles = makeStyles(theme);

  return (
    <View style={styles.container}>
      <CouponForm
        initialValues={initialValues}
        barcodeReadOnly={barcodeReadOnly}
        onSubmit={handleSubmit}
        loading={isSaving || (isEditMode && isFetchingCoupon)}
        submitLabel={isEditMode ? "Update Coupon" : "Save Coupon"}
      />

      <Snackbar
        visible={!!error}
        onDismiss={() => setError(null)}
        duration={4000}
        action={{ label: "OK", onPress: () => setError(null) }}
      >
        {error ?? ""}
      </Snackbar>
    </View>
  );
}

const makeStyles = (theme: MD3Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
  });
