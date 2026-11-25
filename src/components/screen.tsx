// Every screen has the same frame: a header that says where you are, scrolling content, and an optional pinned action.
import { router } from "expo-router";
import type { ReactNode, Ref } from "react";
import { KeyboardAvoidingView, Platform, RefreshControl, ScrollView, View, type ScrollViewInstance } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useStore } from "@/lib/store";
import { c, font } from "@/theme";
import { Icon } from "./icon";
import { Mark } from "./logo";
import { Body, Display, Label, Press } from "./ui";

export const goBack = () => (router.canGoBack() ? router.back() : router.replace("/"));
export const initials = (name: string) => name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase() ?? "").join("");

const round = { width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center" } as const;

function ProfileButton() {
  const { contact } = useStore();
  const letters = initials(contact.name);
  return (
    <Press onPress={() => router.navigate("/profile")} accessibilityLabel="Open your profile" style={[round, { backgroundColor: c.butter }]}>
      {letters ? <Label size={13} color={c.ink}>{letters}</Label> : <Icon name="user" size={22} />}
    </Press>
  );
}

type Props = {
  title: string; subtitle?: string;
  /** Shows a back arrow. Without it the Yuwa mark sits on the left. */
  back?: () => void;
  right?: ReactNode;
  /** Pinned under the header, e.g. booking progress or filters. */
  below?: ReactNode;
  /** Pinned at the bottom: the one thing to do next. */
  footer?: ReactNode;
  /** True on screens without the tab bar, so the bottom safe area is respected. */
  standalone?: boolean;
  scrollRef?: Ref<ScrollViewInstance>;
  refreshing?: boolean; onRefresh?: () => void;
  children: ReactNode;
};

export function Screen({ title, subtitle, back, right, below, footer, standalone, scrollRef, refreshing = false, onRefresh, children }: Props) {
  const insets = useSafeAreaInsets();
  return (
    <KeyboardAvoidingView behavior={Platform.OS === "web" ? undefined : "padding"} style={{ flex: 1, backgroundColor: c.porcelain }}>
      <View style={{ backgroundColor: c.rose, paddingTop: insets.top + 10, paddingBottom: 14, paddingHorizontal: 16, flexDirection: "row", alignItems: "center", gap: 12, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 }}>
        {back ? (
          <Press onPress={back} accessibilityLabel="Go back" style={[round, { backgroundColor: c.porcelain }]}><Icon name="back" color={c.rose} /></Press>
        ) : (
          <View style={[round, { backgroundColor: c.porcelain }]}><Mark size={36} /></View>
        )}
        <View style={{ flex: 1 }}>
          <Display size={22} color={c.white} numberOfLines={1} accessibilityRole="header">{title}</Display>
          {!!subtitle && <Body size={12} color={c.butter} numberOfLines={1} style={{ fontFamily: font.semi }}>{subtitle}</Body>}
        </View>
        {right ?? (back ? null : <ProfileButton />)}
      </View>
      {below}
      <ScrollView ref={scrollRef} keyboardShouldPersistTaps="handled" style={{ flex: 1 }}
        refreshControl={onRefresh ? <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={c.rose} /> : undefined}
        contentContainerStyle={{ padding: 16, gap: 14, paddingBottom: standalone && !footer ? insets.bottom + 24 : 24 }}>
        {children}
      </ScrollView>
      {footer && (
        <View style={{ padding: 14, paddingBottom: standalone ? insets.bottom + 14 : 14, gap: 8, borderTopWidth: 1, borderColor: c.blush, backgroundColor: c.white }}>{footer}</View>
      )}
    </KeyboardAvoidingView>
  );
}
