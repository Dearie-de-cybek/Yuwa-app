// One booking: what happens next comes first, then the prep list, then the receipt.
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, AppState, View } from "react-native";
import { StatusPill, card } from "@/components/blocks";
import { Receipt } from "@/components/receipt";
import { Screen, goBack } from "@/components/screen";
import { SlotPicker } from "@/components/slot-picker";
import { Body, Button, Display, Italic, Label, Press } from "@/components/ui";
import { policy } from "@/content/policy";
import { findVariant } from "@/content/services";
import { site } from "@/content/site";
import { ApiError, changeBooking, getBooking } from "@/lib/api";
import { prettyDate, t12 } from "@/lib/format";
import { useStore, type Visit } from "@/lib/store";
import { useAndroidBack } from "@/lib/use-android-back";
import { useVisitSync } from "@/lib/use-visit-sync";
import { isUpcoming } from "@/lib/visits";
import { c, font } from "@/theme";

const contactLine = site.phone ? `Call ${site.phone}` : site.email ? `Email ${site.email}` : "Contact Yuwa";

function outcome(v: Visit) {
  if (v.payment === "refunded") return `Your $${v.fee} booking fee has been refunded. Your bank decides how soon it appears.`;
  if (v.payment === "kept") return `The $${v.fee} booking fee was kept as the cancellation fee.`;
  if (v.payment === "refund_failed") return `Your $${v.fee} refund hasn't gone through yet. Yuwa will follow up.`;
  return v.status === "expired" ? "The booking fee wasn't paid in time, so the slot was released." : "Nothing was charged.";
}

export default function VisitScreen() {
  const { ref } = useLocalSearchParams<{ ref: string }>();
  const { visits, ready } = useStore();
  const visit = visits.find((v) => v.ref === ref);
  if (visit) return <Detail key={visit.ref} visit={visit} />;
  return (
    <Screen title="Your booking" back={goBack} standalone>
      {ready && <Body>That booking isn&apos;t saved on this phone.</Body>}
    </Screen>
  );
}

