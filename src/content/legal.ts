// SYNCED from the website (content/legal.ts). Do not edit here: run `npm run sync`.
// Terms and privacy text, shown on the website and in the app.
// DRAFT: needs Yuwa's legal name, ABN and contact details, and review by someone qualified in Australian law.
// When it changes, bump `policy.version`.
import { policy } from "./policy";

export type LegalDoc = { title: string; intro: string; sections: { heading: string; body: string[] }[] };

export const legalIsDraft = true;
const fee = `$${policy.bookingFee}`;
const notice = `${policy.freeChangeHours} hours`;

export const terms: LegalDoc = {
  title: "Terms & Conditions",
  intro: "These terms apply when you book with Yuwa Hair World in Adelaide, through our website or app. By confirming a booking you agree to them.",
  sections: [
    { heading: "Booking and confirmation", body: [
      `Paid services need a ${fee} booking fee (AUD), paid online. Your booking is confirmed once the payment succeeds.`,
      "While you pay, we hold your chosen time for about half an hour. If payment is not completed, the time is released.",
      "The free consultation has no booking fee.",
    ] },
    { heading: "Prices and payment", body: [
      "The booking fee comes off the price of your service. The balance is paid to Yuwa for your appointment.",
      "Prices shown are the listed prices for each option. Services marked \"At booking\" are priced by Yuwa. Final price is confirmed by Yuwa.",
      "A 15% surcharge applies to appointments on public holidays.",
      "Card payments are processed by Stripe. We do not see or store your card number.",
    ] },
    { heading: "Cancelling", body: [
      `If you cancel ${notice} or more before your appointment, we refund the booking fee to the card you paid with.`,
      `If you cancel less than ${notice} before, or do not attend, we keep the ${fee} booking fee as a cancellation fee.`,
      `An appointment booked less than ${notice} ahead is already inside this window, so its fee is not refundable if you cancel.`,
      "Refunds are sent when you cancel. Your bank decides how long they take to appear.",
    ] },
    { heading: "Rescheduling", body: [
      `You can move a booking online ${policy.onlineReschedules === 1 ? "once" : `${policy.onlineReschedules} times`}, ${notice} or more before it starts. Your booking fee moves with it.`,
      "For any other change, contact Yuwa.",
    ] },
    { heading: "If Yuwa cancels or moves your appointment", body: [
      "If we cancel, you can choose a new time or receive a full refund of the booking fee.",
    ] },
    { heading: "Preparing for your appointment", body: [
      "Each service lists how to prepare, such as hair length, washing and blow-drying. Please follow it so there is enough time for your style.",
      "Tell us before your appointment about allergies, sensitivities or scalp conditions that may affect your service.",
    ] },
    { heading: "Your consumer rights", body: [
      "Nothing in these terms excludes or limits any right or remedy you have under the Australian Consumer Law, including refunds where a service is not provided with due care and skill.",
    ] },
    { heading: "Changes to these terms", body: [
      "We may update these terms. The version you agreed to when you booked applies to that booking.",
    ] },
    { heading: "Contact", body: ["Use the contact page on our website, or reply to your booking email, with your booking reference."] },
  ],
};

export const privacy: LegalDoc = {
  title: "Privacy Policy",
  intro: "This explains what Yuwa Hair World collects when you use our website and app, why, and your choices. We handle personal information with the Australian Privacy Principles in mind.",
  sections: [
    { heading: "What we collect", body: [
      "Booking details: your name, email, mobile number, chosen service and time, extension colour and any notes you write. Notes may include health information, such as an allergy, if you choose to tell us.",
      "Payment records: the booking fee amount, whether it was paid or refunded, and the payment reference from Stripe. Stripe collects your card details directly; we do not receive your card number.",
      "Messages you send through the contact form.",
    ] },
    { heading: "Why we use it", body: [
      "To book, confirm, change and cancel appointments, take and refund the booking fee, prepare for your service, answer you, and meet our record-keeping obligations.",
      "We do not sell your information, and we do not use it for marketing unless you ask us to.",
    ] },
    { heading: "Who helps us", body: [
      "Stripe processes payments. Resend delivers booking emails when email is switched on. Our hosting provider runs the website. These providers may process data outside Australia.",
      "Reference photos are supplied by Unsplash. When the app loads them, Unsplash receives your device's internet address.",
    ] },
    { heading: "On your phone", body: [
      "The app stores your bookings, saved looks, name, email, mobile number and prep ticks on your device. Reminders are scheduled by your phone. Deleting the app removes this data from the device, not from our booking records.",
      "Each booking has a private link or key that lets you manage it. Do not share it.",
    ] },
    { heading: "Cookies and tracking", body: [
      "Our website and app do not use advertising or analytics tracking. Stripe's payment page has its own cookies and policy.",
    ] },
    { heading: "Keeping and protecting it", body: [
      "We limit who can see booking records and keep them only as long as we need them for the reasons above or as the law requires. No system is perfectly secure.",
    ] },
    { heading: "Your choices", body: [
      "You can ask to see, correct or delete your information through the contact page. Some records may need to be kept by law.",
      "If you have a privacy complaint, contact us first. If you are not satisfied, you can contact the Office of the Australian Information Commissioner (oaic.gov.au).",
    ] },
  ],
};

export const legalDocs = { terms, privacy };
