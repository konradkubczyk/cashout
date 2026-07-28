import { useState, useEffect, useCallback } from "react";
import { useSQLiteContext } from "expo-sqlite";
import type { Coupon, UpdateCouponDto } from "@/db/schema";
import {
  getCouponById,
  updateCoupon,
  redeemCoupon,
  deleteCoupon,
} from "@/db/coupon-repository";

interface UseCouponResult {
  coupon: Coupon | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  update: (dto: UpdateCouponDto) => Promise<Coupon>;
  redeem: () => Promise<Coupon>;
  remove: () => Promise<void>;
}

/**
 * Hook for fetching and managing a single coupon by ID.
 * Provides mutation functions for update, redeem, and delete.
 */
export function useCoupon(id: string): UseCouponResult {
  const db = useSQLiteContext();
  const [coupon, setCoupon] = useState<Coupon | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      setError(null);
      const result = await getCouponById(db, id);
      setCoupon(result);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load coupon";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [db, id]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void refresh();
  }, [refresh]);

  const update = useCallback(
    async (dto: UpdateCouponDto): Promise<Coupon> => {
      const updated = await updateCoupon(db, id, dto);
      setCoupon(updated);
      return updated;
    },
    [db, id],
  );

  const redeem = useCallback(async (): Promise<Coupon> => {
    const redeemed = await redeemCoupon(db, id);
    setCoupon(redeemed);
    return redeemed;
  }, [db, id]);

  const remove = useCallback(async (): Promise<void> => {
    await deleteCoupon(db, id);
    setCoupon(null);
  }, [db, id]);

  return { coupon, loading, error, refresh, update, redeem, remove };
}
