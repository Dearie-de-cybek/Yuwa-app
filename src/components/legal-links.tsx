import { router } from "expo-router";
import { View } from "react-native";
import { c } from "@/theme";
import { Label, Press } from "./ui";

export function LegalLinks({ color = c.berry }: { color?: string }) {
  return (
    <View style={{ flexDirection: "row", justifyContent: "center", gap: 20 }}>
      {([["terms", "Terms"], ["privacy", "Privacy"]] as const).map(([doc, label]) => (
        <Press key={doc} accessibilityRole="link" onPress={() => router.push({ pathname: "/legal/[doc]", params: { doc } })}
          style={{ minHeight: 44, justifyContent: "center", paddingHorizontal: 8 }}>
          <Label size={11} color={color} style={{ textDecorationLine: "underline" }}>{label}</Label>
        </Press>
      ))}
    </View>
  );
}
