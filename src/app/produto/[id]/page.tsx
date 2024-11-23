"use client";

import React, { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { use } from "react";

export default function EditarProduto({ params: promiseParams }: { params: Promise<{ id: string }> }) {
  const params = use(promiseParams); // Desembrulha a Promise de params
  const [nome, setNome] = useState<string>("");
  const [preco, setPreco] = useState<string>("");
  const [descricao, setDescricao] = useState<string>("");
  const [isPorKg, setIsPorKg] = useState<boolean>(false); // Novo estado para isPorKg
  const router = useRouter();

  // Carregar os dados do produto para edição
  useEffect(() => {
    async function fetchProduto() {
      const res = await fetch(`/api/produtos/${params.id}`);
      if (res.ok) {
        const produto = await res.json();
        setNome(produto.nome);
        setPreco(produto.preco.toString());
        setDescricao(produto.descricao || "");
        setIsPorKg(produto.isPorKg); // Define o estado inicial de isPorKg
      }
    }
    fetchProduto();
  }, [params.id]);

  // Atualizar o produto
  const atualizarProduto = async (e: FormEvent) => {
    e.preventDefault();
    const res = await fetch(`/api/produtos/${params.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ nome, preco: parseFloat(preco), descricao, isPorKg }),
    });

    if (res.ok) {
      router.push("/produto"); // Voltar para a lista de produtos
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center">Editar Produto</h1>
      <form onSubmit={atualizarProduto} className="card p-4 shadow-sm">
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
        <button type="submit" className="btn btn-success w-100">
          Atualizar Produto
        </button>
      </form>
    </div>
  );
}
