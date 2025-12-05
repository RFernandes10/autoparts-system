import { Router } from 'express';
import ProdutoController from '../controllers/produto.controller';
import { validate } from '../middlewares/validation.middleware';
import { 
  createProdutoSchema, 
  updateProdutoSchema, 
  getProdutoSchema,
  getProdutoPorCategoriaSchema // Importa o novo schema
} from '../schemas/produto.schema';

const router = Router();

// Rotas de produtos com validação
router.get('/', ProdutoController.listarTodos);
router.get('/estoque/baixo', ProdutoController.listarEstoqueBaixo);

// Adiciona validação para o parâmetro 'categoria'
router.get('/categoria/:categoria', validate(getProdutoPorCategoriaSchema), ProdutoController.buscarPorCategoria);

// Valida o ID na busca, atualização e deleção
router.get('/:id', validate(getProdutoSchema), ProdutoController.buscarPorId);
router.put('/:id', validate(updateProdutoSchema), ProdutoController.atualizar);
router.delete('/:id', validate(getProdutoSchema), ProdutoController.deletar);

// Valida o corpo da requisição ao criar um novo produto
router.post('/', validate(createProdutoSchema), ProdutoController.criar);

export default router;
