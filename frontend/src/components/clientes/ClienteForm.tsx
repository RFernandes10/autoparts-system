import { useState, useEffect } from "react";
import type { Cliente } from "../../types";
import {
  FaTimes,
  FaUser,
  FaIdCard,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaUserCircle,
} from "react-icons/fa";

interface ClienteFormProps {
  cliente?: Cliente;
  onSave: (cliente: any) => void;
  onCancel: () => void;
}

function ClienteForm({ cliente, onSave, onCancel }: ClienteFormProps) {
  const [formData, setFormData] = useState({
    nome: "",
    cpfCnpj: "",
    telefone: "",
    email: "",
    endereco: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (cliente) {
      setFormData({
        nome: cliente.nome,
        cpfCnpj: cliente.cpfCnpj,
        telefone: cliente.telefone,
        email: cliente.email || "",
        endereco: cliente.endereco || "",
      });
    }
  }, [cliente]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onCancel]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const formatarCpfCnpj = (value: string) => {
    const numbers = value.replace(/\D/g, "");

    if (numbers.length <= 11) {
      return numbers
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})/, "$1-$2")
        .replace(/(-\d{2})\d+?$/, "$1");
    } else {
      return numbers
        .replace(/(\d{2})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1/$2")
        .replace(/(\d{4})(\d)/, "$1-$2")
        .replace(/(-\d{2})\d+?$/, "$1");
    }
  };

  const formatarTelefone = (value: string) => {
    const numbers = value.replace(/\D/g, "");

    if (numbers.length <= 10) {
      return numbers
        .replace(/(\d{2})(\d)/, "($1) $2")
        .replace(/(\d{4})(\d)/, "$1-$2")
        .replace(/(-\d{4})\d+?$/, "$1");
    } else {
      return numbers
        .replace(/(\d{2})(\d)/, "($1) $2")
        .replace(/(\d{5})(\d)/, "$1-$2")
        .replace(/(-\d{4})\d+?$/, "$1");
    }
  };

  const handleCpfCnpjChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatarCpfCnpj(e.target.value);
    setFormData((prev) => ({ ...prev, cpfCnpj: formatted }));
    if (errors.cpfCnpj) {
      setErrors((prev) => ({ ...prev, cpfCnpj: "" }));
    }
  };

  const handleTelefoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatarTelefone(e.target.value);
    setFormData((prev) => ({ ...prev, telefone: formatted }));
    if (errors.telefone) {
      setErrors((prev) => ({ ...prev, telefone: "" }));
    }
  };

  const validarEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.nome.trim()) newErrors.nome = "Nome é obrigatório";
    if (!formData.cpfCnpj) newErrors.cpfCnpj = "CPF/CNPJ é obrigatório";
    if (!formData.telefone) newErrors.telefone = "Telefone é obrigatório";

    if (formData.email && !validarEmail(formData.email)) {
      newErrors.email = "E-mail inválido";
    }

    const cpfCnpjNumbers = formData.cpfCnpj.replace(/\D/g, "");
    if (cpfCnpjNumbers.length !== 11 && cpfCnpjNumbers.length !== 14) {
      newErrors.cpfCnpj = "CPF deve ter 11 dígitos ou CNPJ 14 dígitos";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validate()) {
      const clienteData = {
        nome: formData.nome.trim(),
        cpfCnpj: formData.cpfCnpj.replace(/\D/g, ""),
        telefone: formData.telefone.replace(/\D/g, ""),
        email: formData.email.trim() || undefined,
        endereco: formData.endereco.trim() || undefined,
      };

      onSave(clienteData);
    }
  };

  const inputStyle = (hasError: boolean, disabled?: boolean) => ({
    width: "100%",
    padding: "0.75rem 1rem",
    border: hasError ? "2px solid #ef4444" : "2px solid #e5e7eb",
    borderRadius: "0.75rem",
    fontSize: "0.875rem",
    fontWeight: "500",
    backgroundColor: disabled ? "#f3f4f6" : hasError ? "#fef2f2" : "white",
    color: disabled ? "#9ca3af" : "#111827",
    outline: "none",
    transition: "all 0.2s",
    cursor: disabled ? "not-allowed" : "text",
  });

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
          maxWidth: "42rem",
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          overflow: "hidden",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "1.5rem",
            borderBottom: "1px solid #e5e7eb",
            background: "linear-gradient(to right, #eff6ff, #f5f3ff)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div
              style={{
                width: "3rem",
                height: "3rem",
                borderRadius: "0.75rem",
                background:
                  "linear-gradient(to bottom right, #3b82f6, #8b5cf6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 10px 15px -3px rgba(59, 130, 246, 0.3)",
              }}
            >
              <FaUserCircle style={{ color: "white", fontSize: "1.25rem" }} />
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
                {cliente ? "Editar Cliente" : "Novo Cliente"}
              </h2>
              <p
                style={{
                  fontSize: "0.875rem",
                  color: "#6b7280",
                  margin: "0.25rem 0 0 0",
                }}
              >
                {cliente
                  ? "Atualize as informações do cliente"
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

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            overflow: "hidden",
          }}
        >
          <div style={{ overflowY: "auto", padding: "1.5rem", flex: 1 }}>
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
                <FaUser style={{ color: "#3b82f6", fontSize: "1.125rem" }} />
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
                  Informações do Cliente
                </h3>
              </div>

              {/* Nome */}
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
                  Nome Completo <span style={{ color: "#dc2626" }}>*</span>
                </label>
                <input
                  type="text"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  placeholder="Ex: João da Silva"
                  style={inputStyle(!!errors.nome)}
                  onFocus={(e) => {
                    if (!errors.nome) {
                      e.target.style.borderColor = "#3b82f6";
                      e.target.style.boxShadow =
                        "0 0 0 3px rgba(59, 130, 246, 0.1)";
                    }
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = errors.nome
                      ? "#ef4444"
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
                    {errors.nome}
                  </p>
                )}
              </div>

              {/* CPF/CNPJ e Telefone */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
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
                    CPF/CNPJ <span style={{ color: "#dc2626" }}>*</span>
                  </label>
                  <input
                    type="text"
                    name="cpfCnpj"
                    value={formData.cpfCnpj}
                    onChange={handleCpfCnpjChange}
                    placeholder="000.000.000-00"
                    disabled={!!cliente}
                    style={inputStyle(!!errors.cpfCnpj, !!cliente)}
                    onFocus={(e) => {
                      if (!errors.cpfCnpj && !cliente) {
                        e.target.style.borderColor = "#3b82f6";
                        e.target.style.boxShadow =
                          "0 0 0 3px rgba(59, 130, 246, 0.1)";
                      }
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = errors.cpfCnpj
                        ? "#ef4444"
                        : "#e5e7eb";
                      e.target.style.boxShadow = "none";
                    }}
                  />
                  {errors.cpfCnpj && (
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
                      {errors.cpfCnpj}
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
                    Telefone <span style={{ color: "#dc2626" }}>*</span>
                  </label>
                  <input
                    type="text"
                    name="telefone"
                    value={formData.telefone}
                    onChange={handleTelefoneChange}
                    placeholder="(00) 00000-0000"
                    style={inputStyle(!!errors.telefone)}
                    onFocus={(e) => {
                      if (!errors.telefone) {
                        e.target.style.borderColor = "#3b82f6";
                        e.target.style.boxShadow =
                          "0 0 0 3px rgba(59, 130, 246, 0.1)";
                      }
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = errors.telefone
                        ? "#ef4444"
                        : "#e5e7eb";
                      e.target.style.boxShadow = "none";
                    }}
                  />
                  {errors.telefone && (
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
                      {errors.telefone}
                    </p>
                  )}
                </div>
              </div>

              {/* Email */}
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
                  E-mail
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="exemplo@email.com"
                  style={inputStyle(!!errors.email)}
                  onFocus={(e) => {
                    if (!errors.email) {
                      e.target.style.borderColor = "#3b82f6";
                      e.target.style.boxShadow =
                        "0 0 0 3px rgba(59, 130, 246, 0.1)";
                    }
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = errors.email
                      ? "#ef4444"
                      : "#e5e7eb";
                    e.target.style.boxShadow = "none";
                  }}
                />
                {errors.email && (
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
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Endereço */}
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
                  Endereço Completo
                </label>
                <textarea
                  name="endereco"
                  value={formData.endereco}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Rua, Número, Bairro, Cidade - Estado"
                  style={{
                    ...inputStyle(false),
                    resize: "vertical",
                    minHeight: "90px",
                    lineHeight: "1.6",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#3b82f6";
                    e.target.style.boxShadow =
                      "0 0 0 3px rgba(59, 130, 246, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#e5e7eb";
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>
            </div>
          </div>

          {/* Footer */}
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
                background: "linear-gradient(to right, #3b82f6, #8b5cf6)",
                color: "white",
                cursor: "pointer",
                transition: "all 0.2s",
                boxShadow: "0 10px 15px -3px rgba(59, 130, 246, 0.3)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow =
                  "0 20px 25px -5px rgba(59, 130, 246, 0.4)";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow =
                  "0 10px 15px -3px rgba(59, 130, 246, 0.3)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              {cliente ? "💾 Salvar Alterações" : "✨ Cadastrar Cliente"}
            </button>
          </div>
        </form>
      </div>

      <style>{`
        div::-webkit-scrollbar {
          width: 12px;
        }
        div::-webkit-scrollbar-track {
          background: #f3f4f6;
          border-radius: 10px;
        }
        div::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #3b82f6, #8b5cf6);
          border-radius: 10px;
          border: 2px solid #f3f4f6;
        }
        div::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #2563eb, #7c3aed);
        }
      `}</style>
    </div>
  );
}

export default ClienteForm;
