// The app books through the website's API, so both share one diary and cannot double-book.
import Constants from "expo-constants";
import { Platform } from "react-native";
import { site } from "@/content/site";

// Dev on a phone: the website is assumed to run on the same computer as Expo, port 3000.
const devHost = Constants.expoConfig?.hostUri?.split(":")[0] ?? "localhost";
export const API =
  process.env.EXPO_PUBLIC_API_URL ??
  (__DEV__ ? (Platform.OS === "web" ? "" : `http://${devHost}:3000`) : site.url);

/** Website-relative photos need the host; remote ones are asked for at phone size. */
export const photo = (src: string, width = 800) => (src.startsWith("/") ? `${API}${src}` : src.replace("w=1600", `w=${width}`));

export type Availability = { today: string; days: Record<string, string[]> };
export type NewBooking = {
  serviceId: number; date: string; time: string; agreed: boolean;
  name: string; email: string; phone: string; extensionColour: string; notes: string;
};
export type Status = "pending" | "confirmed" | "cancelled" | "expired";
export type Payment = "none" | "due" | "paid" | "refunded" | "kept" | "refund_failed";
/** What the website says about a booking, including what the customer may do now. */
export type BookingView = {
  ref: string; date: string; time: string; status: Status; payment: Payment; fee: number;
  checkoutUrl?: string; canCancel: boolean; refundIfCancel: boolean; canReschedule: boolean;
};

export class ApiError extends Error {
  constructor(message: string, public status: number) { super(message); }
}

async function call<T>(path: string, init?: RequestInit): Promise<T> {
  const stop = new AbortController();
  const timer = setTimeout(() => stop.abort(), 20000);
  try {
    const r = await fetch(`${API}${path}`, { ...init, signal: stop.signal });
    const j = await r.json();
    if (!r.ok) throw new ApiError(j.message ?? "Something went wrong.", r.status);
    return j as T;
  } catch (e) {
    if (e instanceof ApiError) throw e;
    throw new ApiError("Can't reach Yuwa right now. Check your connection and try again.", 0);
  } finally {
    clearTimeout(timer);
  }
}

const json = { "Content-Type": "application/json" };

export const getAvailability = (serviceId: number) => call<Availability>(`/api/availability?service=${serviceId}`);
export const createBooking = (b: NewBooking) =>
  call<{ ref: string; token: string; status: Status; fee: number; checkoutUrl?: string }>("/api/bookings", { method: "POST", headers: json, body: JSON.stringify(b) });

export const getBooking = (ref: string, token: string, slots = false) =>
  call<{ booking: BookingView; days?: Record<string, string[]> }>(`/api/manage/${ref}${slots ? "?slots=1" : ""}`, { headers: { "x-booking-token": token } });
export const changeBooking = (ref: string, token: string, change: { action: "cancel"; expectRefund: boolean } | { action: "reschedule"; date: string; time: string }) =>
  call<{ booking: BookingView }>(`/api/manage/${ref}`, { method: "POST", headers: { ...json, "x-booking-token": token }, body: JSON.stringify(change) });
