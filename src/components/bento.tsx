// Bento tiles and Pinterest-style grids. Every tile says what tapping it does.
import { router } from "expo-router";
import { useId, useState, type ReactNode } from "react";
import { StyleSheet, TextInput, View, type TextInputProps } from "react-native";
import Svg, { Defs, LinearGradient, Rect, Stop } from "react-native-svg";
import type { WorkItem } from "@/content/work";
import { c, font, radius } from "@/theme";
import { Heart } from "./heart";
import { Icon } from "./icon";
import { Body, Display, Label, Photo, Press } from "./ui";

export const GAP = 10;
const ROUND = 24;

/** Two or more tiles side by side. Each child column takes an equal share unless given its own flex. */
export const Cols = ({ children }: { children: ReactNode }) => <View style={{ flexDirection: "row", gap: GAP }}>{children}</View>;
export const Col = ({ children, flex = 1 }: { children: ReactNode; flex?: number }) => <View style={{ flex, gap: GAP }}>{children}</View>;

/** Darkens the foot of a photo so words on it stay readable. */
function Scrim() {
  const id = `scrim${useId().replace(/\W/g, "")}`;
  return (
    <Svg style={StyleSheet.absoluteFill} width="100%" height="100%" pointerEvents="none">
      <Defs>
        <LinearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0.3" stopColor={c.ink} stopOpacity="0" />
          <Stop offset="0.72" stopColor={c.ink} stopOpacity="0.68" />
          <Stop offset="1" stopColor={c.ink} stopOpacity="0.94" />
        </LinearGradient>
      </Defs>
      <Rect width="100%" height="100%" fill={`url(#${id})`} />
    </Svg>
  );
}

type PhotoTileProps = {
  src: string; title: string; hint?: string; badge?: string; height: number; onPress: () => void;
  large?: boolean; children?: ReactNode;
};

export function PhotoTile({ src, title, hint, badge, height, onPress, large, children }: PhotoTileProps) {
  return (
    <Press onPress={onPress} accessibilityLabel={[badge, title, hint].filter(Boolean).join(". ")}
      style={{ height, borderRadius: ROUND, overflow: "hidden", backgroundColor: c.dusty }}>
      <Photo src={src} alt="" width={large ? 900 : 500} top={large && height < 240 ? "24%" : "50%"} style={StyleSheet.absoluteFill} />
      <Scrim />
      {!!badge && (
        <View style={{ position: "absolute", top: 12, left: 12, backgroundColor: c.butter, borderRadius: radius.pill, paddingHorizontal: 10, paddingVertical: 5 }}>
          <Label size={9}>{badge}</Label>
        </View>
      )}
      <View style={{ position: "absolute", left: 14, right: 14, bottom: 12, gap: 4 }}>
        <Display size={large ? 30 : 19} color={c.white} numberOfLines={3}>{title}</Display>
        {!!hint && <Body size={12} color={c.white} style={{ fontFamily: font.semi }}>{hint}</Body>}
        {children}
      </View>
    </Press>
  );
}

type ColourTileProps = { tone: "rose" | "butter" | "ink" | "blush"; title: string; hint?: string; height: number; onPress: () => void; art?: ReactNode };
const tones = { rose: [c.rose, c.white], butter: [c.butter, c.ink], ink: [c.ink, c.porcelain], blush: [c.blush, c.ink] };

export function ColourTile({ tone, title, hint, height, onPress, art }: ColourTileProps) {
  const [bg, fg] = tones[tone];
  return (
    <Press onPress={onPress} accessibilityLabel={[title, hint].filter(Boolean).join(". ")}
      style={{ height, borderRadius: ROUND, backgroundColor: bg, padding: 14, justifyContent: "space-between", overflow: "hidden" }}>
      <View>{art}</View>
      <View>
        <Display size={20} color={fg} numberOfLines={2}>{title}</Display>
        {!!hint && <Body size={12} color={fg} numberOfLines={2}>{hint}</Body>}
      </View>
    </Press>
  );
}

/** A Pinterest-style board cover: one large photo, two stacked beside it. */
export function Board({ photos, height = 150 }: { photos: string[]; height?: number }) {
  const cell = (i: number) => (photos[i] ? <Photo src={photos[i]} alt="" width={400} style={{ flex: 1 }} /> : <View style={{ flex: 1, backgroundColor: i % 2 ? c.dusty : c.blush }} />);
  return (
    <View style={{ height, flexDirection: "row", gap: 3, borderRadius: ROUND, overflow: "hidden" }}>
      <View style={{ flex: 2 }}>{cell(0)}</View>
      <View style={{ flex: 1, gap: 3 }}>{cell(1)}{cell(2)}</View>
    </View>
  );
}

const heights = { tall: 1.47, portrait: 1.25, square: 1, landscape: 0.67 };

/** Two staggered columns; each next photo goes to whichever column is shorter. */
export function Masonry({ items }: { items: WorkItem[] }) {
  const [width, setWidth] = useState(0);
  const cols: WorkItem[][] = [[], []];
  const used = [0, 0];
  for (const w of items) { const i = used[0] <= used[1] ? 0 : 1; cols[i].push(w); used[i] += heights[w.ratio]; }
  return (
    <Cols>
      {cols.map((col, i) => (
        <View key={i} style={{ flex: 1, gap: GAP }} onLayout={i === 0 ? (e) => setWidth(e.nativeEvent.layout.width) : undefined}>
          {col.map((w) => (
            <View key={w.id}>
              <Press onPress={() => router.push({ pathname: "/look/[id]", params: { id: w.id } })} accessibilityLabel={`View ${w.title}`}>
                <Photo src={w.src!} alt={w.alt} width={500} style={{ height: (width || 170) * heights[w.ratio], borderRadius: 20 }} />
              </Press>
              <View style={{ position: "absolute", right: 8, top: 8 }}><Heart id={w.id} title={w.title} /></View>
              <Body size={12} numberOfLines={1} style={{ marginTop: 6, marginLeft: 6, fontFamily: font.semi }}>{w.title}</Body>
            </View>
          ))}
        </View>
      ))}
    </Cols>
  );
}

export function SearchBar(p: TextInputProps) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 10, backgroundColor: c.blush, borderRadius: radius.pill, paddingHorizontal: 16, minHeight: 48 }}>
      <Icon name="search" size={20} color={c.berry} />
      <TextInput accessibilityLabel="Search styles" placeholder="Search styles, e.g. cornrows" placeholderTextColor={c.muted} returnKeyType="search" autoCorrect={false} {...p}
        style={{ flex: 1, fontFamily: font.body, fontSize: 15, color: c.ink, paddingVertical: 12 }} />
    </View>
  );
}
