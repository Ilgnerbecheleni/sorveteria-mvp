import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET: Retorna um produto específico pelo ID
export async function GET(
  request: Request,
  { params: promiseParams }: { params: Promise<{ id: string }> }
) {
  const params = await promiseParams; // Desembrulha params
  const produto = await prisma.produto.findUnique({
    where: { id: parseInt(params.id) },
  });

  if (!produto) {
    return NextResponse.json({ error: "Produto não encontrado" }, { status: 404 });
  }

  return NextResponse.json(produto, { status: 200 });
}

// PUT: Atualiza os dados de um produto específico pelo ID
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const { nome, preco, descricao, isPorKg } = await request.json();

  try {
    const produtoAtualizado = await prisma.produto.update({
      where: { id: parseInt(params.id) },
      data: {
        nome,
        preco: parseFloat(preco),
        descricao,
        isPorKg, // Atualiza o campo isPorKg
      },
    });

    return new Response(JSON.stringify(produtoAtualizado), { status: 200 });
  } catch (error) {
    console.error("Erro ao atualizar o produto:", error);
    return new Response(JSON.stringify({ error: "Erro ao atualizar o produto" }), { status: 500 });
  }
}

// DELETE: Remove um produto específico pelo ID
export async function DELETE(
  request: Request,
  { params: promiseParams }: { params: Promise<{ id: string }> }
) {
  const params = await promiseParams; // Desembrulha params

  try {
    await prisma.produto.delete({
      where: { id: parseInt(params.id) },
    });
    return NextResponse.json({ message: "Produto excluído com sucesso" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Erro ao excluir produto" }, { status: 400 });
  }
}
