import {
  createFlagReader,
  FLAG_MAX_STALE_MS,
  FLAG_REQUEST_TIMEOUT_MS,
  resolveFlags,
} from "./feature-flags";

interface FlagDatabase {
  prepare(sql: string): {
    all(): Promise<{
      success: boolean;
      results?: { key: string; enabled: unknown }[];
    }>;
  };
}

export async function withFlagTimeout<T>(operation: Promise<T>): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      operation,
      new Promise<never>((_, reject) => {
        timer = setTimeout(
          () => reject(new Error("Feature flag read timed out")),
          FLAG_REQUEST_TIMEOUT_MS,
        );
      }),
    ]);
  } finally {
    clearTimeout(timer);
  }
}

export function databaseFlagReader(database: FlagDatabase) {
  return createFlagReader(async () => {
    const result = await withFlagTimeout(
      database.prepare("SELECT key, enabled FROM feature_flags").all(),
    );
    if (!result.success || !Array.isArray(result.results))
      throw new Error("Feature flags unavailable");
    return {
      flags: resolveFlags(result.results),
      validUntil: Date.now() + FLAG_MAX_STALE_MS,
      source: "database",
    };
  });
}
