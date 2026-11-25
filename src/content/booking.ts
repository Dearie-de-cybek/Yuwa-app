// SYNCED from the website (content/booking.ts). Do not edit here: run `npm run sync`.
// Booking rules. PLACEHOLDER VALUES: Yuwa's real hours have not been supplied.
// Edit here and availability updates everywhere (booking page, API validation).
export const bookingConfig = {
  timezone: "Australia/Adelaide",
  /** Weekly opening windows in "HH:MM". 0 = Sunday. null = closed. */
  hours: {
    0: null,
    1: ["09:00", "17:00"],
    2: ["09:00", "17:00"],
    3: ["09:00", "17:00"],
    4: ["09:00", "17:00"],
    5: ["09:00", "17:00"],
    6: ["09:00", "17:00"],
  } as Record<number, [string, string] | null>,
  hoursAreConfirmed: false,
  slotStepMins: 30,
  minNoticeHours: 12,
  horizonDays: 60,
  bufferMins: 0, // gap kept free after each appointment
  blockedDates: [] as string[], // "YYYY-MM-DD" days off / public holidays
  chairs: 1, // simultaneous appointments
};
