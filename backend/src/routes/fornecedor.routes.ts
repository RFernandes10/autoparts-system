import { Router } from 'express';
import FornecedorController from '../controllers/fornecedor.controller';
import { validate } from '../middlewares/validation.middleware';
import {
  createFornecedorSchema,
  updateFornecedorSchema,
  getFornecedorSchema,
  getFornecedorByCnpjSchema,
} from '../schemas/fornecedor.schema';

const router = Router();

router.get('/', FornecedorController.listarTodos);
router.post('/', validate(createFornecedorSchema), FornecedorController.criar);

router.get('/:id', validate(getFornecedorSchema), FornecedorController.buscarPorId);
router.put('/:id', validate(updateFornecedorSchema), FornecedorController.atualizar);
router.delete('/:id', validate(getFornecedorSchema), FornecedorController.deletar);

router.get('/cnpj/:cnpj', validate(getFornecedorByCnpjSchema), FornecedorController.buscarPorCnpj);

export default router;
