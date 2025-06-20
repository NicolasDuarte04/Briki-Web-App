import express from 'express';
import { db } from '../db';
import { conversationLogs, contextSnapshots } from '@shared/schema';
import { desc } from 'drizzle-orm';
import { requireAuth } from '../auth/session';

const router = express.Router();

router.get('/full', requireAuth, async (req, res) => {
  try {
    const [logs, snapshots, routes] = await Promise.all([
      db.select().from(conversationLogs).orderBy(desc(conversationLogs.createdAt)).limit(10),
      db.select().from(contextSnapshots).orderBy(desc(contextSnapshots.createdAt)).limit(10),
      Promise.resolve(getProtectedRoutes())
    ]);

    res.json({
      latestLogs: logs,
      latestContextSnapshots: snapshots,
      apiRoutes: routes,
      assistantBehaviorTriggers: getAssistantTriggerSamples()
    });
  } catch (error) {
    console.error("Error fetching full diagnostic:", error);
    res.status(500).json({ error: "Failed to fetch diagnostic data" });
  }
});

function getProtectedRoutes() {
  return [
    { route: '/api/auth/user', protected: true },
    { route: '/api/company/profile', protected: true },
    { route: '/api/company/plans', protected: true },
    { route: '/api/quotes', protected: true },
    { route: '/api/ai/chat', protected: false },
    { route: '/api/insurance/plans', protected: false },
  ];
}

function getAssistantTriggerSamples() {
  return {
    travel: {
      triggers: ["quiero un seguro para mi viaje a europa", "necesito seguro de viaje"],
      expectedFollowUps: ["¿Desde dónde iniciarás tu viaje?", "¿Cuántos días durará tu viaje?"]
    },
    health: {
      triggers: ["busco seguro de salud", "quiero un plan medico"],
      expectedFollowUps: ["¿Qué edad tienes?", "¿Cuál es tu género?", "¿En qué país vives actualmente?"]
    },
    noContext: {
      triggers: ["hola", "cuentame de briki"],
      expectedBehavior: "No plans suggested, general response."
    }
  };
}

export default router;
