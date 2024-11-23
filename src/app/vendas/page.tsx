"use client";


import React, { useState, useEffect } from "react";
import { FaArrowRight } from "react-icons/fa";

interface Produto {
  id: number;
  nome: string;
  preco: number;
  isPorKg: boolean; // Indica se o produto é vendido por Kg
}

interface ItemVenda {
  produtoId: number;
  quantidade: number;
  nome: string;
  preco: number;
}

export default function Vendas() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [itensVenda, setItensVenda] = useState<ItemVenda[]>([]);
  const [busca, setBusca] = useState<string>(""); // Para o filtro de produtos
  const [quantidades, setQuantidades] = useState<Record<number, string>>({}); // Quantidades associadas a cada produto (como string para permitir vazio)

  // Buscar produtos disponíveis
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

  // Atualizar quantidade de um produto
  const atualizarQuantidade = (produtoId: number, quantidade: string) => {
    setQuantidades({ ...quantidades, [produtoId]: quantidade });
  };

  // Adicionar produto à venda
  const adicionarProduto = (produto: Produto) => {
    let quantidade = parseFloat(quantidades[produto.id] || "0");

    // Ajustar a quantidade para produtos vendidos por Kg
    if (produto.isPorKg) {
      quantidade = quantidade / 1000; // Divide por 1000 se for por Kg
    }

    if (quantidade <= 0) {
      alert("Quantidade inválida!");
      return;
    }

    const itemExistente = itensVenda.find((item) => item.produtoId === produto.id);
    if (itemExistente) {
      setItensVenda(
        itensVenda.map((item) =>
          item.produtoId === produto.id
            ? { ...item, quantidade: item.quantidade + quantidade }
            : item
        )
      );
    } else {
      const novoItem = {
        produtoId: produto.id,
        quantidade,
        nome: produto.nome,
        preco: produto.preco,
      };
      setItensVenda([...itensVenda, novoItem]);
    }

    // Limpar o campo de quantidade após adicionar
    atualizarQuantidade(produto.id, "");
  };

  // Criar a venda
  const criarVenda = async () => {
    const vendaData = itensVenda.map((item) => ({
      produtoId: item.produtoId,
      quantidade: item.quantidade,
    }));

    const res = await fetch("/api/vendas", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ produtos: vendaData }),
    });

    if (res.ok) {
      const venda = await res.json();
      alert("Venda criada com sucesso!");
      console.log(venda);
      setItensVenda([]);
    }
  };

  // Filtrar produtos com base na busca
  const produtosFiltrados = produtos.filter((produto) =>
    produto.nome.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="container mt-5">
    
      <h1 className="text-center mb-4">Nova Venda</h1>
      <div className="row">
        {/* Tabela de Produtos */}
        <div className="col-md-6">
          <h3>Produtos Disponíveis</h3>
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Buscar produto..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
          </div>
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Preço</th>
                <th>Quantidade</th>
                <th>Ação</th>
              </tr>
            </thead>
            <tbody>
              {produtosFiltrados.map((produto) => (
                <tr key={produto.id}>
                  <td>{produto.nome}</td>
                  <td>
  R$ {Number(produto.preco).toFixed(2)}{" "}
  {produto.isPorKg && <span>(por Kg)</span>}
</td>
                  <td>
                    <input
                      type="number"
                      className="form-control"
                      style={{ width: "80px" }}
                      value={quantidades[produto.id] || ""}
                      onChange={(e) =>
                        atualizarQuantidade(produto.id, e.target.value)
                      }
                      min={0.001} // Para suportar decimais
                    />
                  </td>
                  <td>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => adicionarProduto(produto)}
                    >
                      <FaArrowRight />
                    </button>
                  </td>
                </tr>
              ))}
              {produtosFiltrados.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center">
                    Nenhum produto encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Formulário de Venda */}
        <div className="col-md-6">
          <h3>Itens da Venda</h3>
          <ul className="list-group mb-3">
            {itensVenda.map((item, index) => (
              <li
                key={index}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                <div>
                  {item.nome} - {item.quantidade.toFixed(3)}x{" "}
                  {produtos.find((p) => p.id === item.produtoId)?.isPorKg && "(Kg)"}
                </div>
                <div>R$ {(item.preco * item.quantidade).toFixed(2)}</div>
              </li>
            ))}
            {itensVenda.length === 0 && (
              <li className="list-group-item text-center">Nenhum item adicionado.</li>
            )}
          </ul>
          <button
            className="btn btn-success w-100"
            onClick={criarVenda}
            disabled={itensVenda.length === 0}
          >
            Finalizar Venda
          </button>
        </div>
      </div>
    </div>
  );
}
