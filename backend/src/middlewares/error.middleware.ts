import { Request, Response, NextFunction } from 'express';

// Interface para um erro mais detalhado
interface AppError extends Error {
  statusCode?: number;
  details?: any; // Campo para informações adicionais, como erros de validação
}

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Log do erro para depuração
  console.error('--------------------------');
  console.error(`Erro na requisição: ${req.method} ${req.originalUrl}`);
  if (err.details) {
    console.error('Detalhes do Erro:', JSON.stringify(err.details, null, 2));
  } else {
    console.error('Stack do Erro:', err.stack);
  }
  console.error('--------------------------');

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Ocorreu um erro inesperado no servidor.';

  // Monta a resposta de erro
  const errorResponse: { success: boolean; message: string; details?: any } = {
    success: false,
    message,
  };

  // Adiciona os detalhes do erro à resposta, se existirem
  if (err.details) {
    errorResponse.details = err.details;
  }

  res.status(statusCode).json(errorResponse);
};
