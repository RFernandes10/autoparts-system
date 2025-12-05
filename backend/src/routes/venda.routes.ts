import { Router } from 'express';
import VendaController from '../controllers/venda.controller';
import { validate } from '../middlewares/validation.middleware';
import { createVendaSchema } from '../schemas/venda.schema';

const router = Router();

// Listar vendas
router.get('/', VendaController.listarTodos);

// Buscar venda por ID
router.get('/:id', VendaController.buscarPorId);

// Criar nova venda
router.post('/', validate(createVendaSchema), VendaController.criar);

// Excluir venda
router.delete('/:id', VendaController.deletar);

export default router;
