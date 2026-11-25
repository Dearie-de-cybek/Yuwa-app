// SYNCED from the website (content/work.ts). Do not edit here: run `npm run sync`.
// Portfolio. Currently REFERENCE imagery (see content/images.ts), not Yuwa's work.
// To add real work: drop the file in /public/work and set `src` (e.g. "/work/fulani-01.jpg"), and remove `ref`.
import { img, type Img } from "./images";

export type WorkItem = {
  id: string; title: string; category: "Braids" | "Cornrows" | "Weaves & Wigs" | "Makeup";
  service: string; // collection slug
  src: string | null; alt: string; ratio: "portrait" | "landscape" | "square" | "tall"; tone: "blush" | "rose" | "ink" | "porcelain";
  ref?: Img; // set while using reference imagery
};
const w = (id: string, title: string, category: WorkItem["category"], service: string, ref: Img, ratio: WorkItem["ratio"], tone: WorkItem["tone"] = "blush"): WorkItem =>
  ({ id, title, category, service, src: ref.src, alt: ref.alt, ratio, tone, ref });

export const work: WorkItem[] = [
  w("w1", "Long braids with beads", "Braids", "goddess-boho-braids", img.goddess, "tall"),
  w("w2", "Pink wrap, pink lids", "Makeup", "makeup", img.headwrap, "portrait"),
  w("w3", "High braided bun", "Braids", "braids-by-size", img.braidBun, "tall"),
  w("w4", "Neat cornrows", "Cornrows", "cornrows-crochet", img.cornrows, "tall"),
  w("w5", "Wavy install with half-up bun", "Weaves & Wigs", "wigs-weaves", img.wavy, "tall"),
  w("w6", "Honey parted braids", "Braids", "braids-by-size", img.honeyBraids, "portrait"),
  w("w7", "Statement box braids", "Braids", "fulani-braids", img.hero, "portrait"),
  w("w8", "Red lip glow", "Makeup", "makeup", img.redGlam, "tall"),
  w("w9", "Waist-length fine braids", "Braids", "braids-by-size", img.backBraids, "tall"),
  w("w10", "Full natural curls", "Weaves & Wigs", "wigs-weaves", img.pinkFro, "portrait"),
  w("w11", "Blossom glam", "Makeup", "makeup", img.flowers, "portrait"),
  w("w12", "Sleek long braids", "Braids", "goddess-boho-braids", img.brickBraids, "portrait"),
  w("w13", "Pink lid close-up", "Makeup", "makeup", img.eye, "square"),
  w("w14", "Twists, up close", "Braids", "fulani-braids", img.closeTwists, "tall"),
  w("w15", "Soft, glossy makeup", "Makeup", "makeup", img.makeup, "portrait"),
  w("w16", "Braids, outdoors", "Braids", "braids-by-size", img.outdoor, "portrait"),
  w("w17", "Long and loose", "Braids", "goddess-boho-braids", img.longBraids, "square"),
  w("w18", "Soft glam", "Makeup", "makeup", img.softGlam, "portrait"),
  w("w19", "Pink-streaked curls", "Weaves & Wigs", "wigs-weaves", img.pinkCurls, "tall"),
  w("w20", "Braids and bold lids", "Braids", "fulani-braids", img.redBraids, "tall"),
  w("w21", "Braided and smiling", "Braids", "braids-by-size", img.smile, "portrait"),
  w("w22", "Natural curls and glow", "Makeup", "makeup", img.curls, "tall"),
  w("w23", "Sleek and sculpted", "Makeup", "makeup", img.berryPortrait, "portrait"),
  w("w24", "Laughing, braided up", "Braids", "braids-by-size", img.pinkLaugh, "portrait"),
];
export const workCategories = ["All", "Braids", "Cornrows", "Weaves & Wigs", "Makeup"] as const;
