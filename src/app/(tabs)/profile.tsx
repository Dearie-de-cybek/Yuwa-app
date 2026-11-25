// Profile lives on this phone: there are no accounts yet, and the screen says so.
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Switch, View } from "react-native";
import { Board, Col, Cols, ColourTile } from "@/components/bento";
import { Field, Row, Section, card } from "@/components/blocks";
import { Icon } from "@/components/icon";
import { Screen, initials } from "@/components/screen";
import { Body, Button, Display } from "@/components/ui";
import { site } from "@/content/site";
import { work } from "@/content/work";
import { useStore } from "@/lib/store";
import { isUpcoming } from "@/lib/visits";
import { c, font } from "@/theme";

const legal = (doc: "terms" | "privacy") => router.push({ pathname: "/legal/[doc]", params: { doc } });

export default function Profile() {
  const { contact, setContact, visits, saved, reminders, setReminders, clearAll } = useStore();
  const [form, setForm] = useState(contact);
  const [note, setNote] = useState("");
  const [clearing, setClearing] = useState(false);
  useEffect(() => { setForm(contact); }, [contact]);

  const upcoming = visits.filter(isUpcoming).length;
  const changed = form.name !== contact.name || form.email !== contact.email || form.phone !== contact.phone;

  function save() {
    const email = form.email.trim();
    if (email && !/^\S+@\S+\.\S+$/.test(email)) return setNote("That email doesn't look right.");
    if (form.phone.trim() && form.phone.replace(/\D/g, "").length < 8) return setNote("That mobile number looks too short.");
    setContact({ name: form.name.trim(), email, phone: form.phone.trim() });
    setNote("Saved. We'll fill these in when you book.");
  }

  return (
    <Screen title="Profile" subtitle="Saved on this phone" right={<View style={{ width: 44 }} />}>
      <View>
        <Board photos={(saved.length ? work.filter((w) => saved.includes(w.id)) : [work[10], work[5], work[18]]).map((w) => w.src!)} height={160} />
        <View style={{ alignItems: "center", marginTop: -40, gap: 4 }}>
          <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: c.rose, borderWidth: 4, borderColor: c.porcelain, alignItems: "center", justifyContent: "center" }}>
            <Display size={30} color={c.white}>{initials(contact.name) || "Y"}</Display>
          </View>
          <Display size={26}>{contact.name || "Your profile"}</Display>
        </View>
      </View>
      <Cols>
        <Col><ColourTile tone="ink" height={118} title={`${upcoming} upcoming`} hint="My visits  →" onPress={() => router.navigate("/visits")} art={<Icon name="receipt" color={c.butter} />} /></Col>
        <Col><ColourTile tone="butter" height={118} title={`${saved.length} saved`} hint="Saved looks  →" onPress={() => router.navigate({ pathname: "/lookbook", params: { filter: "Saved" } })} art={<Icon name="heart" color={c.rose} />} /></Col>
      </Cols>

      <Section title="Your details" />
      <Field label="Full name" value={form.name} onChangeText={(name) => { setForm({ ...form, name }); setNote(""); }} autoComplete="name" />
      <Field label="Email" value={form.email} onChangeText={(email) => { setForm({ ...form, email }); setNote(""); }} autoComplete="email" keyboardType="email-address" autoCapitalize="none" />
      <Field label="Mobile" value={form.phone} onChangeText={(phone) => { setForm({ ...form, phone }); setNote(""); }} autoComplete="tel" keyboardType="phone-pad" />
      {!!note && <Body size={13} accessibilityRole="alert" style={{ fontFamily: font.semi }} color={note.startsWith("Saved") ? c.ink : c.rose}>{note}</Body>}
      <Button title="Save details" disabled={!changed} onPress={save} />

      <Section title="Settings" />
      <Row icon="bell" title="Appointment reminders" hint="The day before, on this phone"
        trailing={<Switch accessibilityLabel="Appointment reminders" value={reminders} onValueChange={setReminders} trackColor={{ true: c.rose, false: c.dusty }} thumbColor={c.white} {...{ activeThumbColor: c.white }} />} />

      <Section title="Help" />
      <Row icon="info" title="How booking and fees work" onPress={() => router.push("/guide")} />
      <Row icon="replay" title="Replay the intro" onPress={() => router.push("/welcome")} />
      <Row icon="doc" title="Terms & Conditions" onPress={() => legal("terms")} />
      <Row icon="doc" title="Privacy Policy" onPress={() => legal("privacy")} />
      <Row icon="chat" title="Studio" hint={site.address ? `${site.address.street}, ${site.address.suburb}` : site.addressNote} />

      <Section title="This phone" />
      {clearing ? (
        <View style={[card, { gap: 10 }]}>
          <Body size={14} style={{ fontFamily: font.semi }}>Clear your details, saved looks and bookings from this phone?</Body>
          <Body size={13} color={c.muted}>
            {upcoming ? `This does not cancel your ${upcoming} upcoming booking${upcoming > 1 ? "s" : ""}, and you will no longer be able to change ${upcoming > 1 ? "them" : "it"} here.` : "This cannot be undone."}
          </Body>
          <Button tone="ink" title="Yes, clear this phone" onPress={() => { clearAll(); setClearing(false); setNote(""); }} />
          <Button tone="blush" title="Keep my data" onPress={() => setClearing(false)} />
        </View>
      ) : <Row icon="trash" title="Clear data from this phone" onPress={() => setClearing(true)} />}
    </Screen>
  );
}
