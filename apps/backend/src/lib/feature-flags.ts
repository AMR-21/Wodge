import {
  createFlagReader,
  disabledFeature,
  featureDisabledResponse,
  FLAG_REQUEST_TIMEOUT_MS,
} from "@repo/data/feature-flags";
import { mutationFeatures, partyFeatures } from "@repo/data/feature-policy";

type FlagEnvironment = { [key: string]: unknown };

export function partyFlagReader(env: FlagEnvironment) {
  return createFlagReader(async () => {
    if (typeof env.APP_DOMAIN !== "string" || !env.SECRET_KEY)
      throw new Error("Flag endpoint not configured");
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), FLAG_REQUEST_TIMEOUT_MS);
    try {
      const response = await fetch(
        new URL("/api/internal/feature-flags", env.APP_DOMAIN),
        {
          headers: { authorization: `Bearer ${env.SECRET_KEY}` },
          cache: "no-store",
          signal: controller.signal,
        },
      );
      if (!response.ok) throw new Error("Flag endpoint unavailable");
      return await response.json();
    } finally {
      clearTimeout(timer);
    }
  });
}

/** Runs before handlers or Replicache bookkeeping, so a disabled batch has no effects. */
export async function gatePartyRequest(
  request: {
    url: string;
    method: string;
    clone(): { json(): Promise<unknown> };
  },
  domain: string,
  read: ReturnType<typeof partyFlagReader>,
  storedType?: (mutation: { name: string; args: any }) => string | undefined,
) {
  if (request.method === "OPTIONS") return;
  const path =
    "/" + new URL(request.url).pathname.split("/").slice(4).join("/");
  const required = partyFeatures(domain, path, request.method);
  if (!required)
    return Response.json({ error: "UnregisteredCapability" }, { status: 403 });
  if (path === "/replicache-push") {
    let body;
    try {
      body = (await request.clone().json()) as {
        mutations?: { name: string; args: unknown }[];
      };
    } catch {
      return Response.json({ error: "InvalidPush" }, { status: 400 });
    }
    if (!Array.isArray(body.mutations))
      return Response.json({ error: "InvalidPush" }, { status: 400 });
    for (const mutation of body.mutations) {
      const features =
        mutation && mutationFeatures(domain, mutation.name, mutation.args);
      if (!features)
        return Response.json(
          { error: "UnregisteredMutation" },
          { status: 400 },
        );
      required.push(...features);
      const type = storedType?.(mutation);
      if (type)
        required.push(
          ...(mutationFeatures(domain, mutation.name, { type }) || []),
        );
    }
  }
  if (!required.length) return;
  const { flags } = await read();
  const disabled = disabledFeature(flags, required);
  if (disabled) {
    const response = featureDisabledResponse(disabled);
    response.headers.set("Access-Control-Allow-Origin", "*");
    return response;
  }
}
