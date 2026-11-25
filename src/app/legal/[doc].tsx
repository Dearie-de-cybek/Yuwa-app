import { useLocalSearchParams } from "expo-router";
import { View } from "react-native";
import { Screen, goBack } from "@/components/screen";
import { Body, Display, Label } from "@/components/ui";
import { legalDocs, legalIsDraft } from "@/content/legal";
import { policy } from "@/content/policy";
import { c } from "@/theme";

export default function Legal() {
  const { doc } = useLocalSearchParams<{ doc: string }>();
  const page = doc === "privacy" ? legalDocs.privacy : legalDocs.terms;
  return (
    <Screen title={page.title} subtitle={`Version ${policy.version}`} back={goBack} standalone>
      {legalIsDraft && <Body size={13} style={{ backgroundColor: c.butter, padding: 14, borderRadius: 18 }}>Draft. Yuwa&apos;s legal business details and a legal review are still to come.</Body>}
      <Body>{page.intro}</Body>
      {page.sections.map((s, i) => (
        <View key={s.heading} style={{ gap: 8, marginTop: 8 }}>
          <Label size={10} color={c.rose}>{i + 1} of {page.sections.length}</Label>
          <Display size={22} accessibilityRole="header">{s.heading}</Display>
          {s.body.map((p) => <Body key={p}>{p}</Body>)}
        </View>
      ))}
    </Screen>
  );
}
