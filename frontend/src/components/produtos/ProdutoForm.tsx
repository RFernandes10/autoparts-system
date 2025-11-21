import { useState, useEffect } from "react";
import type { Produto } from "../../types";
import {
  FaTimes,
  FaChevronDown,
  FaChevronUp,
  FaCar,
  FaCarBattery,
} from "react-icons/fa";
import { GiCarWheel } from "react-icons/gi";
import "./ProdutoForm.css";

interface ProdutoFormProps {
  produto?: Produto;
  onSave: (produto: any) => void;
  onCancel: () => void;
}

function ProdutoForm({ produto, onSave, onCancel }: ProdutoFormProps) {
  // Estados do formulário principal
  const [formData, setFormData] = useState({
    codigoProduto: "",
    nome: "",
    descricao: "",
    categoria: "AUTOPECA",
    tipoProduto: "NOVO",
    precoCompra: "",
    precoVenda: "",
    estoqueAtual: "",
    estoqueMinimo: "5",
    fornecedorId: "",
    imagemUrl: "",
  });

  // Estados das especificações opcionais
  const [mostrarCompatibilidade, setMostrarCompatibilidade] = useState(false);
  const [mostrarBateria, setMostrarBateria] = useState(false);
  const [mostrarPneu, setMostrarPneu] = useState(false);

  const [compatibilidade, setCompatibilidade] = useState({
    marcaVeiculo: "",
    modeloVeiculo: "",
    anoInicio: "",
    anoFim: "",
    motor: "",
  });

  const [bateria, setBateria] = useState({
    amperagem: "",
    voltagem: "",
    tipoBateria: "",
    marca: "",
    garantiaMeses: "",
    estado: "NOVA",
  });

  const [pneu, setPneu] = useState({
    medida: "",
    marca: "",
    tipoPneu: "NOVO",
    dot: "",
    indiceCarga: "",
    indiceVelocidade: "",
  });

  // Carregar dados se estiver editando
  useEffect(() => {
    if (produto) {
      setFormData({
        codigoProduto: produto.codigoProduto,
        nome: produto.nome,
        descricao: produto.descricao || "",
        categoria: produto.categoria,
        tipoProduto: produto.tipoProduto,
        precoCompra: produto.precoCompra.toString(),
        precoVenda: produto.precoVenda.toString(),
        estoqueAtual: produto.estoqueAtual.toString(),
        estoqueMinimo: produto.estoqueMinimo.toString(),
        fornecedorId: produto.fornecedorId ? produto.fornecedorId.toString() : "",
        imagemUrl: produto.imagemUrl || "",
      });

      // Carregar especificações se existirem
      if (produto.compatibilidadeVeiculos && produto.compatibilidadeVeiculos.length > 0) {
        const comp = produto.compatibilidadeVeiculos[0];
        setCompatibilidade({
          marcaVeiculo: comp.marcaVeiculo || "",
          modeloVeiculo: comp.modeloVeiculo || "",
          anoInicio: comp.anoInicio?.toString() || "",
          anoFim: comp.anoFim?.toString() || "",
          motor: comp.motor || "",
        });
        setMostrarCompatibilidade(true);
      }

      // Tratamento para especificacoesBateria (pode ser array ou objeto)
      if (produto.especificacoesBateria) {
        const bat = Array.isArray(produto.especificacoesBateria)
          ? produto.especificacoesBateria[0]
          : produto.especificacoesBateria;
        
        if (bat && (bat.amperagem || bat.voltagem)) {
          setBateria({
            amperagem: bat.amperagem || "",
            voltagem: bat.voltagem || "",
            tipoBateria: bat.tipoBateria || "",
            marca: bat.marca || "",
            garantiaMeses: bat.garantiaMeses?.toString() || "",
            estado: bat.estado || "NOVA",
          });
          setMostrarBateria(true);
        }
      }

      // Tratamento para especificacoesPneu (pode ser array ou objeto)
      if (produto.especificacoesPneu) {
        const pn = Array.isArray(produto.especificacoesPneu)
          ? produto.especificacoesPneu[0]
          : produto.especificacoesPneu;
        
        if (pn && (pn.medida || pn.marca)) {
          setPneu({
            medida: pn.medida || "",
            marca: pn.marca || "",
            tipoPneu: pn.tipoPneu || "NOVO",
            dot: pn.dot || "",
            indiceCarga: pn.indiceCarga || "",
            indiceVelocidade: pn.indiceVelocidade || "",
          });
          setMostrarPneu(true);
        }
      }
    }
  }, [produto]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const data: any = {
      codigoProduto: formData.codigoProduto,
      nome: formData.nome,
      descricao: formData.descricao,
      categoria: formData.categoria,
      tipoProduto: formData.tipoProduto,
      precoCompra: Number(formData.precoCompra),
      precoVenda: Number(formData.precoVenda),
      estoqueAtual: Number(formData.estoqueAtual),
      estoqueMinimo: Number(formData.estoqueMinimo),
      fornecedorId: formData.fornecedorId ? Number(formData.fornecedorId) : null,
      imagemUrl: formData.imagemUrl,
    };

    // Adicionar especificações se preenchidas
    if (mostrarCompatibilidade && compatibilidade.marcaVeiculo) {
      data.compatibilidade = {
        marcaVeiculo: compatibilidade.marcaVeiculo,
        modeloVeiculo: compatibilidade.modeloVeiculo,
        anoInicio: Number(compatibilidade.anoInicio),
        anoFim: compatibilidade.anoFim ? Number(compatibilidade.anoFim) : undefined,
        motor: compatibilidade.motor,
      };
    }

    if (mostrarBateria && bateria.amperagem) {
      data.especificacoesBateria = {
        amperagem: bateria.amperagem,
        voltagem: bateria.voltagem,
        tipoBateria: bateria.tipoBateria,
        marca: bateria.marca,
        garantiaMeses: bateria.garantiaMeses ? Number(bateria.garantiaMeses) : undefined,
        estado: bateria.estado,
      };
    }

    if (mostrarPneu && pneu.medida) {
      data.especificacoesPneu = {
        medida: pneu.medida,
        marca: pneu.marca,
        tipoPneu: pneu.tipoPneu,
        dot: pneu.dot,
        indiceCarga: pneu.indiceCarga,
        indiceVelocidade: pneu.indiceVelocidade,
      };
    }

    onSave(data);
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

        <form onSubmit={handleSubmit} className="form">
          {/* Informações Básicas */}
          <div className="form-section">
            <h3 className="section-title">Informações Básicas</h3>

            <div className="form-row">
              <div className="form-group">
                <label>Código *</label>
                <input
                  type="text"
                  value={formData.codigoProduto}
                  onChange={(e) =>
                    setFormData({ ...formData, codigoProduto: e.target.value })
                  }
                  required
                  placeholder="Ex: P001"
                />
              </div>
              <div className="form-group">
                <label>Nome *</label>
                <input
                  type="text"
                  value={formData.nome}
                  onChange={(e) =>
                    setFormData({ ...formData, nome: e.target.value })
                  }
                  required
                  placeholder="Nome do produto"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Descrição</label>
              <textarea
                value={formData.descricao}
                onChange={(e) =>
                  setFormData({ ...formData, descricao: e.target.value })
                }
                rows={2}
                placeholder="Descrição opcional do produto"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Categoria *</label>
                <select
                  value={formData.categoria}
                  onChange={(e) =>
                    setFormData({ ...formData, categoria: e.target.value })
                  }
                >
                  <option value="AUTOPECA">Autopeça</option>
                  <option value="BATERIA">Bateria</option>
                  <option value="PNEU">Pneu</option>
                  <option value="ACESSORIO">Acessório</option>
                  <option value="SERVICO">Serviço</option>
                </select>
              </div>
              <div className="form-group">
                <label>Tipo *</label>
                <select
                  value={formData.tipoProduto}
                  onChange={(e) =>
                    setFormData({ ...formData, tipoProduto: e.target.value })
                  }
                >
                  <option value="NOVO">Novo</option>
                  <option value="USADO">Usado</option>
                  <option value="RECONDICIONADO">Recondicionado</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Preço Compra (R$) *</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.precoCompra}
                  onChange={(e) =>
                    setFormData({ ...formData, precoCompra: e.target.value })
                  }
                  required
                  placeholder="0.00"
                />
              </div>
              <div className="form-group">
                <label>Preço Venda (R$) *</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.precoVenda}
                  onChange={(e) =>
                    setFormData({ ...formData, precoVenda: e.target.value })
                  }
                  required
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Estoque Atual *</label>
                <input
                  type="number"
                  min="0"
                  value={formData.estoqueAtual}
                  onChange={(e) =>
                    setFormData({ ...formData, estoqueAtual: e.target.value })
                  }
                  required
                  placeholder="0"
                />
              </div>
              <div className="form-group">
                <label>Estoque Mínimo *</label>
                <input
                  type="number"
                  min="0"
                  value={formData.estoqueMinimo}
                  onChange={(e) =>
                    setFormData({ ...formData, estoqueMinimo: e.target.value })
                  }
                  required
                  placeholder="5"
                />
              </div>
            </div>
          </div>

          {/* Especificações Adicionais */}
          <div className="form-section">
            <h3 className="section-title">Especificações Adicionais (Opcional)</h3>

            {/* Compatibilidade de Veículo */}
            <div className="collapsible-section">
              <button
                type="button"
                className="collapsible-header"
                onClick={() => setMostrarCompatibilidade(!mostrarCompatibilidade)}
              >
                <span className="collapsible-title">
                  <FaCar className="section-icon" /> Compatibilidade de Veículo
                </span>
                {mostrarCompatibilidade ? <FaChevronUp /> : <FaChevronDown />}
              </button>
              {mostrarCompatibilidade && (
                <div className="collapsible-content">
                  <div className="form-row">
                    <div className="form-group">
                      <label>Marca</label>
                      <input
                        type="text"
                        value={compatibilidade.marcaVeiculo}
                        onChange={(e) =>
                          setCompatibilidade({
                            ...compatibilidade,
                            marcaVeiculo: e.target.value,
                          })
                        }
                        placeholder="Ex: Volkswagen"
                      />
                    </div>
                    <div className="form-group">
                      <label>Modelo</label>
                      <input
                        type="text"
                        value={compatibilidade.modeloVeiculo}
                        onChange={(e) =>
                          setCompatibilidade({
                            ...compatibilidade,
                            modeloVeiculo: e.target.value,
                          })
                        }
                        placeholder="Ex: Gol"
                      />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Ano Início</label>
                      <input
                        type="number"
                        value={compatibilidade.anoInicio}
                        onChange={(e) =>
                          setCompatibilidade({
                            ...compatibilidade,
                            anoInicio: e.target.value,
                          })
                        }
                        placeholder="2010"
                      />
                    </div>
                    <div className="form-group">
                      <label>Ano Fim</label>
                      <input
                        type="number"
                        value={compatibilidade.anoFim}
                        onChange={(e) =>
                          setCompatibilidade({
                            ...compatibilidade,
                            anoFim: e.target.value,
                          })
                        }
                        placeholder="2023"
                      />
                    </div>
                    <div className="form-group">
                      <label>Motor</label>
                      <input
                        type="text"
                        value={compatibilidade.motor}
                        onChange={(e) =>
                          setCompatibilidade({
                            ...compatibilidade,
                            motor: e.target.value,
                          })
                        }
                        placeholder="1.0"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Especificações de Bateria */}
            <div className="collapsible-section">
              <button
                type="button"
                className="collapsible-header"
                onClick={() => setMostrarBateria(!mostrarBateria)}
              >
                <span className="collapsible-title">
                  <FaCarBattery className="section-icon" /> Especificações de Bateria
                </span>
                {mostrarBateria ? <FaChevronUp /> : <FaChevronDown />}
              </button>
              {mostrarBateria && (
                <div className="collapsible-content">
                  <div className="form-row">
                    <div className="form-group">
                      <label>Amperagem</label>
                      <input
                        type="text"
                        value={bateria.amperagem}
                        onChange={(e) =>
                          setBateria({ ...bateria, amperagem: e.target.value })
                        }
                        placeholder="60Ah"
                      />
                    </div>
                    <div className="form-group">
                      <label>Voltagem</label>
                      <input
                        type="text"
                        value={bateria.voltagem}
                        onChange={(e) =>
                          setBateria({ ...bateria, voltagem: e.target.value })
                        }
                        placeholder="12V"
                      />
                    </div>
                    <div className="form-group">
                      <label>Tipo</label>
                      <input
                        type="text"
                        value={bateria.tipoBateria}
                        onChange={(e) =>
                          setBateria({ ...bateria, tipoBateria: e.target.value })
                        }
                        placeholder="Chumbo-ácido"
                      />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Marca</label>
                      <input
                        type="text"
                        value={bateria.marca}
                        onChange={(e) =>
                          setBateria({ ...bateria, marca: e.target.value })
                        }
                        placeholder="Moura"
                      />
                    </div>
                    <div className="form-group">
                      <label>Garantia (meses)</label>
                      <input
                        type="number"
                        value={bateria.garantiaMeses}
                        onChange={(e) =>
                          setBateria({ ...bateria, garantiaMeses: e.target.value })
                        }
                        placeholder="18"
                      />
                    </div>
                    <div className="form-group">
                      <label>Estado</label>
                      <select
                        value={bateria.estado}
                        onChange={(e) =>
                          setBateria({ ...bateria, estado: e.target.value })
                        }
                      >
                        <option value="NOVA">Nova</option>
                        <option value="USADA">Usada</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Especificações de Pneu */}
            <div className="collapsible-section">
              <button
                type="button"
                className="collapsible-header"
                onClick={() => setMostrarPneu(!mostrarPneu)}
              >
                <span className="collapsible-title">
                  <GiCarWheel className="section-icon" /> Especificações de Pneu
                </span>
                {mostrarPneu ? <FaChevronUp /> : <FaChevronDown />}
              </button>
              {mostrarPneu && (
                <div className="collapsible-content">
                  <div className="form-row">
                    <div className="form-group">
                      <label>Medida</label>
                      <input
                        type="text"
                        value={pneu.medida}
                        onChange={(e) =>
                          setPneu({ ...pneu, medida: e.target.value })
                        }
                        placeholder="175/65R14"
                      />
                    </div>
                    <div className="form-group">
                      <label>Marca</label>
                      <input
                        type="text"
                        value={pneu.marca}
                        onChange={(e) =>
                          setPneu({ ...pneu, marca: e.target.value })
                        }
                        placeholder="Goodyear"
                      />
                    </div>
                    <div className="form-group">
                      <label>Tipo</label>
                      <select
                        value={pneu.tipoPneu}
                        onChange={(e) =>
                          setPneu({ ...pneu, tipoPneu: e.target.value })
                        }
                      >
                        <option value="NOVO">Novo</option>
                        <option value="USADO">Usado</option>
                        <option value="REMOLDADO">Remoldado</option>
                      </select>
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>DOT</label>
                      <input
                        type="text"
                        value={pneu.dot}
                        onChange={(e) =>
                          setPneu({ ...pneu, dot: e.target.value })
                        }
                        placeholder="2025"
                      />
                    </div>
                    <div className="form-group">
                      <label>Índice de Carga</label>
                      <input
                        type="text"
                        value={pneu.indiceCarga}
                        onChange={(e) =>
                          setPneu({ ...pneu, indiceCarga: e.target.value })
                        }
                        placeholder="86"
                      />
                    </div>
                    <div className="form-group">
                      <label>Índice de Velocidade</label>
                      <input
                        type="text"
                        value={pneu.indiceVelocidade}
                        onChange={(e) =>
                          setPneu({ ...pneu, indiceVelocidade: e.target.value })
                        }
                        placeholder="H"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Botões */}
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
