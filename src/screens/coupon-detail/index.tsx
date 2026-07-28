import React, { useState, useCallback } from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { useRouter, useLocalSearchParams, useFocusEffect } from "expo-router";
import {
  ActivityIndicator,
  Text,
  List,
  Button,
  Portal,
  Dialog,
  Snackbar,
  useTheme,
  Divider,
} from "react-native-paper";
import type { MD3Theme } from "react-native-paper";

import { useCoupon } from "@/hooks/use-coupon";
import { BarcodeDisplay } from "@/components/barcode-display";
import { formatCents } from "@/utils/money";
import { formatDate, formatRelativeExpiry } from "@/utils/date";

/**
 * Coupon detail screen with barcode display, metadata, and action buttons.
 * Supports marking as redeemed, editing, and deleting with confirmation dialogs.
 */
export function CouponDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const {
    coupon,
    loading,
    error: fetchError,
    redeem,
    remove,
    refresh,
  } = useCoupon(id ?? "");

  const theme = useTheme<MD3Theme>();
  const styles = makeStyles(theme);

  const [redeemDialogVisible, setRedeemDialogVisible] = useState(false);
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      void refresh();
    }, [refresh]),
  );

  const handleRedeem = async () => {
    setRedeemDialogVisible(false);
    setIsProcessing(true);
    setActionError(null);
    try {
      await redeem();
    } catch (e) {
      const message =
        e instanceof Error ? e.message : "Failed to redeem coupon";
      setActionError(message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = async () => {
    setDeleteDialogVisible(false);
    setIsProcessing(true);
    setActionError(null);
    try {
      await remove();
      router.back();
    } catch (e) {
      const message =
        e instanceof Error ? e.message : "Failed to delete coupon";
      setActionError(message);
      setIsProcessing(false);
    }
  };

  if (loading && !coupon) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (fetchError || !coupon) {
    return (
      <View style={styles.center}>
        <Text variant="bodyLarge" style={{ color: theme.colors.error }}>
          {fetchError ?? "Coupon not found"}
        </Text>
      </View>
    );
  }

  const isRedeemed = coupon.status === "redeemed";
  const isActive = coupon.status === "active";

  const statusLabel =
    coupon.status === "active"
      ? "Active"
      : coupon.status === "redeemed"
        ? "Redeemed"
        : "Expired";

  const statusColor =
    coupon.status === "active"
      ? theme.colors.primary
      : coupon.status === "redeemed"
        ? theme.colors.secondary
        : theme.colors.error;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Barcode Display */}
        <View style={styles.barcodeContainer}>
          <BarcodeDisplay
            value={coupon.barcode_value}
            format={coupon.barcode_format}
          />
          {isRedeemed ? (
            <View style={styles.redeemedBanner}>
              <Text
                variant="titleMedium"
                style={{
                  color: theme.colors.onErrorContainer,
                  fontWeight: "700",
                }}
              >
                REDEEMED
              </Text>
            </View>
          ) : null}
        </View>

        {/* Amount */}
        <Text variant="displaySmall" style={styles.amountText}>
          {formatCents(coupon.amount_cents, coupon.currency)}
        </Text>

        {/* Details Section */}
        <View style={styles.detailsSection}>
          <List.Item
            title="Store"
            description={coupon.store_name ?? "Unknown Store"}
            left={(props) => <List.Icon {...props} icon="store" />}
          />
          <Divider />
          <List.Item
            title="Status"
            description={statusLabel}
            descriptionStyle={{ color: statusColor }}
            left={(props) => (
              <List.Icon {...props} icon="information-outline" />
            )}
          />
          <Divider />
          <List.Item
            title="Created"
            description={formatDate(coupon.created_at)}
            left={(props) => <List.Icon {...props} icon="calendar-plus" />}
          />
          <Divider />
          <List.Item
            title="Expiry"
            description={
              coupon.expires_at
                ? `${formatDate(coupon.expires_at)} · ${formatRelativeExpiry(coupon.expires_at)}`
                : "No expiry date"
            }
            left={(props) => <List.Icon {...props} icon="calendar-clock" />}
          />
          {isRedeemed && coupon.redeemed_at ? (
            <>
              <Divider />
              <List.Item
                title="Redeemed"
                description={formatDate(coupon.redeemed_at)}
                left={(props) => <List.Icon {...props} icon="calendar-check" />}
              />
            </>
          ) : null}
          {coupon.notes ? (
            <>
              <Divider />
              <List.Item
                title="Notes"
                description={coupon.notes}
                descriptionNumberOfLines={5}
                left={(props) => <List.Icon {...props} icon="note-text" />}
              />
            </>
          ) : null}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsSection}>
          {isActive ? (
            <Button
              mode="contained"
              icon="check-circle"
              onPress={() => setRedeemDialogVisible(true)}
              style={styles.actionButton}
              contentStyle={styles.actionButtonContent}
              loading={isProcessing}
              disabled={isProcessing}
            >
              Mark as Redeemed
            </Button>
          ) : null}
          <Button
            mode="outlined"
            icon="pencil"
            onPress={() => router.push(`/add?couponId=${id}`)}
            style={styles.actionButton}
            contentStyle={styles.actionButtonContent}
            disabled={isProcessing}
          >
            Edit
          </Button>
          <Button
            mode="outlined"
            icon="delete"
            textColor={theme.colors.error}
            style={[styles.actionButton, { borderColor: theme.colors.error }]}
            contentStyle={styles.actionButtonContent}
            onPress={() => setDeleteDialogVisible(true)}
            disabled={isProcessing}
          >
            Delete
          </Button>
        </View>
      </ScrollView>

      {/* Confirmation Dialogs */}
      <Portal>
        <Dialog
          visible={redeemDialogVisible}
          onDismiss={() => setRedeemDialogVisible(false)}
        >
          <Dialog.Title>Redeem Coupon</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">
              Are you sure you want to mark this coupon as redeemed? This will
              move it to your archived coupons.
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setRedeemDialogVisible(false)}>
              Cancel
            </Button>
            <Button onPress={handleRedeem}>Confirm</Button>
          </Dialog.Actions>
        </Dialog>

        <Dialog
          visible={deleteDialogVisible}
          onDismiss={() => setDeleteDialogVisible(false)}
        >
          <Dialog.Title>Delete Coupon</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">
              Are you sure you want to permanently delete this coupon? This
              action cannot be undone.
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDeleteDialogVisible(false)}>
              Cancel
            </Button>
            <Button textColor={theme.colors.error} onPress={handleDelete}>
              Delete
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <Snackbar
        visible={!!actionError}
        onDismiss={() => setActionError(null)}
        duration={4000}
        action={{ label: "OK", onPress: () => setActionError(null) }}
      >
        {actionError ?? ""}
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
    center: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 16,
      backgroundColor: theme.colors.background,
    },
    scrollContent: {
      padding: 16,
      paddingBottom: 32,
    },
    barcodeContainer: {
      alignItems: "center",
      marginVertical: 24,
      position: "relative",
    },
    redeemedBanner: {
      position: "absolute",
      top: "35%",
      backgroundColor: theme.colors.errorContainer,
      paddingHorizontal: 24,
      paddingVertical: 8,
      borderRadius: 8,
      transform: [{ rotate: "-10deg" }],
    },
    amountText: {
      textAlign: "center",
      marginBottom: 24,
      fontWeight: "700",
      color: theme.colors.primary,
      fontVariant: ["tabular-nums"],
    },
    detailsSection: {
      marginBottom: 24,
      backgroundColor: theme.colors.elevation.level1,
      borderRadius: theme.roundness,
      overflow: "hidden",
    },
    actionsSection: {
      gap: 12,
      marginBottom: 24,
    },
    actionButton: {
      borderRadius: theme.roundness,
    },
    actionButtonContent: {
      paddingVertical: 4,
    },
  });
