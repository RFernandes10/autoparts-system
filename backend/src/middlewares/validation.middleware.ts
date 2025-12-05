import { Request, Response, NextFunction } from 'express';
import { ZodError, ZodSchema, ZodIssue } from 'zod';

// Este middleware recebe um schema Zod e o usa para validar a requisição.
// Ele é genérico e pode ser usado para validar body, params ou query.
export const validate =
  (schema: ZodSchema<any>) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Valida e extrai os dados do corpo, query e parâmetros
      const parsed = await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      // Sobrescreve APENAS o body (query e params são read-only)
      if (parsed.body !== undefined) {
        req.body = parsed.body;
      }

      // Para query e params, não tentamos sobrescrever
      // O Zod já validou, e isso é suficiente
      
      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        // Formata os erros de validação para uma resposta clara
        const formattedErrors = error.issues.map((e: ZodIssue) => ({
          path: e.path.join('.'),
          message: e.message,
        }));

        // Cria um erro customizado que será capturado pelo nosso errorHandler
        const validationError = new Error('Erro de validação de dados.') as any;
        validationError.statusCode = 400; // Bad Request
        validationError.details = formattedErrors;
        
        // Passa o erro para o próximo middleware (o nosso errorHandler)
        return next(validationError);
      }
      
      // Se for outro tipo de erro, passa para o errorHandler
      return next(error);
    }
  };
