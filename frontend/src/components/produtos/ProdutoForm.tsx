/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import { useForm, type SubmitHandler, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  produtoFormSchema,
  type ProdutoFormData,
  CategoriaProdutoEnum,
  TipoProdutoEnum,
} from "../../schemas/produto.schema";
import type { Produto } from "../../types";
import {
  FaTimes,
  FaBox,
  FaDollarSign,
  FaWarehouse,
  FaTag,
} from "react-icons/fa";

interface ProdutoFormProps {
  produto?: Produto;
  onSave: (data: ProdutoFormData) => void;
  onCancel: () => void;
}

function ProdutoForm({ produto, onSave, onCancel }: ProdutoFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ProdutoFormData>({
    resolver: zodResolver(produtoFormSchema) as unknown as Resolver<
      ProdutoFormData,
      any
    >,
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

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onCancel]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        backdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        padding: "1rem",
      }}
      onClick={onCancel}
    >
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "1rem",
          width: "100%",
          maxWidth: "48rem",
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          overflow: "hidden",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Fixo */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "1.5rem",
            borderBottom: "1px solid #e5e7eb",
            background: "linear-gradient(to right, #eef2ff, #faf5ff)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div
              style={{
                width: "3rem",
                height: "3rem",
                borderRadius: "0.75rem",
                background:
                  "linear-gradient(to bottom right, #6366f1, #9333ea)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 10px 15px -3px rgba(99, 102, 241, 0.3)",
              }}
            >
              <FaBox style={{ color: "white", fontSize: "1.25rem" }} />
            </div>
            <div>
              <h2
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "bold",
                  margin: 0,
                  color: "#111827",
                }}
              >
                {produto ? "Editar Produto" : "Novo Produto"}
              </h2>
              <p
                style={{
                  fontSize: "0.875rem",
                  color: "#6b7280",
                  margin: "0.25rem 0 0 0",
                }}
              >
                {produto
                  ? "Atualize as informações do produto"
                  : "Preencha os dados para cadastrar"}
              </p>
            </div>
          </div>
          <button
            style={{
              width: "2.5rem",
              height: "2.5rem",
              borderRadius: "0.75rem",
              border: "none",
              backgroundColor: "white",
              color: "#6b7280",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
              transition: "all 0.2s",
            }}
            onClick={onCancel}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#fee2e2";
              e.currentTarget.style.color = "#dc2626";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "white";
              e.currentTarget.style.color = "#6b7280";
            }}
            type="button"
          >
            <FaTimes size={16} />
          </button>
        </div>

        {/* Form com Scroll */}
        <form
          onSubmit={handleSubmit(onSubmit, onError)}
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              overflowY: "auto",
              padding: "1.5rem",
              flex: 1,
            }}
          >
            {/* Seção: Informações Básicas */}
            <div style={{ marginBottom: "2rem" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  paddingBottom: "0.75rem",
                  borderBottom: "2px solid #e5e7eb",
                  marginBottom: "1.25rem",
                }}
              >
                <FaTag style={{ color: "#6366f1", fontSize: "1.125rem" }} />
                <h3
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: "bold",
                    color: "#111827",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    margin: 0,
                  }}
                >
                  Informações Básicas
                </h3>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                  gap: "1.25rem",
                  marginBottom: "1.25rem",
                }}
              >
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.875rem",
                      fontWeight: "600",
                      color: "#374151",
                      marginBottom: "0.5rem",
                    }}
                  >
                    Código do Produto{" "}
                    <span style={{ color: "#dc2626" }}>*</span>
                  </label>
                  <input
                    {...register("codigoProduto")}
                    placeholder="Ex: P001, AUTO-123"
                    style={{
                      width: "100%",
                      padding: "0.75rem 1rem",
                      border: errors.codigoProduto
                        ? "2px solid #dc2626"
                        : "2px solid #e5e7eb",
                      borderRadius: "0.75rem",
                      fontSize: "0.875rem",
                      fontWeight: "500",
                      outline: "none",
                      transition: "all 0.2s",
                    }}
                    onFocus={(e) => {
                      if (!errors.codigoProduto) {
                        e.target.style.borderColor = "#6366f1";
                        e.target.style.boxShadow =
                          "0 0 0 3px rgba(99, 102, 241, 0.1)";
                      }
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = errors.codigoProduto
                        ? "#dc2626"
                        : "#e5e7eb";
                      e.target.style.boxShadow = "none";
                    }}
                  />
                  {errors.codigoProduto && (
                    <p
                      style={{
                        color: "#dc2626",
                        fontSize: "0.75rem",
                        marginTop: "0.375rem",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.25rem",
                      }}
                    >
                      <span
                        style={{
                          display: "inline-block",
                          width: "0.375rem",
                          height: "0.375rem",
                          borderRadius: "50%",
                          backgroundColor: "#dc2626",
                        }}
                      />
                      {errors.codigoProduto.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.875rem",
                      fontWeight: "600",
                      color: "#374151",
                      marginBottom: "0.5rem",
                    }}
                  >
                    Nome do Produto <span style={{ color: "#dc2626" }}>*</span>
                  </label>
                  <input
                    {...register("nome")}
                    placeholder="Ex: Filtro de Óleo"
                    style={{
                      width: "100%",
                      padding: "0.75rem 1rem",
                      border: errors.nome
                        ? "2px solid #dc2626"
                        : "2px solid #e5e7eb",
                      borderRadius: "0.75rem",
                      fontSize: "0.875rem",
                      fontWeight: "500",
                      outline: "none",
                      transition: "all 0.2s",
                    }}
                    onFocus={(e) => {
                      if (!errors.nome) {
                        e.target.style.borderColor = "#6366f1";
                        e.target.style.boxShadow =
                          "0 0 0 3px rgba(99, 102, 241, 0.1)";
                      }
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = errors.nome
                        ? "#dc2626"
                        : "#e5e7eb";
                      e.target.style.boxShadow = "none";
                    }}
                  />
                  {errors.nome && (
                    <p
                      style={{
                        color: "#dc2626",
                        fontSize: "0.75rem",
                        marginTop: "0.375rem",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.25rem",
                      }}
                    >
                      <span
                        style={{
                          display: "inline-block",
                          width: "0.375rem",
                          height: "0.375rem",
                          borderRadius: "50%",
                          backgroundColor: "#dc2626",
                        }}
                      />
                      {errors.nome.message}
                    </p>
                  )}
                </div>
              </div>

              <div style={{ marginBottom: "1.25rem" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.875rem",
                    fontWeight: "600",
                    color: "#374151",
                    marginBottom: "0.5rem",
                  }}
                >
                  Descrição
                </label>
                <textarea
                  {...register("descricao")}
                  rows={3}
                  placeholder="Adicione detalhes sobre o produto..."
                  style={{
                    width: "100%",
                    padding: "0.75rem 1rem",
                    border: "2px solid #e5e7eb",
                    borderRadius: "0.75rem",
                    fontSize: "0.875rem",
                    fontWeight: "500",
                    outline: "none",
                    resize: "vertical",
                    minHeight: "90px",
                    lineHeight: "1.6",
                    transition: "all 0.2s",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#6366f1";
                    e.target.style.boxShadow =
                      "0 0 0 3px rgba(99, 102, 241, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#e5e7eb";
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                  gap: "1.25rem",
                }}
              >
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.875rem",
                      fontWeight: "600",
                      color: "#374151",
                      marginBottom: "0.5rem",
                    }}
                  >
                    Categoria <span style={{ color: "#dc2626" }}>*</span>
                  </label>
                  <select
                    {...register("categoria")}
                    style={{
                      width: "100%",
                      padding: "0.75rem 1rem",
                      border: "2px solid #e5e7eb",
                      borderRadius: "0.75rem",
                      fontSize: "0.875rem",
                      fontWeight: "500",
                      outline: "none",
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#6366f1";
                      e.target.style.boxShadow =
                        "0 0 0 3px rgba(99, 102, 241, 0.1)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "#e5e7eb";
                      e.target.style.boxShadow = "none";
                    }}
                  >
                    {CategoriaProdutoEnum.options.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat === "AUTOPECA"
                          ? "Autopeças"
                          : cat === "BATERIA"
                          ? "Baterias"
                          : "Pneus"}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.875rem",
                      fontWeight: "600",
                      color: "#374151",
                      marginBottom: "0.5rem",
                    }}
                  >
                    Tipo <span style={{ color: "#dc2626" }}>*</span>
                  </label>
                  <select
                    {...register("tipoProduto")}
                    style={{
                      width: "100%",
                      padding: "0.75rem 1rem",
                      border: "2px solid #e5e7eb",
                      borderRadius: "0.75rem",
                      fontSize: "0.875rem",
                      fontWeight: "500",
                      outline: "none",
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#6366f1";
                      e.target.style.boxShadow =
                        "0 0 0 3px rgba(99, 102, 241, 0.1)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "#e5e7eb";
                      e.target.style.boxShadow = "none";
                    }}
                  >
                    {TipoProdutoEnum.options.map((tipo) => (
                      <option key={tipo} value={tipo}>
                        {tipo === "NOVO"
                          ? "Novo"
                          : tipo === "USADO"
                          ? "Usado"
                          : "Seminovo"}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Seção: Valores */}
            <div style={{ marginBottom: "2rem" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  paddingBottom: "0.75rem",
                  borderBottom: "2px solid #e5e7eb",
                  marginBottom: "1.25rem",
                }}
              >
                <FaDollarSign
                  style={{ color: "#10b981", fontSize: "1.125rem" }}
                />
                <h3
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: "bold",
                    color: "#111827",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    margin: 0,
                  }}
                >
                  Valores
                </h3>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                  gap: "1.25rem",
                }}
              >
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.875rem",
                      fontWeight: "600",
                      color: "#374151",
                      marginBottom: "0.5rem",
                    }}
                  >
                    Preço de Compra (R$){" "}
                    <span style={{ color: "#dc2626" }}>*</span>
                  </label>
                  <div style={{ position: "relative" }}>
                    <span
                      style={{
                        position: "absolute",
                        left: "1rem",
                        top: "50%",
                        transform: "translateY(-50%)",
                        color: "#6b7280",
                        fontWeight: "600",
                        fontSize: "0.875rem",
                      }}
                    >
                      R$
                    </span>
                    <input
                      {...register("precoCompra", { valueAsNumber: true })}
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0,00"
                      style={{
                        width: "100%",
                        padding: "0.75rem 1rem 0.75rem 3rem",
                        border: errors.precoCompra
                          ? "2px solid #dc2626"
                          : "2px solid #e5e7eb",
                        borderRadius: "0.75rem",
                        fontSize: "0.875rem",
                        fontWeight: "500",
                        outline: "none",
                        transition: "all 0.2s",
                      }}
                      onFocus={(e) => {
                        if (!errors.precoCompra) {
                          e.target.style.borderColor = "#6366f1";
                          e.target.style.boxShadow =
                            "0 0 0 3px rgba(99, 102, 241, 0.1)";
                        }
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = errors.precoCompra
                          ? "#dc2626"
                          : "#e5e7eb";
                        e.target.style.boxShadow = "none";
                      }}
                    />
                  </div>
                  {errors.precoCompra && (
                    <p
                      style={{
                        color: "#dc2626",
                        fontSize: "0.75rem",
                        marginTop: "0.375rem",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.25rem",
                      }}
                    >
                      <span
                        style={{
                          display: "inline-block",
                          width: "0.375rem",
                          height: "0.375rem",
                          borderRadius: "50%",
                          backgroundColor: "#dc2626",
                        }}
                      />
                      {errors.precoCompra.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.875rem",
                      fontWeight: "600",
                      color: "#374151",
                      marginBottom: "0.5rem",
                    }}
                  >
                    Preço de Venda (R$){" "}
                    <span style={{ color: "#dc2626" }}>*</span>
                  </label>
                  <div style={{ position: "relative" }}>
                    <span
                      style={{
                        position: "absolute",
                        left: "1rem",
                        top: "50%",
                        transform: "translateY(-50%)",
                        color: "#6b7280",
                        fontWeight: "600",
                        fontSize: "0.875rem",
                      }}
                    >
                      R$
                    </span>
                    <input
                      {...register("precoVenda", { valueAsNumber: true })}
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0,00"
                      style={{
                        width: "100%",
                        padding: "0.75rem 1rem 0.75rem 3rem",
                        border: errors.precoVenda
                          ? "2px solid #dc2626"
                          : "2px solid #e5e7eb",
                        borderRadius: "0.75rem",
                        fontSize: "0.875rem",
                        fontWeight: "500",
                        outline: "none",
                        transition: "all 0.2s",
                      }}
                      onFocus={(e) => {
                        if (!errors.precoVenda) {
                          e.target.style.borderColor = "#6366f1";
                          e.target.style.boxShadow =
                            "0 0 0 3px rgba(99, 102, 241, 0.1)";
                        }
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = errors.precoVenda
                          ? "#dc2626"
                          : "#e5e7eb";
                        e.target.style.boxShadow = "none";
                      }}
                    />
                  </div>
                  {errors.precoVenda && (
                    <p
                      style={{
                        color: "#dc2626",
                        fontSize: "0.75rem",
                        marginTop: "0.375rem",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.25rem",
                      }}
                    >
                      <span
                        style={{
                          display: "inline-block",
                          width: "0.375rem",
                          height: "0.375rem",
                          borderRadius: "50%",
                          backgroundColor: "#dc2626",
                        }}
                      />
                      {errors.precoVenda.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Seção: Estoque */}
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  paddingBottom: "0.75rem",
                  borderBottom: "2px solid #e5e7eb",
                  marginBottom: "1.25rem",
                }}
              >
                <FaWarehouse
                  style={{ color: "#3b82f6", fontSize: "1.125rem" }}
                />
                <h3
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: "bold",
                    color: "#111827",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    margin: 0,
                  }}
                >
                  Controle de Estoque
                </h3>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                  gap: "1.25rem",
                }}
              >
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.875rem",
                      fontWeight: "600",
                      color: "#374151",
                      marginBottom: "0.5rem",
                    }}
                  >
                    Estoque Atual <span style={{ color: "#dc2626" }}>*</span>
                  </label>
                  <input
                    {...register("estoqueAtual", { valueAsNumber: true })}
                    type="number"
                    min="0"
                    placeholder="0"
                    style={{
                      width: "100%",
                      padding: "0.75rem 1rem",
                      border: errors.estoqueAtual
                        ? "2px solid #dc2626"
                        : "2px solid #e5e7eb",
                      borderRadius: "0.75rem",
                      fontSize: "0.875rem",
                      fontWeight: "500",
                      outline: "none",
                      transition: "all 0.2s",
                    }}
                    onFocus={(e) => {
                      if (!errors.estoqueAtual) {
                        e.target.style.borderColor = "#6366f1";
                        e.target.style.boxShadow =
                          "0 0 0 3px rgba(99, 102, 241, 0.1)";
                      }
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = errors.estoqueAtual
                        ? "#dc2626"
                        : "#e5e7eb";
                      e.target.style.boxShadow = "none";
                    }}
                  />
                  {errors.estoqueAtual && (
                    <p
                      style={{
                        color: "#dc2626",
                        fontSize: "0.75rem",
                        marginTop: "0.375rem",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.25rem",
                      }}
                    >
                      <span
                        style={{
                          display: "inline-block",
                          width: "0.375rem",
                          height: "0.375rem",
                          borderRadius: "50%",
                          backgroundColor: "#dc2626",
                        }}
                      />
                      {errors.estoqueAtual.message}
                    </p>
                  )}
                  <p
                    style={{
                      fontSize: "0.75rem",
                      color: "#6b7280",
                      marginTop: "0.375rem",
                    }}
                  >
                    Quantidade disponível no momento
                  </p>
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.875rem",
                      fontWeight: "600",
                      color: "#374151",
                      marginBottom: "0.5rem",
                    }}
                  >
                    Estoque Mínimo <span style={{ color: "#dc2626" }}>*</span>
                  </label>
                  <input
                    {...register("estoqueMinimo", { valueAsNumber: true })}
                    type="number"
                    min="0"
                    placeholder="5"
                    style={{
                      width: "100%",
                      padding: "0.75rem 1rem",
                      border: errors.estoqueMinimo
                        ? "2px solid #dc2626"
                        : "2px solid #e5e7eb",
                      borderRadius: "0.75rem",
                      fontSize: "0.875rem",
                      fontWeight: "500",
                      outline: "none",
                      transition: "all 0.2s",
                    }}
                    onFocus={(e) => {
                      if (!errors.estoqueMinimo) {
                        e.target.style.borderColor = "#6366f1";
                        e.target.style.boxShadow =
                          "0 0 0 3px rgba(99, 102, 241, 0.1)";
                      }
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = errors.estoqueMinimo
                        ? "#dc2626"
                        : "#e5e7eb";
                      e.target.style.boxShadow = "none";
                    }}
                  />
                  {errors.estoqueMinimo && (
                    <p
                      style={{
                        color: "#dc2626",
                        fontSize: "0.75rem",
                        marginTop: "0.375rem",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.25rem",
                      }}
                    >
                      <span
                        style={{
                          display: "inline-block",
                          width: "0.375rem",
                          height: "0.375rem",
                          borderRadius: "50%",
                          backgroundColor: "#dc2626",
                        }}
                      />
                      {errors.estoqueMinimo.message}
                    </p>
                  )}
                  <p
                    style={{
                      fontSize: "0.75rem",
                      color: "#6b7280",
                      marginTop: "0.375rem",
                    }}
                  >
                    Alerta quando atingir este nível
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Fixo */}
          <div
            style={{
              display: "flex",
              gap: "1rem",
              padding: "1.5rem",
              borderTop: "1px solid #e5e7eb",
              backgroundColor: "#f9fafb",
            }}
          >
            <button
              type="button"
              style={{
                flex: 1,
                padding: "0.875rem 1.5rem",
                borderRadius: "0.75rem",
                fontSize: "0.875rem",
                fontWeight: "bold",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                border: "2px solid #e5e7eb",
                backgroundColor: "white",
                color: "#374151",
                cursor: "pointer",
                transition: "all 0.2s",
                boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
              }}
              onClick={onCancel}
              disabled={isSubmitting}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#f3f4f6";
                e.currentTarget.style.borderColor = "#d1d5db";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "white";
                e.currentTarget.style.borderColor = "#e5e7eb";
              }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              style={{
                flex: 1,
                padding: "0.875rem 1.5rem",
                borderRadius: "0.75rem",
                fontSize: "0.875rem",
                fontWeight: "bold",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                border: "none",
                background: "linear-gradient(to right, #6366f1, #9333ea)",
                color: "white",
                cursor: isSubmitting ? "not-allowed" : "pointer",
                transition: "all 0.2s",
                boxShadow: "0 10px 15px -3px rgba(99, 102, 241, 0.3)",
                opacity: isSubmitting ? 0.6 : 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
              }}
              disabled={isSubmitting}
              onMouseEnter={(e) => {
                if (!isSubmitting) {
                  e.currentTarget.style.boxShadow =
                    "0 20px 25px -5px rgba(99, 102, 241, 0.4)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow =
                  "0 10px 15px -3px rgba(99, 102, 241, 0.3)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              {isSubmitting ? (
                <>
                  <div
                    style={{
                      width: "1rem",
                      height: "1rem",
                      border: "2px solid rgba(255, 255, 255, 0.3)",
                      borderTopColor: "white",
                      borderRadius: "50%",
                      animation: "spin 0.6s linear infinite",
                    }}
                  />
                  Salvando...
                </>
              ) : (
                <>{produto ? "💾 Atualizar" : "✨ Cadastrar"}</>
              )}
            </button>
          </div>
        </form>
        <style>{`
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
      
      /* Barra de scroll personalizada */
      form > div:first-child::-webkit-scrollbar {
        width: 12px;
      }
      
      form > div:first-child::-webkit-scrollbar-track {
        background: #f3f4f6;
        border-radius: 10px;
      }
      
      form > div:first-child::-webkit-scrollbar-thumb {
        background: linear-gradient(to bottom, #6366f1, #9333ea);
        border-radius: 10px;
        border: 2px solid #f3f4f6;
      }
      
      form > div:first-child::-webkit-scrollbar-thumb:hover {
        background: linear-gradient(to bottom, #4f46e5, #7c3aed);
      }
      
      form > div:first-child::-webkit-scrollbar-thumb:active {
        background: linear-gradient(to bottom, #4338ca, #6d28d9);
      }
    `}</style>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default ProdutoForm;
