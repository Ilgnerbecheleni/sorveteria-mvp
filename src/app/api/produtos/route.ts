import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Busca todos os produtos
    const produtos = await prisma.produto.findMany();
    return new Response(JSON.stringify(produtos), { status: 200 });
  } catch (error) {
    console.error("Erro ao buscar produtos:", error);
    return new Response(JSON.stringify({ error: "Erro ao buscar produtos" }), { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    // Extrai os dados do corpo da requisição
    const { nome, preco, descricao, isPorKg } = await request.json();

    // Validação básica
    if (!nome || !preco) {
      return new Response(
        JSON.stringify({ error: "Os campos nome e preco são obrigatórios" }),
        { status: 400 }
      );
    }

    // Cria um novo produto com o campo isPorKg
    const produto = await prisma.produto.create({
      data: {
        nome,
        preco: parseFloat(preco), // Garante que o preço seja um número decimal
        descricao: descricao || null, // Permite descrição nula
        isPorKg: isPorKg ?? false, // Define false como padrão se não for enviado
      },
    });

    return new Response(JSON.stringify(produto), { status: 201 });
  } catch (error) {
    console.error("Erro ao criar produto:", error);
    return new Response(JSON.stringify({ error: "Erro ao criar produto" }), { status: 500 });
  }
}
