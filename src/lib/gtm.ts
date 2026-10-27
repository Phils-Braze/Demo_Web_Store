import { brazeAppLog } from "./brazeAppLog";

export const GTM_CONTAINER_ID =
  import.meta.env.VITE_GTM_CONTAINER_ID || "GTM-57Q85TXB";

export function isGtmMode(): boolean {
  return import.meta.env.VITE_APP_MODE === "gtm";
}

export type GtmEcommerceItem = {
  item_id: string;
  item_name: string;
  price: number;
  item_category?: string;
  quantity?: number;
};

/**
 * Push an event object to Google Tag Manager dataLayer.
 * Also mirrors to in-app Logs for live debugging.
 */
export function pushToDataLayer(
  event: string,
  payload: Record<string, unknown> = {},
): void {
  if (typeof window === "undefined") return;

  window.dataLayer = window.dataLayer || [];
  const fullPayload = {
    event,
    ...payload,
  };

  window.dataLayer.push(fullPayload);

  // Send to in-app log sink so user can see it in ☰ Logs
  brazeAppLog({
    type: "event",
    message: `[GTM dataLayer] event: "${event}"`,
    detail: JSON.stringify(fullPayload, null, 2),
  });
}

/** Track page navigation / view */
export function gtmTrackPageView(path: string, title?: string): void {
  pushToDataLayer("page_view", {
    page_path: path,
    page_title: title || (typeof document !== "undefined" ? document.title : ""),
    page_location: typeof window !== "undefined" ? window.location.href : "",
  });
}

/** Track user login */
export function gtmTrackLogin(
  userId: string,
  attributes?: Record<string, unknown>,
): void {
  pushToDataLayer("login", {
    user_id: userId,
    method: "User ID",
    user_properties: attributes || {},
  });
}

/** Track user logout */
export function gtmTrackLogout(userId?: string): void {
  pushToDataLayer("logout", {
    user_id: userId || null,
  });
}

/** Track item added to cart */
export function gtmTrackAddToCart(
  item: { id: string; name: string; price: number; category?: string },
  quantity = 1,
): void {
  pushToDataLayer("add_to_cart", {
    ecommerce: {
      currency: "USD",
      value: Number((item.price * quantity).toFixed(2)),
      items: [
        {
          item_id: item.id,
          item_name: item.name,
          price: item.price,
          item_category: item.category || "General",
          quantity,
        },
      ],
    },
  });
}

/** Track item removed from cart */
export function gtmTrackRemoveFromCart(
  item: { id: string; name: string; price: number; category?: string },
  quantity = 1,
): void {
  pushToDataLayer("remove_from_cart", {
    ecommerce: {
      currency: "USD",
      value: Number((item.price * quantity).toFixed(2)),
      items: [
        {
          item_id: item.id,
          item_name: item.name,
          price: item.price,
          item_category: item.category || "General",
          quantity,
        },
      ],
    },
  });
}

/** Track successful purchase / checkout */
export function gtmTrackPurchase(
  transactionId: string,
  total: number,
  items: Array<{ id: string; name: string; price: number; category?: string; quantity?: number }>,
): void {
  pushToDataLayer("purchase", {
    ecommerce: {
      transaction_id: transactionId,
      value: Number(total.toFixed(2)),
      currency: "USD",
      items: items.map((i) => ({
        item_id: i.id,
        item_name: i.name,
        price: i.price,
        item_category: i.category || "General",
        quantity: i.quantity || 1,
      })),
    },
  });
}

/** Track custom user action or feature event */
export function gtmTrackCustomEvent(
  eventName: string,
  properties?: Record<string, unknown>,
): void {
  pushToDataLayer(eventName, properties || {});
}

/** Track profile attribute updates */
export function gtmTrackProfileUpdate(
  userId: string,
  attributes: Record<string, unknown>,
): void {
  pushToDataLayer("user_profile_update", {
    user_id: userId,
    user_properties: attributes,
  });
}
