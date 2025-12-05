import { useState, useEffect } from 'react';
import type { Cliente } from '../../types';
import { 
  FaTimes, 
  FaUser, 
  FaIdCard, 
  FaPhone, 
  FaEnvelope, 
  FaMapMarkerAlt 
} from 'react-icons/fa';
import './ClienteForm.css';

interface ClienteFormProps {
  cliente?: Cliente;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSave: (cliente: any) => void;
  onCancel: () => void;
}

function ClienteForm({ cliente, onSave, onCancel }: ClienteFormProps) {
  const [formData, setFormData] = useState({
    nome: '',
    cpfCnpj: '',
    telefone: '',
    email: '',
    endereco: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (cliente) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData({
        nome: cliente.nome,
        cpfCnpj: cliente.cpfCnpj,
        telefone: cliente.telefone,
        email: cliente.email || '',
        endereco: cliente.endereco || '',
      });
    }
  }, [cliente]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const formatarCpfCnpj = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    
    if (numbers.length <= 11) {
      return numbers
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})/, '$1-$2')
        .replace(/(-\d{2})\d+?$/, '$1');
    } else {
      return numbers
        .replace(/(\d{2})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1/$2')
        .replace(/(\d{4})(\d)/, '$1-$2')
        .replace(/(-\d{2})\d+?$/, '$1');
    }
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

  const handleCpfCnpjChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatarCpfCnpj(e.target.value);
    setFormData(prev => ({ ...prev, cpfCnpj: formatted }));
    if (errors.cpfCnpj) {
      setErrors(prev => ({ ...prev, cpfCnpj: '' }));
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
    if (!formData.cpfCnpj) newErrors.cpfCnpj = 'CPF/CNPJ é obrigatório';
    if (!formData.telefone) newErrors.telefone = 'Telefone é obrigatório';
    
    if (formData.email && !validarEmail(formData.email)) {
      newErrors.email = 'E-mail inválido';
    }

    const cpfCnpjNumbers = formData.cpfCnpj.replace(/\D/g, '');
    if (cpfCnpjNumbers.length !== 11 && cpfCnpjNumbers.length !== 14) {
      newErrors.cpfCnpj = 'CPF deve ter 11 dígitos ou CNPJ 14 dígitos';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validate()) {
      const clienteData = {
        nome: formData.nome.trim(),
        cpfCnpj: formData.cpfCnpj.replace(/\D/g, ''),
        telefone: formData.telefone.replace(/\D/g, ''),
        email: formData.email.trim() || undefined,
        endereco: formData.endereco.trim() || undefined,
      };

      onSave(clienteData);
    }
  };

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content cliente-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>
            <FaUser className="header-icon" />
            {cliente ? 'Editar Cliente' : 'Novo Cliente'}
          </h2>
          <button className="btn-close" onClick={onCancel} type="button">
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="form">
          <div className="form-section">
            <h3 className="section-title">Informações do Cliente</h3>

            {/* Nome */}
            <div className="form-group">
              <label htmlFor="nome">
                <FaUser size={12} /> Nome Completo *
              </label>
              <input
                type="text"
                id="nome"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                className={errors.nome ? 'error' : ''}
                placeholder="Ex: João da Silva"
                autoComplete="name"
              />
              {errors.nome && <span className="error-message">{errors.nome}</span>}
            </div>

            {/* CPF/CNPJ e Telefone */}
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="cpfCnpj">
                  <FaIdCard size={12} /> CPF/CNPJ *
                </label>
                <input
                  type="text"
                  id="cpfCnpj"
                  name="cpfCnpj"
                  value={formData.cpfCnpj}
                  onChange={handleCpfCnpjChange}
                  className={errors.cpfCnpj ? 'error' : ''}
                  placeholder="000.000.000-00"
                  disabled={!!cliente}
                  autoComplete="off"
                />
                {errors.cpfCnpj && <span className="error-message">{errors.cpfCnpj}</span>}
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
                placeholder="exemplo@email.com"
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
              {cliente ? 'Salvar Alterações' : 'Cadastrar Cliente'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ClienteForm;
