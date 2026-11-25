// The animated booking sticker from the website: a spinning ring around a braid that keeps braiding (lipstick for makeup).
import { useEffect, useState } from "react";
import { AccessibilityInfo, Animated, Easing, Platform, View } from "react-native";
import Svg, { Circle, Defs, G, Path, Rect, Text, TextPath } from "react-native-svg";
import { c, font } from "@/theme";

const P = 72;
const COLOURS = [c.rose, c.berry, c.pink];
const pieces = COLOURS.flatMap((colour, s) => {
  const phase = (s * 2 * Math.PI) / 3;
  return Array.from({ length: 16 }, (_, i) => {
    const from = ((i - 4) * Math.PI) / 2;
    const d = Array.from({ length: 13 }, (_, j) => {
      const a = from + (j / 12) * (Math.PI / 2);
      return `${j ? "L" : "M"}${(38 + 15 * Math.sin(a)).toFixed(2)} ${(((a - phase) / (2 * Math.PI)) * P + 8).toFixed(2)}`;
    }).join("");
    return { key: `${s}-${i}`, d, colour, over: Math.sin(2 * from + Math.PI / 2) > 0 };
  });
}).sort((a, b) => Number(a.over) - Number(b.over));

export function useReduceMotion() {
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setReduce);
    const sub = AccessibilityInfo.addEventListener("reduceMotionChanged", setReduce);
    return () => sub.remove();
  }, []);
  return reduce;
}

/** 0 -> 1, forever. Holds still when the user asks for reduced motion. */
export function useLoop(duration: number) {
  const [v] = useState(() => new Animated.Value(0));
  const reduce = useReduceMotion();
  useEffect(() => {
    if (reduce) { v.setValue(0); return; }
    const a = Animated.loop(Animated.timing(v, { toValue: 1, duration, easing: Easing.linear, useNativeDriver: Platform.OS !== "web" }));
    a.start();
    return () => a.stop();
  }, [reduce, duration, v]);
  return v;
}

export function Sticker({ kind = "braid", size = 112 }: { kind?: "braid" | "makeup"; size?: number }) {
  const spin = useLoop(18000);
  const flow = useLoop(3600);
  const k = size / 120;
  const disc = 76 * k; // inner butter disc
  const fill = { position: "absolute" as const, width: size, height: size };

  return (
    <View aria-hidden importantForAccessibility="no-hide-descendants" style={{ width: size, height: size }}>
      <Animated.View style={[fill, { transform: [{ rotate: spin.interpolate({ inputRange: [0, 1], outputRange: ["0deg", "360deg"] }) }] }]}>
        <Svg width={size} height={size} viewBox="0 0 120 120">
          <Defs><Path id="ring" d="M60 60 m0 -45.5 a45.5 45.5 0 1 1 0 91 a45.5 45.5 0 1 1 0 -91" /></Defs>
          <Circle cx="60" cy="60" r="56" fill={c.ink} />
          <Text fill={c.porcelain} fontSize="10.5" fontFamily={font.bold} letterSpacing="1">
            {/* textLength matches the ring's circumference so the words never run over themselves. */}
            <TextPath href="#ring" textLength="283">YOUR MOMENT ✿ YUWA ✿ YOUR MOMENT ✿ YUWA ✿</TextPath>
          </Text>
        </Svg>
      </Animated.View>
      <View style={{ position: "absolute", left: (size - disc) / 2, top: (size - disc) / 2, width: disc, height: disc, borderRadius: disc / 2, overflow: "hidden", backgroundColor: c.butter }}>
        {kind === "makeup" ? (
          <Svg width={disc} height={disc} viewBox="22 22 76 76">
            <Path d="M34 79 C46 68 56 90 68 80 S82 70 88 76" fill="none" stroke={c.rose} strokeWidth="6" strokeLinecap="round" />
            <G>
              <Path d="M52 47 V36 Q52 31 57 29 L68 24 V47 Z" fill={c.rose} />
              <Rect x="50" y="46" width="20" height="9" rx="2" fill={c.pink} />
              <Rect x="47" y="54" width="26" height="19" rx="4" fill={c.berry} />
            </G>
          </Svg>
        ) : (
          // Taller than the disc by one braid repeat, then slid up by exactly one repeat for a seamless loop.
          <Animated.View style={{ transform: [{ translateY: flow.interpolate({ inputRange: [0, 1], outputRange: [0, -P * k] }) }] }}>
            <Svg width={disc} height={disc + P * k} viewBox={`0 0 76 ${76 + P}`}>
              {pieces.map((p) => (
                <G key={p.key}>
                  <Path d={p.d} stroke={c.butter} strokeWidth="16" fill="none" />
                  <Path d={p.d} stroke={p.colour} strokeWidth="11.5" strokeLinecap="round" fill="none" />
                </G>
              ))}
            </Svg>
          </Animated.View>
        )}
      </View>
    </View>
  );
}
