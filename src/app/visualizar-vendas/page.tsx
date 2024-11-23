"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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

export default function VisualizarVendas() {
  const [vendas, setVendas] = useState<Venda[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [dataFiltro, setDataFiltro] = useState<string>(""); // Filtro de data
  const router = useRouter();

  // Buscar vendas realizadas
  useEffect(() => {
    async function fetchVendas() {
      setIsLoading(true);
      try {
        const res = await fetch("/api/vendas");
        if (res.ok) {
          const data: Venda[] = await res.json();
          setVendas(data);
        }
      } catch (error) {
        console.error("Erro ao buscar vendas:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchVendas();
  }, []);

  // Filtrar vendas por data
  const vendasFiltradas = dataFiltro
    ? vendas.filter((venda) =>
        new Date(venda.criadoEm).toLocaleDateString("en-CA") === dataFiltro
      )
    : vendas;

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Visualizar Vendas</h1>

      {/* Filtro por Data */}
      <div className="mb-4">
        <label htmlFor="dataFiltro" className="form-label">
          Filtrar por Data
        </label>
        <input
          type="date"
          id="dataFiltro"
          className="form-control"
          value={dataFiltro}
          onChange={(e) => setDataFiltro(e.target.value)}
        />
      </div>

      {isLoading ? (
        <p>Carregando vendas...</p>
      ) : vendasFiltradas.length === 0 ? (
        <p className="text-center">Nenhuma venda registrada para o período.</p>
      ) : (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>#</th>
              <th>Data</th>
              <th>Total</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {vendasFiltradas.map((venda) => (
              <tr key={venda.id}>
                <td>{venda.id}</td>
                <td>{new Date(venda.criadoEm).toLocaleDateString()}</td>
                <td>R$ {venda.total.toFixed(2)}</td>
                <td>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => router.push(`/visualizar-vendas/${venda.id}`)}
                  >
                    Detalhar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
