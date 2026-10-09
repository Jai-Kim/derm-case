# Play Console declarations: answer sheet

Drafted from what the code actually does. You sign these forms, so read each answer against the definition on the form before you submit. Sources: Google Play Health Content and Services policy, Health apps declaration help page, Data safety help.

## App content

| Section | Answer | Why |
|---|---|---|
| Privacy policy | https://dermcase.jai-kim.com/privacy | Required, and for health apps also required inside the app (linked from the app page, footer and login) |
| App access | All functionality available without login | Account is optional. "Load example" shows a full brief with no photo |
| Ads | No | No ads, no ad SDKs. Anonymous usage counts exist (see Data safety), they are not advertising |
| Content rating | Utility / reference. No violence, sexual content, language, gambling. No user-to-user interaction, no user-generated content shared with others, no location sharing, no purchases | Questionnaire answers; result should be low |
| Target audience | 18 and over only | Tool for licensed professionals. Avoids the Families policy |
| News app | No | |
| Government app | No | |
| Financial features | None | |
| Data safety | See below | |
| Health apps | See below | |
| Account deletion | In-app: Library, "Delete account and all cases". Web link: https://dermcase.jai-kim.com/privacy#delete | Required for apps that let users create accounts |

## Health apps declaration

| Question | Suggested answer | Note |
|---|---|---|
| Health features | Medical reference and education. Clinical decision support | Select what the app does. It surfaces literature and a differential for clinicians, so both describe it. Do not tick "diagnosis" style options for features the app does not claim |
| Intended users | Healthcare professionals | |
| Disclaimer in app | Present on landing, app, About and Privacy pages: "not a medical device and does not diagnose, treat, cure or prevent any medical condition", plus advice to consult a professional | Matches Google's required wording |

### Regulatory risk, read once

The app reads a clinical photo and proposes a differential with ICD-10 codes. Regulators can treat software that analyzes a medical image to suggest diagnoses as a medical device, whatever the disclaimer says. The US clinical decision support exemption excludes software that analyzes medical images. Korea's MFDS regulates AI image-analysis software for diagnostic aid. I am not a lawyer and this is not legal advice. What it means in practice:

| Path | Exposure |
|---|---|
| Internal or closed testing with named dermatologists (the pilot) | Low. Not a public listing |
| Public production listing | Google can ask for proof of regulatory approval or clearance if it judges the app a medical device. Get a regulatory read first |

Recommendation: ship to Play through internal testing for the pilot, and get a short regulatory consult before any public production release.

## Data safety form

Definitions that matter. "Collect" means data leaves the device to you or a service provider. "Share" excludes transfers to a service provider that processes data on your behalf, and excludes transfers the user starts. Anthropic, Vercel and Supabase act as service providers. Confirm against Google's definition before you submit.

| Data type | Collected | Shared | Required or optional | Purpose | Stored beyond the request |
|---|---|---|---|---|---|
| Photos | Yes | No | Required for analysis | App functionality | Not by DermCase. Anthropic states deletion within 30 days, so do not tick "processed ephemerally" |
| Health info (case details: age, sex, site, duration, skin type, notes) | Yes | No | Required for analysis | App functionality | Only if the user saves: case details except notes |
| Email address | Yes | No | Optional (account) | App functionality, account management | Yes, until the account is deleted |
| Other user-generated content (saved brief) | Yes | No | Optional | App functionality | Yes, until deleted |
| App interactions (page views, and how many analyses run and how they end) | Yes | No | Required | Analytics, app functionality | Page views: Vercel Web Analytics, cookie-free, no persistent ID, off when Do Not Track or Global Privacy Control is on. Analysis tally: anonymous daily counts in our database with no ID, IP, photo or case text |
| Device or other IDs (IP address in host logs) | Yes | No | Required | Security, app functionality | Per host log retention. Declare conservatively |

| Security practices | Answer |
|---|---|
| Data encrypted in transit | Yes (HTTPS only) |
| Security notes for the reviewer | Strict content-security policy, no third-party scripts, API accepts only the app's own requests with a daily limit, security.txt published |
| Users can request data deletion | Yes |
| Follows Families policy | Not applicable (adults only) |
| Independent security review | No |

## Reviewer note (paste into "App access" notes)

DermCase needs no login. Open the app, tap "Load example" to see a complete brief without uploading anything. To test the real flow, upload any skin photo; a model call takes 20 to 60 seconds. The app is a literature reference for clinicians and is not a medical device.
