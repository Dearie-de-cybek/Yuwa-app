// SYNCED from the website (content/policy.ts). Do not edit here: run `npm run sync`.
// Fees and change rules. The server enforces these; the website, the app and the terms all read from here.
export const policy = {
  bookingFee: 30, // AUD, paid online to confirm; comes off the service price
  freeChangeHours: 48, // refund and online reschedule need at least this much notice
  onlineReschedules: 1,
  holdMinutes: 31, // how long an unpaid slot is held (the card checkout allows no less than 30)
  version: "2026-11-25", // bump whenever the terms or privacy policy change
};

/** Free services (price 0) carry no fee. Services priced "at booking" do. */
export const feeFor = (price: number | null) => (price === 0 ? 0 : policy.bookingFee);

export const feeSummary = [
  `A $${policy.bookingFee} booking fee confirms your appointment and comes off the price.`,
  `Cancel ${policy.freeChangeHours} hours or more before and the fee is refunded.`,
  `Cancel later, or miss the appointment, and Yuwa keeps the fee as the cancellation fee.`,
  `You can reschedule once online, ${policy.freeChangeHours} hours or more before.`,
];
