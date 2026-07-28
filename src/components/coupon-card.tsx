import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { Card, Text, Chip, useTheme } from "react-native-paper";
import type { MD3Theme } from "react-native-paper";
import type { Coupon, CouponStatus } from "@/db/schema";
import { formatCents } from "@/utils/money";
import { formatRelativeExpiry, daysUntilExpiry } from "@/utils/date";

interface CouponCardProps {
  /** The coupon data to display. */
  coupon: Coupon;
  /** Callback when the card is pressed. */
  onPress: (coupon: Coupon) => void;
}

const STATUS_CONFIG: Record<CouponStatus, { label: string; icon: string }> = {
  active: { label: "Active", icon: "check-circle-outline" },
  redeemed: { label: "Redeemed", icon: "check-circle" },
  expired: { label: "Expired", icon: "clock-alert-outline" },
};

/**
 * Coupon list item card displaying store name, amount,
 * expiry info, and status badge.
 */
export function CouponCard({ coupon, onPress }: CouponCardProps) {
  const theme = useTheme<MD3Theme>();
  const styles = makeStyles(theme);

  const isRedeemed = coupon.status === "redeemed";
  const isExpired = coupon.status === "expired";
  const isDimmed = isRedeemed || isExpired;

  const days = daysUntilExpiry(coupon.expires_at);
  const isUrgent = days !== null && days >= 0 && days <= 3 && !isDimmed;

  const statusConfig = STATUS_CONFIG[coupon.status];

  return (
    <Pressable onPress={() => onPress(coupon)}>
      <Card
        style={[styles.card, isDimmed && styles.cardDimmed]}
        mode="elevated"
      >
        <Card.Content style={styles.content}>
          <View style={styles.topRow}>
            <View style={styles.storeInfo}>
              <Text
                variant="titleMedium"
                style={[styles.storeName, isDimmed && styles.textDimmed]}
                numberOfLines={1}
              >
                {coupon.store_name || "Unknown Store"}
              </Text>
              <Text
                variant="bodySmall"
                style={[
                  styles.expiryText,
                  isUrgent && styles.expiryUrgent,
                  isDimmed && styles.textDimmed,
                ]}
              >
                {formatRelativeExpiry(coupon.expires_at)}
              </Text>
            </View>
            <Text
              variant="headlineSmall"
              style={[
                styles.amount,
                isDimmed && styles.textDimmed,
                isUrgent && styles.amountUrgent,
              ]}
            >
              {formatCents(coupon.amount_cents, coupon.currency)}
            </Text>
          </View>

          <View style={styles.bottomRow}>
            <Text
              variant="bodySmall"
              style={[styles.barcodePreview, isDimmed && styles.textDimmed]}
              numberOfLines={1}
            >
              {coupon.barcode_value}
            </Text>
            <Chip
              icon={statusConfig.icon}
              compact
              textStyle={styles.chipText}
              style={[
                styles.chip,
                isRedeemed && styles.chipRedeemed,
                isExpired && styles.chipExpired,
              ]}
            >
              {statusConfig.label}
            </Chip>
          </View>
        </Card.Content>
      </Card>
    </Pressable>
  );
}

const makeStyles = (theme: MD3Theme) =>
  StyleSheet.create({
    card: {
      marginHorizontal: 16,
      marginVertical: 6,
      borderRadius: theme.roundness,
    },
    cardDimmed: {
      opacity: 0.65,
    },
    content: {
      paddingVertical: 12,
      gap: 10,
    },
    topRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
    },
    storeInfo: {
      flex: 1,
      marginRight: 12,
      gap: 2,
    },
    storeName: {
      color: theme.colors.onSurface,
      fontWeight: "600",
    },
    expiryText: {
      color: theme.colors.onSurfaceVariant,
    },
    expiryUrgent: {
      color: theme.colors.error,
      fontWeight: "600",
    },
    amount: {
      color: theme.colors.primary,
      fontWeight: "700",
      fontVariant: ["tabular-nums"],
    },
    amountUrgent: {
      color: theme.colors.error,
    },
    textDimmed: {
      color: theme.colors.onSurfaceVariant,
    },
    bottomRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    barcodePreview: {
      fontFamily: "monospace",
      color: theme.colors.onSurfaceVariant,
      flex: 1,
      marginRight: 8,
    },
    chip: {
      height: 28,
    },
    chipText: {
      fontSize: 11,
    },
    chipRedeemed: {
      backgroundColor: theme.colors.secondaryContainer,
    },
    chipExpired: {
      backgroundColor: theme.colors.errorContainer,
    },
  });
