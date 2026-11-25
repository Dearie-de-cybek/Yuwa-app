// The booking summary as a till slip, matching the website card.
import { useState } from "react";
import { View } from "react-native";
import Svg, { Path } from "react-native-svg";
import { feeFor, policy } from "@/content/policy";
import { findVariant, fmtDuration, fmtPrice } from "@/content/services";
import type { Payment } from "@/lib/api";
import { c, font } from "@/theme";
import { Logo } from "./logo";
import { Sticker } from "./sticker";
import { Body, DashLine, Display, Italic, Label, Poster } from "./ui";

function Torn({ width, flip }: { width: number; flip?: boolean }) {
  const n = Math.max(1, Math.round(width / 16));
  const w = width / n;
  const d = `M0 8 ${Array.from({ length: n }, (_, i) => `L${(i + 0.5) * w} 0 L${(i + 1) * w} 8`).join(" ")} Z`;
  return (
    <Svg width={width} height={8} style={flip ? { transform: [{ scaleY: -1 }] } : undefined}>
      <Path d={d} fill={c.blush} />
    </Svg>
  );
}

const Rule = () => <DashLine style={{ marginVertical: 16 }} />;

const Line = ({ label, value }: { label: string; value: string }) => (
  <View style={{ flexDirection: "row", alignItems: "flex-end", gap: 8, marginBottom: 10 }}>
    <Label size={11}>{label}</Label>
    <DashLine dots style={{ flex: 1, minWidth: 12, marginBottom: 4 }} />
    <Body size={14} selectable style={{ fontFamily: font.semi, maxWidth: "65%", textAlign: "right" }}>{value}</Body>
  </View>
);

// Decorative bars only. It encodes nothing.
const Barcode = () => (
  <View aria-hidden style={{ flexDirection: "row", justifyContent: "center", height: 34, gap: 2.5, overflow: "hidden" }}>
    {Array.from({ length: 40 }, (_, i) => <View key={i} style={{ width: [1, 3, 1, 2, 4, 1, 2][(i * 5) % 7], backgroundColor: c.ink }} />)}
  </View>
);

const feeNote: Record<Payment, string> = {
  none: "Not charged", due: "Due now", paid: "Paid", refunded: "Refunded", kept: "Kept as cancellation fee", refund_failed: "Refund pending",
};

type Props = { serviceId: number; when: string; reference?: string; payment?: Payment; heading?: string };

export function Receipt({ serviceId, when, reference, payment = "due", heading = "Your booking" }: Props) {
  const [width, setWidth] = useState(0);
  const v = findVariant(serviceId);
  if (!v) return null;
  const fee = feeFor(v.price);
  return (
    <View onLayout={(e) => setWidth(e.nativeEvent.layout.width)} style={{ marginTop: 34 }}>
      {width > 0 && <Torn width={width} />}
      <View style={{ backgroundColor: c.blush, paddingHorizontal: 22, paddingTop: 20, paddingBottom: 18 }}>
        <Logo size={40} />
        <Label size={11} color={c.rose} style={{ marginTop: 14 }}>{heading}</Label>
        <Rule />
        <Display size={28}>{v.name}</Display>
        <Body size={13} color={c.muted} style={{ marginBottom: 14 }}>{v.collection.title}</Body>
        <Line label="Duration" value={fmtDuration(v.mins)} />
        <Line label="When" value={when} />
        {reference && <Line label="Ref" value={reference} />}
        <Rule />
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 12 }}>
          <Poster size={30} color={c.ink}>Price</Poster>
          <Display size={v.price ? 34 : 24} color={c.rose}>{fmtPrice(v.price)}</Display>
        </View>
        {fee > 0 ? (
          <>
            <Line label="Booking fee" value={`$${fee} · ${feeNote[payment]}`} />
            <Line label="Pay later" value={v.price === null ? "Set by Yuwa" : `$${v.price - fee}`} />
          </>
        ) : <Body size={12} style={{ fontFamily: font.semi, textAlign: "right" }}>No booking fee</Body>}
        <Rule />
        <Body size={12} color={c.muted} style={{ textAlign: "center" }}>
          {fee > 0 ? `Fee refunded if you cancel ${policy.freeChangeHours} hours or more before. ` : ""}A 15% surcharge applies on public holidays. Final price is confirmed by Yuwa.
        </Body>
        <Rule />
        <Barcode />
        <Italic style={{ textAlign: "center", fontSize: 18, marginTop: 10 }}>See you in the chair</Italic>
      </View>
      {width > 0 && <Torn width={width} flip />}
      <View style={{ position: "absolute", right: -6, top: -34 }}>
        <Sticker kind={v.collection.slug === "makeup" ? "makeup" : "braid"} size={104} />
      </View>
    </View>
  );
}
