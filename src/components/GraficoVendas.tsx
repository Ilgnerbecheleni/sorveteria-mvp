"use client";

import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

interface Venda {
  id: number;
  criadoEm: string;
  total: number;
}

export default function GraficoVendas() {
  const [vendas, setVendas] = useState<Venda[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [periodo, setPeriodo] = useState<string>("dia"); // Período selecionado: dia, semana, ou mes

  // Consultar vendas para o período selecionado
  const fetchVendasPorPeriodo = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/vendas?periodo=${periodo}`); // Consulta com o período
      if (res.ok) {
        const data: Venda[] = await res.json();
        setVendas(data);
      }
    } catch (error) {
      console.error("Erro ao buscar vendas:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Atualizar dados ao alterar o período
  useEffect(() => {
    fetchVendasPorPeriodo();
  }, [periodo]); // Inclua "periodo" de forma estática no array de dependências

  // Transformar os dados de vendas para o formato do gráfico
  const data = vendas.map((venda) => ({
    name: new Date(venda.criadoEm).toLocaleDateString(), // Data no eixo X
    total: venda.total, // Total no eixo Y
  }));

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Relatório de Vendas</h1>

      {/* Combobox para selecionar o período */}
      <div className="mb-4">
        <label htmlFor="periodo" className="form-label">
          Selecionar Período
        </label>
        <select
          id="periodo"
          className="form-select"
          value={periodo}
          onChange={(e) => setPeriodo(e.target.value)} // Atualiza o estado
        >
          <option value="dia">Dia</option>
          <option value="semana">Semana</option>
          <option value="mes">Mês</option>
        </select>
      </div>

      {/* Gráfico */}
      <div>
        {isLoading ? (
          <p>Carregando dados...</p>
        ) : vendas.length > 0 ? (
          <BarChart
            width={600}
            height={300}
            data={data}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="total" fill="#8884d8" />
          </BarChart>
        ) : (
          <p className="text-center">Nenhuma venda encontrada para o período selecionado.</p>
        )}
      </div>
    </div>
  );
}
