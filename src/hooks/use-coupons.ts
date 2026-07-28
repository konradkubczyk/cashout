import { useState, useEffect, useCallback } from "react";
import { useSQLiteContext } from "expo-sqlite";
import type { Coupon } from "@/db/schema";
import { getAllCoupons, getArchivedCoupons } from "@/db/coupon-repository";

interface UseCouponsResult {
  coupons: Coupon[];
  archivedCoupons: Coupon[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

/**
 * Hook for fetching and managing the full coupon list.
 * Provides both active and archived coupons with pull-to-refresh support.
 */
export function useCoupons(): UseCouponsResult {
  const db = useSQLiteContext();
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [archivedCoupons, setArchivedCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      setError(null);
      const [active, archived] = await Promise.all([
        getAllCoupons(db),
        getArchivedCoupons(db),
      ]);
      setCoupons(active);
      setArchivedCoupons(archived);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load coupons";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [db]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void refresh();
  }, [refresh]);

  return { coupons, archivedCoupons, loading, error, refresh };
}
