import { Router } from 'express';

const router = Router();

// Rotas serão implementadas posteriormente
router.get('/', (req, res) => {
  res.json({ message: 'Rota de usuários - em desenvolvimento' });
});

export default router;
