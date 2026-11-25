// Launch screen. It starts exactly like the native splash (mark centred on pink), then brings in the name and fades away.
import { useEffect, useState } from "react";
import { Animated, Easing, Platform, StyleSheet } from "react-native";
import { useStore } from "@/lib/store";
import { c } from "@/theme";
import { Mark } from "./logo";
import { useReduceMotion } from "./sticker";
import { Display, Italic, Poster } from "./ui";

const native = Platform.OS !== "web";
const out = Easing.bezier(0.23, 1, 0.32, 1);

export function Splash() {
  const { ready } = useStore();
  const reduce = useReduceMotion();
  const [gone, setGone] = useState(false);
  const [words] = useState(() => new Animated.Value(0));
  const [fade] = useState(() => new Animated.Value(1));

  useEffect(() => {
    Animated.timing(words, { toValue: 1, duration: reduce ? 0 : 550, delay: reduce ? 0 : 200, easing: out, useNativeDriver: native }).start();
  }, [words, reduce]);

  // Leave once the saved data has loaded, after a beat long enough to read.
  useEffect(() => {
    if (!ready) return;
    const wait = setTimeout(() => {
      Animated.timing(fade, { toValue: 0, duration: 280, easing: out, useNativeDriver: native }).start(() => setGone(true));
    }, 1300);
    return () => clearTimeout(wait);
  }, [ready, fade]);

  if (gone) return null;
  const rise = { opacity: words, transform: [{ translateY: words.interpolate({ inputRange: [0, 1], outputRange: [14, 0] }) }] };
  return (
    <Animated.View accessibilityLabel="Yuwa Hair World is opening" style={[StyleSheet.absoluteFill, { backgroundColor: c.rose, alignItems: "center", justifyContent: "center", opacity: fade, zIndex: 10 }]}>
      <Mark size={160} inverted />
      <Animated.View style={[{ position: "absolute", top: "50%", marginTop: 108, alignItems: "center" }, rise]}>
        <Poster size={64} color={c.white}>Yuwa</Poster>
        <Display size={20} color={c.butter}><Italic color={c.butter}>your beauty, your moment</Italic></Display>
      </Animated.View>
    </Animated.View>
  );
}
