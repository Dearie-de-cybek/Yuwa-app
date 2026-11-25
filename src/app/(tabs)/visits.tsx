// A short list of bookings. Tap one to see what to do with it.
import { router } from "expo-router";
import { useState } from "react";
import { View } from "react-native";
import { Col, Cols, PhotoTile } from "@/components/bento";
import { StatusPill, card } from "@/components/blocks";
import { Screen } from "@/components/screen";
import { Body, Chip, Display, Italic, Label, Photo, Press } from "@/components/ui";
import { img, serviceImage } from "@/content/images";
import { findVariant } from "@/content/services";
import { dateParts, t12 } from "@/lib/format";
import { useStore, type Visit } from "@/lib/store";
import { isUpcoming, soonestFirst, useRefreshVisits } from "@/lib/visits";
import { c, font } from "@/theme";

function VisitCard({ visit }: { visit: Visit }) {
  const p = dateParts(visit.date);
  const v = findVariant(visit.serviceId);
  const past = !isUpcoming(visit) && visit.status === "confirmed";
  return (
    <Press onPress={() => router.push({ pathname: "/visit/[ref]", params: { ref: visit.ref } })} style={[card, { flexDirection: "row", gap: 12, padding: 8 }]}>
      <View style={{ width: 96, height: 116, borderRadius: 18, overflow: "hidden" }}>
        {v && <Photo src={serviceImage[v.collection.slug].src} alt="" width={300} style={{ flex: 1 }} />}
        <View style={{ position: "absolute", left: 6, bottom: 6, backgroundColor: c.porcelain, borderRadius: 12, paddingHorizontal: 8, paddingVertical: 3, alignItems: "center" }}>
          <Display size={20}>{p.day}</Display>
          <Label size={8} color={c.rose}>{p.month}</Label>
        </View>
      </View>
      <View style={{ flex: 1, justifyContent: "center", gap: 6 }}>
        <StatusPill status={past ? "done" : visit.status} />
        <Body size={15} numberOfLines={2} style={{ fontFamily: font.semi }}>{v?.name ?? "Appointment"}</Body>
        <Body size={12} color={c.muted}>{p.dow} · {t12(visit.time)}  →</Body>
      </View>
    </Press>
  );
}

export default function Visits() {
  const { visits, ready } = useStore();
  const { offline, refreshing, pull } = useRefreshVisits();
  const [tab, setTab] = useState<"upcoming" | "past">("upcoming");
  const upcoming = visits.filter(isUpcoming).sort(soonestFirst);
  const past = visits.filter((v) => !isUpcoming(v)).sort(soonestFirst).reverse();
  const list = tab === "upcoming" ? upcoming : past;

  return (
    <Screen title="My visits" subtitle="Tap a booking to change it" refreshing={refreshing} onRefresh={pull}
      below={
        <View style={{ flexDirection: "row", gap: 8, paddingHorizontal: 16, paddingTop: 12 }}>
          <Chip title={`Upcoming (${upcoming.length})`} active={tab === "upcoming"} onPress={() => setTab("upcoming")} />
          <Chip title={`Past (${past.length})`} active={tab === "past"} onPress={() => setTab("past")} />
        </View>
      }>
      {offline && <Body size={13} color={c.rose} accessibilityRole="alert">Couldn&apos;t check for updates. Showing what was saved.</Body>}
      {list.map((v) => <VisitCard key={v.ref} visit={v} />)}
      {ready && list.length === 0 && (
        <View style={{ gap: 14 }}>
          <Display size={26} style={{ textAlign: "center", marginTop: 8 }}>{tab === "upcoming" ? <>Nothing booked <Italic>yet.</Italic></> : <>No past <Italic>visits.</Italic></>}</Display>
          <Body size={13} color={c.muted} style={{ textAlign: "center" }}>Bookings you make in this app appear here, with your prep list.</Body>
          <PhotoTile large height={240} src={img.braidBun.src} badge="Start here" title="Book a visit" hint="Choose a style  →" onPress={() => router.navigate("/book")} />
          <Cols>
            <Col><PhotoTile height={150} src={img.redGlam.src} title="Browse looks" hint="Lookbook  →" onPress={() => router.navigate("/lookbook")} /></Col>
            <Col><PhotoTile height={150} src={img.pinkFro.src} title="Free consult" hint="15 min  →" onPress={() => router.navigate({ pathname: "/book", params: { service: "59433565" } })} /></Col>
          </Cols>
        </View>
      )}
    </Screen>
  );
}
