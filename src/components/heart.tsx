import Svg, { Path } from "react-native-svg";
import { useStore } from "@/lib/store";
import { c } from "@/theme";
import { Press } from "./ui";

export function Heart({ id, title }: { id: string; title: string }) {
  const { saved, toggleSaved } = useStore();
  const on = saved.includes(id);
  return (
    <Press onPress={() => toggleSaved(id)} accessibilityLabel={`${on ? "Remove" : "Save"} ${title}`} accessibilityState={{ selected: on }}
      style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: on ? c.rose : c.porcelain, alignItems: "center", justifyContent: "center" }}>
      <Svg width={22} height={22} viewBox="0 0 24 24">
        <Path d="M12 20s-8-4.8-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 9c0 6.2-8 11-8 11Z" fill={on ? c.white : "none"} stroke={on ? c.white : c.rose} strokeWidth={2} />
      </Svg>
    </Press>
  );
}
