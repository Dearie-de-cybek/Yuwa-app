// Same pink system as the website (app/globals.css), converted from OKLCH to hex.
export const c = {
  porcelain: "#fff7f9",
  white: "#fffcfd",
  blush: "#ffdce9",
  dusty: "#fbb7d0",
  pink: "#fc90bc",
  rose: "#cd1061",
  berry: "#6f0d3d",
  butter: "#ffe283",
  ink: "#30101e",
  muted: "#6d4e59",
} as const;

export const font = {
  display: "Fraunces_400Regular",
  italic: "Fraunces_400Regular_Italic",
  poster: "LeagueGothic_400Regular",
  body: "Figtree_400Regular",
  semi: "Figtree_600SemiBold",
  bold: "Figtree_700Bold",
} as const;

export const radius = { card: 28, pill: 999 } as const;
