import { createUserTable } from "./mockBackend";
import { STORAGE } from "./storageKeys";

export type BrazeLastSentValues = {
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  mobile: string | null;
  favoriteProductCategory: string | null;
  activeMember: boolean | null;
  vipMember: boolean | null;
  paidMembership: boolean | null;
};

function empty(): BrazeLastSentValues {
  return {
    firstName: null,
    lastName: null,
    email: null,
    mobile: null,
    favoriteProductCategory: null,
    activeMember: null,
    vipMember: null,
    paidMembership: null,
  };
}

const lastSentTable = createUserTable<Partial<BrazeLastSentValues>>(
  STORAGE.brazeLastSent,
);

export function loadBrazeLastSent(userId: string): BrazeLastSentValues {
  return { ...empty(), ...lastSentTable.get(userId) };
}

export function mergeBrazeLastSent(
  userId: string,
  patch: Partial<BrazeLastSentValues>,
): void {
  lastSentTable.set(userId, { ...loadBrazeLastSent(userId), ...patch });
}
