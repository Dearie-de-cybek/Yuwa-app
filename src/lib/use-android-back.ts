import { useFocusEffect } from "expo-router";
import { useCallback, useRef } from "react";
import { BackHandler, Platform } from "react-native";

/** While `active`, Android's back button steps back inside the screen instead of leaving it. */
export function useAndroidBack(active: boolean, back: () => void) {
  const latest = useRef(back);
  latest.current = back;
  useFocusEffect(useCallback(() => {
    if (!active || Platform.OS !== "android") return;
    const sub = BackHandler.addEventListener("hardwareBackPress", () => { latest.current(); return true; });
    return () => sub.remove();
  }, [active]));
}
