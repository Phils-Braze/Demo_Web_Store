/**
 * Google Tag Manager replacement shim for @braze/web-sdk.
 * 
 * Replaces all Braze SDK methods with no-op stubs or bridges that push
 * standard events directly to Google Tag Manager's window.dataLayer.
 * Keeps all UI components, buttons, feeds, and forms functional without
 * loading any Braze SDK code or external Braze dependencies.
 */

import {
  pushToDataLayer,
  gtmTrackLogin,
  gtmTrackLogout,
  gtmTrackCustomEvent,
} from "../gtm";
import { brazeAppLog } from "../brazeAppLog";

export interface Card {
  id: string;
  title?: string;
  description?: string;
  imageUrl?: string;
  url?: string;
  dismissible?: boolean;
  extras?: Record<string, string>;
  pinned?: boolean;
  viewed?: boolean;
  created?: number;
  updated?: number;
  categories?: string[];
}

export interface ContentCards {
  cards: Card[];
  getUnviewedCardCount(): number;
}

export interface Banner {
  id: string;
  placementId: string;
  extras?: Record<string, string>;
}

export interface InAppMessage {
  message?: string;
  header?: string;
  extras?: Record<string, string>;
}

export interface FeatureFlag {
  id: string;
  enabled: boolean;
  getStringProperty(key: string): string | null;
  getNumberProperty(key: string): number | null;
  getBooleanProperty(key: string): boolean | null;
  getTimestampProperty(key: string): number | null;
}

export type InitializationOptions = Record<string, unknown>;

class MockUser {
  private userId: string | null = null;

  constructor(id: string | null = null) {
    this.userId = id;
  }

  getUserId(): string | null {
    return this.userId;
  }

  setFirstName(name: string): void {
    pushToDataLayer("set_user_attribute", { attribute: "firstName", value: name });
  }

  setLastName(name: string): void {
    pushToDataLayer("set_user_attribute", { attribute: "lastName", value: name });
  }

  setEmail(email: string): void {
    pushToDataLayer("set_user_attribute", { attribute: "email", value: email });
  }

  setPhoneNumber(phone: string): void {
    pushToDataLayer("set_user_attribute", { attribute: "phone", value: phone });
  }

  setCustomUserAttribute(key: string, value: unknown): void {
    pushToDataLayer("set_custom_user_attribute", { key, value });
  }

  addToCustomAttributeArray(key: string, value: string): void {
    pushToDataLayer("add_to_custom_attribute_array", { key, value });
  }

  removeFromCustomAttributeArray(key: string, value: string): void {
    pushToDataLayer("remove_from_custom_attribute_array", { key, value });
  }

  setCountry(country: string): void {
    pushToDataLayer("set_user_attribute", { attribute: "country", value: country });
  }

  setHomeCity(city: string): void {
    pushToDataLayer("set_user_attribute", { attribute: "homeCity", value: city });
  }

  setDateOfBirth(year: number, month: number, day: number): void {
    pushToDataLayer("set_user_attribute", {
      attribute: "dateOfBirth",
      value: `${year}-${month}-${day}`,
    });
  }

  setGender(gender: string): void {
    pushToDataLayer("set_user_attribute", { attribute: "gender", value: gender });
  }
}

let currentUserInstance = new MockUser();
let isSdkInitialized = false;
let currentSubscriptions: Array<() => void> = [];

export function initialize(
  _apiKey?: string,
  _options?: InitializationOptions,
): boolean {
  isSdkInitialized = true;
  brazeAppLog({
    type: "info",
    message: "GTM build active: Braze SDK replaced with Google Tag Manager dataLayer bridge.",
  });
  return true;
}

export function isInitialized(): boolean {
  return isSdkInitialized;
}

export function changeUser(userId: string): void {
  currentUserInstance = new MockUser(userId);
  gtmTrackLogin(userId);
}

export function getUser(): MockUser {
  return currentUserInstance;
}

export function logCustomEvent(
  eventName: string,
  eventProperties?: Record<string, unknown>,
): boolean {
  gtmTrackCustomEvent(eventName, eventProperties);
  return true;
}

