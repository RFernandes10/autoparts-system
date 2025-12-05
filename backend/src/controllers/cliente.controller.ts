import { Request, Response } from 'express';
import ClienteService from '../services/cliente.service';

class ClienteController {
  async listarTodos(req: Request, res: Response) {
    const clientes = await ClienteService.listarTodos();
    res.json(clientes);
  }

  async buscarPorId(req: Request, res: Response) {
    const { id } = req.params;
    const cliente = await ClienteService.buscarPorId(Number(id));
    
    if (!cliente) {
      return res.status(404).json({ message: 'Cliente não encontrado' });
    }
    
    res.json(cliente);
  }

  async criar(req: Request, res: Response) {
    const cliente = await ClienteService.criar(req.body);
    res.status(201).json(cliente);
  }

  async atualizar(req: Request, res: Response) {
    const { id } = req.params;
    const cliente = await ClienteService.atualizar(Number(id), req.body);
    res.json(cliente);
  }

  async deletar(req: Request, res: Response) {
    const { id } = req.params;
    await ClienteService.deletar(Number(id));
    res.status(204).send();
  }

  async buscarPorCpfCnpj(req: Request, res: Response) {
    const { cpfCnpj } = req.params;
    const cliente = await ClienteService.buscarPorCpfCnpj(cpfCnpj);
    
    if (!cliente) {
      return res.status(404).json({ message: 'Cliente não encontrado' });
    }
    
    res.json(cliente);
  }
}

export default new ClienteController();
