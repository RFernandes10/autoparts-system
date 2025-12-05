import { useState, useEffect } from 'react';
import type { Fornecedor } from '../../types';
import { 
  FaTimes, 
  FaBuilding, 
  FaIdCard, 
  FaPhone, 
  FaEnvelope, 
  FaMapMarkerAlt,
  FaTruck
} from 'react-icons/fa';
import './FornecedorForm.css';

interface FornecedorFormProps {
  fornecedor?: Fornecedor;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSave: (fornecedor: any) => void;
  onCancel: () => void;
}

function FornecedorForm({ fornecedor, onSave, onCancel }: FornecedorFormProps) {
  const [formData, setFormData] = useState({
    nome: '',
    cnpj: '',
    telefone: '',
    email: '',
    endereco: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (fornecedor) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData({
        nome: fornecedor.nome,
        cnpj: fornecedor.cnpj,
        telefone: fornecedor.telefone,
        email: fornecedor.email || '',
        endereco: fornecedor.endereco || '',
      });
    }
  }, [fornecedor]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const formatarCnpj = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    return numbers
      .replace(/(\d{2})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1/$2')
      .replace(/(\d{4})(\d)/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');
  };

  const formatarTelefone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    
    if (numbers.length <= 10) {
      return numbers
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{4})(\d)/, '$1-$2')
        .replace(/(-\d{4})\d+?$/, '$1');
    } else {
      return numbers
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{5})(\d)/, '$1-$2')
        .replace(/(-\d{4})\d+?$/, '$1');
    }
  };

  const handleCnpjChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatarCnpj(e.target.value);
    setFormData(prev => ({ ...prev, cnpj: formatted }));
    if (errors.cnpj) {
      setErrors(prev => ({ ...prev, cnpj: '' }));
    }
  };

  const handleTelefoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatarTelefone(e.target.value);
    setFormData(prev => ({ ...prev, telefone: formatted }));
    if (errors.telefone) {
      setErrors(prev => ({ ...prev, telefone: '' }));
    }
  };

  const validarEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.nome.trim()) newErrors.nome = 'Nome é obrigatório';
    if (!formData.cnpj) newErrors.cnpj = 'CNPJ é obrigatório';
    if (!formData.telefone) newErrors.telefone = 'Telefone é obrigatório';
    
    if (formData.email && !validarEmail(formData.email)) {
      newErrors.email = 'E-mail inválido';
    }

    const cnpjNumbers = formData.cnpj.replace(/\D/g, '');
    if (cnpjNumbers.length !== 14) {
      newErrors.cnpj = 'CNPJ deve ter 14 dígitos';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validate()) {
      const fornecedorData = {
        nome: formData.nome.trim(),
        cnpj: formData.cnpj.replace(/\D/g, ''),
        telefone: formData.telefone.replace(/\D/g, ''),
        email: formData.email.trim() || undefined,
        endereco: formData.endereco.trim() || undefined,
      };

      onSave(fornecedorData);
    }
  };

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content fornecedor-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>
            <FaTruck className="header-icon" />
            {fornecedor ? 'Editar Fornecedor' : 'Novo Fornecedor'}
          </h2>
          <button className="btn-close" onClick={onCancel} type="button">
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="form">
          <div className="form-section">
            <h3 className="section-title">Informações do Fornecedor</h3>

            {/* Nome da Empresa */}
            <div className="form-group">
              <label htmlFor="nome">
                <FaBuilding size={12} /> Nome da Empresa *
              </label>
              <input
                type="text"
                id="nome"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                className={errors.nome ? 'error' : ''}
                placeholder="Ex: AutoPeças Brasil Ltda"
                autoComplete="organization"
              />
              {errors.nome && <span className="error-message">{errors.nome}</span>}
            </div>

            {/* CNPJ e Telefone */}
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="cnpj">
                  <FaIdCard size={12} /> CNPJ *
                </label>
                <input
                  type="text"
                  id="cnpj"
                  name="cnpj"
                  value={formData.cnpj}
                  onChange={handleCnpjChange}
                  className={errors.cnpj ? 'error' : ''}
                  placeholder="00.000.000/0000-00"
                  disabled={!!fornecedor}
                  autoComplete="off"
                />
                {errors.cnpj && <span className="error-message">{errors.cnpj}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="telefone">
                  <FaPhone size={12} /> Telefone *
                </label>
                <input
                  type="text"
                  id="telefone"
                  name="telefone"
                  value={formData.telefone}
                  onChange={handleTelefoneChange}
                  className={errors.telefone ? 'error' : ''}
                  placeholder="(00) 00000-0000"
                  autoComplete="tel"
                />
                {errors.telefone && <span className="error-message">{errors.telefone}</span>}
              </div>
            </div>

            {/* E-mail */}
            <div className="form-group">
              <label htmlFor="email">
                <FaEnvelope size={12} /> E-mail
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? 'error' : ''}
                placeholder="contato@empresa.com"
                autoComplete="email"
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>

            {/* Endereço */}
            <div className="form-group">
              <label htmlFor="endereco">
                <FaMapMarkerAlt size={12} /> Endereço Completo
              </label>
              <textarea
                id="endereco"
                name="endereco"
                value={formData.endereco}
                onChange={handleChange}
                rows={3}
                placeholder="Rua, Número, Bairro, Cidade - Estado"
                autoComplete="street-address"
              />
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={onCancel}>
              Cancelar
            </button>
            <button type="submit" className="btn-submit">
              {fornecedor ? 'Salvar Alterações' : 'Cadastrar Fornecedor'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default FornecedorForm;
