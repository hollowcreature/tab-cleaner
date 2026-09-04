# Tab Cleaner

A browser extension for manually cleaning up open tabs

## What it does

- **Groups panel** scans all open tabs and groups exact duplicates together (e.g. two identical `youtube.com` home tabs group up, while distinct video tabs stay separate).
- **Staleness panel** lists every open tab individually, sorted oldest-viewed first, showing how long it's been since each was last accessed.

Check what you want to clean and press the Confirm button.

## Project structure

```
firefox/    # Firefox (Manifest V3) build — manifest.json, popup.html/js/css, icons
chromium/   # Chrome / Edge / Opera / Brave build (Chromium-based, Manifest V3)
```

## Install

Packaged builds are published under this repo's [Releases](../../releases).

**Firefox** — download the `.xpi` and install it via `about:addons` → gear icon → **Install Add-on From File**.

**Chromium** (Chrome, Edge, Opera, Brave) — download and unzip the Chromium build, then:

1. Go to `chrome://extensions` (or your browser's equivalent).
2. Enable **Developer mode** (toggle, top-right).
3. Click **Load unpacked** and select the unzipped folder.

## Tech

HTML/CSS/JavaScript. Built directly against each platform's tabs API — [`browser.tabs`](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/tabs) on Firefox, [`chrome.tabs`](https://developer.chrome.com/docs/extensions/reference/api/tabs) on Chromium.
