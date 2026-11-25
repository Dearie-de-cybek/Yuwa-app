import { useCallback, useEffect, useRef, useState } from "react";
import { AppState } from "react-native";
import { useFocusEffect } from "expo-router";
import { bookingConfig } from "@/content/booking";
import type { ApiError } from "./api";
import { studioInstant } from "./format";
import { useStore, type Visit } from "./store";
import { useVisitSync } from "./use-visit-sync";

export const startsAt = (v: Visit) => studioInstant(v.date, v.time, bookingConfig.timezone).getTime();
export const isUpcoming = (v: Visit) => (v.status === "confirmed" || v.status === "pending") && startsAt(v) >= Date.now();
export const soonestFirst = (a: Visit, b: Visit) => startsAt(a) - startsAt(b);

/** Checks open bookings with the website whenever the screen or the app comes back into view. */
export function useRefreshVisits() {
  const { visits, ready } = useStore();
  const { refresh } = useVisitSync();
  const [offline, setOffline] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const current = useRef(visits);
  current.current = visits;

  const check = useCallback(async () => {
    const open = current.current.filter((v) => isUpcoming(v) || v.payment === "refund_failed");
    // One booking the website can't find mustn't hold up the others or look like a lost connection.
    const results = await Promise.allSettled(open.map(refresh));
    const failed = results.flatMap((r) => (r.status === "rejected" ? [(r.reason as ApiError).status] : []));
    setOffline(failed.some((s) => s !== 404));
  }, [refresh]);

  useFocusEffect(useCallback(() => { if (ready) check(); }, [ready, check]));
  useEffect(() => {
    const sub = AppState.addEventListener("change", (s) => { if (s === "active") check(); });
    return () => sub.remove();
  }, [check]);

  const pull = useCallback(() => { setRefreshing(true); check().finally(() => setRefreshing(false)); }, [check]);
  return { offline, refreshing, pull };
}
