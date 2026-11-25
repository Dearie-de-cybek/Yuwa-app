// First-run intro: three screens that say what the app is for, then straight in. Replayable from the profile.
import { router } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, View, useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Field } from "@/components/blocks";
import { Icon } from "@/components/icon";
import { Sticker } from "@/components/sticker";
import { Body, Button, Display, Italic, Label, Photo, Press } from "@/components/ui";
import { img } from "@/content/images";
import { policy } from "@/content/policy";
import { useStore } from "@/lib/store";
import { useAndroidBack } from "@/lib/use-android-back";
import { c } from "@/theme";

const slides = [
  { title: "Find your", accent: "next look.", text: "Browse the lookbook, save what you love and show it at your appointment." },
  { title: "Book in", accent: "three steps.", text: `Choose a style, pick an open time and confirm with a $${policy.bookingFee} booking fee that comes off your price.` },
  { title: "Stay in", accent: "control.", text: `See your prep list and reminders. Reschedule or cancel from My visits; ${policy.freeChangeHours} hours' notice keeps your fee refundable.` },
];

export default function Welcome() {
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const { contact, finishIntro } = useStore();
  const [i, setI] = useState(0);
  const [name, setName] = useState(contact.name);
  const s = slides[i];
  const last = i === slides.length - 1;
  const art = Math.min(height * 0.36, 320);
  // A replay was opened on top of the app, so just close it; replacing would stack a second copy of the tabs.
  const finish = () => { finishIntro(name); if (router.canGoBack()) router.back(); else router.replace("/"); };
  useAndroidBack(i > 0, () => setI(i - 1));

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "web" ? undefined : "padding"} style={{ flex: 1, backgroundColor: c.rose }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingTop: insets.top + 8, paddingHorizontal: 20, minHeight: insets.top + 56 }}>
        {i > 0 ? <Press onPress={() => setI(i - 1)} accessibilityLabel="Previous" style={{ width: 44, height: 44, justifyContent: "center" }}><Icon name="back" color={c.white} /></Press> : <View style={{ width: 44 }} />}
        <Press onPress={finish} style={{ minHeight: 44, justifyContent: "center", paddingLeft: 16 }}><Label color={c.white}>Skip</Label></Press>
      </View>

      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ flexGrow: 1, justifyContent: "center", paddingHorizontal: 24, gap: 18 }}>
        <View style={{ height: art, alignItems: "center", justifyContent: "center" }}>
          {i === 0 && <Photo src={img.headwrap.src} alt={img.headwrap.alt} width={600} style={{ width: art * 0.72, height: art, borderTopLeftRadius: art, borderTopRightRadius: art }} />}
          {i === 1 && <Sticker size={Math.min(art, 230)} />}
          {i === 2 && <Photo src={img.pinkLaugh.src} alt={img.pinkLaugh.alt} width={600} style={{ width: art * 0.9, height: art * 0.9, borderRadius: art }} />}
        </View>
        <View accessibilityLiveRegion="polite" style={{ alignItems: "center", gap: 10 }}>
          <Display size={40} color={c.white} style={{ textAlign: "center" }}>{s.title} <Italic color={c.butter}>{s.accent}</Italic></Display>
          <Body color={c.white} style={{ textAlign: "center" }}>{s.text}</Body>
        </View>
        {last && (
          <View style={{ backgroundColor: c.porcelain, borderRadius: 22, padding: 16 }}>
            <Field label="Your name (optional)" value={name} onChangeText={setName} autoComplete="name" placeholder="So we can say hello" />
          </View>
        )}
      </ScrollView>

      <View style={{ paddingHorizontal: 24, paddingBottom: insets.bottom + 20, gap: 18 }}>
        <View accessible accessibilityLabel={`Screen ${i + 1} of ${slides.length}`} style={{ flexDirection: "row", justifyContent: "center", gap: 8 }}>
          {slides.map((x, n) => <View key={x.accent} style={{ width: n === i ? 28 : 8, height: 8, borderRadius: 4, backgroundColor: n === i ? c.butter : c.pink }} />)}
        </View>
        <Button tone="butter" title={last ? "Get started" : "Next  →"} onPress={last ? finish : () => setI(i + 1)} />
      </View>
    </KeyboardAvoidingView>
  );
}
