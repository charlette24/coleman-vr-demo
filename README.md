# Coleman VR Investor Prototype

This is a lightweight prototype for an investor demo of a location-driven AR/VR scavenger-hunt platform.

## What it shows

- A consumer exploration experience with simulated geofenced hunts and reward unlocks
- A sponsor console with reward inventory and campaign analytics
- An SDK/API view showing how third-party developers would embed 3D caches and prize flows

## Fastest local demo

Double-click [launch_demo.command](/Users/charlettesinclair/Downloads/Coleman-VR/launch_demo.command).

That will:

- start a local server
- open the demo in your browser automatically
- print a phone-friendly URL for any iPhone on the same Wi-Fi
- let you refresh after edits without rebuilding anything

## Terminal fallback

If you prefer Terminal, run:

```bash
cd /Users/charlettesinclair/Downloads/Coleman-VR
python3 serve_demo.py
```

The script prints two URLs:

- `Browser URL` for your Mac
- `Phone URL` for iPhones on the same Wi-Fi

If you only want the demo on your Mac, use:

```bash
python3 serve_demo.py --host 127.0.0.1
```

## Making changes

- Edit [index.html](/Users/charlettesinclair/Downloads/Coleman-VR/index.html), [styles.css](/Users/charlettesinclair/Downloads/Coleman-VR/styles.css), or [app.js](/Users/charlettesinclair/Downloads/Coleman-VR/app.js)
- refresh the browser or phone page
- no build step is required

## Going live publicly

This project is static and deployment-ready. I added [vercel.json](/Users/charlettesinclair/Downloads/Coleman-VR/vercel.json) so it can be hosted cleanly on Vercel.

The easiest public-hosting flow is:

1. Put this folder in a GitHub repo.
2. Import that repo into Vercel.
3. Deploy it as a static site.
4. Share the resulting public URL with any iPhone.

I could not finish the actual public deploy from this machine because it currently does not have `npm` or the `vercel` CLI installed, and there is no connected hosting account in this environment.

## Demo flow

1. Start on the hero to explain the mass-market product vision.
2. Open the `Explorer app` tab and click different hotspots to show city-specific hunts.
3. Click `Generate investor demo voucher` to simulate prize issuance.
4. Switch to `Sponsor console` to show sponsor inventory and campaign ROI hooks.
5. Switch to `SDK + APIs` to show the developer platform and backend narrative.
