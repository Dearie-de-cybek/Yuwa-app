import { View } from "react-native";
import Svg, { Circle, Path } from "react-native-svg";
import { c, font } from "@/theme";
import { Label, Poster } from "./ui";

/** Two strands meet as a Y and braid down the stem. Same drawing as the website logo. `inverted` suits pink grounds. */
export function Mark({ size = 48, inverted = false }: { size?: number; inverted?: boolean }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48">
      <Circle cx="24" cy="24" r="24" fill={inverted ? c.porcelain : c.rose} />
      <Path d="M35 11C34 19 29 21 24 25S18 33 24 35S28 39 24 41" stroke={inverted ? c.berry : c.butter} strokeWidth={4.2} strokeLinecap="round" fill="none" />
      <Path d="M13 11C14 19 19 21 24 25S30 33 24 35S20 39 24 41" stroke={inverted ? c.rose : c.porcelain} strokeWidth={4.2} strokeLinecap="round" fill="none" />
    </Svg>
  );
}

export function Logo({ light = false, size = 44 }: { light?: boolean; size?: number }) {
  return (
    <View accessible accessibilityLabel="Yuwa Hair World" style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
      <Mark size={size} />
      <View>
        <Poster size={size * 0.82} color={light ? c.white : c.rose} style={{ lineHeight: size * 0.98, fontFamily: font.poster }}>Yuwa</Poster>
        <Label size={size * 0.19} color={light ? c.butter : c.berry} style={{ letterSpacing: size * 0.06 }}>Hair World</Label>
      </View>
    </View>
  );
}