export function logPurchase(
  productId: string,
  price: number,
  currencyCode = "USD",
  quantity = 1,
  purchaseProperties?: Record<string, unknown>,
): boolean {
  pushToDataLayer("purchase_item", {
    product_id: productId,
    price,
    currency: currencyCode,
    quantity,
    ...purchaseProperties,
  });
  return true;
}

export function openSession(): void {
  pushToDataLayer("session_start");
}

export function requestImmediateDataFlush(): void {
  // GTM pushes synchronously to window.dataLayer
}

export function requestContentCardsRefresh(
  onSuccess?: () => void,
  _onError?: () => void,
): void {
  setTimeout(() => onSuccess?.(), 0);
}

export function requestBannersRefresh(
  _placementIds?: string[],
  onSuccess?: () => void,
): void {
  setTimeout(() => onSuccess?.(), 0);
}

export function getCachedContentCards(): ContentCards {
  return {
    cards: [],
    getUnviewedCardCount: () => 0,
  };
}

export function getCachedBanners(): Banner[] {
  return [];
}

export function subscribeToContentCardsUpdates(
  callback: (cards: ContentCards) => void,
): string {
  const handler = () => callback({ cards: [], getUnviewedCardCount: () => 0 });
  currentSubscriptions.push(handler);
  return "gtm_sub_cards";
}

export function subscribeToBannersUpdates(
  callback: (banners: Banner[]) => void,
): string {
  const handler = () => callback([]);
  currentSubscriptions.push(handler);
  return "gtm_sub_banners";
}

export function subscribeToInAppMessage(
  _callback: (msg: InAppMessage) => void,
): string {
  return "gtm_sub_iam";
}

export function subscribeToFeatureFlagsUpdates(
  callback: () => void,
): string {
  const handler = () => callback();
  currentSubscriptions.push(handler);
  return "gtm_sub_ff";
}

export function removeSubscription(_id: string): void {
  // no-op
}

export function showInAppMessage(_msg: InAppMessage): void {
  // no-op
}

export function automaticallyShowInAppMessages(): void {
  // no-op
}

export function logCardImpressions(_cards: Card[]): void {
  // no-op
}

export function logCardClick(_card: Card): void {
  // no-op
}

export function logCardDismissal(_card: Card): void {
  // no-op
}

export function getFeatureFlag(flagId: string): FeatureFlag {
  return {
    id: flagId,
    enabled: true,
    getStringProperty: () => null,
    getNumberProperty: () => null,
    getBooleanProperty: () => null,
    getTimestampProperty: () => null,
  };
}

export function getAllFeatureFlags(): FeatureFlag[] {
  return [
    {
      id: "enable_vip_products",
      enabled: true,
      getStringProperty: () => null,
      getNumberProperty: () => null,
      getBooleanProperty: () => null,
      getTimestampProperty: () => null,
    },
  ];
}

export function isPushSupported(): boolean {
  return false;
}

export function isPushPermissionGranted(): boolean {
  return false;
}

export function isPushBlocked(): boolean {
  return false;
}

export async function requestPushPermission(): Promise<string> {
  return "denied";
}

export function registerAppboyPushMessages(): void {
  // no-op
}

export function setLogger(_logger: unknown): void {
  // no-op
}

export function destroy(): void {
  gtmTrackLogout(currentUserInstance.getUserId() || undefined);
  currentUserInstance = new MockUser();
  currentSubscriptions = [];
}

const brazeShim = {
  initialize,
  isInitialized,
  changeUser,
  getUser,
  logCustomEvent,
  logPurchase,
  openSession,
  requestImmediateDataFlush,
  requestContentCardsRefresh,
  requestBannersRefresh,
  getCachedContentCards,
  getCachedBanners,
  subscribeToContentCardsUpdates,
  subscribeToBannersUpdates,
  subscribeToInAppMessage,
  subscribeToFeatureFlagsUpdates,
  removeSubscription,
  showInAppMessage,
  automaticallyShowInAppMessages,
  logCardImpressions,
  logCardClick,
  logCardDismissal,
  getFeatureFlag,
  getAllFeatureFlags,
  isPushSupported,
  isPushPermissionGranted,
  isPushBlocked,
  requestPushPermission,
  registerAppboyPushMessages,
  setLogger,
  destroy,
};

export default brazeShim;
