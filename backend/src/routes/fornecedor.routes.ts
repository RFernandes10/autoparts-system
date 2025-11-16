import { Router } from 'express';
import FornecedorController from '../controllers/fornecedor.controller';

const router = Router();

router.get('/', FornecedorController.listarTodos);
router.get('/:id', FornecedorController.buscarPorId);
router.get('/cnpj/:cnpj', FornecedorController.buscarPorCnpj);
router.post('/', FornecedorController.criar);
router.put('/:id', FornecedorController.atualizar);
router.delete('/:id', FornecedorController.deletar);

export default router;
