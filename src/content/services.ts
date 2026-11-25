// SYNCED from the website (content/services.ts). Do not edit here: run `npm run sync`.
export type Variant = {
  id: number; // stable service id; /book?service=ID preselects it
  name: string;
  mins: number;
  price: number | null; // AUD, null = confirmed at booking
  note?: string;
};
export type Collection = {
  slug: string; title: string; kicker: string; blurb: string; result: string;
  prep: string[]; aftercare: string[] | null; variants: Variant[]; tone: "blush" | "rose" | "ink" | "porcelain";
};

const PREP = [
  "Hair must be at least 4 inches long.",
  "Arrive with hair clean, fully blow-dried straight, and free of oils or leave-in products.",
  "Shampoo and blow-dry can be added to your booking for an additional fee.",
  "Hair extensions are included - note your preferred extension colour in the appointment notes.",
];
const HOLIDAY = "A 15% surcharge applies to appointments booked on public holidays.";

export const collections: Collection[] = [
  { slug: "goddess-boho-braids", title: "Goddess & Boho Braids", kicker: "Signature", tone: "rose",
    blurb: "Sculpted braids finished with soft, flowing curls.",
    result: "A romantic, long-wearing braided style with curls through the lengths.",
    prep: [...PREP, "Curls can be supplied: human hair from $150, high-quality synthetic $70.", HOLIDAY], aftercare: null,
    variants: [
      { id: 10070641, name: "Shoulder length, medium", mins: 240, price: 270 },
      { id: 99007809, name: "Mid back, medium", mins: 300, price: 350 },
      { id: 99243607, name: "Mid back, small", mins: 480, price: 470 },
      { id: 99244483, name: "Waist length, medium", mins: 360, price: 500 },
      { id: 94018619, name: "Add curls to Boho / Goddess braids", mins: 60, price: null, note: "Human hair from $150 - synthetic $70" },
    ] },
  { slug: "fulani-braids", title: "Fulani & Statement Braids", kicker: "Collection", tone: "blush",
    blurb: "Cornrows at the front with braids through the back, plus festival, kids and fade styles.",
    result: "Graphic, art-directed braid work built around your hairline and length.",
    prep: [...PREP, HOLIDAY], aftercare: null,
    variants: [
      { id: 99415738, name: "Fulani braids, medium", mins: 180, price: 270 },
      { id: 93714002, name: "2 Dutch / festival braids", mins: 60, price: 70 },
      { id: 99204278, name: "Kids braids with curls", mins: 180, price: 150 },
      { id: 87849659, name: "Braids on a fade, mid back", mins: 240, price: 230 },
      { id: 87849689, name: "Braids on a fade, waist length", mins: 300, price: 350 },
      { id: 99375450, name: "Men's cornrows, 8 rows", mins: 100, price: 85 },
    ] },
  { slug: "braids-by-size", title: "Braids by Size & Length", kicker: "Collection", tone: "porcelain",
    blurb: "Choose your size and length: small, medium or large, shoulder to waist.",
    result: "Neat, even braiding in the scale you choose.",
    prep: [...PREP, HOLIDAY], aftercare: null,
    variants: [
      { id: 88167616, name: "Large, shoulder length", mins: 180, price: 170 },
      { id: 88167650, name: "Large, back length", mins: 210, price: 230 },
      { id: 88167692, name: "Large, waist length", mins: 270, price: 300 },
      { id: 87849724, name: "Medium, shoulder length", mins: 210, price: 250 },
      { id: 87849781, name: "Medium, mid back", mins: 260, price: 300 },
      { id: 87849824, name: "Medium, waist length", mins: 330, price: 450 },
      { id: 87849493, name: "Small, shoulder length", mins: 300, price: 270 },
      { id: 87849545, name: "Small, back length", mins: 360, price: 430 },
      { id: 87849593, name: "Small, waist length", mins: 450, price: 570 },
    ] },
  { slug: "cornrows-crochet", title: "Cornrows & Crochet", kicker: "Collection", tone: "blush",
    blurb: "Cornrows in every scale, and crochet installs including faux locs.",
    result: "Defined, protective patterns on natural hair or with extensions.",
    prep: [...PREP, "Crochet hair is not included in crochet prices.", HOLIDAY], aftercare: null,
    variants: [
      { id: 88167846, name: "Cornrows, natural hair, 6-8 rows", mins: 60, price: 70 },
      { id: 93712683, name: "Large cornrows with extensions, 6-10 rows", mins: 90, price: 150 },
      { id: 93713135, name: "Medium cornrows with extensions, 10-15 rows", mins: 210, price: 230 },
      { id: 93713289, name: "Small cornrows with extensions, 16-24 rows", mins: 330, price: 280 },
      { id: 88168051, name: "Ponytail cornrows", mins: 180, price: 170 },
      { id: 88167725, name: "Crochet with cornrows", mins: 150, price: 160 },
      { id: 88167743, name: "Individual crochet for faux locs", mins: 270, price: 300 },
    ] },
  { slug: "wigs-weaves", title: "Wigs, Weaves & Installs", kicker: "Collection", tone: "ink",
    blurb: "Frontal installs, sew-ins and ponytails, finished cleanly.",
    result: "A seamless install styled to sit naturally.",
    prep: ["Hair must be at least 4 inches long for sew-ins.", "Arrive with hair clean, fully blow-dried straight, and free of oils or leave-in products.", HOLIDAY], aftercare: null,
    variants: [
      { id: 10033759, name: "Frontal wig install", mins: 80, price: 130 },
      { id: 97826447, name: "Ponytail install", mins: 80, price: 80 },
      { id: 94019814, name: "Sew-in with leave-out", mins: 180, price: 170 },
      { id: 94019304, name: "Sew-in with closure", mins: 240, price: 220 },
      { id: 10070841, name: "Half braids + half weave", mins: 180, price: 220 },
    ] },
  { slug: "makeup", title: "Makeup", kicker: "Beauty", tone: "rose",
    blurb: "Soft glam to full glam, or paired with a frontal install.",
    result: "Soft Glam is minimalist with a soft nude lip and a hint of gloss, perfect for lunch or dinner.",
    prep: [HOLIDAY], aftercare: null,
    variants: [
      { id: 94019969, name: "Soft Glam", mins: 60, price: 100 },
      { id: 97781676, name: "Full Glam", mins: 80, price: 120 },
      { id: 97781643, name: "Makeup + frontal wig install bundle", mins: 150, price: 210, note: "Soft Glam ($100) + frontal install ($130) bundled" },
    ] },
  { slug: "care-consultation", title: "Care & Consultation", kicker: "Begin here", tone: "porcelain",
    blurb: "Wash, take-down, and a free 15-minute consultation by phone or in person.",
    result: "A clean reset, or clear direction on what is achievable for your hair.",
    prep: ["Tell us your current style when booking a take-down so enough time is allocated.", HOLIDAY], aftercare: null,
    variants: [
      { id: 59433565, name: "Consultation (phone or in person)", mins: 15, price: 0 },
      { id: 87848733, name: "Hair wash and blow dry", mins: 60, price: 50 },
      { id: 87848821, name: "Hair removal + shampoo", mins: 120, price: null, note: "Gentle take-down of your existing style, then shampoo" },
    ] },
];

export const fmtDuration = (m: number) => {
  const h = Math.floor(m / 60), r = m % 60;
  return [h ? `${h} hr` : "", r ? `${r} min` : ""].filter(Boolean).join(" ");
};
export const fmtPrice = (p: number | null) => (p === null ? "At booking" : p === 0 ? "Complimentary" : `$${p}`);
export const startingPrice = (c: Collection) => {
  const ps = c.variants.map((v) => v.price).filter((p): p is number => p !== null && p > 0);
  return ps.length ? Math.min(...ps) : null;
};
export const bySlug = (s: string) => collections.find((c) => c.slug === s);
export const findVariant = (id: number) => {
  for (const c of collections) { const v = c.variants.find((x) => x.id === id); if (v) return { ...v, collection: c }; }
  return null;
};
