"use client";

import GraficoVendas from "@/components/GraficoVendas";
import React, { useEffect, useState } from "react";

interface Venda {
  id: number;
  criadoEm: string;
  total: number;
}

export default function RelatorioVendas() {
  const [vendas, setVendas] = useState<Venda[]>([]);
  const [totalMes, setTotalMes] = useState<number>(0);
  const [totalSemana, setTotalSemana] = useState<number>(0);
  const [totalDia, setTotalDia] = useState<number>(0);

  // Fetch vendas realizadas
  useEffect(() => {
    async function fetchVendas() {
      const res = await fetch("/api/vendas");
      if (res.ok) {
        const data: Venda[] = await res.json();
        setVendas(data);
        calcularTotais(data);
      }
    }
    fetchVendas();
  }, []);

  // Calcular os totais de vendas
  const calcularTotais = (vendas: Venda[]) => {
    const hoje = new Date();
    const inicioSemana = new Date(
      hoje.setDate(hoje.getDate() - hoje.getDay() + 1) // Início da semana (segunda-feira)
    );
    const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1); // Início do mês

    let totalMes = 0;
    let totalSemana = 0;
    let totalDia = 0;

    vendas.forEach((venda) => {
      const dataVenda = new Date(venda.criadoEm);

      if (dataVenda >= inicioMes) {
        totalMes += venda.total;
      }
      if (dataVenda >= inicioSemana) {
        totalSemana += venda.total;
      }
      if (dataVenda.toDateString() === new Date().toDateString()) {
        totalDia += venda.total;
      }
    });

    setTotalMes(totalMes);
    setTotalSemana(totalSemana);
    setTotalDia(totalDia);
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Relatório de Vendas</h1>
      <div className="row">
        {/* Total do Mês */}
        <div className="col-md-4">
          <div className="card text-white bg-primary mb-3">
            <div className="card-header">Total do Mês</div>
            <div className="card-body">
              <h5 className="card-title">R$ {totalMes.toFixed(2)}</h5>
              <p className="card-text">Vendas realizadas no mês atual.</p>
            </div>
          </div>
        </div>

        {/* Total da Semana */}
        <div className="col-md-4">
          <div className="card text-white bg-success mb-3">
            <div className="card-header">Total da Semana</div>
            <div className="card-body">
              <h5 className="card-title">R$ {totalSemana.toFixed(2)}</h5>
              <p className="card-text">Vendas realizadas na semana atual.</p>
            </div>
          </div>
        </div>

        {/* Total do Dia */}
        <div className="col-md-4">
          <div className="card text-white bg-info mb-3">
            <div className="card-header">Total do Dia</div>
            <div className="card-body">
              <h5 className="card-title">R$ {totalDia.toFixed(2)}</h5>
              <p className="card-text">Vendas realizadas hoje.</p>
            </div>
          </div>
        </div>
      </div>
      <GraficoVendas/>
    </div>
  );
}
