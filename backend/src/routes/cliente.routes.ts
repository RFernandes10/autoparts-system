import { Router } from 'express';
import ClienteController from '../controllers/cliente.controller';
import { validate } from '../middlewares/validation.middleware';
import { 
  createClienteSchema, 
  updateClienteSchema, 
  getClienteSchema,
  getClienteByCpfCnpjSchema
} from '../schemas/cliente.schema';

const router = Router();

router.get('/', ClienteController.listarTodos);
router.post('/', validate(createClienteSchema), ClienteController.criar);

router.get('/:id', validate(getClienteSchema), ClienteController.buscarPorId);
router.put('/:id', validate(updateClienteSchema), ClienteController.atualizar);
router.delete('/:id', validate(getClienteSchema), ClienteController.deletar);

router.get('/cpf-cnpj/:cpfCnpj', validate(getClienteByCpfCnpjSchema), ClienteController.buscarPorCpfCnpj);

export default router;
