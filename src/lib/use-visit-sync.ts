// Brings a stored visit up to date with the website, and keeps its reminder matching.
import { useCallback } from "react";
import { findVariant } from "@/content/services";
import { getBooking, type BookingView } from "./api";
import { cancelReminder, scheduleReminder } from "./reminders";
import { useStore, type Visit } from "./store";

// Reminder changes run one at a time per booking, so two refreshes can't set two reminders.
const queue = new Map<string, Promise<unknown>>();
const latest = new Map<string, Pick<Visit, "reminderId" | "reminderFor">>();

export function useVisitSync() {
  const { updateVisit, reminders } = useStore();

  const apply = useCallback((visit: Visit, view: BookingView) => {
    const run = async () => {
      let { reminderId, reminderFor } = latest.get(visit.ref) ?? visit;
      const slot = reminders && view.status === "confirmed" ? `${view.date} ${view.time}` : null;
      if (slot !== reminderFor) {
        await cancelReminder(reminderId);
        reminderId = slot ? await scheduleReminder({ date: view.date, time: view.time, serviceName: findVariant(visit.serviceId)?.name ?? "Your appointment" }) : null;
        reminderFor = slot;
      }
      latest.set(visit.ref, { reminderId, reminderFor });
      updateVisit(visit.ref, { ...view, checkoutUrl: view.checkoutUrl, reminderId, reminderFor });
    };
    const next = (queue.get(visit.ref) ?? Promise.resolve()).then(run, run);
    queue.set(visit.ref, next);
    return next;
  }, [updateVisit, reminders]);

  const refresh = useCallback(async (visit: Visit) => apply(visit, (await getBooking(visit.ref, visit.token)).booking), [apply]);
  return { apply, refresh };
}
