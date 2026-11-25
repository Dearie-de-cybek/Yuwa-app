// SYNCED from the website (content/images.ts). Do not edit here: run `npm run sync`.
// REFERENCE imagery (Unsplash) used during development. These are NOT Yuwa's work and must never be presented as such.
// Replace each with real Yuwa photography: drop files in /public/work and point `src` at them, then delete the credit.
export type Img = { src: string; alt: string; author: string; page: string };
const u = (id: string) => `https://unsplash.com/photos/${id}`;
const r = (file: string, id: string, author: string, alt: string): Img =>
  ({ src: `https://images.unsplash.com/photo-${file}?w=1600&q=80&auto=format&fit=max`, alt, author, page: u(id) });

export const img = {
  hero: { src: "/ref/hero.jpg", alt: "Portrait of a woman with large box braids against an orange backdrop", author: "Gama. Films", page: u("tZx2TIOBQnQ") },
  goddess: { src: "/ref/goddess.jpg", alt: "Woman with long braids and beads looking away", author: "Ufoma Ojo", page: u("QIm_0C3D-Jo") },
  cornrows: { src: "/ref/cornrows.jpg", alt: "Woman with neat cornrows in a denim jacket", author: "Ben Iwara", page: u("w_zA_e8TRfM") },
  outdoor: { src: "/ref/braids-outdoor.jpg", alt: "Young woman with braided hair outdoors", author: "Michael Kyule", page: u("Ln_2SIooJTs") },
  smile: { src: "/ref/braids-smile.jpg", alt: "Smiling young woman with braided hair", author: "Ufoma Ojo", page: u("4Vroia0RXGg") },
  makeup: { src: "/ref/makeup.jpg", alt: "Portrait with glossy lips and soft makeup", author: "Good Faces", page: u("62wQhEghaw0") },
  curls: { src: "/ref/curls.jpg", alt: "Portrait of a woman with voluminous natural curls", author: "Jabari Timothy", page: u("4-UWyfTsFws") },
  wavy: { src: "/ref/wavy.jpg", alt: "Studio portrait with long wavy installed hair and a half-up bun", author: "Joecalih", page: u("tcBb4NykdAU") },
  pinkLaugh: r("1683122806152-99b01db5011d", "5291Q42Z8I0", "Michael Zadok", "Laughing woman with braided hair against a pink backdrop"),
  pinkFro: r("1673623250951-68692d52d841", "rOuTz5d10k8", "Polina Kuzovkova", "Woman with full natural curls against a pink backdrop"),
  pinkCurls: r("1676564121755-de2648b693fd", "BxJOjAWjZx4", "Peter Sil", "Woman with pink-streaked curls against a blue wall"),
  headwrap: r("1662893965003-31ae7064ae9a", "YxKa50gI-FA", "Eyitayo Adekoya", "Woman in a pink head wrap with pink eye makeup"),
  flowers: r("1662893964858-2df26b3b9fd0", "WBSa4O_KYsY", "Eyitayo Adekoya", "Woman in a pink head wrap holding pink blossoms"),
  backBraids: r("1663851071150-b6617bbee927", "yWcWeMGVPjk", "J Morgan", "Very long fine braids seen from behind"),
  braidBun: r("1572955304332-bf714bd49add", "K2D7muBun1A", "Gustavo Spindula", "Smiling woman with braids gathered into a high bun"),
  brickBraids: r("1612459284970-e8f027596582", "zWOPIzzzltk", "Brock Wegner", "Woman with long sleek braids beside a brick wall"),
  closeTwists: r("1636302925868-52075f44d810", "VBvL623KYKY", "Michael Starkie", "Close-up of twisted braids in warm light"),
  longBraids: r("1572954889228-2b12a55144d1", "M0NkWmz98o8", "Gustavo Spindula", "Smiling woman holding one of her long braids"),
  honeyBraids: r("1658497730270-b5f4fef00ae1", "gbN5g9ifbqs", "Jabari Timothy", "Woman with honey-toned parted braids"),
  redBraids: r("1648729778687-e4bc519d0300", "7lTR-ocwowg", "Aur Glow", "Woman with long braids and bright eye makeup in a red top"),
  berryPortrait: r("1552793084-49132af00ff1", "Yi4Zs64l0tE", "Oladimeji Odunsi", "Portrait with sleek hair and earrings on a deep berry backdrop"),
  redGlam: r("1637851362556-46d07c374023", "F_JclIZa4D8", "Reece van der Merwe", "Glowing makeup with a red lip and red nails"),
  softGlam: r("1613730317814-1cede28e0151", "WCEMFqEIVek", "Gideon Hezekiah", "Soft glam makeup, eyes closed"),
  eye: r("1645735123314-d11fcfdd0000", "fWvzGNKQvok", "Ato Aikins", "Close-up of pink eyeshadow and long lashes"),
} satisfies Record<string, Img>;

export const serviceImage: Record<string, Img> = {
  "goddess-boho-braids": img.goddess,
  "fulani-braids": img.hero,
  "braids-by-size": img.smile,
  "cornrows-crochet": img.cornrows,
  "wigs-weaves": img.wavy,
  "makeup": img.makeup,
  "care-consultation": img.curls,
};
