import type { Request, Response, NextFunction } from 'express';
import { VendaService } from '../services/venda.service';

class VendaController {
  async criar(req: Request, res: Response, next: NextFunction) {
    try {
      const venda = await VendaService.criarVenda(req.body);
      return res.status(201).json(venda);
    } catch (error) {
      return next(error);
    }
  }

  async listarTodos(req: Request, res: Response, next: NextFunction) {
    try {
      const vendas = await VendaService.listarVendas();
      return res.json(vendas);
    } catch (error) {
      return next(error);
    }
  }

  async buscarPorId(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const venda = await VendaService.buscarPorId(id);
      return res.json(venda);
    } catch (error) {
      return next(error);
    }
  }

  async deletar(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      await VendaService.deletarVenda(id);
      return res.status(204).send();
    } catch (error) {
      return next(error);
    }
  }
}

export default new VendaController();
