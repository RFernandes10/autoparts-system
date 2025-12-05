import { Request, Response } from 'express';
import FornecedorService from '../services/fornecedor.service';

class FornecedorController {
  async listarTodos(req: Request, res: Response) {
    const fornecedores = await FornecedorService.listarTodos();
    res.json(fornecedores);
  }

  async buscarPorId(req: Request, res: Response) {
    const { id } = req.params;
    const fornecedor = await FornecedorService.buscarPorId(Number(id));
    
    if (!fornecedor) {
      return res.status(404).json({ message: 'Fornecedor não encontrado' });
    }
    
    res.json(fornecedor);
  }

  async criar(req: Request, res: Response) {
    const fornecedor = await FornecedorService.criar(req.body);
    res.status(201).json(fornecedor);
  }

  async atualizar(req: Request, res: Response) {
    const { id } = req.params;
    const fornecedor = await FornecedorService.atualizar(Number(id), req.body);
    res.json(fornecedor);
  }

  async deletar(req: Request, res: Response) {
    const { id } = req.params;
    await FornecedorService.deletar(Number(id));
    res.status(204).send();
  }

  async buscarPorCnpj(req: Request, res: Response) {
    const { cnpj } = req.params;
    const fornecedor = await FornecedorService.buscarPorCnpj(cnpj);
    
    if (!fornecedor) {
      return res.status(404).json({ message: 'Fornecedor não encontrado' });
    }
    
    res.json(fornecedor);
  }
}

export default new FornecedorController();
