// One look, big, with the booking button pinned and more like it underneath.
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef } from "react";
import { View, useWindowDimensions, type ScrollViewInstance } from "react-native";
import { Masonry } from "@/components/bento";
import { Section } from "@/components/blocks";
import { Heart } from "@/components/heart";
import { Screen } from "@/components/screen";
import { Body, Button, Display, Photo } from "@/components/ui";
import { bySlug, fmtPrice, startingPrice } from "@/content/services";
import { work } from "@/content/work";
import { c, radius } from "@/theme";

const close = () => (router.canGoBack() ? router.back() : router.replace("/lookbook"));

export default function Look() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { height } = useWindowDimensions();
  const scroll = useRef<ScrollViewInstance>(null);
  useEffect(() => { scroll.current?.scrollTo({ y: 0, animated: false }); }, [id]);
  const w = work.find((x) => x.id === id);
  if (!w) return <Screen title="Look" back={close} standalone><Body>That look is no longer here.</Body></Screen>;

  const service = bySlug(w.service);
  const from = service ? startingPrice(service) : null;
  // Same category first, then the rest, so the grid is never thin.
  const more = [...work.filter((x) => x.id !== w.id && x.category === w.category), ...work.filter((x) => x.category !== w.category)].slice(0, 8);

  return (
    <Screen title={w.title} subtitle={w.category} back={close} right={<Heart id={w.id} title={w.title} />} standalone scrollRef={scroll}
      footer={<Button title="Book this style  →" onPress={() => { close(); router.navigate({ pathname: "/book", params: { collection: w.service } }); }} />}>
      <Photo src={w.src!} alt={w.alt} width={1000} style={{ height: Math.min(height * 0.56, 560), borderRadius: radius.card }} />
      {service && (
        <View style={{ backgroundColor: c.blush, borderRadius: 22, padding: 16, gap: 2 }}>
          <Display size={22}>{service.title}</Display>
          <Body size={13}>{service.blurb}{from !== null ? ` From ${fmtPrice(from)}.` : ""}</Body>
        </View>
      )}
      {w.ref && <Body size={11} color={c.muted}>Reference photo by {w.ref.author} / Unsplash. Not Yuwa&apos;s work.</Body>}
      <Section title="More like this" />
      <Masonry items={more} />
    </Screen>
  );
}
