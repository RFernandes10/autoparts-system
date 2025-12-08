import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { produtoService } from "../services/produtoService";
import type { Produto } from "../types";
import type { ProdutoFormData } from "../schemas/produto.schema";

import ProdutoForm from "../components/produtos/ProdutoForm";
import { ProdutoCard } from "../components/produtos/ProdutoCard";
import { ProdutoListItem } from "../components/produtos/ProdutoListItem";
import { ProdutoFilterBar } from "../components/produtos/ProdutoFilterBar";
import { PageHeader } from "../components/common/PageHeader";
import { ProdutoCardSkeleton } from "../components/produtos/ProdutoCardSkeleton";
import { ProdutoListItemSkeleton } from "../components/produtos/ProdutoListItemSkeleton";
import { FaSearch, FaBoxOpen, FaExclamationCircle } from "react-icons/fa";

function ProdutosPage() {
  const queryClient = useQueryClient();

  const [filtroCategoria, setFiltroCategoria] = useState("TODOS");
  const [busca, setBusca] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [produtoEditando, setProdutoEditando] = useState<Produto | undefined>(
    undefined
  );
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const {
    data: produtos = [],
    isLoading,
    isError,
    error,
  } = useQuery<Produto[], Error>({
    queryKey: ["produtos"],
    queryFn: produtoService.listarTodos,
  });

  const createMutation = useMutation({
    mutationFn: (data: ProdutoFormData) =>
      produtoService.criar(data as unknown as Partial<Produto>),
    onSuccess: () => {
      toast.success("✅ Produto cadastrado com sucesso!", {
        duration: 3000,
        position: "top-right",
      });
      queryClient.invalidateQueries({ queryKey: ["produtos"] });
    },
    onError: (err: any) => {
      toast.error(
        `❌ ${err.response?.data?.message || "Erro ao salvar produto"}`,
        {
          duration: 4000,
          position: "top-right",
        }
      );
    },
  });

  const updateMutation = useMutation({
    mutationFn: (vars: { id: number; data: ProdutoFormData }) =>
      produtoService.atualizar(
        vars.id,
        vars.data as unknown as Partial<Produto>
      ),
    onSuccess: () => {
      toast.success("✅ Produto atualizado com sucesso!", {
        duration: 3000,
        position: "top-right",
      });
      queryClient.invalidateQueries({ queryKey: ["produtos"] });
    },
    onError: (err: any) => {
      toast.error(
        `❌ ${err.response?.data?.message || "Erro ao atualizar produto"}`,
        {
          duration: 4000,
          position: "top-right",
        }
      );
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => produtoService.deletar(id),
    onSuccess: () => {
      toast.success("🗑️ Produto excluído com sucesso!", {
        duration: 3000,
        position: "top-right",
      });
      queryClient.invalidateQueries({ queryKey: ["produtos"] });
    },
    onError: (err: any) => {
      toast.error(
        `❌ ${err.response?.data?.message || "Erro ao excluir produto"}`,
        {
          duration: 4000,
          position: "top-right",
        }
      );
    },
  });

  const handleNovoProduto = () => {
    setProdutoEditando(undefined);
    setShowForm(true);
  };

  const handleEditarProduto = (produto: Produto) => {
    setProdutoEditando(produto);
    setShowForm(true);
  };

  const handleSalvarProduto = async (data: ProdutoFormData) => {
    if (produtoEditando) {
      await updateMutation.mutateAsync({ id: produtoEditando.id, data });
    } else {
      await createMutation.mutateAsync(data);
    }
    setShowForm(false);
    setProdutoEditando(undefined);
  };

  const handleDeletarProduto = async (produto: Produto) => {
    if (
      window.confirm(
        `⚠️ Tem certeza que deseja excluir o produto "${produto.nome}"?\n\nEsta ação não pode ser desfeita.`
      )
    ) {
      await deleteMutation.mutateAsync(produto.id);
    }
  };

  const handleCancelarForm = () => {
    setShowForm(false);
    setProdutoEditando(undefined);
  };

  const produtosFiltrados = useMemo(() => {
    return produtos
      .filter(
        (p) => filtroCategoria === "TODOS" || p.categoria === filtroCategoria
      )
      .filter(
        (p) =>
          busca === "" ||
          p.nome.toLowerCase().includes(busca.toLowerCase()) ||
          p.codigoProduto.toLowerCase().includes(busca.toLowerCase())
      );
  }, [produtos, filtroCategoria, busca]);

  // Estado de carregamento com skeleton animado
  if (isLoading) {
    const skeletonCount = viewMode === 'grid' ? 8 : 10;
    const SkeletonComponent = viewMode === 'grid' ? ProdutoCardSkeleton : ProdutoListItemSkeleton;
    
    return (
      <div className="flex flex-col h-full gap-6 animate-in fade-in duration-300">
        <PageHeader
          title="Produtos"
          subtitle="Carregando produtos..."
          buttonText="Novo Produto"
          onButtonClick={() => {}}
          buttonDisabled={true}
        />
        
        <div className="w-full h-16 bg-gradient-to-r from-zinc-100 to-zinc-50 dark:from-zinc-800 dark:to-zinc-900 rounded-lg animate-pulse" />
        
        <div className={viewMode === 'grid' 
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' 
          : 'flex flex-col gap-3'
        }>
          {Array.from({ length: skeletonCount }).map((_, index) => (
            <SkeletonComponent key={index} />
          ))}
        </div>
      </div>
    );
  }

  // Estado de erro
  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-full animate-in fade-in zoom-in duration-300">
        <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-2xl p-12 max-w-md text-center">
          <div className="w-20 h-20 mx-auto mb-6 bg-red-100 dark:bg-red-900/40 rounded-full flex items-center justify-center">
            <FaExclamationCircle className="text-red-500 dark:text-red-400" size={40} />
          </div>
          <h3 className="text-2xl font-bold text-red-800 dark:text-red-300 mb-3">
            Erro ao carregar produtos
          </h3>
          <p className="text-red-600 dark:text-red-400 mb-6">
            {error?.message || "Ocorreu um erro inesperado"}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  // Estado vazio - sem produtos no sistema
  if (produtos.length === 0 && !isLoading) {
    return (
      <div className="flex flex-col h-full gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <PageHeader
          title="Produtos"
          subtitle="Nenhum produto cadastrado"
          buttonText="Cadastrar Primeiro Produto"
          onButtonClick={handleNovoProduto}
        />

        <div className="flex flex-col items-center justify-center flex-1 text-center p-16">
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full blur-3xl opacity-20 animate-pulse" />
            <div className="relative w-32 h-32 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-3xl flex items-center justify-center shadow-2xl">
              <FaBoxOpen size={64} className="text-indigo-600 dark:text-indigo-400" />
            </div>
          </div>
          
          <h2 className="text-3xl font-bold text-text-dark dark:text-text-light mb-4">
            Comece seu catálogo de produtos
          </h2>
          <p className="text-lg text-text-muted max-w-md mb-8">
            Adicione produtos ao seu estoque para começar a gerenciar autopeças, baterias e pneus de forma eficiente.
          </p>
          
          <button
            onClick={handleNovoProduto}
            className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 flex items-center gap-3"
          >
            <FaBoxOpen size={20} />
            Cadastrar Primeiro Produto
          </button>
        </div>

        {showForm && (
          <ProdutoForm
            produto={produtoEditando}
            onSave={handleSalvarProduto}
            onCancel={handleCancelarForm}
          />
        )}
      </div>
    );
  }

  // Tela principal com produtos
  return (
    <div className="flex h-full flex-col gap-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <PageHeader
        title="Produtos"
        subtitle={`${produtos.length} ${produtos.length === 1 ? 'produto cadastrado' : 'produtos cadastrados'}`}
        buttonText="Novo Produto"
        onButtonClick={handleNovoProduto}
      />

      <ProdutoFilterBar
        busca={busca}
        onBuscaChange={setBusca}
        filtroCategoria={filtroCategoria}
        onFiltroCategoriaChange={setFiltroCategoria}
        produtos={produtos}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {produtosFiltrados.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center p-16 mt-6 border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-2xl bg-gradient-to-br from-zinc-50 to-white dark:from-zinc-900/50 dark:to-zinc-800/50 shadow-inner animate-in fade-in zoom-in duration-300">
          <div className="w-24 h-24 mb-6 bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-900 rounded-2xl flex items-center justify-center shadow-lg">
            <FaSearch size={48} className="text-zinc-400 dark:text-zinc-600" />
          </div>
          <h3 className="text-2xl font-bold text-text-dark dark:text-text-light mb-3">
            Nenhum produto encontrado
          </h3>
          <p className="text-text-muted max-w-md mb-6">
            Não encontramos produtos que correspondam aos filtros aplicados.
            {busca && (
              <span className="block mt-2 text-sm">
                Busca: <span className="font-semibold text-primary">"{busca}"</span>
              </span>
            )}
          </p>
          <button
            onClick={() => {
              setBusca("");
              setFiltroCategoria("TODOS");
            }}
            className="px-6 py-3 bg-white dark:bg-zinc-800 border-2 border-zinc-200 dark:border-zinc-700 text-text-dark dark:text-text-light font-medium rounded-lg hover:border-primary hover:text-primary transition-all duration-200 shadow-sm hover:shadow-md"
          >
            Limpar Filtros
          </button>
        </div>
      ) : (
        <div className={
          viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-in fade-in duration-300' 
            : 'flex flex-col gap-3 animate-in fade-in duration-300'
        }>
          {produtosFiltrados.map((produto, index) => (
            <div
              key={produto.id}
              className="animate-in fade-in slide-in-from-bottom-4"
              style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'backwards' }}
            >
              {viewMode === 'grid' ? (
                <ProdutoCard
                  produto={produto}
                  onEdit={handleEditarProduto}
                  onDelete={handleDeletarProduto}
                />
              ) : (
                <ProdutoListItem
                  produto={produto}
                  onEdit={handleEditarProduto}
                  onDelete={handleDeletarProduto}
                />
              )}
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <ProdutoForm
          produto={produtoEditando}
          onSave={handleSalvarProduto}
          onCancel={handleCancelarForm}
        />
      )}
    </div>
  );
}

export default ProdutosPage;
