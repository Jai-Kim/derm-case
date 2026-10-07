# DermCase on Google Play: runbook

The web app is already installable on Android (Chrome menu, "Install app"). This folder is everything needed to put the same app in the Play Store as a Trusted Web Activity (TWA): the Android app is a thin shell that opens `dermcase.jai-kim.com/app` full screen once Google has verified that you own the domain.

Why I could not build the Android file myself: the build needs Google's Android SDK and Maven, which this sandbox's network policy blocks. Everything else is done and tested.

## Done in the repo

| Piece | Where |
|---|---|
| Privacy policy, English and Korean, readable without JavaScript | `/privacy` |
| Account deletion (required by Play) | Library page button, plus `delete_my_account()` in `supabase-schema.sql` |
| Digital Asset Links endpoint | `/.well-known/assetlinks.json` (empty until you add fingerprints) |
| TWA build config | `android/twa-manifest.json` |
| Store text, English and Korean | `store/listing.md` |
| Icon, feature graphics, phone screenshots | `store/` |
| Answers for Data safety, Health apps, content rating | `store/declarations.md` |
| Package name (permanent once published) | `com.jai_kim.dermcase` |
| Automated checks | `node tests/smoke.js` |

## What only you can do, in order

| # | Step | Time |
|---|---|---|
| 1 | Run the SQL block at the bottom of `supabase-schema.sql` in the Supabase SQL editor. Without it, "Delete account" shows an error | 2 min |
| 2 | In `config.js`, set `window.DERMCASE_CONTACT_EMAIL = "you@..."`. The privacy page shows it instead of the GitHub issues fallback | 1 min |
| 3 | Create a Play developer account at play.google.com/console. $25 once, ID verification. Personal is fine for the pilot | 15 min + Google's wait |
| 4 | Build the Android App Bundle, option A below | 10 min |
| 5 | Play Console, Create app, then Testing, Internal testing, upload the `.aab`, add testers by Gmail address, copy the opt-in link | 20 min |
| 6 | Play Console, Test and release, Setup, App signing. Copy the **SHA-256 certificate fingerprint** under "App signing key certificate" | 2 min |
| 7 | Add that fingerprint (and the upload key's, from step 4) to `/.well-known/assetlinks.json`, commit, wait for deploy. Or send me the fingerprints and I will | 5 min |
| 8 | Fill Store listing and App content from `listing.md` and `declarations.md` | 40 min |
| 9 | Install from the opt-in link on an Android phone. If there is no address bar, verification worked. If there is one, the fingerprint is missing or wrong | 5 min |

Production release for a personal developer account created after November 2023 first needs a closed test with at least 12 testers opted in for 14 continuous days. Internal testing (up to 100 testers, no review) does not count toward that and is the right channel for the dermatologist pilot.

## Step 4, option A: PWABuilder (recommended, no installs)

1. Open pwabuilder.com, enter `https://dermcase.jai-kim.com`, press Start.
2. Package for stores, Android, Google Play.
3. Set the values from `android/twa-manifest.json`: package ID `com.jai_kim.dermcase`, name and launcher name DermCase, host `dermcase.jai-kim.com`, start URL `/app?source=twa`, version 1.0.0 with version code 1, theme and background `#F4F5F3`, fallback behavior Custom Tabs, notifications off. Field labels may differ slightly.
4. Signing key: choose "create new". Download the zip. It holds `signing.keystore`, `signing-key-info.txt` with the passwords, an `assetlinks.json`, and the `.aab`.
5. Store the keystore and passwords in your password manager. Never commit them. `.gitignore` already blocks `*.keystore`. Play App Signing keeps the real app-signing key at Google, so a lost upload key can be reset through Play support.

## Step 4, option B: Bubblewrap on your own machine

```
npm i -g @bubblewrap/cli
mkdir dermcase-android && cd dermcase-android
cp <repo>/android/twa-manifest.json .
bubblewrap build
```
Bubblewrap offers to download the JDK and Android SDK on first run, then asks to create a keystore. Use this for later versions: bump `appVersionCode` and `appVersionName` in `twa-manifest.json`, rebuild, upload.

## Capturing screenshots again

Start any static server on the repo root with Vercel-style clean URLs on port 8123, then use Playwright at 360 x 640, device scale factor 3, mobile mode: load `/`, `/app` (press "Load example"), scroll to each brief section. The scripts used were throwaway, so ask Claude to regenerate them.

## Updating after launch

Web changes ship by pushing to `main` and Vercel deploys. The Android app does not need a new release for web changes. A new Play version is only needed to change the package, host, icon, colors or start URL.