function Detail({ visit }: { visit: Visit }) {
  const { togglePrep, removeVisit } = useStore();
  const { apply, refresh } = useVisitSync();
  const [mode, setMode] = useState<"view" | "move" | "cancel">("view");
  const [days, setDays] = useState<Record<string, string[]> | null>(null);
  const [date, setDate] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const v = findVariant(visit.serviceId);
  const upcoming = isUpcoming(visit);
  useAndroidBack(mode !== "view", () => setMode("view"));

  // Check with the website on arrival and on return from the payment page.
  const check = useCallback(() => {
    refresh(visit).catch((e: ApiError) => setMsg(e.status === 404 ? `Yuwa can't find this booking any more. ${contactLine}.` : "Couldn't check for updates. Showing what was saved."));
  }, [visit.ref, refresh]); // eslint-disable-line react-hooks/exhaustive-deps
  useFocusEffect(useCallback(() => { check(); }, [check]));
  useEffect(() => {
    const sub = AppState.addEventListener("change", (s) => { if (s === "active") check(); });
    return () => sub.remove();
  }, [check]);

  async function run(work: () => Promise<unknown>) {
    setBusy(true); setMsg("");
    try { await work(); }
    catch (e) { setMsg((e as ApiError).message); await refresh(visit).catch(() => {}); setMode("view"); }
    finally { setBusy(false); }
  }
  const pay = () => run(async () => { await WebBrowser.openBrowserAsync(visit.checkoutUrl!); await refresh(visit); });
  const cancel = () => run(async () => {
    const r = await changeBooking(visit.ref, visit.token, { action: "cancel", expectRefund: visit.refundIfCancel });
    await apply(visit, r.booking); setMode("view");
  });
  const openMove = () => run(async () => {
    setDays(null); setDate(null); setTime(null);
    const r = await getBooking(visit.ref, visit.token, true);
    await apply(visit, r.booking); setDays(r.days ?? {}); setDate(Object.keys(r.days ?? {})[0] ?? null);
    if (r.booking.canReschedule) setMode("move");
  });
  const move = () => run(async () => {
    const r = await changeBooking(visit.ref, visit.token, { action: "reschedule", date: date!, time: time! });
    await apply(visit, r.booking); setMode("view"); setMsg("Done. Your booking has moved.");
  });

  if (!v) return <Screen title="Your booking" back={goBack} standalone><Body>This service is no longer listed. {contactLine}.</Body></Screen>;

  const footer =
    mode === "cancel" ? (
      <>
        <Button title={busy ? "Cancelling…" : "Yes, cancel booking"} disabled={busy} onPress={cancel} />
        <Button tone="blush" title="Keep booking" disabled={busy} onPress={() => setMode("view")} />
      </>
    ) : mode === "move" ? (
      <>
        <Button title={date && time ? `Move to ${prettyDate(date)}, ${t12(time)}` : "Tap a new start time"} disabled={busy || !date || !time} onPress={move} />
        <Button tone="blush" title="Keep current time" onPress={() => setMode("view")} />
      </>
    ) : visit.status === "pending" ? (
      <>
        {visit.checkoutUrl && <Button title={`Pay $${visit.fee} to confirm`} disabled={busy} onPress={pay} />}
        <Button tone="blush" title="I've paid, check again" disabled={busy} onPress={() => run(() => refresh(visit))} />
      </>
    ) : !upcoming ? (
      <Button title="Book again" onPress={() => router.navigate({ pathname: "/book", params: { service: String(visit.serviceId) } })} />
    ) : undefined;

  return (
    <Screen title={mode === "move" ? "New time" : mode === "cancel" ? "Cancel booking" : "Your booking"} subtitle={`Ref ${visit.ref}`}
      back={mode === "view" ? goBack : () => setMode("view")} footer={footer} standalone>
      {!!msg && <Body selectable accessibilityRole="alert" style={{ backgroundColor: c.butter, padding: 14, borderRadius: 18 }}>{msg}</Body>}
      {busy && <ActivityIndicator color={c.rose} accessibilityLabel="Working" />}

      {mode === "view" && (
        <>
          <View style={[card, { backgroundColor: c.blush, gap: 8 }]}>
            <StatusPill status={!upcoming && visit.status === "confirmed" ? "done" : visit.status} />
            <Display size={28}>{prettyDate(visit.date)}, {t12(visit.time)}</Display>
            <Body size={14}>{v.collection.title}: {v.name}</Body>
            <Body size={14} style={{ fontFamily: font.semi }}>
              {visit.status === "pending" ? `Next: pay the $${visit.fee} booking fee. Your time is held for a short while.`
                : visit.status !== "confirmed" ? outcome(visit)
                : upcoming ? "Next: tick off your prep list before you come."
                : "This appointment has passed."}
            </Body>
          </View>

          {visit.status === "pending" && <Button tone="blush" title="Release this time" disabled={busy} onPress={() => setMode("cancel")} />}

          {upcoming && visit.status === "confirmed" && (
            <>
              <View style={{ flexDirection: "row", gap: 10 }}>
                {visit.canReschedule && <View style={{ flex: 1 }}><Button title="Reschedule" disabled={busy} onPress={openMove} /></View>}
                {visit.canCancel && <View style={{ flex: 1 }}><Button tone="blush" title="Cancel" onPress={() => { setMsg(""); setMode("cancel"); }} /></View>}
              </View>
              {!visit.canReschedule && <Body size={12} color={c.muted}>Online rescheduling is available once, {policy.freeChangeHours} hours or more before. {contactLine} with your reference for other changes.</Body>}
              <View style={[card, { gap: 8 }]}>
                <Display size={24}>Your <Italic>prep</Italic> · {visit.prepDone.length}/{v.collection.prep.length}</Display>
                <Body size={12} color={c.muted}>{visit.reminderId ? "Reminder set on this phone." : "No reminder set for this booking."}</Body>
                {v.collection.prep.map((p) => {
                  const on = visit.prepDone.includes(p);
                  return (
                    <Press key={p} onPress={() => togglePrep(visit.ref, p)} accessibilityRole="checkbox" accessibilityState={{ checked: on }}
                      style={{ flexDirection: "row", gap: 12, paddingVertical: 4, minHeight: 44 }}>
                      <View style={{ width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: c.rose, backgroundColor: on ? c.rose : "transparent", alignItems: "center", justifyContent: "center" }}>
                        {on && <Label size={11} color={c.white}>✓</Label>}
                      </View>
                      <Body size={14} color={on ? c.muted : c.ink} style={{ flex: 1, textDecorationLine: on ? "line-through" : "none" }}>{p}</Body>
                    </Press>
                  );
                })}
              </View>
            </>
          )}

          <Receipt serviceId={v.id} when={`${prettyDate(visit.date)}, ${t12(visit.time)}`} reference={visit.ref} payment={visit.payment}
            heading={visit.status === "confirmed" ? "Booked" : visit.status === "pending" ? "Awaiting payment" : "Not booked"} />

          {!upcoming && <Button tone="blush" title="Remove from this list" onPress={() => { removeVisit(visit.ref); goBack(); }} />}
        </>
      )}

      {mode === "cancel" && (
        <View style={[card, { gap: 10 }]}>
          <Display size={26}>{visit.status === "pending" ? "Release this time?" : "Cancel this booking?"}</Display>
          <Body style={{ fontFamily: font.semi }}>
            {visit.refundIfCancel ? `Your $${visit.fee} booking fee will be refunded.`
              : visit.payment === "paid" ? `It is less than ${policy.freeChangeHours} hours away, so the $${visit.fee} booking fee will be kept as the cancellation fee.`
              : "Nothing has been charged."}
          </Body>
          <Body size={13} color={c.muted}>{prettyDate(visit.date)}, {t12(visit.time)} · {v.name}</Body>
        </View>
      )}

      {mode === "move" && days && (
        <>
          <Body size={13} color={c.muted}>You can reschedule once. Your booking fee moves with you.</Body>
          {visit.payment === "paid" && <Body size={13} style={{ fontFamily: font.semi }}>If the new time is less than {policy.freeChangeHours} hours away, the fee can no longer be refunded.</Body>}
          {Object.keys(days).length === 0 ? <Body>No other times are open. {contactLine}.</Body>
            : <SlotPicker days={days} date={date} time={time} onDate={(d) => { setDate(d); setTime(null); }} onTime={setTime} />}
        </>
      )}
    </Screen>
  );
}
