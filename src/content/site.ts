// SYNCED from the website (content/site.ts). Do not edit here: run `npm run sync`.
// Single source of truth for business facts. Edit here; nothing below is invented.
// `null` = not yet verified -> the UI hides it or shows a clear placeholder.
export const site = {
  name: "Yuwa Hair World",
  short: "Yuwa",
  url: "https://yuwahairworld.com.au", // TODO confirm production domain
  city: "Adelaide",
  region: "SA",
  country: "AU",
  // Needs owner confirmation before it is published as the address (two different suburbs appear in old listings).
  address: null as null | { street: string; suburb: string; postcode: string },
  addressNote: "Studio address to be confirmed. Your exact location is shared when you book.",
  phone: null as null | string,
  email: null as null | string,
  hours: null as null | { day: string; time: string }[],
  social: { instagram: null as null | string, facebook: null as null | string, tiktok: null as null | string },
  mapQuery: null as null | string,
};

/** Our own booking flow. Passing a service id preselects it and skips straight to date & time. */
export const bookUrl = (serviceId?: number) => (serviceId ? `/book?service=${serviceId}` : "/book");
