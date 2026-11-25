# Yuwa Hair World - mobile app

Expo SDK 58 · React Native · Expo Router · TypeScript. Same pink system, fonts, logo, sticker and receipt as the website.

## Run it

The app books through the website, so start both (same computer):

```
cd ../Yuwa && npm run dev      # website and booking API on port 3000
cd ../Yuwa-app && npm start    # then scan the QR code with Expo Go (phone on the same Wi-Fi)
```

If the phone cannot load times, allow Node through the Windows firewall on private networks. `w` in the Expo terminal opens a browser preview.

## What's in it

| Tab | Does |
|---|---|
| Home | Search, bento board (next step, services, saved board, how it works), fresh looks, story tiles |
| Looks | Search, photo categories, staggered grid; a look page with "Book this style" and "More like this" |
| Book | Three steps with a progress bar: service (photo tiles, then options), time, details and fee |
| Visits | Upcoming and past list; open one to pay, reschedule, cancel or tick off prep |
| Profile | Your details (prefill bookings), reminders switch, help, legal, clear phone data |

Also: launch splash, three-screen intro on first run (replay from Profile), and a "How it works" screen.
Every screen uses `src/components/screen.tsx`: header, content, pinned next action. Photo tiles and grids live in
`src/components/bento.tsx`; every tile must say what tapping it does.

Fees and terms come from the website (`content/policy.ts`, `content/legal.ts`). Payment opens the website's checkout in an
in-app browser: Stripe when the website has a key, a pretend page in local development.

Bookings, saved looks and contact details are stored on the phone only. A local reminder is set the day before (or two hours before for short notice).

## Content

`src/content/` is **copied from the website**. Edit `../Yuwa/content/`, then run `npm run sync`.

## Not built yet

- Returning from payment automatically: the customer closes the browser, then the app checks the booking.
- Managing bookings made on the website from the app (the emailed private link does that).
- Accounts or syncing bookings across phones. Push notifications from the studio.
- Store release: needs the live website address (`EXPO_PUBLIC_API_URL`, defaults to `site.url`), Apple and Google developer accounts, bundle identifiers, final icon sign-off and finalised legal pages.
- Opening hours are still placeholders (see the website's `content/booking.ts`) and photos are Unsplash references.
