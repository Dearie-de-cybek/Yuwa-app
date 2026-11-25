// Three clear steps: service, time, details and fee. The pinned button is always the next thing to do.
import { router, useLocalSearchParams } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { useCallback, useEffect, useRef, useState } from "react";
import { ActivityIndicator, View, type ScrollViewInstance } from "react-native";
import { Col, Cols, GAP, PhotoTile } from "@/components/bento";
import { Field, Steps, card } from "@/components/blocks";
import { LegalLinks } from "@/components/legal-links";
import { Screen } from "@/components/screen";
import { SlotPicker } from "@/components/slot-picker";
import { Body, Button, Display, Label, Poster, Press } from "@/components/ui";
import { img, serviceImage } from "@/content/images";
import { feeFor, feeSummary, policy } from "@/content/policy";
import { bySlug, collections, findVariant, fmtDuration, fmtPrice, startingPrice, type Collection } from "@/content/services";
import { ApiError, createBooking, getAvailability, type Availability } from "@/lib/api";
import { prettyDate, t12 } from "@/lib/format";
import { useStore, type Visit } from "@/lib/store";
import { useAndroidBack } from "@/lib/use-android-back";
import { useVisitSync } from "@/lib/use-visit-sync";
import { c, font, radius } from "@/theme";

const STEPS = ["Service", "Time", "Confirm"];
const headings = [["Choose a style", "Tap a photo to see its options"], ["Pick a time", "Only open times are shown"], ["Confirm", "Your details and booking fee"]];

function Tile({ col, height, onPress }: { col: Collection; height: number; onPress: () => void }) {
  const from = startingPrice(col);
  return <PhotoTile src={serviceImage[col.slug].src} title={col.title} height={height} onPress={onPress}
    badge={`${col.variants.length} options`} hint={from !== null ? `From ${fmtPrice(from)}  →` : "Complimentary  →"} />;
}

