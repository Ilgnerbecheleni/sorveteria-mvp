import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    const venda = await prisma.venda.findUnique({
      where: { id: Number(id) },
      include: {
        vendaProduto: {
          include: {
            produto: true,
          },
        },
      },
    });

    if (!venda) {
      return NextResponse.json({ error: "Venda não encontrada" }, { status: 404 });
    }

    // Recalcular os totais de cada item para garantir precisão
  
    const vendaComTotais = {
      ...venda,
      vendaProduto: venda.vendaProduto.map((item) => ({
        ...item,
          //@ts-ignore
        total: parseFloat((item.quantidade * item.produto.preco).toFixed(2)), // Garantir precisão
      })),
    };

    return NextResponse.json(vendaComTotais, { status: 200 });
  } catch (error) {
    console.error("Erro ao buscar venda:", error);
    return NextResponse.json({ error: "Erro ao buscar venda" }, { status: 500 });
  }
}
