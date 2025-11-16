import { Request, Response } from 'express';
import ClienteService from '../services/cliente.service';

class ClienteController {
  async listarTodos(req: Request, res: Response) {
    try {
      const clientes = await ClienteService.listarTodos();
      res.json(clientes);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async buscarPorId(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const cliente = await ClienteService.buscarPorId(Number(id));
      
      if (!cliente) {
        return res.status(404).json({ error: 'Cliente não encontrado' });
      }
      
      res.json(cliente);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async criar(req: Request, res: Response) {
    try {
      const cliente = await ClienteService.criar(req.body);
      res.status(201).json(cliente);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async atualizar(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const cliente = await ClienteService.atualizar(Number(id), req.body);
      res.json(cliente);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async deletar(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await ClienteService.deletar(Number(id));
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async buscarPorCpfCnpj(req: Request, res: Response) {
    try {
      const { cpfCnpj } = req.params;
      const cliente = await ClienteService.buscarPorCpfCnpj(cpfCnpj);
      
      if (!cliente) {
        return res.status(404).json({ error: 'Cliente não encontrado' });
      }
      
      res.json(cliente);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default new ClienteController();
