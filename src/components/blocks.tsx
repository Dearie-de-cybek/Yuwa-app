// Small building blocks that give the user direction: section titles, list rows, tips, steps and status.
import type { ReactNode } from "react";
import { TextInput, View, type TextInputProps } from "react-native";
import type { Status } from "@/lib/api";
import { useStore } from "@/lib/store";
import { c, font, radius } from "@/theme";
import { Icon, type IconName } from "./icon";
import { Body, Display, Label, Press } from "./ui";

export const card = { borderRadius: 22, backgroundColor: c.white, borderWidth: 1.5, borderColor: c.blush, padding: 16 } as const;

export function Section({ title, action, onAction }: { title: string; action?: string; onAction?: () => void }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 8, minHeight: 32 }}>
      <Display size={22} accessibilityRole="header">{title}</Display>
      {action && onAction && (
        <Press onPress={onAction} accessibilityRole="link" style={{ minHeight: 44, justifyContent: "center", paddingLeft: 12 }}>
          <Label size={11} color={c.rose}>{action} →</Label>
        </Press>
      )}
    </View>
  );
}

export function Row({ title, hint, icon, leading, trailing, onPress }: { title: string; hint?: string; icon?: IconName; leading?: ReactNode; trailing?: ReactNode; onPress?: () => void }) {
  const body = (
    <>
      {leading ?? (icon && <View style={{ width: 44, height: 44, borderRadius: 14, backgroundColor: c.blush, alignItems: "center", justifyContent: "center" }}><Icon name={icon} color={c.rose} size={22} /></View>)}
      <View style={{ flex: 1 }}>
        <Body size={15} style={{ fontFamily: font.semi }}>{title}</Body>
        {!!hint && <Body size={12} color={c.muted}>{hint}</Body>}
      </View>
      {trailing ?? (onPress && <Icon name="next" color={c.muted} size={18} />)}
    </>
  );
  const style = [card, { flexDirection: "row", alignItems: "center", gap: 12, padding: 12, minHeight: 68 }] as const;
  return onPress ? <Press onPress={onPress} style={[...style]}>{body}</Press> : <View style={[...style]}>{body}</View>;
}

/** A one-off hint. Once dismissed it stays dismissed. */
export function Tip({ id, children }: { id: string; children: string }) {
  const { tips, dismissTip } = useStore();
  if (tips.includes(id)) return null;
  return (
    <View style={{ flexDirection: "row", gap: 12, alignItems: "center", backgroundColor: c.butter, borderRadius: 18, paddingLeft: 14 }}>
      <Icon name="info" size={20} />
      <Body size={13} style={{ flex: 1, paddingVertical: 12 }}>{children}</Body>
      <Press onPress={() => dismissTip(id)} accessibilityLabel="Dismiss tip" style={{ minWidth: 60, minHeight: 48, alignItems: "center", justifyContent: "center" }}>
        <Label size={10}>Got it</Label>
      </Press>
    </View>
  );
}

export function Steps({ steps, current }: { steps: string[]; current: number }) {
  return (
    <View accessible accessibilityLabel={`Step ${current} of ${steps.length}: ${steps[current - 1]}`} style={{ flexDirection: "row", gap: 8, paddingHorizontal: 16, paddingTop: 12 }}>
      {steps.map((s, i) => (
        <View key={s} style={{ flex: 1, gap: 6 }}>
          <View style={{ height: 5, borderRadius: radius.pill, backgroundColor: i < current ? c.rose : c.blush }} />
          <Label size={9} color={i + 1 === current ? c.ink : c.muted} numberOfLines={1}>{i + 1}. {s}</Label>
        </View>
      ))}
    </View>
  );
}

export function Numbered({ items }: { items: (readonly [string, string])[] }) {
  return (
    <View style={{ gap: 14 }}>
      {items.map(([title, text], i) => (
        <View key={title} style={{ flexDirection: "row", gap: 12 }}>
          <View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: c.rose, alignItems: "center", justifyContent: "center" }}><Label size={12} color={c.white}>{i + 1}</Label></View>
          <View style={{ flex: 1 }}>
            <Body size={15} style={{ fontFamily: font.semi }}>{title}</Body>
            <Body size={13} color={c.muted}>{text}</Body>
          </View>
        </View>
      ))}
    </View>
  );
}

const statuses: Record<Status | "done", [string, string, string]> = {
  confirmed: ["Confirmed", c.ink, c.porcelain], pending: ["Pay to confirm", c.butter, c.ink], cancelled: ["Cancelled", c.blush, c.berry],
  expired: ["Not paid", c.blush, c.berry], done: ["Done", c.blush, c.ink],
};
export function StatusPill({ status }: { status: Status | "done" }) {
  const [text, bg, fg] = statuses[status];
  return <View style={{ alignSelf: "flex-start", backgroundColor: bg, borderRadius: radius.pill, paddingHorizontal: 10, paddingVertical: 4 }}><Label size={9} color={fg}>{text}</Label></View>;
}

export function Field({ label, ...p }: TextInputProps & { label: string }) {
  return (
    <View>
      <Label size={11}>{label}</Label>
      <TextInput accessibilityLabel={label} placeholderTextColor={c.muted} {...p}
        style={{ fontFamily: font.body, fontSize: 16, color: c.ink, minHeight: p.multiline ? 80 : 48, marginTop: 6, paddingHorizontal: 16, paddingVertical: 12, borderRadius: 18, backgroundColor: c.white, borderWidth: 1.5, borderColor: c.dusty, textAlignVertical: p.multiline ? "top" : "center" }} />
    </View>
  );
}
