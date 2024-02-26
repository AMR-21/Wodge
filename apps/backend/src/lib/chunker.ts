import sizeof from "object-sizeof";

const MAX_SIZE = 128 * 1024; // 128KB

export async function put(key: string, data: any) {
  // 1. Check size of the active shard (if any)
  // 2. If the active shard cannot accept new value, create a new shard
  // 3. Write the value to the active shard
  // 4. Store the new shard
  // 5. Update the shard index
}
