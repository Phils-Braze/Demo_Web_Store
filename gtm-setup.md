# GTM setup summary

Source: `tag_assistant_phil_gith_workers_dev_2026_10_29 (1).json`

## Container GTM-57Q85TXB

### Triggers (Custom Event, one per dataLayer event)

| Event name | Seen | Params |
|---|---|---|
| `page_view` | 13 | `page_path`, `page_title`, `page_location` |
| `add_to_cart` | 6 | `ecommerce` |
| `select_item_list` | 3 | `item_list_name` |
| `purchase` | 1 | `ecommerce` |
| `login` | 3 | `user_id`, `method`, `user_properties` |
| `logout` | 2 | `user_id` |

### Data Layer Variables (name → sample value)

| Key | Sample | Events |
|---|---|---|
| `page_path` | `/content` | page_view |
| `page_title` | `Demo Store — Google Tag Manager` | page_view |
| `page_location` | `https://gtm-demo-web-store.phil-gith.workers.dev/?gtm_debug=1793234570789#/co...` | page_view |
| `ecommerce` | `{"currency":"USD","value":1299.99,"items":[{"item_id":"9","item_name":"Premiu...` | add_to_cart, purchase |
| `item_list_name` | `VIP Products` | select_item_list |
| `user_id` | `user1` | login, logout |
| `method` | `User ID` | login |
| `user_properties` | `{}` | login |

### Tags fired

- Braze SDK (Braze Initialization Tag) on: page_view, add_to_cart, select_item_list, purchase, login, logout, gtm.load, gtm.dom, gtm.js, gtm.init, gtm.init_consent

### Variables resolved in preview

- _event (Custom Event)
- Page URL (URL)
- Page Hostname (URL)
- Page Path (URL)
- Referrer (HTTP Referrer)
- Event (Custom Event)
- Click Element (Data Layer Variable)
- Click Classes (Data Layer Variable)
- Click ID (Data Layer Variable)
- Click Target (Data Layer Variable)
- Click URL (Data Layer Variable)
- Click Text (Auto-Event Variable)
- Form Element (Data Layer Variable)
- Form Classes (Data Layer Variable)
- Form ID (Data Layer Variable)
- Form Target (Data Layer Variable)
- Form URL (Data Layer Variable)
- Form Text (Auto-Event Variable)
- Container ID (Container ID)
