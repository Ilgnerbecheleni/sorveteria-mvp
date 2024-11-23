"use client";

import React, { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";

interface Produto {
  id: number;
  nome: string;
  preco: number;
  descricao?: string; // Campo opcional
  isPorKg: boolean; // Indica se o produto é vendido por Kg
}

export default function Produto() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [nome, setNome] = useState<string>("");
  const [preco, setPreco] = useState<string>("");
  const [descricao, setDescricao] = useState<string>("");
  const [isPorKg, setIsPorKg] = useState<boolean>(false); // Novo estado para isPorKg
  const router = useRouter();

  // Fetch produtos
  useEffect(() => {
    async function fetchProdutos() {
      const res = await fetch("/api/produtos");
      if (res.ok) {
        const data: Produto[] = await res.json();
        setProdutos(data);
      }
    }
    fetchProdutos();
  }, []);

  // Adicionar Produto
  const adicionarProduto = async (e: FormEvent) => {
    e.preventDefault();
    const novoProduto = { nome, preco: parseFloat(preco), descricao, isPorKg };

    const res = await fetch("/api/produtos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(novoProduto),
    });

    if (res.ok) {
      const produto: Produto = await res.json();
      setProdutos([...produtos, produto]);
      setNome("");
      setPreco("");
      setDescricao("");
      setIsPorKg(false);
    }
  };

  // Excluir Produto
  const excluirProduto = async (id: number) => {
    const res = await fetch(`/api/produtos/${id}`, { method: "DELETE" });
    if (res.ok) {
      setProdutos(produtos.filter((produto) => produto.id !== id));
    }
  };

  // Editar Produto
  const editarProduto = (id: number) => {
    router.push(`/produto/${id}`);
  };

  return (
    <div className="container mt-5">
      
      <form onSubmit={adicionarProduto} className="card p-4 shadow-sm mb-4">
        <h2 className="text-center mb-3">Cadastrar Produto</h2>
        <div className="mb-3">
          <label className="form-label">Nome</label>
          <input
            type="text"
            className="form-control"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Preço</label>
          <input
            type="number"
            step="0.01"
            className="form-control"
            value={preco}
            onChange={(e) => setPreco(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Descrição</label>
          <textarea
            className="form-control"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            rows={3}
          ></textarea>
        </div>
        <div className="mb-3 form-check">
          <input
            type="checkbox"
            className="form-check-input"
            id="isPorKg"
            checked={isPorKg}
            onChange={(e) => setIsPorKg(e.target.checked)}
          />
          <label className="form-check-label" htmlFor="isPorKg">
            Vendido por Kg
          </label>
        </div>
        <button type="submit" className="btn btn-primary w-100">
          Adicionar Produto
        </button>
      </form>

      <div className="card shadow-sm">
        <div className="card-header">
          <h2 className="text-center mb-0">Lista de Produtos</h2>
        </div>
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>#</th>
                <th>Nome</th>
                <th>Preço</th>
                <th>Descrição</th>
                <th>Vendido por Kg?</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {produtos.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center">
                    Nenhum produto cadastrado ainda.
                  </td>
                </tr>
              ) : (
                produtos.map((produto) => (
                  <tr key={produto.id}>
                    <td>{produto.id}</td>
                    <td>{produto.nome}</td>
                    <td>R$ {Number(produto.preco).toFixed(2)}</td>
                    <td>{produto.descricao || "Sem descrição"}</td>
                    <td>{produto.isPorKg ? "Sim" : "Não"}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-warning me-2"
                        onClick={() => editarProduto(produto.id)}
                      >
                        Editar
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => excluirProduto(produto.id)}
                      >
                        Excluir
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
