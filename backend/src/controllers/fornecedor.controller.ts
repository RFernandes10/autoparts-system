import { Request, Response } from 'express';
import FornecedorService from '../services/fornecedor.service';

class FornecedorController {
  async listarTodos(req: Request, res: Response) {
    try {
      const fornecedores = await FornecedorService.listarTodos();
      res.json(fornecedores);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async buscarPorId(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const fornecedor = await FornecedorService.buscarPorId(Number(id));
      
      if (!fornecedor) {
        return res.status(404).json({ error: 'Fornecedor não encontrado' });
      }
      
      res.json(fornecedor);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async criar(req: Request, res: Response) {
    try {
      const fornecedor = await FornecedorService.criar(req.body);
      res.status(201).json(fornecedor);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async atualizar(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const fornecedor = await FornecedorService.atualizar(Number(id), req.body);
      res.json(fornecedor);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async deletar(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await FornecedorService.deletar(Number(id));
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async buscarPorCnpj(req: Request, res: Response) {
    try {
      const { cnpj } = req.params;
      const fornecedor = await FornecedorService.buscarPorCnpj(cnpj);
      
      if (!fornecedor) {
        return res.status(404).json({ error: 'Fornecedor não encontrado' });
      }
      
      res.json(fornecedor);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default new FornecedorController();
