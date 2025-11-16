import { Router } from 'express';
import ClienteController from '../controllers/cliente.controller';

const router = Router();

router.get('/', ClienteController.listarTodos);
router.get('/:id', ClienteController.buscarPorId);
router.get('/cpf-cnpj/:cpfCnpj', ClienteController.buscarPorCpfCnpj);
router.post('/', ClienteController.criar);
router.put('/:id', ClienteController.atualizar);
router.delete('/:id', ClienteController.deletar);

export default router;
