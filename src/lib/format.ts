const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export const dateParts = (d: string) => {
  const x = new Date(`${d}T00:00:00Z`);
  return { dow: DAYS[x.getUTCDay()], day: x.getUTCDate(), month: MONTHS[x.getUTCMonth()] };
};
export const prettyDate = (d: string) => { const p = dateParts(d); return `${p.dow} ${p.day} ${p.month}`; };
export const t12 = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  return `${((h + 11) % 12) + 1}:${String(m).padStart(2, "0")} ${h < 12 ? "am" : "pm"}`;
};

/** Booking times are studio (Adelaide) wall-clock. Convert to a real instant, whatever zone the phone is in. */
export function studioInstant(date: string, time: string, timeZone: string): Date {
  const guess = Date.parse(`${date}T${time}:00Z`);
  try {
    const p = Object.fromEntries(
      new Intl.DateTimeFormat("en-CA", { timeZone, hourCycle: "h23", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" })
        .formatToParts(new Date(guess)).map((x) => [x.type, x.value]),
    );
    const wall = Date.parse(`${p.year}-${p.month}-${p.day}T${p.hour}:${p.minute}:00Z`);
    return new Date(guess - (wall - guess));
  } catch {
    return new Date(`${date}T${time}:00`); // engine without time-zone data: assume the phone is on studio time
  }
}
