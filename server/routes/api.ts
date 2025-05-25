import { Router } from 'express';

const router = Router();

// Esta es una ruta API básica para probar que todo funciona
router.get('/test', (_req, res) => {
  res.json({ status: 'ok', message: 'API funcionando correctamente' });
});

export default router;