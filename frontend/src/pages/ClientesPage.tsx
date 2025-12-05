import { useEffect, useState } from 'react';
import { clienteService } from '../services/clienteService';
import type { Cliente } from '../types';
import ClienteForm from '../components/clientes/ClienteForm';
import { FaUser, FaPhone, FaEnvelope, FaMapMarkerAlt, FaIdCard } from 'react-icons/fa';
import './ClientesPage.css';

function ClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [showForm, setShowForm] = useState(false);
  const [clienteEditando, setClienteEditando] = useState<Cliente | undefined>(undefined);
  const [busca, setBusca] = useState('');

  useEffect(() => {
    carregarClientes();
  }, []);

  const carregarClientes = async () => {
    try {
      setLoading(true);
      const dados = await clienteService.listarTodos();
      setClientes(dados);
    } catch (err) {
      setError('Erro ao carregar clientes');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleNovoCliente = () => {
    setClienteEditando(undefined);
    setShowForm(true);
  };

  const handleEditarCliente = (cliente: Cliente) => {
    setClienteEditando(cliente);
    setShowForm(true);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSalvarCliente = async (clienteData: any) => {
    try {
      if (clienteEditando) {
        await clienteService.atualizar(clienteEditando.id, clienteData);
        alert('Cliente atualizado com sucesso!');
      } else {
        await clienteService.criar(clienteData);
        alert('Cliente cadastrado com sucesso!');
      }
      setShowForm(false);
      setClienteEditando(undefined);
      carregarClientes();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      alert('Erro ao salvar cliente: ' + (err.response?.data?.error || err.message));
      console.error(err);
    }
  };

  const handleDeletarCliente = async (cliente: Cliente) => {
    if (window.confirm(`Tem certeza que deseja excluir o cliente "${cliente.nome}"?`)) {
      try {
        await clienteService.deletar(cliente.id);
        alert('Cliente excluído com sucesso!');
        carregarClientes();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        alert('Erro ao excluir cliente: ' + (err.response?.data?.error || err.message));
        console.error(err);
      }
    }
  };

  const handleCancelarForm = () => {
    setShowForm(false);
    setClienteEditando(undefined);
  };

  const formatarCpfCnpj = (cpfCnpj: string) => {
    const numbers = cpfCnpj.replace(/\D/g, '');
    
    if (numbers.length === 11) {
      return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    } else if (numbers.length === 14) {
      return numbers.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    }
    return cpfCnpj;
  };

  const formatarTelefone = (telefone: string) => {
    const numbers = telefone.replace(/\D/g, '');
    
    if (numbers.length === 10) {
      return numbers.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    } else if (numbers.length === 11) {
      return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
    return telefone;
  };

  const clientesFiltrados = clientes.filter(cliente => {
    const termoBusca = busca.toLowerCase();
    return (
      cliente.nome.toLowerCase().includes(termoBusca) ||
      cliente.cpfCnpj.includes(busca.replace(/\D/g, '')) ||
      cliente.telefone.includes(busca.replace(/\D/g, '')) ||
      cliente.email?.toLowerCase().includes(termoBusca)
    );
  });

  if (loading) return <div className="loading">Carregando clientes...</div>;
  if (error) return <div className="error">Erro: {error}</div>;

  return (
    <div className="clientes-page">
      <div className="page-header">
        <h2>Gerenciamento de Clientes</h2>
        <button className="btn-primary" onClick={handleNovoCliente}>
          + Novo Cliente
        </button>
      </div>

      {/* Barra de Busca */}
      <div className="busca-container">
        <input
          type="text"
          placeholder="🔍 Buscar por nome, CPF/CNPJ, telefone ou e-mail..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="input-busca"
        />
        <span className="resultado-busca">
          {clientesFiltrados.length} cliente{clientesFiltrados.length !== 1 ? 's' : ''} encontrado{clientesFiltrados.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Lista de Clientes */}
      {clientesFiltrados.length === 0 ? (
        <div className="empty-state">
          <FaUser size={64} color="#bdc3c7" />
          <h3>Nenhum cliente encontrado</h3>
          <p>Comece cadastrando seu primeiro cliente!</p>
        </div>
      ) : (
        <div className="clientes-grid">
          {clientesFiltrados.map((cliente) => (
            <div key={cliente.id} className="cliente-card">
              <div className="cliente-header">
                <div className="cliente-avatar">
                  <FaUser size={24} />
                </div>
                <div className="cliente-info-header">
                  <h3>{cliente.nome}</h3>
                  <span className="cliente-id">ID: #{cliente.id}</span>
                </div>
              </div>

              <div className="cliente-detalhes">
                <div className="detalhe-item">
                  <FaIdCard className="detalhe-icon" />
                  <div>
                    <span className="detalhe-label">CPF/CNPJ</span>
                    <span className="detalhe-valor">{formatarCpfCnpj(cliente.cpfCnpj)}</span>
                  </div>
                </div>

                <div className="detalhe-item">
                  <FaPhone className="detalhe-icon" />
                  <div>
                    <span className="detalhe-label">Telefone</span>
                    <span className="detalhe-valor">{formatarTelefone(cliente.telefone)}</span>
                  </div>
                </div>

                {cliente.email && (
                  <div className="detalhe-item">
                    <FaEnvelope className="detalhe-icon" />
                    <div>
                      <span className="detalhe-label">E-mail</span>
                      <span className="detalhe-valor">{cliente.email}</span>
                    </div>
                  </div>
                )}

                {cliente.endereco && (
                  <div className="detalhe-item">
                    <FaMapMarkerAlt className="detalhe-icon" />
                    <div>
                      <span className="detalhe-label">Endereço</span>
                      <span className="detalhe-valor">{cliente.endereco}</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="cliente-acoes">
                <button 
                  className="btn-editar"
                  onClick={() => handleEditarCliente(cliente)}
                >
                  ✏️ Editar
                </button>
                <button 
                  className="btn-deletar"
                  onClick={() => handleDeletarCliente(cliente)}
                >
                  🗑️ Excluir
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Formulário Modal */}
      {showForm && (
        <ClienteForm
          cliente={clienteEditando}
          onSave={handleSalvarCliente}
          onCancel={handleCancelarForm}
        />
      )}
    </div>
  );
}

export default ClientesPage;
