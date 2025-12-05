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
import { FaSearch } from "react-icons/fa";

import "./ProdutosPage.css";
import "../components/produtos/ProdutoListItem.css";


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
      toast.success("Produto cadastrado com sucesso.");
      queryClient.invalidateQueries({ queryKey: ["produtos"] });
    },
    onError: (err: any) => {
      toast.error(
        "Erro ao salvar produto. " + (err.response?.data?.message || err.message)
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
      toast.success("Produto atualizado com sucesso.");
      queryClient.invalidateQueries({ queryKey: ["produtos"] });
    },
    onError: (err: any) => {
      toast.error(
        "Erro ao atualizar produto. " +
          (err.response?.data?.message || err.message)
      );
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => produtoService.deletar(id),
    onSuccess: () => {
      toast.success("Produto excluído com sucesso.");
      queryClient.invalidateQueries({ queryKey: ["produtos"] });
    },
    onError: (err: any) => {
      toast.error(
        "Erro ao excluir produto. " +
          (err.response?.data?.message || err.message)
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
      window.confirm(`Tem certeza que deseja excluir o produto "${produto.nome}"?`)
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

  if (isLoading) {
    const skeletonCount = viewMode === 'grid' ? 6 : 8;
    const SkeletonComponent = viewMode === 'grid' ? ProdutoCardSkeleton : ProdutoListItemSkeleton;
    return (
      <div className="produtos-page">
        <PageHeader
          title="Produtos"
          subtitle="Carregando..."
          buttonText="Novo Produto"
          onButtonClick={() => {}}
          buttonDisabled={true}
        />
        <ProdutoFilterBar
            busca=""
            onBuscaChange={() => {}}
            filtroCategoria="TODOS"
            onFiltroCategoriaChange={() => {}}
            produtos={[]}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
        />
        <div className={viewMode === 'grid' ? 'produtos-grid' : 'produtos-list'}>
          {Array.from({ length: skeletonCount }).map((_, index) => (
            <SkeletonComponent key={index} />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="error">Erro ao carregar produtos. {error?.message}</div>
    );
  }

  return (
    <div className="produtos-page">
      <PageHeader
        title="Produtos"
        subtitle={`${produtos.length} produtos cadastrados`}
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
        <div className="empty-state">
          <FaSearch size={48} />
          <h3>Nenhum produto encontrado</h3>
          <p>Tente ajustar os filtros ou adicionar um novo produto.</p>
        </div>
      ) : (
        <div className={viewMode === 'grid' ? 'produtos-grid' : 'produtos-list'}>
          {produtosFiltrados.map((produto) =>
            viewMode === 'grid' ? (
              <ProdutoCard
                key={produto.id}
                produto={produto}
                onEdit={handleEditarProduto}
                onDelete={handleDeletarProduto}
              />
            ) : (
              <ProdutoListItem
                key={produto.id}
                produto={produto}
                onEdit={handleEditarProduto}
                onDelete={handleDeletarProduto}
              />
            )
          )}
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

