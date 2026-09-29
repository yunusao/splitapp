# Five-Day Split

A personal workout log for a five-day split, built as an installable PWA (React + TypeScript + Vite). Works offline, installs to your phone's home screen, and stores everything on the device.

## Features
- 5 training days, 6 exercises each, 3 × 12 target
- Log weight and reps for every set; the weight carries down to the next set after you log reps
- Previous weight per exercise, updated automatically when you finish a workout
- "Move up in weight" reminder when you hit 12 reps on all 3 sets
- Info panel for each exercise: muscles worked, how to do it, a form tip, and a demo link
- History of every finished workout, plus a progress chart per exercise
- Export and restore a JSON backup

## Run locally
```bash
npm install
npm run dev
```

## Deploy (Vercel, free)
1. Push this folder to a new GitHub repo.
2. Go to vercel.com, choose **Add New → Project**, and import the repo.
3. Vercel detects Vite automatically. Click **Deploy**.

Netlify or Cloudflare Pages work the same way (build command `npm run build`, output folder `dist`).

## Install on your phone
- **iPhone (Safari):** open your Vercel URL, tap Share → **Add to Home Screen**.
- **Android (Chrome):** open the URL, tap ⋮ → **Install app**.

It then opens full-screen from its own icon and works with no signal at the gym.

## Where the data lives
Everything is saved in the browser's local storage on that phone. Use **Backup → Export backup** now and then, and **Restore from backup** to move to a new phone.

## Editing exercises
Exercises and how-to text are in `src/data.ts`. Keep an exercise's `id` the same when renaming it so its history stays linked.
