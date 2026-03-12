import { useState, useCallback } from "react";
import type { Produtor, Empresa, Talhao, Lancamento, Colheita } from "@/types/agroharvest";

// Simple hook-based store using localStorage
function loadFromStorage<T>(key: string, fallback: T[]): T[] {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch {
    return fallback;
  }
}

function saveToStorage<T>(key: string, data: T[]) {
  localStorage.setItem(key, JSON.stringify(data));
}

export function useProdutores() {
  const [produtores, setProdutores] = useState<Produtor[]>(() =>
    loadFromStorage<Produtor>("agroharvest_produtores", [])
  );

  const addProdutor = useCallback((p: Produtor) => {
    setProdutores((prev) => {
      const next = [...prev, p];
      saveToStorage("agroharvest_produtores", next);
      return next;
    });
  }, []);

  const removeProdutor = useCallback((id: string) => {
    setProdutores((prev) => {
      const next = prev.filter((p) => p.id !== id);
      saveToStorage("agroharvest_produtores", next);
      return next;
    });
  }, []);

  return { produtores, addProdutor, removeProdutor };
}

export function useEmpresas() {
  const [empresas, setEmpresas] = useState<Empresa[]>(() =>
    loadFromStorage<Empresa>("agroharvest_empresas", [])
  );

  const addEmpresa = useCallback((e: Empresa) => {
    setEmpresas((prev) => {
      const next = [...prev, e];
      saveToStorage("agroharvest_empresas", next);
      return next;
    });
  }, []);

  const removeEmpresa = useCallback((id: string) => {
    setEmpresas((prev) => {
      const next = prev.filter((e) => e.id !== id);
      saveToStorage("agroharvest_empresas", next);
      return next;
    });
  }, []);

  const updateEmpresa = useCallback((updated: Empresa) => {
    setEmpresas((prev) => {
      const next = prev.map((e) => (e.id === updated.id ? updated : e));
      saveToStorage("agroharvest_empresas", next);
      return next;
    });
  }, []);

  return { empresas, addEmpresa, removeEmpresa, updateEmpresa };
}

export function useTalhoes() {
  const [talhoes, setTalhoes] = useState<Talhao[]>(() =>
    loadFromStorage<Talhao>("agroharvest_talhoes", [])
  );

  const addTalhao = useCallback((t: Talhao) => {
    setTalhoes((prev) => {
      const next = [...prev, t];
      saveToStorage("agroharvest_talhoes", next);
      return next;
    });
  }, []);

  const removeTalhao = useCallback((id: string) => {
    setTalhoes((prev) => {
      const next = prev.filter((t) => t.id !== id);
      saveToStorage("agroharvest_talhoes", next);
      return next;
    });
  }, []);

  return { talhoes, addTalhao, removeTalhao };
}

export function useLancamentos() {
  const [lancamentos, setLancamentos] = useState<Lancamento[]>(() =>
    loadFromStorage<Lancamento>("agroharvest_lancamentos", [])
  );

  const addLancamento = useCallback((l: Lancamento) => {
    setLancamentos((prev) => {
      const next = [...prev, l];
      saveToStorage("agroharvest_lancamentos", next);
      return next;
    });
  }, []);

  const removeLancamento = useCallback((id: string) => {
    setLancamentos((prev) => {
      const next = prev.filter((l) => l.id !== id);
      saveToStorage("agroharvest_lancamentos", next);
      return next;
    });
  }, []);

  const updateLancamento = useCallback((updated: Lancamento) => {
    setLancamentos((prev) => {
      const next = prev.map((l) => (l.id === updated.id ? updated : l));
      saveToStorage("agroharvest_lancamentos", next);
      return next;
    });
  }, []);

  return { lancamentos, addLancamento, removeLancamento, updateLancamento };
}

export function useColheitas() {
  const [colheitas, setColheitas] = useState<Colheita[]>(() =>
    loadFromStorage<Colheita>("agroharvest_colheitas", [])
  );

  const addColheita = useCallback((c: Colheita) => {
    setColheitas((prev) => {
      const next = [...prev, c];
      saveToStorage("agroharvest_colheitas", next);
      return next;
    });
  }, []);

  const removeColheita = useCallback((id: string) => {
    setColheitas((prev) => {
      const next = prev.filter((c) => c.id !== id);
      saveToStorage("agroharvest_colheitas", next);
      return next;
    });
  }, []);

  const updateColheita = useCallback((updated: Colheita) => {
    setColheitas((prev) => {
      const next = prev.map((c) => (c.id === updated.id ? updated : c));
      saveToStorage("agroharvest_colheitas", next);
      return next;
    });
  }, []);

  return { colheitas, addColheita, removeColheita, updateColheita };
}
