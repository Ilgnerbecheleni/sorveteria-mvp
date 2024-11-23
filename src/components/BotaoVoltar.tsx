"use client";

import { useRouter, usePathname } from "next/navigation";
import { FaArrowCircleLeft } from "react-icons/fa";

export default function BotaoVoltar() {
  const router = useRouter(); // Hook para navegação
  const pathname = usePathname(); // Obter a rota atual

  if (pathname === "/") return null; // Não exibir o botão na Home

  return (
    <div
      style={{
        position: "fixed",
        top: "10px",
        left: "10px",
        zIndex: 1000,
      }}
    >
      <button
        onClick={() => router.back()} // Voltar à página anterior no histórico
        className="btn btn-secondary d-flex align-items-center gap-2"
      >
        <FaArrowCircleLeft />
        Voltar
      </button>
    </div>
  );
}
