import { useState, useEffect } from 'react';
import { type Produto, CategoriaProduto, TipoProduto } from '../../types';
import { FaTools, FaCarBattery } from 'react-icons/fa';
import { GiCarWheel } from 'react-icons/gi';
import './ProdutoForm.css';

interface ProdutoFormProps {
  produto?: Produto;
  onSave: (produto: any) => void;
  onCancel: () => void;
}

function ProdutoForm({ produto, onSave, onCancel }: ProdutoFormProps) {
  const [formData, setFormData] = useState({
    codigoProduto: '',
    nome: '',
    descricao: '',
    categoria: 'AUTOPECA' as CategoriaProduto,
    tipoProduto: 'NOVO' as TipoProduto,
    precoCompra: '',
    precoVenda: '',
    estoqueAtual: '',
    estoqueMinimo: '5',
    fornecedorId: '',
    imagemUrl: '',
  });

  const [compatibilidadeData, setCompatibilidadeData] = useState({
    marcaVeiculo: '',
    modeloVeiculo: '',
    anoInicio: '',
    anoFim: '',
    motor: '',
  });

  const [bateriaData, setBateriaData] = useState({
    amperagem: '',
    voltagem: '',
    tipoBateria: '',
    marca: '',
    garantiaMeses: '',
    estado: 'NOVA' as 'NOVA' | 'USADA',
  });

  const [pneuData, setPneuData] = useState({
    medida: '',
    marca: '',
    tipoPneu: 'NOVO' as 'NOVO' | 'USADO' | 'REMOLDADO',
    dot: '',
    indiceCarga: '',
    indiceVelocidade: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [mostrarCompatibilidade, setMostrarCompatibilidade] = useState(false);
  const [mostrarBateria, setMostrarBateria] = useState(false);
  const [mostrarPneu, setMostrarPneu] = useState(false);

  useEffect(() => {
    if (produto) {
      setFormData({
        codigoProduto: produto.codigoProduto,
        nome: produto.nome,
        descricao: produto.descricao || '',
        categoria: produto.categoria,
        tipoProduto: produto.tipoProduto,
        precoCompra: produto.precoCompra.toString(),
        precoVenda: produto.precoVenda.toString(),
        estoqueAtual: produto.estoqueAtual.toString(),
        estoqueMinimo: produto.estoqueMinimo.toString(),
        fornecedorId: produto.fornecedorId ? produto.fornecedorId.toString() : '',
        imagemUrl: produto.imagemUrl || '',
      });

      // Carregar compatibilidade se existir
      if (produto.compatibilidadeVeiculos && produto.compatibilidadeVeiculos.length > 0) {
        const comp = produto.compatibilidadeVeiculos[0];
        setCompatibilidadeData({
          marcaVeiculo: comp.marcaVeiculo || '',
          modeloVeiculo: comp.modeloVeiculo || '',
          anoInicio: comp.anoInicio ? comp.anoInicio.toString() : '',
          anoFim: comp.anoFim ? comp.anoFim.toString() : '',
          motor: comp.motor || '',
        });
        setMostrarCompatibilidade(true);
      }

      // Carregar especificações de bateria se existir
      if (produto.especificacoesBateria && produto.especificacoesBateria.length > 0) {
        const bat = produto.especificacoesBateria[0];
        setBateriaData({
          amperagem: bat.amperagem || '',
          voltagem: bat.voltagem || '',
          tipoBateria: bat.tipoBateria || '',
          marca: bat.marca || '',
          garantiaMeses: bat.garantiaMeses ? bat.garantiaMeses.toString() : '',
          estado: bat.estado || 'NOVA',
        });
        setMostrarBateria(true);
      }

      // Carregar especificações de pneu se existir
      if (produto.especificacoesPneu && produto.especificacoesPneu.length > 0) {
        const pneu = produto.especificacoesPneu[0];
        setPneuData({
          medida: pneu.medida || '',
          marca: pneu.marca || '',
          tipoPneu: pneu.tipoPneu || 'NOVO',
          dot: pneu.dot || '',
          indiceCarga: pneu.indiceCarga || '',
          indiceVelocidade: pneu.indiceVelocidade || '',
        });
        setMostrarPneu(true);
      }
    }
  }, [produto]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleCompatibilidadeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCompatibilidadeData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBateriaChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setBateriaData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePneuChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPneuData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.codigoProduto) newErrors.codigoProduto = 'Código é obrigatório';
    if (!formData.nome) newErrors.nome = 'Nome é obrigatório';
    if (!formData.precoCompra || Number(formData.precoCompra) <= 0) {
      newErrors.precoCompra = 'Preço de compra deve ser maior que zero';
    }
    if (!formData.precoVenda || Number(formData.precoVenda) <= 0) {
      newErrors.precoVenda = 'Preço de venda deve ser maior que zero';
    }
    if (!formData.estoqueAtual || Number(formData.estoqueAtual) < 0) {
      newErrors.estoqueAtual = 'Estoque atual é obrigatório';
    }
    if (!formData.estoqueMinimo || Number(formData.estoqueMinimo) < 0) {
      newErrors.estoqueMinimo = 'Estoque mínimo é obrigatório';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    const produtoData: any = {
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

    // Adicionar compatibilidade se preenchida
    if (mostrarCompatibilidade && compatibilidadeData.marcaVeiculo && compatibilidadeData.modeloVeiculo) {
      produtoData.compatibilidade = {
        marcaVeiculo: compatibilidadeData.marcaVeiculo,
        modeloVeiculo: compatibilidadeData.modeloVeiculo,
        anoInicio: Number(compatibilidadeData.anoInicio),
        anoFim: compatibilidadeData.anoFim ? Number(compatibilidadeData.anoFim) : undefined,
        motor: compatibilidadeData.motor,
      };
    }

    // Adicionar especificações de bateria se preenchidas
    if (mostrarBateria && bateriaData.amperagem && bateriaData.voltagem) {
      produtoData.especificacoesBateria = {
        amperagem: bateriaData.amperagem,
        voltagem: bateriaData.voltagem,
        tipoBateria: bateriaData.tipoBateria,
        marca: bateriaData.marca,
        garantiaMeses: bateriaData.garantiaMeses ? Number(bateriaData.garantiaMeses) : undefined,
        estado: bateriaData.estado,
      };
    }

    // Adicionar especificações de pneu se preenchidas
    if (mostrarPneu && pneuData.medida && pneuData.marca) {
      produtoData.especificacoesPneu = {
        medida: pneuData.medida,
        marca: pneuData.marca,
        tipoPneu: pneuData.tipoPneu,
        dot: pneuData.dot,
        indiceCarga: pneuData.indiceCarga,
        indiceVelocidade: pneuData.indiceVelocidade,
      };
    }

    onSave(produtoData);
  };

  return (
    <div className="produto-form-overlay">
      <div className="produto-form-container">
        <div className="form-header">
          <h2>{produto ? 'Editar Produto' : 'Novo Produto'}</h2>
          <button className="btn-close" onClick={onCancel}>
            ×
          </button>
        </div>

        <form className="produto-form" onSubmit={handleSubmit}>
          {/* Informações Básicas */}
          <div className="form-section">
            <h3>Informações Básicas</h3>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="codigoProduto">Código do Produto *</label>
                <input
                  type="text"
                  id="codigoProduto"
                  name="codigoProduto"
                  value={formData.codigoProduto}
                  onChange={handleChange}
                  className={errors.codigoProduto ? 'error' : ''}
                />
                {errors.codigoProduto && <span className="error-message">{errors.codigoProduto}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="nome">Nome *</label>
                <input
                  type="text"
                  id="nome"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  className={errors.nome ? 'error' : ''}
                />
                {errors.nome && <span className="error-message">{errors.nome}</span>}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="descricao">Descrição</label>
              <textarea
                id="descricao"
                name="descricao"
                value={formData.descricao}
                onChange={handleChange}
                rows={3}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="categoria">Categoria *</label>
                <select
                  id="categoria"
                  name="categoria"
                  value={formData.categoria}
                  onChange={handleChange}
                >
                  <option value="AUTOPECA">Autopeça</option>
                  <option value="BATERIA">Bateria</option>
                  <option value="PNEU">Pneu</option>
                  <option value="ACESSORIO">Acessório</option>
                  <option value="SERVICO">Serviço</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="tipoProduto">Tipo *</label>
                <select
                  id="tipoProduto"
                  name="tipoProduto"
                  value={formData.tipoProduto}
                  onChange={handleChange}
                >
                  <option value="NOVO">Novo</option>
                  <option value="USADO">Usado</option>
                  <option value="RECONDICIONADO">Recondicionado</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="precoCompra">Preço de Compra (R$) *</label>
                <input
                  type="number"
                  id="precoCompra"
                  name="precoCompra"
                  value={formData.precoCompra}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  className={errors.precoCompra ? 'error' : ''}
                />
                {errors.precoCompra && <span className="error-message">{errors.precoCompra}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="precoVenda">Preço de Venda (R$) *</label>
                <input
                  type="number"
                  id="precoVenda"
                  name="precoVenda"
                  value={formData.precoVenda}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  className={errors.precoVenda ? 'error' : ''}
                />
                {errors.precoVenda && <span className="error-message">{errors.precoVenda}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="estoqueAtual">Estoque Atual *</label>
                <input
                  type="number"
                  id="estoqueAtual"
                  name="estoqueAtual"
                  value={formData.estoqueAtual}
                  onChange={handleChange}
                  min="0"
                  className={errors.estoqueAtual ? 'error' : ''}
                />
                {errors.estoqueAtual && <span className="error-message">{errors.estoqueAtual}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="estoqueMinimo">Estoque Mínimo *</label>
                <input
                  type="number"
                  id="estoqueMinimo"
                  name="estoqueMinimo"
                  value={formData.estoqueMinimo}
                  onChange={handleChange}
                  min="0"
                  className={errors.estoqueMinimo ? 'error' : ''}
                />
                {errors.estoqueMinimo && <span className="error-message">{errors.estoqueMinimo}</span>}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="fornecedorId">Fornecedor</label>
              <select
                id="fornecedorId"
                name="fornecedorId"
                value={formData.fornecedorId}
                onChange={handleChange}
              >
                <option value="">Nenhum / Cadastrar depois</option>
                <option value="1">Fornecedor Padrão</option>
              </select>
              <small style={{ color: '#95a5a6', fontSize: '12px', marginTop: '5px', display: 'block' }}>
                Opcional - Pode cadastrar fornecedor depois
              </small>
            </div>

            <div className="form-group">
              <label htmlFor="imagemUrl">URL da Imagem</label>
              <input
                type="text"
                id="imagemUrl"
                name="imagemUrl"
                value={formData.imagemUrl}
                onChange={handleChange}
                placeholder="https://exemplo.com/imagem.jpg"
              />
            </div>
          </div>

          {/* Seções Opcionais */}
          <div className="form-section optional-sections">
            <h3>Especificações Adicionais (Opcional)</h3>

            {/* Compatibilidade de Veículo */}
            <div className="optional-section">
              <button
                type="button"
                className="btn-toggle-section"
                onClick={() => setMostrarCompatibilidade(!mostrarCompatibilidade)}
              >
                <FaTools /> Compatibilidade de Veículo {mostrarCompatibilidade ? '▼' : '▶'}
              </button>

              {mostrarCompatibilidade && (
                <div className="section-content">
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="marcaVeiculo">Marca</label>
                      <input
                        type="text"
                        id="marcaVeiculo"
                        name="marcaVeiculo"
                        value={compatibilidadeData.marcaVeiculo}
                        onChange={handleCompatibilidadeChange}
                        placeholder="Ex: Volkswagen"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="modeloVeiculo">Modelo</label>
                      <input
                        type="text"
                        id="modeloVeiculo"
                        name="modeloVeiculo"
                        value={compatibilidadeData.modeloVeiculo}
                        onChange={handleCompatibilidadeChange}
                        placeholder="Ex: Gol"
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="anoInicio">Ano Início</label>
                      <input
                        type="number"
                        id="anoInicio"
                        name="anoInicio"
                        value={compatibilidadeData.anoInicio}
                        onChange={handleCompatibilidadeChange}
                        placeholder="2010"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="anoFim">Ano Fim</label>
                      <input
                        type="number"
                        id="anoFim"
                        name="anoFim"
                        value={compatibilidadeData.anoFim}
                        onChange={handleCompatibilidadeChange}
                        placeholder="2023"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="motor">Motor</label>
                      <input
                        type="text"
                        id="motor"
                        name="motor"
                        value={compatibilidadeData.motor}
                        onChange={handleCompatibilidadeChange}
                        placeholder="1.0"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Especificações de Bateria */}
            <div className="optional-section">
              <button
                type="button"
                className="btn-toggle-section"
                onClick={() => setMostrarBateria(!mostrarBateria)}
              >
                <FaCarBattery /> Especificações de Bateria {mostrarBateria ? '▼' : '▶'}
              </button>

              {mostrarBateria && (
                <div className="section-content">
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="amperagem">Amperagem</label>
                      <input
                        type="text"
                        id="amperagem"
                        name="amperagem"
                        value={bateriaData.amperagem}
                        onChange={handleBateriaChange}
                        placeholder="Ex: 60Ah"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="voltagem">Voltagem</label>
                      <input
                        type="text"
                        id="voltagem"
                        name="voltagem"
                        value={bateriaData.voltagem}
                        onChange={handleBateriaChange}
                        placeholder="Ex: 12V"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="tipoBateria">Tipo</label>
                      <input
                        type="text"
                        id="tipoBateria"
                        name="tipoBateria"
                        value={bateriaData.tipoBateria}
                        onChange={handleBateriaChange}
                        placeholder="Ex: Chumbo-ácido"
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="marcaBateria">Marca</label>
                      <input
                        type="text"
                        id="marcaBateria"
                        name="marca"
                        value={bateriaData.marca}
                        onChange={handleBateriaChange}
                        placeholder="Ex: Moura"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="garantiaMeses">Garantia (meses)</label>
                      <input
                        type="number"
                        id="garantiaMeses"
                        name="garantiaMeses"
                        value={bateriaData.garantiaMeses}
                        onChange={handleBateriaChange}
                        placeholder="18"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="estadoBateria">Estado</label>
                      <select
                        id="estadoBateria"
                        name="estado"
                        value={bateriaData.estado}
                        onChange={handleBateriaChange}
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
            <div className="optional-section">
              <button
                type="button"
                className="btn-toggle-section"
                onClick={() => setMostrarPneu(!mostrarPneu)}
              >
                <GiCarWheel /> Especificações de Pneu {mostrarPneu ? '▼' : '▶'}
              </button>

              {mostrarPneu && (
                <div className="section-content">
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="medida">Medida</label>
                      <input
                        type="text"
                        id="medida"
                        name="medida"
                        value={pneuData.medida}
                        onChange={handlePneuChange}
                        placeholder="Ex: 175/70R13"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="marcaPneu">Marca</label>
                      <input
                        type="text"
                        id="marcaPneu"
                        name="marca"
                        value={pneuData.marca}
                        onChange={handlePneuChange}
                        placeholder="Ex: Pirelli"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="tipoPneu">Tipo</label>
                      <select
                        id="tipoPneu"
                        name="tipoPneu"
                        value={pneuData.tipoPneu}
                        onChange={handlePneuChange}
                      >
                        <option value="NOVO">Novo</option>
                        <option value="USADO">Usado</option>
                        <option value="REMOLDADO">Remoldado</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="dot">DOT</label>
                      <input
                        type="text"
                        id="dot"
                        name="dot"
                        value={pneuData.dot}
                        onChange={handlePneuChange}
                        placeholder="Ex: 2023"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="indiceCarga">Índice de Carga</label>
                      <input
                        type="text"
                        id="indiceCarga"
                        name="indiceCarga"
                        value={pneuData.indiceCarga}
                        onChange={handlePneuChange}
                        placeholder="Ex: 82"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="indiceVelocidade">Índice de Velocidade</label>
                      <input
                        type="text"
                        id="indiceVelocidade"
                        name="indiceVelocidade"
                        value={pneuData.indiceVelocidade}
                        onChange={handlePneuChange}
                        placeholder="Ex: T"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={onCancel}>
              Cancelar
            </button>
            <button type="submit" className="btn-submit">
              {produto ? 'Atualizar Produto' : 'Cadastrar Produto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProdutoForm;
