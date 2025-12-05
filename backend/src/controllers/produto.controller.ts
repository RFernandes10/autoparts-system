import { Request, Response } from 'express';
import ProdutoService from '../services/produto.service';

// Com o middleware de erro assíncrono, não precisamos mais de try-catch.
// Qualquer erro lançado nos métodos abaixo será automaticamente capturado
// e enviado para o nosso errorHandler.
class ProdutoController {
  async listarTodos(req: Request, res: Response) {
    const produtos = await ProdutoService.listarTodos();
    res.json(produtos);
  }

  async buscarPorId(req: Request, res: Response) {
    const { id } = req.params;
    const produto = await ProdutoService.buscarPorId(Number(id));
    
    // A lógica de negócio para "não encontrado" permanece no controller.
    if (!produto) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }
    
    res.json(produto);
  }

  async criar(req: Request, res: Response) {
    const produto = await ProdutoService.criar(req.body);
    res.status(201).json(produto);
  }

  async atualizar(req: Request, res: Response) {
    const { id } = req.params;
    const produto = await ProdutoService.atualizar(Number(id), req.body);
    res.json(produto);
  }

  async deletar(req: Request, res: Response) {
    const { id } = req.params;
    await ProdutoService.deletar(Number(id));
    res.status(204).send();
  }

  async listarEstoqueBaixo(req: Request, res: Response) {
    const produtos = await ProdutoService.listarEstoqueBaixo();
    res.json(produtos);
  }

  async buscarPorCategoria(req: Request, res: Response) {
    const { categoria } = req.params;
    const produtos = await ProdutoService.buscarPorCategoria(categoria);
    res.json(produtos);
  }
}

export default new ProdutoController();
