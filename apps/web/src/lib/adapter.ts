// // @ts-nocheck
// import { eq, and } from "drizzle-orm";

// import type { Adapter } from "@auth/core/adapters";
// import { nanoid } from "nanoid";
// import { accounts, sessions, users, verificationTokens } from "@repo/data";
// import { BaseSQLiteDatabase } from "drizzle-orm/sqlite-core";

// type NonNullableProps<T> = {
//   [P in keyof T]: null extends T[P] ? never : P;
// }[keyof T];

// function stripUndefined<T>(obj: T): Pick<T, NonNullableProps<T>> {
//   const result = {} as T;
//   for (const key in obj) if (obj[key] !== undefined) result[key] = obj[key];
//   return result;
// }

// export function DbAdapter(
//   client: () => InstanceType<typeof BaseSQLiteDatabase>,
// ): Adapter {
//   const db = client();
//   return {
//     async createUser(data) {
//       return await db
//         .insert(users)
//         .values({
//           ...data,
//           displayName: data.name,
//           avatar: data.image,
//           id: nanoid(),
//         })
//         .returning()
//         .get();
//     },
//     async getUser(data) {
//       const result = await db
//         .select()
//         .from(users)
//         .where(eq(users.id, data))
//         .get();
//       return result ?? null;
//     },
//     async getUserByEmail(data) {
//       const result = await db
//         .select()
//         .from(users)
//         .where(eq(users.email, data))
//         .get();
//       return result ?? null;
//     },
//     createSession(data) {
//       return db.insert(sessions).values(data).returning().get();
//     },
//     async getSessionAndUser(data) {
//       const result = await db
//         .select({ session: sessions, user: users })
//         .from(sessions)
//         .where(eq(sessions.sessionToken, data))
//         .innerJoin(users, eq(users.id, sessions.userId))
//         .get();
//       return result ?? null;
//     },
//     async updateUser(data) {
//       if (!data.id) {
//         throw new Error("No user id.");
//       }

//       const result = await db
//         .update(users)
//         .set(data)
//         .where(eq(users.id, data.id))
//         .returning()
//         .get();
//       return result ?? null;
//     },
//     async updateSession(data) {
//       const result = await db
//         .update(sessions)
//         .set(data)
//         .where(eq(sessions.sessionToken, data.sessionToken))
//         .returning()
//         .get();
//       return result ?? null;
//     },
//     async linkAccount(rawAccount) {
//       return stripUndefined(
//         await db.insert(accounts).values(rawAccount).returning().get(),
//       );
//     },
//     async getUserByAccount(account) {
//       const results = await db
//         .select()
//         .from(accounts)
//         .leftJoin(users, eq(users.id, accounts.userId))
//         .where(
//           and(
//             eq(accounts.provider, account.provider),
//             eq(accounts.providerAccountId, account.providerAccountId),
//           ),
//         )
//         .get();

//       if (!results) {
//         return null;
//       }
//       return Promise.resolve(results).then((results) => results.users);
//     },
//     async deleteSession(sessionToken) {
//       const result = await db
//         .delete(sessions)
//         .where(eq(sessions.sessionToken, sessionToken))
//         .returning()
//         .get();
//       return result ?? null;
//     },
//     async createVerificationToken(token) {
//       const result = await db
//         .insert(verificationTokens)
//         .values(token)
//         .returning()
//         .get();
//       return result ?? null;
//     },
//     async useVerificationToken(token) {
//       try {
//         const result = await db
//           .delete(verificationTokens)
//           .where(
//             and(
//               eq(verificationTokens.identifier, token.identifier),
//               eq(verificationTokens.token, token.token),
//             ),
//           )
//           .returning()
//           .get();
//         return result ?? null;
//       } catch (err) {
//         throw new Error("No verification token found.");
//       }
//     },
//     async deleteUser(id) {
//       const result = await db
//         .delete(users)
//         .where(eq(users.id, id))
//         .returning()
//         .get();
//       return result ?? null;
//     },
//     async unlinkAccount(account) {
//       await db
//         .delete(accounts)
//         .where(
//           and(
//             eq(accounts.providerAccountId, account.providerAccountId),
//             eq(accounts.provider, account.provider),
//           ),
//         )
//         .run();
//     },
//   };
// }
