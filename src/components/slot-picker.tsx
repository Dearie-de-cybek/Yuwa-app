// Date strip plus start times, used to book and to reschedule.
import { ScrollView, View } from "react-native";
import { dateParts, prettyDate, t12 } from "@/lib/format";
import { c, radius } from "@/theme";
import { Chip, Display, Label, Press } from "./ui";

type Props = { days: Record<string, string[]>; date: string | null; time: string | null; onDate: (d: string) => void; onTime: (t: string) => void };

export function SlotPicker({ days, date, time, onDate, onTime }: Props) {
  return (
    <>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
        {Object.keys(days).map((d) => {
          const p = dateParts(d);
          const on = d === date;
          return (
            <Press key={d} onPress={() => onDate(d)} accessibilityLabel={prettyDate(d)} accessibilityState={{ selected: on }}
              style={{ width: 66, paddingVertical: 12, alignItems: "center", borderRadius: radius.pill, backgroundColor: on ? c.ink : c.blush }}>
              <Label size={10} color={on ? c.butter : c.muted}>{p.dow}</Label>
              <Display size={26} color={on ? c.porcelain : c.ink}>{p.day}</Display>
              <Label size={9} color={on ? c.porcelain : c.muted}>{p.month}</Label>
            </Press>
          );
        })}
      </ScrollView>
      {date && days[date] && (
        <>
          <Label size={11}>Start time (Adelaide)</Label>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
            {days[date].map((t) => <Chip key={t} title={t12(t)} active={time === t} onPress={() => onTime(t)} />)}
          </View>
        </>
      )}
    </>
  );
}
