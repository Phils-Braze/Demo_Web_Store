import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dir = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "static-html-site-gtm");
const gtmHtml = path.join(dir, "index.gtm.html");
const standardHtml = path.join(dir, "index.html");

fs.mkdirSync(dir, { recursive: true });

// Ensure static-html-site-gtm/index.html exists from index.gtm.html
if (fs.existsSync(gtmHtml)) {
  fs.copyFileSync(gtmHtml, standardHtml);
  console.log("Created static-html-site-gtm/index.html");
}

const text = `Demo Store — Google Tag Manager Static Edition
============================================================

Overview
--------
• Fully duplicate standalone version of Demo Store.
• Braze Web SDK completely stripped out.
• Google Tag Manager installed (Container ID: GTM-57Q85TXB).
• Standard eCommerce & user events instrumented to window.dataLayer:
  - page_view (route changes)
  - login / logout
  - add_to_cart (GA4 items & value schema)
  - remove_from_cart
  - purchase (order total, items, transaction ID)
  - user_profile_update
  - custom_event (Push demo triggers, user actions)

How to Open & Run
-----------------
1. Double-click index.html or open it directly in any browser (file://).
2. Or serve folder with any HTTP server:
   npx serve static-html-site-gtm
   or
   python3 -m http.server -d static-html-site-gtm

Rebuilding
----------
To recompile this bundle after changing source code:
  npm run build:static-gtm

Testing with GTM / Tag Assistant
---------------------------------
• Open Google Tag Assistant (tagassistant.google.com).
• Connect to your running URL or local server.
• Actions performed in store push events immediately to window.dataLayer.
• Click "☰ Logs" in the top header to view live in-app dataLayer events stream.
`;

fs.writeFileSync(path.join(dir, "README.txt"), text, "utf8");
console.log("Wrote static-html-site-gtm/README.txt");

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const headersSrc = path.join(root, "public", "_headers");
const robotsSrc = path.join(root, "public", "robots.txt");
if (fs.existsSync(headersSrc)) fs.copyFileSync(headersSrc, path.join(dir, "_headers"));
if (fs.existsSync(robotsSrc)) fs.copyFileSync(robotsSrc, path.join(dir, "robots.txt"));

