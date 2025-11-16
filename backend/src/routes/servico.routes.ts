import { Router } from 'express';

const router = Router();

// Rotas serão implementadas posteriormente
router.get('/', (req, res) => {
  res.json({ message: 'Rota de serviços - em desenvolvimento' });
});

export default router;
