/** Environment-wide product switches. Authentication and recovery are infrastructure. */
export const FEATURE_REGISTRY = {
  workspaceCreation: { default: true, available: true },
  workspaceSettings: { default: true, available: true },
  membership: { default: true, available: true },
  teamManagement: { default: true, available: true },
  groups: { default: true, available: true },
  discussions: { default: true, available: true },
  messaging: { default: true, available: true },
  polls: { default: true, available: true },
  pages: { default: true, available: true },
  tasks: { default: true, available: true },
  attachments: { default: true, available: true },
  profiles: { default: true, available: true },
  billing: { default: true, available: true },
  // The selected Calls/SFU replacement and MCP transport are not implemented.
  calls: { default: false, available: false },
  agentAccess: { default: false, available: false },
  // These legacy implementations are outside the approved product scope.
  hostedGeneration: { default: false, available: false },
  resources: { default: false, available: false },
} as const;

export type Feature = keyof typeof FEATURE_REGISTRY;
export type FeatureFlags = Record<Feature, boolean>;
export const FEATURES = Object.keys(FEATURE_REGISTRY) as Feature[];
export const FLAG_REFRESH_MS = 15_000;
export const FLAG_MAX_STALE_MS = 60_000;
export const FLAG_REQUEST_TIMEOUT_MS = 5_000;

export function closedFlags(): FeatureFlags {
  return Object.fromEntries(
    FEATURES.map((key) => [key, false]),
  ) as FeatureFlags;
}

export function resolveFlags(
  rows: { key: string; enabled: unknown }[],
): FeatureFlags {
  const flags = Object.fromEntries(
    FEATURES.map((key) => [key, FEATURE_REGISTRY[key].default]),
  ) as FeatureFlags;
  for (const row of rows) {
    if (!Object.hasOwn(FEATURE_REGISTRY, row.key)) continue;
    // Do not coerce strings, null, arbitrary numbers, or malformed DB values.
    flags[row.key as Feature] = row.enabled === 1;
  }
  for (const key of FEATURES) flags[key] &&= FEATURE_REGISTRY[key].available;
  return flags;
}

export interface FlagSnapshot {
  flags: FeatureFlags;
  /** Absolute expiry travels across runtimes; failures never extend it. */
  validUntil: number;
  source: "database" | "last-known-good" | "closed";
}

export function parseFlagSnapshot(
  value: unknown,
  now = Date.now(),
): FlagSnapshot {
  const snapshot = value as FlagSnapshot;
  if (
    !snapshot ||
    !snapshot.flags ||
    !Number.isFinite(snapshot.validUntil) ||
    snapshot.validUntil <= now ||
    snapshot.validUntil > now + FLAG_MAX_STALE_MS ||
    !["database", "last-known-good", "closed"].includes(snapshot.source) ||
    FEATURES.some((key) => typeof snapshot.flags[key] !== "boolean")
  ) {
    throw new Error("Invalid feature flag snapshot");
  }
  const flags = closedFlags();
  for (const key of FEATURES)
    flags[key] = snapshot.flags[key] && FEATURE_REGISTRY[key].available;
  return { flags, validUntil: snapshot.validUntil, source: snapshot.source };
}

/** Reads every time. The retained value is used only after a failed read. */
export function createFlagReader(
  load: () => Promise<FlagSnapshot>,
  now = Date.now,
) {
  let lastGood: FlagSnapshot | undefined;
  return async (): Promise<FlagSnapshot> => {
    try {
      const snapshot = parseFlagSnapshot(await load(), now());
      if (snapshot.source !== "closed") lastGood = snapshot;
      return snapshot;
    } catch {
      if (lastGood && now() < lastGood.validUntil) {
        return { ...lastGood, source: "last-known-good" };
      }
      return { flags: closedFlags(), validUntil: now(), source: "closed" };
    }
  };
}

export function disabledFeature(
  flags: FeatureFlags,
  required: readonly Feature[],
) {
  return required.find(
    (key) => !FEATURE_REGISTRY[key].available || !flags[key],
  );
}

export function featureDisabledResponse(feature: Feature) {
  return Response.json(
    { error: "FeatureDisabled", feature },
    {
      status: 403,
      headers: { "Cache-Control": "no-store" },
    },
  );
}
