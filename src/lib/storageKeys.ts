export const STORAGE = {
  /** Active client session: `{ userId, sessionId, startedAt }`. Removed on logout. */
  session: "phil_wed_store_session",
  /** Mock backend tables, keyed by user ID. Survive logout. */
  profiles: "phil_wed_store_profiles",
  carts: "phil_wed_store_carts",
  purchases: "phil_wed_store_purchase_history",
  /** Cached Braze `total_revenue` per user (USD), merged with local orders for lifetime spend / VIP. */
  brazeTotalRevenueByUser: "phil_wed_store_braze_total_revenue",
  brazeLastSent: "phil_wed_store_braze_last_sent",
  /** Device preferences. */
  guestDarkMode: "phil_wed_store_guest_dark",
  brazeApiKey: "braze_api_key",
  brazeSdkEndpoint: "braze_sdk_endpoint",
  brazeRestApiKey: "braze_rest_api_key",
  brazeRestEndpoint: "braze_rest_endpoint",
  brazeAllowUserJs: "braze_demo_allow_user_supplied_javascript",
  schemaVersion: "phil_wed_store_schema_version",
} as const;

/** Keys written by schema v1; removed by `migrateStorage`. */
export const LEGACY_STORAGE = {
  currentUserId: "phil_wed_store_current_user",
  cartItems: "phil_wed_store_cart_items",
} as const;
