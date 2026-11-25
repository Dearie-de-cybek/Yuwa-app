// Pinterest-style discovery: search, photo categories, staggered grid.
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import { Masonry, SearchBar } from "@/components/bento";
import { Tip } from "@/components/blocks";
import { Screen } from "@/components/screen";
import { Body, Button, Label, Photo, Press } from "@/components/ui";
import { img } from "@/content/images";
import { bySlug } from "@/content/services";
import { work, workCategories } from "@/content/work";
import { useStore } from "@/lib/store";
import { c, font } from "@/theme";

const covers: Record<string, string> = {
  All: img.headwrap.src, Saved: img.flowers.src, Braids: img.honeyBraids.src, Cornrows: img.cornrows.src, "Weaves & Wigs": img.wavy.src, Makeup: img.redGlam.src,
};

export default function Lookbook() {
  const params = useLocalSearchParams<{ filter?: string; q?: string }>();
  const { saved } = useStore();
  const [filter, setFilter] = useState<string>("All");
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!params.filter && !params.q) return;
    setFilter(params.filter ?? "All");
    setQuery(params.q ?? "");
    router.setParams({ filter: undefined, q: undefined });
  }, [params.filter, params.q]);

  // Every typed word must appear somewhere in the look's name, category or service.
  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  const items = work
    .filter((w) => (filter === "All" ? true : filter === "Saved" ? saved.includes(w.id) : w.category === filter))
    .filter((w) => {
      const text = `${w.title} ${w.category} ${bySlug(w.service)?.title ?? ""}`.toLowerCase();
      return words.every((x) => text.includes(x));
    });

  return (
    <Screen title="Lookbook" subtitle={`${items.length} ${items.length === 1 ? "look" : "looks"} · tap one to book it`}
      below={
        <View style={{ paddingTop: 12, gap: 10 }}>
          <View style={{ paddingHorizontal: 16 }}><SearchBar value={query} onChangeText={setQuery} /></View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 14, paddingHorizontal: 16 }}>
            {["All", "Saved", ...workCategories.slice(1)].map((f) => {
              const on = filter === f;
              return (
                <Press key={f} onPress={() => setFilter(f)} accessibilityState={{ selected: on }} accessibilityLabel={f} style={{ alignItems: "center", gap: 4, width: 66 }}>
                  <View style={{ width: 62, height: 62, borderRadius: 31, borderWidth: 2.5, borderColor: on ? c.rose : "transparent", padding: 2 }}>
                    <Photo src={covers[f]} alt="" width={150} style={{ flex: 1, borderRadius: 29 }} />
                  </View>
                  <Label size={8} numberOfLines={1} color={on ? c.rose : c.ink}>{f === "Weaves & Wigs" ? "Wigs" : f}</Label>
                </Press>
              );
            })}
          </ScrollView>
        </View>
      }>
      <Tip id="lookbook">Tap a photo to see it and book that style. Tap the heart to save it for your appointment.</Tip>
      {items.length === 0 ? (
        <View style={{ alignItems: "center", gap: 14, padding: 32 }}>
          <Body color={c.muted} style={{ textAlign: "center", fontFamily: font.semi }}>
            {words.length ? `Nothing matches "${query.trim()}".` : filter === "Saved" ? "Nothing saved yet. Tap the heart on a look to keep it here." : "No looks here yet."}
          </Body>
          <Button title="Browse all looks" onPress={() => { setFilter("All"); setQuery(""); }} />
        </View>
      ) : <Masonry items={items} />}
      {items.length > 0 && <Body size={11} color={c.muted} style={{ textAlign: "center" }}>Reference photos for mood, not Yuwa&apos;s own work.</Body>}
    </Screen>
  );
}
