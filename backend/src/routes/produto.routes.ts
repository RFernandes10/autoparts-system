import { Router } from 'express';
import ProdutoController from '../controllers/produto.controller';

const router = Router();

// Rotas de produtos
router.get('/', ProdutoController.listarTodos);
router.get('/:id', ProdutoController.buscarPorId);
router.post('/', ProdutoController.criar);
router.put('/:id', ProdutoController.atualizar);
router.delete('/:id', ProdutoController.deletar);
router.get('/estoque/baixo', ProdutoController.listarEstoqueBaixo);
router.get('/categoria/:categoria', ProdutoController.buscarPorCategoria);

export default router;
