import type { ColorValue } from "react-native";
import Svg, { Path } from "react-native-svg";
import { c } from "@/theme";

const paths = {
  home: "M3 11.5 12 4l9 7.5M5.5 10v10h13V10",
  heart: "M12 20s-8-4.8-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 9c0 6.2-8 11-8 11Z",
  plus: "M12 5v14M5 12h14",
  receipt: "M6 3h12v18l-2-1.5-2 1.5-2-1.5-2 1.5-2-1.5L6 21ZM9 8h6M9 12h6",
  user: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM4 21c0-4.4 3.6-7 8-7s8 2.6 8 7",
  back: "M15 5l-7 7 7 7",
  next: "M9 5l7 7-7 7",
  chat: "M4 5h16v11H9l-5 4Z",
  info: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM12 11v5M12 8v.01",
  bell: "M6 16V10a6 6 0 0 1 12 0v6l1.5 2h-15ZM10 21h4",
  doc: "M7 3h7l4 4v14H7ZM14 3v4h4M10 12h5M10 16h5",
  replay: "M5 12a7 7 0 1 0 2-5M5 4v4h4",
  trash: "M5 7h14M9 7V4h6v3M7 7l1 14h8l1-14",
  search: "M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14ZM16.5 16.5 21 21",
};
export type IconName = keyof typeof paths;

export function Icon({ name, color = c.ink, size = 24 }: { name: IconName; color?: ColorValue; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
      <Path d={paths[name]} stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </Svg>
  );
}
