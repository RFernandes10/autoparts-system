import { useState, useEffect } from 'react';
import type { Cliente } from '../../types';
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
      // CPF: 000.000.000-00
      return numbers
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})/, '$1-$2')
        .replace(/(-\d{2})\d+?$/, '$1');
    } else {
      // CNPJ: 00.000.000/0000-00
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
      // Telefone fixo: (00) 0000-0000
      return numbers
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{4})(\d)/, '$1-$2')
        .replace(/(-\d{4})\d+?$/, '$1');
    } else {
      // Celular: (00) 00000-0000
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
        cpfCnpj: formData.cpfCnpj.replace(/\D/g, ''), // Remove formatação
        telefone: formData.telefone.replace(/\D/g, ''), // Remove formatação
        email: formData.email.trim() || undefined,
        endereco: formData.endereco.trim() || undefined,
      };

      onSave(clienteData);
    }
  };

  return (
    <div className="cliente-form-overlay">
      <div className="cliente-form-container">
        <div className="form-header">
          <h2>{cliente ? '✏️ Editar Cliente' : '➕ Novo Cliente'}</h2>
          <button className="btn-close" onClick={onCancel}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="cliente-form">
          <div className="form-group">
            <label htmlFor="nome">Nome Completo *</label>
            <input
              type="text"
              id="nome"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              className={errors.nome ? 'error' : ''}
              placeholder="Ex: João da Silva"
            />
            {errors.nome && <span className="error-message">{errors.nome}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="cpfCnpj">CPF/CNPJ *</label>
              <input
                type="text"
                id="cpfCnpj"
                name="cpfCnpj"
                value={formData.cpfCnpj}
                onChange={handleCpfCnpjChange}
                className={errors.cpfCnpj ? 'error' : ''}
                placeholder="000.000.000-00 ou 00.000.000/0000-00"
                disabled={!!cliente}
              />
              {errors.cpfCnpj && <span className="error-message">{errors.cpfCnpj}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="telefone">Telefone *</label>
              <input
                type="text"
                id="telefone"
                name="telefone"
                value={formData.telefone}
                onChange={handleTelefoneChange}
                className={errors.telefone ? 'error' : ''}
                placeholder="(00) 00000-0000"
              />
              {errors.telefone && <span className="error-message">{errors.telefone}</span>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email">E-mail</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? 'error' : ''}
              placeholder="exemplo@email.com"
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="endereco">Endereço Completo</label>
            <textarea
              id="endereco"
              name="endereco"
              value={formData.endereco}
              onChange={handleChange}
              rows={3}
              placeholder="Rua, Número, Bairro, Cidade - Estado"
            />
          </div>

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
