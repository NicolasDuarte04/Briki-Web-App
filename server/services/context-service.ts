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
    // Find the latest conversation log for the user (and optionally category)
    const latestConversation = await db
      .select({ id: conversationLogs.id })
      .from(conversationLogs)
      .where(
        and(
          eq(conversationLogs.userId, userId),
          category ? eq(conversationLogs.category, category) : undefined
        )
      )
      .orderBy(desc(conversationLogs.timestamp))
      .limit(1)
      .then((rows) => rows[0]);

    if (!latestConversation) {
      console.log(`[Context Service] No previous conversations found for user ${userId}.`);
      return null;
    }

    // Now find the latest snapshot for that conversation
    const latestSnapshot = await db
      .select({ memoryJson: contextSnapshots.memoryJson })
      .from(contextSnapshots)
      .where(eq(contextSnapshots.conversationId, latestConversation.id))
      .orderBy(desc(contextSnapshots.createdAt))
      .limit(1)
      .then((rows) => rows[0]);

    if (latestSnapshot && latestSnapshot.memoryJson) {
      console.log(`[Context Service] Rehydrated context for user ${userId}.`);
      return latestSnapshot.memoryJson;
    }

    console.log(`[Context Service] No context snapshot found for conversation ${latestConversation.id}.`);
    return null;
  } catch (error) {
    console.error('[Context Service] Error fetching user context:', error);
    return null; // Fallback gracefully
  }
}; 