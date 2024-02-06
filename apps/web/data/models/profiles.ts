import "server-only";

import { db } from "@/lib/db";
import { eq, sql } from "drizzle-orm";
import { Profile, profiles } from "../schemas/db.schema";

export async function getProfileById(id: string): Promise<Partial<Profile>> {
  try {
    const profile = await db.query.profiles.findFirst({
      columns: { userId: false },
      where: eq(profiles.userId, id),
    });

    return profile;
  } catch (e) {
    return null;
  }
}
