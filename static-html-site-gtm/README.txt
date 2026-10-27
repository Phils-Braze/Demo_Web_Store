Demo Store — Google Tag Manager Static Edition
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
