# Canvas Kaltura Video Downloader

![License](https://img.shields.io/github/license/twangodev/canvas-kaltura-dl?logo=opensourceinitiative&logoColor=white)
![Platform: Browser Console](https://img.shields.io/badge/platform-browser%20console-lightgrey?logo=googlechrome&logoColor=white)
![Kaltura: Hosted](https://img.shields.io/badge/kaltura-hosted%20(cfvod)-orange?logo=kaltura&logoColor=white)
![No Dependencies](https://img.shields.io/badge/dependencies-none-brightgreen?logo=javascript&logoColor=white)

A browser console script that extracts direct download URLs for Kaltura-hosted videos. Works on Canvas LMS and any platform using hosted Kaltura (`cfvod.kaltura.com`).

## Usage

1. Navigate to the Canvas page containing the Kaltura video.
2. Play the video (at least briefly) so the browser loads the HLS stream URL.
3. Open DevTools (`F12` or `Cmd+Shift+I` on Mac).
4. Go to the **Console** tab.
5. Paste the contents of `download.js` and press **Enter**.

If a video URL is found, it opens automatically in a new tab. If multiple URLs are found, additional URLs are printed in the console.

## Changing Console Context for Iframes

Kaltura videos on Canvas are often embedded inside an iframe. The script tries to search iframe performance entries automatically, but cross-origin restrictions may block access. If the script reports "No Kaltura video found," you likely need to switch the console's execution context:

1. Open DevTools and go to the **Console** tab.
2. Look for the **context selector** dropdown — it's near the top of the console and usually says **"top"** by default.
   - **Chrome/Edge:** dropdown at the top-left of the Console panel.
   - **Firefox:** small dropdown above the console input that shows the current context.
3. Click the dropdown and select the iframe that contains the Kaltura player (look for entries with `kaltura` or the Canvas tool/media URL).
4. Paste and run the script again within that iframe context.

## How It Works

- Scans `performance.getEntriesByType("resource")` for URLs matching `cfvod.kaltura.com/hls/`.
- Transforms the HLS streaming URL into a direct `.mp4` download URL by replacing `/hls/` (or `/scf/hls/`) with `/pd/` and trimming everything after `.mp4`.
- If no URL is found in existing entries, it monkey-patches `XMLHttpRequest.prototype.open` to intercept future requests — just play or seek the video and it will be caught automatically.

## Troubleshooting

| Problem | Solution |
|---|---|
| "No Kaltura video found" | Switch the console context to the Kaltura iframe (see above), then re-run the script. |
| Still nothing after switching context | Make sure the video has actually started playing. Seek or restart playback, then run the script again. |
| New tab is blocked by popup blocker | Allow popups for the Canvas domain, or copy the URL printed in the console and open it manually. |
| Downloaded file has no extension | Rename it to `.mp4`. |