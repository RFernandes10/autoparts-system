import { Request, Response } from 'express';
import ProdutoService from '../services/produto.service';

class ProdutoController {
  async listarTodos(req: Request, res: Response) {
    try {
      const produtos = await ProdutoService.listarTodos();
      res.json(produtos);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async buscarPorId(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const produto = await ProdutoService.buscarPorId(Number(id));
      
      if (!produto) {
        return res.status(404).json({ error: 'Produto não encontrado' });
      }
      
      res.json(produto);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async criar(req: Request, res: Response) {
    try {
      const produto = await ProdutoService.criar(req.body);
      res.status(201).json(produto);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async atualizar(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const produto = await ProdutoService.atualizar(Number(id), req.body);
      res.json(produto);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async deletar(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await ProdutoService.deletar(Number(id));
      res.status(204).send();
    } catch (error: any) {
      console.error('Erro no controller ao deletar:', error.message);
      
      // Retornar a mensagem de erro de forma clara
      res.status(400).json({ 
        error: error.message || 'Erro ao excluir produto'
      });
    }
  }

  async listarEstoqueBaixo(req: Request, res: Response) {
    try {
      const produtos = await ProdutoService.listarEstoqueBaixo();
      res.json(produtos);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async buscarPorCategoria(req: Request, res: Response) {
    try {
      const { categoria } = req.params;
      const produtos = await ProdutoService.buscarPorCategoria(categoria);
      res.json(produtos);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default new ProdutoController();
