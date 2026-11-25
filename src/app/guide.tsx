import { router } from "expo-router";
import { View } from "react-native";
import { Numbered, Row, Section, card } from "@/components/blocks";
import { Screen, goBack } from "@/components/screen";
import { Body, Button, Photo } from "@/components/ui";
import { feeSummary, policy } from "@/content/policy";
import { chapters } from "@/content/story";
import { c } from "@/theme";

export default function Guide() {
  return (
    <Screen title="How it works" subtitle="Booking, fees and your visit" back={goBack} standalone
      footer={<Button title="Start booking  →" onPress={() => router.navigate("/book")} />}>
      <Section title="Booking" />
      <View style={card}>
        <Numbered items={[
          ["Choose a style", "Open the Book tab and pick a service. Prices and durations are listed."],
          ["Pick a time", "Only open times are shown, in Adelaide time."],
          ["Confirm", `Add your details and pay the $${policy.bookingFee} booking fee. The free consultation has no fee.`],
          ["Prepare", "Tick off the prep list in My visits."],
        ]} />
      </View>
      <Section title="Fee and cancelling" />
      <View style={[card, { backgroundColor: c.butter, borderColor: c.butter, gap: 8 }]}>
        {feeSummary.map((s) => <Body key={s} size={14}>• {s}</Body>)}
      </View>
      <Section title="A day in the chair" />
      {chapters.map((ch) => (
        <Row key={ch.when} title={`${ch.when}: ${ch.title} ${ch.accent}`} hint={ch.body}
          leading={<Photo src={ch.image.src} alt="" width={200} style={{ width: 56, height: 72, borderRadius: 14 }} />} />
      ))}
    </Screen>
  );
}
