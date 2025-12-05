/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import { useForm, type SubmitHandler, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { produtoFormSchema, type ProdutoFormData, CategoriaProdutoEnum, TipoProdutoEnum } from "../../schemas/produto.schema";
import type { Produto } from "../../types";
import { FaTimes } from "react-icons/fa";
import "./ProdutoForm.css";

interface ProdutoFormProps {
  produto?: Produto;
  onSave: (data: ProdutoFormData) => void;
  onCancel: () => void;
}

// Componente para exibir erros de formulário
const FormError = ({ message }: { message?: string }) => {
  return message ? <span className="form-error">{message}</span> : null;
};

function ProdutoForm({ produto, onSave, onCancel }: ProdutoFormProps) {
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProdutoFormData>({
    resolver: zodResolver(produtoFormSchema) as unknown as Resolver<ProdutoFormData, any>,
    defaultValues: {
      codigoProduto: "",
      nome: "",
      descricao: "",
      precoCompra: undefined,
      precoVenda: undefined,
      estoqueAtual: undefined,
      estoqueMinimo: 5,
      categoria: CategoriaProdutoEnum.options[0],
      tipoProduto: TipoProdutoEnum.options[0],
    },
  });

  // Popula o formulário com dados do produto quando ele muda (para edição)
  useEffect(() => {
    if (produto) {
      reset({
        ...produto,
        precoCompra: Number(produto.precoCompra),
        precoVenda: Number(produto.precoVenda),
      });
    }
  }, [produto, reset]);

  const onSubmit: SubmitHandler<ProdutoFormData> = (data) => {
    console.log("Formulário enviado com sucesso. Dados:", data);
    onSave(data);
  };

  const onError = (errors: any) => {
    console.log("Erro de validação do formulário:", errors);
  };

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{produto ? "Editar Produto" : "Novo Produto"}</h2>
          <button className="btn-close" onClick={onCancel} type="button">
            <FaTimes />
          </button>
        </div>

        {/* handleSubmit do react-hook-form valida antes de chamar onSubmit */}
        <form onSubmit={handleSubmit(onSubmit, onError)} className="form">
          <div className="form-section">
            <h3 className="section-title">Informações Básicas</h3>

            <div className="form-row">
              <div className="form-group">
                <label>Código *</label>
                <input 
                  {...register("codigoProduto")} 
                  placeholder="Ex: P001" 
                />
                <FormError message={errors.codigoProduto?.message} />
              </div>
              <div className="form-group">
                <label>Nome *</label>
                <input 
                  {...register("nome")} 
                  placeholder="Nome do produto" 
                />
                <FormError message={errors.nome?.message} />
              </div>
            </div>

            <div className="form-group">
              <label>Descrição</label>
              <textarea 
                {...register("descricao")} 
                rows={2} 
                placeholder="Descrição opcional do produto" 
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Categoria *</label>
                <select {...register("categoria")}>
                  {CategoriaProdutoEnum.options.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <FormError message={errors.categoria?.message} />
              </div>
              <div className="form-group">
                <label>Tipo *</label>
                <select {...register("tipoProduto")}>
                  {TipoProdutoEnum.options.map(tipo => (
                    <option key={tipo} value={tipo}>{tipo}</option>
                  ))}
                </select>
                <FormError message={errors.tipoProduto?.message} />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Preço Compra (R$) *</label>
                <input 
                  {...register("precoCompra", { valueAsNumber: true })} 
                  type="number" 
                  step="0.01" 
                  min="0" 
                  placeholder="0.00" 
                />
                <FormError message={errors.precoCompra?.message} />
              </div>
              <div className="form-group">
                <label>Preço Venda (R$) *</label>
                <input 
                  {...register("precoVenda", { valueAsNumber: true })} 
                  type="number" 
                  step="0.01" 
                  min="0" 
                  placeholder="0.00" 
                />
                <FormError message={errors.precoVenda?.message} />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Estoque Atual *</label>
                <input 
                  {...register("estoqueAtual", { valueAsNumber: true })} 
                  type="number" 
                  min="0" 
                  placeholder="0" 
                />
                <FormError message={errors.estoqueAtual?.message} />
              </div>
              <div className="form-group">
                <label>Estoque Mínimo *</label>
                <input 
                  {...register("estoqueMinimo", { valueAsNumber: true })} 
                  type="number" 
                  min="0" 
                  placeholder="5" 
                />
                <FormError message={errors.estoqueMinimo?.message} />
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={onCancel}>
              Cancelar
            </button>
            <button type="submit" className="btn-submit">
              {produto ? "Atualizar" : "Cadastrar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProdutoForm;
