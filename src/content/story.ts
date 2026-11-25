// SYNCED from the website (content/story.ts). Do not edit here: run `npm run sync`.
// The appointment, told in chapters. Claims come from content/services.ts and the booking flow.
import { img } from "./images";

export const chapters = [
  { when: "Before", title: "It starts with", accent: "a conversation.", image: img.pinkLaugh, tone: "bg-blush text-ink",
    body: "Not sure what suits you? The 15-minute consultation is free, by phone or in person. Talk through your hair and learn what is achievable before you commit." },
  { when: "The night before", title: "Wash day,", accent: "your way.", image: img.pinkFro, tone: "bg-pink text-ink",
    body: "For most braiding services, arrive with hair at least four inches long, clean, blown straight and product-free. Short on time? Add a wash and blow-dry to your booking." },
  { when: "In the chair", title: "Hands, parts,", accent: "patience.", image: img.closeTwists, tone: "on-dark bg-berry text-porcelain",
    body: "Some looks take one hour, small waist-length braids closer to eight. Every duration is listed up front, so you can plan the day around the style." },
  { when: "The reveal", title: "Then you", accent: "look up.", image: img.headwrap, tone: "on-rose bg-rose text-white",
    body: "The part that matters: the mirror, the first photo, the way you carry yourself out the door." },
];

// Planned, not shipped. Confirm the list with the owner.
export const appFeatures = [
  ["Book in a few taps", "Pick a service, see open times and lock one in."],
  ["Change your mind", "Reschedule or cancel without a phone call."],
  ["Never miss it", "Reminders before your appointment, with your prep checklist."],
  ["Keep your looks", "Save styles from the lookbook and show them at your next visit."],
] as const;
