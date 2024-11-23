'use client'
"use client";

import { useEffect } from "react";

export default function InstallBootstrap() {
  useEffect(() => {
    // Carrega o JavaScript do Bootstrap apenas no cliente
    //@ts-ignore
    import("bootstrap/dist/js/bootstrap.bundle.min.js")
      .then(() => {
        console.log("Bootstrap JS carregado com sucesso.");
      })
      .catch((err) => {
        console.error("Erro ao carregar o Bootstrap JS:", err);
      });
  }, []);

  return null; // Este componente não renderiza nada visual
}
