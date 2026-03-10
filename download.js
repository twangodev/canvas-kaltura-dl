// Canvas Kaltura Video Downloader - Console Version
// 1. Play the video on Canvas
// 2. Open DevTools (F12) and go to the Console tab
// 3. Paste this script and press Enter

(() => {
    const KALTURA_PATTERN = "cfvod.kaltura.com/hls/";
    function transformUrl(url) {
        // Handle both /hls/ and /scf/hls/ patterns
        const sourceUrl = url.replace("/scf/hls/", "/pd/").replace("/hls/", "/pd/");
        const mp4Index = sourceUrl.indexOf(".mp4");
        return mp4Index !== -1 ? sourceUrl.substring(0, mp4Index + 4) : sourceUrl;
    }

    function searchPerformanceEntries(win) {
        try {
            return win.performance
                .getEntriesByType("resource")
                .filter((e) => e.name.includes(KALTURA_PATTERN))
                .map((e) => transformUrl(e.name));
        } catch {
            return [];
        }
    }

    // Search current window and all accessible iframes
    let urls = searchPerformanceEntries(window);
    document.querySelectorAll("iframe").forEach((iframe) => {
        try {
            urls = urls.concat(searchPerformanceEntries(iframe.contentWindow));
        } catch {
            // cross-origin iframe, can't access
        }
    });

    // Deduplicate
    urls = [...new Set(urls)];

    if (urls.length > 0) {
        console.log("Found Kaltura video URL(s):");
        urls.forEach((url, i) => console.log(`  ${i + 1}. ${url}`));
        window.open(urls[0], "_blank");
        if (urls.length > 1) {
            console.log("Opened the first URL. Copy others from above if needed.");
        }
    } else {
        console.log(
            "No Kaltura video found yet. Setting up interceptor — play or seek the video..."
        );

        // Monkey-patch XMLHttpRequest to catch future requests
        const origOpen = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function (method, url) {
            if (typeof url === "string" && url.includes(KALTURA_PATTERN)) {
                const downloadUrl = transformUrl(url);
                console.log("Kaltura video found:", downloadUrl);
                window.open(downloadUrl, "_blank");
                XMLHttpRequest.prototype.open = origOpen; // restore
            }
            return origOpen.apply(this, arguments);
        };
    }
})();