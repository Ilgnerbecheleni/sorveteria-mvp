import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Criar uma nova venda
export async function POST(request: Request) {
  const { produtos } = await request.json(); // produtos = [{ produtoId, quantidade }]
  
  // Calcular o total
  let total = 0;
  const itens = await Promise.all(
    produtos.map(async (item: { produtoId: number; quantidade: number }) => {
      const produto = await prisma.produto.findUnique({ where: { id: item.produtoId } });
      if (!produto) throw new Error(`Produto ID ${item.produtoId} não encontrado`);
        //@ts-ignore
      const subtotal = produto.preco * item.quantidade;
      total += subtotal;

      return {
        produtoId: item.produtoId,
        quantidade: item.quantidade,
        total: subtotal,
      };
    })
  );

  // Criar a venda
  const venda = await prisma.venda.create({
    data: {
      total,
      vendaProduto: {
        create: itens,
      },
    },
    include: {
      vendaProduto: true,
    },
  });

  return NextResponse.json(venda, { status: 201 });
}

// Listar vendas com filtro por período
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const periodo = searchParams.get("periodo"); // "dia", "semana", "mes"
  const hoje = new Date();

  let vendas;

  if (periodo === "dia") {
    // Vendas do dia atual
    vendas = await prisma.venda.findMany({
      where: {
        criadoEm: {
          gte: new Date(hoje.toISOString().split("T")[0] + "T00:00:00"), // Início do dia
        },
      },
      include: {
        vendaProduto: {
          include: { produto: true },
        },
      },
    });
  } else if (periodo === "semana") {
    // Vendas da semana atual
    const inicioSemana = new Date(
      hoje.setDate(hoje.getDate() - hoje.getDay() + 1) // Segunda-feira da semana atual
    );
    vendas = await prisma.venda.findMany({
      where: {
        criadoEm: {
          gte: inicioSemana,
        },
      },
      include: {
        vendaProduto: {
          include: { produto: true },
        },
      },
    });
  } else if (periodo === "mes") {
    // Vendas do mês atual
    const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1); // Primeiro dia do mês
    vendas = await prisma.venda.findMany({
      where: {
        criadoEm: {
          gte: inicioMes,
        },
      },
      include: {
        vendaProduto: {
          include: { produto: true },
        },
      },
    });
  } else {
    // Todas as vendas (sem filtro)
    vendas = await prisma.venda.findMany({
      include: {
        vendaProduto: {
          include: { produto: true },
        },
      },
    });
  }

  return NextResponse.json(vendas, { status: 200 });
}
