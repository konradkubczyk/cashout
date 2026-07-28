import React, { useState, useCallback } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import {
  Surface,
  Text,
  SegmentedButtons,
  Snackbar,
  FAB,
  useTheme,
  MD3Theme,
} from "react-native-paper";
import { useRouter, useFocusEffect } from "expo-router";
import { useCoupons } from "@/hooks/use-coupons";
import { CouponCard } from "@/components/coupon-card";
import { EmptyState } from "@/components/empty-state";
import { formatCents } from "@/utils/money";

export function HomeScreen() {
  const theme = useTheme<MD3Theme>();
  const router = useRouter();
  const { coupons, archivedCoupons, loading, error, refresh } = useCoupons();
  const [viewMode, setViewMode] = useState<"active" | "archived">("active");
  const [errorVisible, setErrorVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      void refresh();
    }, [refresh]),
  );

  React.useEffect(() => {
    if (error) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setErrorVisible(true);
    }
  }, [error]);

  const activeTotalCents = coupons.reduce((sum, c) => sum + c.amount_cents, 0);
  const displayedCoupons = viewMode === "active" ? coupons : archivedCoupons;

  const renderEmptyState = () => {
    if (viewMode === "active") {
      return (
        <EmptyState
          message="No coupons yet"
          description="Scan a bottle deposit coupon to get started"
          actionLabel="Scan Coupon"
          onAction={() => router.push("/scan")}
        />
      );
    }
    return (
      <EmptyState
        message="No archived coupons"
        description="Redeemed and expired coupons will appear here"
      />
    );
  };

  if (loading && !displayedCoupons?.length) {
    return (
      <View
        style={[styles.centered, { backgroundColor: theme.colors.background }]}
      >
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Surface style={styles.headerSurface} elevation={2}>
        <Text
          variant="titleMedium"
          style={{ color: theme.colors.onSurfaceVariant }}
        >
          Total Active Value
        </Text>
        <Text
          variant="displayMedium"
          style={{ color: theme.colors.primary, fontWeight: "bold" }}
        >
          {formatCents(activeTotalCents)}
        </Text>
        <Text
          variant="labelLarge"
          style={{ color: theme.colors.onSurfaceVariant }}
        >
          {coupons?.length || 0} coupon{coupons?.length !== 1 ? "s" : ""}
        </Text>
      </Surface>

      <View style={styles.segmentContainer}>
        <SegmentedButtons
          value={viewMode}
          onValueChange={(value) => setViewMode(value as "active" | "archived")}
          buttons={[
            { value: "active", label: "Active" },
            { value: "archived", label: "Archived" },
          ]}
        />
      </View>

      <FlatList
        data={displayedCoupons}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CouponCard
            coupon={item}
            onPress={() => router.push(`/coupon/${item.id}` as any)}
          />
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={refresh}
            colors={[theme.colors.primary]}
          />
        }
      />

      <FAB
        icon="barcode-scan"
        style={[styles.fab, { backgroundColor: theme.colors.primaryContainer }]}
        color={theme.colors.onPrimaryContainer}
        onPress={() => router.push("/scan")}
      />

      <Snackbar
        visible={errorVisible}
        onDismiss={() => setErrorVisible(false)}
        action={{ label: "Retry", onPress: () => refresh() }}
      >
        {error ?? "An error occurred while loading coupons"}
      </Snackbar>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  headerSurface: {
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
    margin: 16,
    borderRadius: 16,
  },
  segmentContainer: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  listContent: {
    padding: 16,
    flexGrow: 1,
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
