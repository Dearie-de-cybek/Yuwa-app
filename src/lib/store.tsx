// Everything the app remembers lives on this phone: bookings made here, saved looks, your profile and settings.
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, use, useCallback, useEffect, useState, type ReactNode } from "react";
import type { BookingView } from "./api";
import { cancelReminder } from "./reminders";

export type Visit = BookingView & {
  serviceId: number;
  token: string; // private key for managing this booking
  reminderId: string | null; reminderFor: string | null; // the date and time the reminder was set for
  prepDone: string[];
};
export type Contact = { name: string; email: string; phone: string };
type State = { visits: Visit[]; saved: string[]; contact: Contact; onboarded: boolean; reminders: boolean; tips: string[] };

const empty: State = { visits: [], saved: [], contact: { name: "", email: "", phone: "" }, onboarded: false, reminders: true, tips: [] };
const KEY = "yuwa.v2";

type Store = State & {
  ready: boolean;
  addVisit: (v: Visit, contact: Contact) => void;
  updateVisit: (ref: string, patch: Partial<Visit>) => void;
  removeVisit: (ref: string) => void;
  togglePrep: (ref: string, item: string) => void;
  toggleSaved: (id: string) => void;
  setContact: (contact: Contact) => void;
  finishIntro: (name?: string) => void;
  setReminders: (on: boolean) => void;
  dismissTip: (id: string) => void;
  clearAll: () => void;
};

const Ctx = createContext<Store | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>(empty);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(KEY)
      .then((raw) => { if (raw) setState({ ...empty, ...JSON.parse(raw) }); })
      .catch(() => {})
      .finally(() => setReady(true));
  }, []);
  useEffect(() => { if (ready) AsyncStorage.setItem(KEY, JSON.stringify(state)).catch(() => {}); }, [state, ready]);

  const flip = (list: string[], x: string) => (list.includes(x) ? list.filter((i) => i !== x) : [...list, x]);
  const edit = (ref: string, change: (v: Visit) => Visit) => setState((s) => ({ ...s, visits: s.visits.map((v) => (v.ref === ref ? change(v) : v)) }));

  const addVisit = useCallback((v: Visit, contact: Contact) => setState((s) => ({ ...s, contact, visits: [...s.visits, v] })), []);
  const updateVisit = useCallback((ref: string, patch: Partial<Visit>) => edit(ref, (v) => ({ ...v, ...patch })), []);
  const removeVisit = useCallback((ref: string) => setState((s) => {
    cancelReminder(s.visits.find((v) => v.ref === ref)?.reminderId ?? null);
    return { ...s, visits: s.visits.filter((v) => v.ref !== ref) };
  }), []);
  const togglePrep = useCallback((ref: string, item: string) => edit(ref, (v) => ({ ...v, prepDone: flip(v.prepDone, item) })), []);
  const toggleSaved = useCallback((id: string) => setState((s) => ({ ...s, saved: flip(s.saved, id) })), []);
  const setContact = useCallback((contact: Contact) => setState((s) => ({ ...s, contact })), []);
  const finishIntro = useCallback((name?: string) => setState((s) => ({ ...s, onboarded: true, contact: { ...s.contact, name: name?.trim() || s.contact.name } })), []);
  const setReminders = useCallback((reminders: boolean) => setState((s) => ({ ...s, reminders })), []);
  const dismissTip = useCallback((id: string) => setState((s) => ({ ...s, tips: [...s.tips, id] })), []);
  const clearAll = useCallback(() => setState((s) => {
    s.visits.forEach((v) => cancelReminder(v.reminderId));
    return { ...empty, onboarded: true };
  }), []);

  return (
    <Ctx value={{ ...state, ready, addVisit, updateVisit, removeVisit, togglePrep, toggleSaved, setContact, finishIntro, setReminders, dismissTip, clearAll }}>
      {children}
    </Ctx>
  );
}

export function useStore() {
  const s = use(Ctx);
  if (!s) throw new Error("useStore must be used inside StoreProvider");
  return s;
}
