import { Router } from 'express';

const router = Router();

// Rotas serão implementadas posteriormente
router.get('/', (req, res) => {
  res.json({ message: 'Rota de vendas - em desenvolvimento' });
});

export default router;
