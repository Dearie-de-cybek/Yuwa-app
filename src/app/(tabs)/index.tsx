// Home as a bento board: the big tile is what to do next, the rest are doors into the app.
import { router } from "expo-router";
import { useState } from "react";
import { ScrollView, View } from "react-native";
import { Board, Col, Cols, ColourTile, GAP, Masonry, PhotoTile, SearchBar } from "@/components/bento";
import { Section } from "@/components/blocks";
import { Icon } from "@/components/icon";
import { Screen } from "@/components/screen";
import { Sticker } from "@/components/sticker";
import { Body, Display, Label, Press } from "@/components/ui";
import { img, serviceImage } from "@/content/images";
import { policy } from "@/content/policy";
import { bySlug, findVariant, fmtPrice, startingPrice } from "@/content/services";
import { chapters } from "@/content/story";
import { work } from "@/content/work";
import { prettyDate, t12 } from "@/lib/format";
import { useStore } from "@/lib/store";
import { isUpcoming, soonestFirst, useRefreshVisits } from "@/lib/visits";
import { c } from "@/theme";

const book = (params?: { collection?: string; service?: string }) => router.navigate({ pathname: "/book", params });

/** A service collection as a photo tile with its starting price. */
function Service({ slug, height }: { slug: string; height: number }) {
  const col = bySlug(slug);
  if (!col) return null;
  const from = startingPrice(col);
  return <PhotoTile src={serviceImage[slug].src} title={col.title} hint={from !== null ? `From ${fmtPrice(from)}  →` : "Complimentary  →"} height={height} onPress={() => book({ collection: slug })} />;
}

export default function Home() {
  const { visits, saved, contact } = useStore();
  const { refreshing, pull } = useRefreshVisits();
  const [query, setQuery] = useState("");
  const upcoming = visits.filter(isUpcoming).sort(soonestFirst);
  const next = upcoming[0];
  const nextService = next && findVariant(next.serviceId);
  const first = contact.name.trim().split(/\s+/)[0];
  const savedLooks = work.filter((w) => saved.includes(w.id));

  const search = () => {
    if (!query.trim()) return;
    router.navigate({ pathname: "/lookbook", params: { q: query.trim() } });
    setQuery("");
  };

  return (
    <Screen title={first ? `Hi, ${first}` : "Welcome to Yuwa"} subtitle="What would you like to do?" refreshing={refreshing} onRefresh={pull}
      below={<View style={{ paddingHorizontal: 16, paddingTop: 12 }}><SearchBar value={query} onChangeText={setQuery} onSubmitEditing={search} /></View>}>
      <View style={{ gap: GAP }}>
        {next && nextService ? (
          <PhotoTile large height={300} src={serviceImage[nextService.collection.slug].src}
            badge={next.status === "pending" ? "Pay to confirm" : "Your next visit"}
            title={`${prettyDate(next.date)}, ${t12(next.time)}`}
            hint={next.status === "pending" ? `Finish booking: $${next.fee} fee  →` : "Prep, move or cancel  →"}
            onPress={() => router.push({ pathname: "/visit/[ref]", params: { ref: next.ref } })} />
        ) : (
          <PhotoTile large height={320} src={img.headwrap.src} badge="Start here" title="Book your next look"
            hint={`Style → time → $${policy.bookingFee} fee, off your price  →`} onPress={() => book()} />
        )}

        <Cols>
          <Col><Service slug="goddess-boho-braids" height={250} /></Col>
          <Col>
            <ColourTile tone="butter" height={150} title="Free consult" hint="15 min, no fee" onPress={() => book({ service: "59433565" })} art={<Sticker size={68} />} />
            <ColourTile tone="ink" height={90} title="My visits" hint={`${upcoming.length} upcoming`} onPress={() => router.navigate("/visits")} />
          </Col>
        </Cols>

        <Cols>
          <Col><Service slug="fulani-braids" height={190} /></Col>
          <Col><Service slug="makeup" height={190} /></Col>
        </Cols>

        <Press onPress={() => router.navigate({ pathname: "/lookbook", params: { filter: saved.length ? "Saved" : "All" } })} accessibilityLabel="Your saved looks"
          style={{ backgroundColor: c.white, borderRadius: 28, padding: 8, borderWidth: 1.5, borderColor: c.blush }}>
          <Board photos={(savedLooks.length ? savedLooks : [work[5], work[2], work[7]]).map((w) => w.src!)} />
          <View style={{ flexDirection: "row", alignItems: "center", padding: 10, gap: 10 }}>
            <View style={{ flex: 1 }}>
              <Display size={20}>{savedLooks.length ? "Your saved looks" : "Start your board"}</Display>
              <Body size={12} color={c.muted}>{savedLooks.length ? `${savedLooks.length} saved for your appointment` : "Tap a heart on any look to save it"}</Body>
            </View>
            <Icon name="next" color={c.rose} />
          </View>
        </Press>

        <Cols>
          <Col>
            <ColourTile tone="rose" height={150} title="How booking works" hint={`Refund if you cancel ${policy.freeChangeHours}h ahead`} onPress={() => router.push("/guide")} art={<Icon name="info" color={c.butter} size={30} />} />
            <Service slug="braids-by-size" height={170} />
          </Col>
          <Col>
            <Service slug="wigs-weaves" height={230} />
            <Service slug="cornrows-crochet" height={90} />
          </Col>
        </Cols>
      </View>

      <Section title="Fresh looks" action="All looks" onAction={() => router.navigate({ pathname: "/lookbook", params: { filter: "All" } })} />
      <Masonry items={[work[1], work[13], work[19], work[10], work[11], work[8]]} />

      <Section title="A day in the chair" />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: GAP }}>
        {chapters.map((ch) => (
          <View key={ch.when} style={{ width: 220 }}>
            <PhotoTile height={270} src={ch.image.src} badge={ch.when} title={`${ch.title} ${ch.accent}`} onPress={() => router.push("/guide")} />
          </View>
        ))}
      </ScrollView>
      <Label size={9} color={c.muted} style={{ textAlign: "center" }}>Reference photos, not Yuwa&apos;s own work</Label>
    </Screen>
  );
}