export default function Book() {
  const params = useLocalSearchParams<{ service?: string; collection?: string }>();
  const { contact, addVisit } = useStore();
  const { refresh } = useVisitSync();
  const scroll = useRef<ScrollViewInstance>(null);

  const [serviceId, setServiceId] = useState<number | null>(null);
  const [open, setOpen] = useState<string | null>(null);
  const [avail, setAvail] = useState<Availability | null>(null);
  const [date, setDate] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [details, setDetails] = useState(false);
  const [form, setForm] = useState({ ...contact, extensionColour: "", notes: "" });
  const [agreed, setAgreed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0); // bumps on every restart, so choosing the same service again reloads it
  const latest = useRef(0);

  const v = serviceId ? findVariant(serviceId) : null;
  const fee = v ? feeFor(v.price) : 0;
  const step = !serviceId ? 1 : !details ? 2 : 3;

  const reset = useCallback(() => {
    setServiceId(null); setDetails(false); setAgreed(false); setError(""); setAttempt((n) => n + 1);
    setForm((f) => ({ ...f, extensionColour: "", notes: "" }));
  }, []);

  // Arriving from a card or a look preselects the service or opens its group. Params are then cleared so a repeat tap works.
  useEffect(() => {
    if (!params.service && !params.collection) return;
    reset();
    const id = Number(params.service);
    if (findVariant(id)) setServiceId(id);
    setOpen(params.collection ?? null);
    router.setParams({ service: undefined, collection: undefined });
  }, [params.service, params.collection, reset]);

  // Keep the form filled with whatever the profile holds.
  useEffect(() => { setForm((f) => ({ ...f, ...contact })); }, [contact]);

  const load = useCallback(async (id: number) => {
    setError("");
    const mine = ++latest.current; // only the newest request may answer
    try {
      const a = await getAvailability(id);
      if (mine !== latest.current) return;
      setAvail(a);
      setDate((d) => (d && a.days[d] ? d : Object.keys(a.days)[0] ?? null));
    } catch (e) { if (mine === latest.current) setError((e as ApiError).message); }
  }, []);
  useEffect(() => { latest.current++; setAvail(null); setDate(null); setTime(null); setDetails(false); if (serviceId) load(serviceId); }, [serviceId, attempt, load]);
  useAndroidBack(step > 1 || !!open, () => (step === 3 ? setDetails(false) : step === 2 ? reset() : setOpen(null)));
  useEffect(() => { scroll.current?.scrollTo({ y: 0, animated: false }); }, [step, open]);

  async function confirm() {
    if (!v || !date || !time || busy) return;
    if (form.name.trim().length < 2 || !/^\S+@\S+\.\S+$/.test(form.email.trim()) || form.phone.replace(/\D/g, "").length < 8)
      return setError("Please enter your name, a valid email and a phone number.");
    setBusy(true); setError("");
    try {
      const r = await createBooking({ serviceId: v.id, date, time, agreed, ...form, email: form.email.trim() });
      const fresh: Visit = {
        ref: r.ref, token: r.token, serviceId: v.id, date, time, status: r.status, fee: r.fee,
        payment: r.fee ? "due" : "none", checkoutUrl: r.checkoutUrl,
        canCancel: true, refundIfCancel: false, canReschedule: false, reminderId: null, reminderFor: null, prepDone: [],
      };
      addVisit(fresh, { name: form.name.trim(), email: form.email.trim(), phone: form.phone.trim() });
      reset();
      router.push({ pathname: "/visit/[ref]", params: { ref: r.ref } });
      if (r.checkoutUrl) await WebBrowser.openBrowserAsync(r.checkoutUrl).catch(() => {});
      await refresh(fresh).catch(() => {}); // the booking screen checks again too
    } catch (e) {
      const err = e as ApiError;
      setError(err.message);
      if (err.status === 409) { setDetails(false); setTime(null); load(v.id); }
    } finally { setBusy(false); }
  }

  const group = step === 1 && open ? bySlug(open) : undefined;
  const [lead, ...others] = collections;

  const problem = !!error && <Body color={c.rose} selectable accessibilityRole="alert" style={{ fontFamily: font.semi }}>{error}</Body>;
  const footer = step === 2 && v ? (
    <>
      <Body size={13} style={{ textAlign: "center", fontFamily: font.semi }}>{date && time ? `${prettyDate(date)}, ${t12(time)}` : "Tap a date, then a start time"}</Body>
      <Button title="Continue  →" disabled={!date || !time} onPress={() => { setError(""); setDetails(true); }} />
    </>
  ) : step === 3 ? (
    <>
      {problem}
      {!agreed && <Body size={12} color={c.muted} style={{ textAlign: "center" }}>Tick the agreement above to continue.</Body>}
      <Button title={busy ? "Working…" : fee ? `Pay $${fee} & confirm` : "Confirm booking"} disabled={busy || !agreed} onPress={confirm} />
    </>
  ) : undefined;

  return (
    <Screen title={group ? group.title : headings[step - 1][0]} subtitle={group ? "Tap an option to pick a time" : headings[step - 1][1]} scrollRef={scroll} footer={footer}
      back={step === 3 ? () => setDetails(false) : step === 2 ? reset : group ? () => setOpen(null) : undefined}
      below={<Steps steps={STEPS} current={step} />}>
      {step === 1 && !group && (
        <View style={{ gap: GAP }}>
          <PhotoTile large height={190} src={img.pinkLaugh.src} badge="Free" title="Not sure? Start with a chat" hint="15-minute consultation  →" onPress={() => setServiceId(59433565)} />
          <Tile col={lead} height={230} onPress={() => setOpen(lead.slug)} />
          {/* Two uneven columns, so the board staggers like a pin grid. */}
          <Cols>
            {[0, 1].map((side) => (
              <Col key={side}>
                {others.filter((_, i) => i % 2 === side).map((col, i) => <Tile key={col.slug} col={col} height={(i + side) % 2 ? 180 : 230} onPress={() => setOpen(col.slug)} />)}
              </Col>
            ))}
          </Cols>
        </View>
      )}

      {group && (
        <>
          <PhotoTile large height={200} src={serviceImage[group.slug].src} title={group.title} hint={group.blurb} onPress={() => router.navigate({ pathname: "/lookbook", params: { q: group.title.split(/[ ,&]+/)[0] } })} badge="See looks" />
          {group.variants.map((x) => (
            <Press key={x.id} onPress={() => setServiceId(x.id)} style={[card, { flexDirection: "row", alignItems: "center", gap: 12, minHeight: 68 }]}>
              <View style={{ flex: 1 }}>
                <Body size={15} style={{ fontFamily: font.semi }}>{x.name}</Body>
                <Body size={12} color={c.muted}>{fmtDuration(x.mins)}{x.note ? ` · ${x.note}` : ""}</Body>
              </View>
              <Display size={22} color={c.rose}>{fmtPrice(x.price)}</Display>
            </Press>
          ))}
        </>
      )}

      {step > 1 && v && (
        <View style={[card, { backgroundColor: c.blush, gap: 4 }]}>
          <Display size={22}>{v.name}</Display>
          <Body size={13} color={c.muted}>{v.collection.title} · {fmtDuration(v.mins)}</Body>
          <Body size={14} style={{ fontFamily: font.semi }}>{fmtPrice(v.price)}{fee ? ` · $${fee} to confirm` : " · no booking fee"}</Body>
          {step === 3 && date && time && <Body size={14} style={{ fontFamily: font.semi }}>{prettyDate(date)}, {t12(time)}</Body>}
        </View>
      )}

      {step === 2 && v && (
        <>
          {!avail && !error && <ActivityIndicator color={c.rose} accessibilityLabel="Loading available times" />}
          {avail && !date && <Body>This service needs more time than a day allows online, or the diary is full. Please contact Yuwa to arrange it.</Body>}
          {avail && date && <SlotPicker days={avail.days} date={date} time={time} onDate={(d) => { setDate(d); setTime(null); }} onTime={(t) => { setTime(t); setError(""); }} />}
          {problem}
          {!!error && !avail && <Button title="Try again" onPress={() => load(v.id)} />}
        </>
      )}

      {step === 3 && v && (
        <>
          <Label size={11} color={c.rose}>Your details</Label>
          <Field label="Full name" value={form.name} onChangeText={(name) => setForm({ ...form, name })} autoComplete="name" textContentType="name" />
          <Field label="Email" value={form.email} onChangeText={(email) => setForm({ ...form, email })} autoComplete="email" keyboardType="email-address" autoCapitalize="none" />
          <Field label="Mobile" value={form.phone} onChangeText={(phone) => setForm({ ...form, phone })} autoComplete="tel" keyboardType="phone-pad" />
          <Field label="Extension colour (optional)" value={form.extensionColour} onChangeText={(extensionColour) => setForm({ ...form, extensionColour })} />
          <Field label="Notes (optional)" placeholder="Current style, anything we should know" value={form.notes} onChangeText={(notes) => setForm({ ...form, notes })} multiline />
          {fee > 0 && (
            <View style={{ backgroundColor: c.butter, borderRadius: radius.card, padding: 18, gap: 6 }}>
              <Poster size={28} color={c.ink}>Fee &amp; cancelling</Poster>
              {feeSummary.map((line) => <Body key={line} size={13}>• {line}</Body>)}
            </View>
          )}
          <Press onPress={() => { setAgreed(!agreed); setError(""); }} accessibilityRole="checkbox" accessibilityState={{ checked: agreed }}
            style={{ flexDirection: "row", gap: 12, minHeight: 44 }}>
            <View style={{ width: 26, height: 26, borderRadius: 8, borderWidth: 2, borderColor: c.rose, backgroundColor: agreed ? c.rose : "transparent", alignItems: "center", justifyContent: "center" }}>
              {agreed && <Label size={12} color={c.white}>✓</Label>}
            </View>
            <Body size={13} style={{ flex: 1 }}>I agree to the Terms &amp; Conditions and Privacy Policy{fee ? `, including the $${fee} booking fee and the ${policy.freeChangeHours}-hour cancellation rule` : ""}.</Body>
          </Press>
          <LegalLinks />
        </>
      )}
    </Screen>
  );
}
