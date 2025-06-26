import { db } from '../db';
import { conversationLogs, contextSnapshots } from '@shared/schema';
import { eq, and, desc } from 'drizzle-orm';

/**
 * Retrieves the most recent context snapshot for a given user.
 *
 * @param userId - The ID of the user.
 * @param category - (Optional) The category to narrow down the context.
 * @returns The most recent memory JSON object or null if not found.
 */
export const getLatestUserContext = async (
  userId: string,
  category?: string
): Promise<object | null> => {
  try {
    const query = db
      .select({ memoryJson: contextSnapshots.memoryJson })
      .from(contextSnapshots)
      .leftJoin(conversationLogs, eq(contextSnapshots.conversationId, conversationLogs.id))
      .where(
        and(
          eq(conversationLogs.userId, userId),
          category ? eq(conversationLogs.category, category) : undefined
        )
      )
      .orderBy(desc(contextSnapshots.createdAt))
      .limit(1);

    const latestSnapshot = await query.then((rows) => rows[0]);

    if (latestSnapshot && latestSnapshot.memoryJson) {
      console.log(`[Context Service] Rehydrated context for user ${userId}.`);
      return latestSnapshot.memoryJson;
    }

    console.log(`[Context Service] No previous context snapshot found for user ${userId}.`);
    return null;
  } catch (error) {
    console.error('[Context Service] Error fetching user context:', error);
    return null; // Fallback gracefully
  }
}; 