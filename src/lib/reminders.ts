// Local reminders, scheduled on the phone. No push server needed.
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import { bookingConfig } from "@/content/booking";
import { studioInstant, t12 } from "./format";

const supported = Platform.OS !== "web";
const HOUR = 3600_000;

if (supported) {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({ shouldShowBanner: true, shouldShowList: true, shouldPlaySound: false, shouldSetBadge: false }),
  });
}

/** A day before (or two hours before, for short-notice bookings). Returns the id, or null if none was set. */
export async function scheduleReminder(b: { date: string; time: string; serviceName: string }): Promise<string | null> {
  if (!supported) return null;
  try {
    if (Platform.OS === "android")
      await Notifications.setNotificationChannelAsync("reminders", { name: "Appointment reminders", importance: Notifications.AndroidImportance.DEFAULT });
    const perm = await Notifications.requestPermissionsAsync();
    if (!perm.granted) return null;
    const at = studioInstant(b.date, b.time, bookingConfig.timezone).getTime();
    const when = [at - 24 * HOUR, at - 2 * HOUR].find((t) => t > Date.now() + 60_000);
    if (!when) return null;
    return await Notifications.scheduleNotificationAsync({
      content: { title: "Your Yuwa appointment", body: `${b.serviceName} at ${t12(b.time)}. Check your prep list.` },
      trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: new Date(when), channelId: "reminders" },
    });
  } catch {
    return null; // a failed reminder must never lose a confirmed booking
  }
}

export async function cancelReminder(id: string | null) {
  if (supported && id) await Notifications.cancelScheduledNotificationAsync(id).catch(() => {});
}
