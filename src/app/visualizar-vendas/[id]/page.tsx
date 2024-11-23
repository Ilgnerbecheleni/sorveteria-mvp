"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";

interface Produto {
  id: number;
  nome: string;
  preco: number;
}

interface VendaProduto {
  id: number;
  produto: Produto;
  quantidade: number;
  total: number;
}

interface Venda {
  id: number;
  criadoEm: string;
  total: number;
  vendaProduto: VendaProduto[];
}

export default function DetalharVenda() {
  const [venda, setVenda] = useState<Venda | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { id } = useParams();

  useEffect(() => {
    async function fetchVenda() {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/vendas/${id}`);
        if (res.ok) {
          const data: Venda = await res.json();
          setVenda(data);
        }
      } catch (error) {
        console.error("Erro ao buscar venda:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchVenda();
  }, [id]);

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Detalhes da Venda</h1>
      {isLoading ? (
        <p>Carregando...</p>
      ) : !venda ? (
        <p>Venda não encontrada.</p>
      ) : (
        <div>
          <h2>
            Venda #{venda.id} - Total: R$ {venda.total.toFixed(2)}
          </h2>
          <p>Data: {new Date(venda.criadoEm).toLocaleDateString()}</p>

          <h3>Produtos:</h3>
          <ul className="list-group">
            {venda.vendaProduto.map((item) => (
              <li
                key={item.id}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                <div>
                  <strong>{item.produto.nome}</strong> - {item.quantidade}x
                </div>
                <span>
                  R$ {item.total.toFixed(2)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
