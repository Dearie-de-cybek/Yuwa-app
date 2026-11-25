import { Redirect } from "expo-router";
import { Tabs } from "expo-router/js-tabs";
import { useEffect } from "react";
import { Icon, type IconName } from "@/components/icon";
import { useStore } from "@/lib/store";
import { useVisitSync } from "@/lib/use-visit-sync";
import { isUpcoming } from "@/lib/visits";
import { c, font } from "@/theme";

const tabs: [name: string, title: string, icon: IconName][] = [
  ["index", "Home", "home"], ["lookbook", "Looks", "heart"], ["book", "Book", "plus"], ["visits", "Visits", "receipt"], ["profile", "Profile", "user"],
];

export default function TabsLayout() {
  const { visits, ready, onboarded, reminders } = useStore();
  const { apply } = useVisitSync();
  const upcoming = visits.filter(isUpcoming);

  // Turning reminders on or off in the profile applies to bookings already made.
  useEffect(() => { if (ready) upcoming.forEach((v) => apply(v, v)); }, [reminders]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!ready) return null; // the splash covers this
  if (!onboarded) return <Redirect href="/welcome" />;

  return (
    <Tabs screenOptions={{
      headerShown: false,
      tabBarHideOnKeyboard: true,
      tabBarActiveTintColor: c.rose,
      tabBarInactiveTintColor: c.muted,
      tabBarStyle: { backgroundColor: c.white, borderTopColor: c.blush },
      tabBarLabelStyle: { fontFamily: font.bold, fontSize: 10, textTransform: "uppercase", letterSpacing: 0.6 },
      sceneStyle: { backgroundColor: c.porcelain },
    }}>
      {tabs.map(([name, title, icon]) => (
        <Tabs.Screen key={name} name={name} options={{
          title,
          tabBarIcon: ({ color }) => <Icon name={icon} color={color} />,
          ...(name === "visits" && { tabBarBadge: upcoming.length || undefined, tabBarBadgeStyle: { backgroundColor: c.rose, color: c.white } }),
        }} />
      ))}
    </Tabs>
  );
}
