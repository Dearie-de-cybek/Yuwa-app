// Shared type and controls: the same three voices as the website (display serif, poster caps, body).
import { Image } from "expo-image";
import * as Haptics from "expo-haptics";
import { useRef, type ReactNode } from "react";
import { Animated, Platform, Pressable, Text, View, type PressableProps, type StyleProp, type TextProps, type ViewStyle } from "react-native";
import Svg, { Line } from "react-native-svg";
import { photo } from "@/lib/api";
import { c, font, radius } from "@/theme";

type T = TextProps & { size?: number; color?: string };
// Phones clip tall or deep glyphs when the line is tighter than the font's own height; browsers don't.
const line = (web: number, device: number) => (Platform.OS === "web" ? web : device);

export const Display = ({ size = 40, color = c.ink, style, ...p }: T) => (
  <Text maxFontSizeMultiplier={1.3} {...p} style={[{ fontFamily: font.display, fontSize: size, lineHeight: size * line(1.08, 1.24), letterSpacing: -size * 0.02, color }, style]} />
);
export const Italic = ({ style, color = c.rose, ...p }: TextProps & { color?: string }) => <Text {...p} style={[{ fontFamily: font.italic, color }, style]} />;
export const Poster = ({ size = 48, color = c.rose, style, ...p }: T) => (
  <Text maxFontSizeMultiplier={1.3} {...p} style={[{ fontFamily: font.poster, fontSize: size, lineHeight: size * line(1.02, 1.2), textTransform: "uppercase", color }, style]} />
);
export const Label = ({ size = 12, color = c.ink, style, ...p }: T) => (
  <Text maxFontSizeMultiplier={1.4} {...p} style={[{ fontFamily: font.bold, fontSize: size, letterSpacing: size * 0.12, textTransform: "uppercase", color }, style]} />
);
export const Body = ({ size = 15, color = c.ink, style, ...p }: T) => (
  <Text {...p} style={[{ fontFamily: font.body, fontSize: size, lineHeight: size * 1.5, color }, style]} />
);

export const tap = () => { if (Platform.OS === "ios") Haptics.selectionAsync(); };

/** Pressable that sinks slightly under the finger. */
export function Press({ children, style, onPress, ...p }: Omit<PressableProps, "style" | "children"> & { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  const scale = useRef(new Animated.Value(1)).current;
  const to = (v: number) => Animated.timing(scale, { toValue: v, duration: 120, useNativeDriver: Platform.OS !== "web" }).start();
  return (
    <Pressable accessibilityRole="button" {...p} onPress={(e) => { tap(); onPress?.(e); }} onPressIn={() => to(0.97)} onPressOut={() => to(1)}>
      <Animated.View style={[style, { transform: [{ scale }] }]}>{children}</Animated.View>
    </Pressable>
  );
}

const buttons = {
  rose: { bg: c.rose, fg: c.white },
  butter: { bg: c.butter, fg: c.ink },
  ink: { bg: c.ink, fg: c.porcelain },
  blush: { bg: c.blush, fg: c.ink },
};

export function Button({ title, onPress, tone = "rose", disabled, style }: { title: string; onPress: () => void; tone?: keyof typeof buttons; disabled?: boolean; style?: StyleProp<ViewStyle> }) {
  const t = buttons[tone];
  return (
    <Press onPress={onPress} disabled={disabled} accessibilityState={{ disabled }}
      style={[{ minHeight: 52, borderRadius: radius.pill, backgroundColor: t.bg, alignItems: "center", justifyContent: "center", paddingHorizontal: 24, opacity: disabled ? 0.45 : 1 }, style]}>
      <Label color={t.fg} style={{ textAlign: "center" }}>{title}</Label>
    </Press>
  );
}

export function Chip({ title, active, onPress }: { title: string; active: boolean; onPress: () => void }) {
  return (
    <Press onPress={onPress} accessibilityState={{ selected: active }}
      style={{ minHeight: 44, paddingHorizontal: 18, borderRadius: radius.pill, justifyContent: "center", backgroundColor: active ? c.rose : c.blush }}>
      <Label size={11} color={active ? c.white : c.ink}>{title}</Label>
    </Press>
  );
}

/** `top` keeps faces in frame when a tall photo is cropped into a wide space. */
export function Photo({ src, alt, style, width = 800, top }: { src: string; alt: string; style?: StyleProp<ViewStyle>; width?: number; top?: string }) {
  return (
    <View style={[{ overflow: "hidden", backgroundColor: c.dusty }, style]}>
      <Image source={{ uri: photo(src, width) }} accessibilityLabel={alt} accessible={!!alt} contentFit="cover" contentPosition={top ? { top: top as `${number}%`, left: "50%" } : "center"} transition={250} style={{ width: "100%", height: "100%" }} />
    </View>
  );
}

/** A dashed or dotted rule. Drawn, because Android cannot dash a single border edge. */
export function DashLine({ dots = false, style }: { dots?: boolean; style?: StyleProp<ViewStyle> }) {
  return (
    <View style={[{ height: 2, overflow: "hidden" }, style]}>
      <Svg width="100%" height={2}>
        <Line x1="1" y1="1" x2="100%" y2="1" stroke="#6f0d3d4d" strokeWidth={dots ? 2 : 1.5} strokeDasharray={dots ? "0.1 5" : "5 4"} strokeLinecap={dots ? "round" : "butt"} />
      </Svg>
    </View>
  );
}
