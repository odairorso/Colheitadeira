import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Produtor, Empresa, Talhao, Lancamento, Colheita } from "@/types/agroharvest";

// Generic fetch helpers
async function fetchJson<T>(url: string): Promise<T[]> {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Erro ao carregar dados");
  return res.json();
}

async function postJson(url: string, body: unknown) {
  const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  if (!res.ok) throw new Error("Erro ao salvar");
  return res.json();
}

async function putJson(url: string, body: unknown) {
  const res = await fetch(url, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  if (!res.ok) throw new Error("Erro ao atualizar");
  return res.json();
}

async function deleteJson(url: string, id: string) {
  const res = await fetch(url, { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
  if (!res.ok) throw new Error("Erro ao remover");
  return res.json();
}

// ---- mappers: DB snake_case → frontend camelCase ----
function mapProdutor(r: any): Produtor {
  return { id: r.id, nome: r.nome, telefone: r.telefone || "", endereco: r.endereco || "", observacoes: r.observacoes || "", createdAt: r.created_at };
}
function mapEmpresa(r: any): Empresa {
  return { id: r.id, nome: r.nome, tipo: r.tipo, telefone: r.telefone || "", endereco: r.endereco || "", cidade: r.cidade || "", estado: r.estado || "", observacoes: r.observacoes || "", createdAt: r.created_at };
}
function mapTalhao(r: any): Talhao {
  return { id: r.id, nome: r.nome, area_hectares: Number(r.area_hectares) || 0, cultura: r.cultura || "", safra: r.safra || "", observacoes: r.observacoes || "", createdAt: r.created_at };
}
function mapLancamento(r: any): Lancamento {
  return { id: r.id, tipo: r.tipo, categoria: r.categoria, descricao: r.descricao || "", valor: Number(r.valor), data: r.data, talhaoId: r.talhao_id || undefined, empresaId: r.empresa_id || undefined, produtorId: r.produtor_id || undefined, createdAt: r.created_at };
}
function mapColheita(r: any): Colheita {
  return { id: r.id, talhaoId: r.talhao_id || "", produtorId: r.produtor_id || undefined, data: r.data, quantidade: Number(r.quantidade), unidade: r.unidade, umidade: Number(r.umidade) || 0, cultura: r.cultura, valorSaca: r.valor_saca ? Number(r.valor_saca) : undefined, observacoes: r.observacoes || "", createdAt: r.created_at };
}

// ---- HOOKS ----

export function useProdutores() {
  const qc = useQueryClient();
  const { data: produtores = [], isLoading } = useQuery({ queryKey: ["produtores"], queryFn: async () => (await fetchJson<any>("/api/produtores")).map(mapProdutor) });

  const addProdutor = async (p: Produtor) => { await postJson("/api/produtores", p); qc.invalidateQueries({ queryKey: ["produtores"] }); };
  const removeProdutor = async (id: string) => { await deleteJson("/api/produtores", id); qc.invalidateQueries({ queryKey: ["produtores"] }); };
  const updateProdutor = async (p: Produtor) => { await putJson("/api/produtores", p); qc.invalidateQueries({ queryKey: ["produtores"] }); };

  return { produtores, isLoading, addProdutor, removeProdutor, updateProdutor };
}

export function useEmpresas() {
  const qc = useQueryClient();
  const { data: empresas = [], isLoading } = useQuery({ queryKey: ["empresas"], queryFn: async () => (await fetchJson<any>("/api/empresas")).map(mapEmpresa) });

  const addEmpresa = async (e: Empresa) => { await postJson("/api/empresas", e); qc.invalidateQueries({ queryKey: ["empresas"] }); };
  const removeEmpresa = async (id: string) => { await deleteJson("/api/empresas", id); qc.invalidateQueries({ queryKey: ["empresas"] }); };
  const updateEmpresa = async (e: Empresa) => { await putJson("/api/empresas", e); qc.invalidateQueries({ queryKey: ["empresas"] }); };

  return { empresas, isLoading, addEmpresa, removeEmpresa, updateEmpresa };
}

export function useTalhoes() {
  const qc = useQueryClient();
  const { data: talhoes = [], isLoading } = useQuery({ queryKey: ["talhoes"], queryFn: async () => (await fetchJson<any>("/api/talhoes")).map(mapTalhao) });

  const addTalhao = async (t: Talhao) => { await postJson("/api/talhoes", t); qc.invalidateQueries({ queryKey: ["talhoes"] }); };
  const removeTalhao = async (id: string) => { await deleteJson("/api/talhoes", id); qc.invalidateQueries({ queryKey: ["talhoes"] }); };
  const updateTalhao = async (t: Talhao) => { await putJson("/api/talhoes", t); qc.invalidateQueries({ queryKey: ["talhoes"] }); };

  return { talhoes, isLoading, addTalhao, removeTalhao, updateTalhao };
}

export function useLancamentos() {
  const qc = useQueryClient();
  const { data: lancamentos = [], isLoading } = useQuery({ queryKey: ["lancamentos"], queryFn: async () => (await fetchJson<any>("/api/lancamentos")).map(mapLancamento) });

  const addLancamento = async (l: Lancamento) => { await postJson("/api/lancamentos", l); qc.invalidateQueries({ queryKey: ["lancamentos"] }); };
  const removeLancamento = async (id: string) => { await deleteJson("/api/lancamentos", id); qc.invalidateQueries({ queryKey: ["lancamentos"] }); };
  const updateLancamento = async (l: Lancamento) => { await putJson("/api/lancamentos", l); qc.invalidateQueries({ queryKey: ["lancamentos"] }); };

  return { lancamentos, isLoading, addLancamento, removeLancamento, updateLancamento };
}

export function useColheitas() {
  const qc = useQueryClient();
  const { data: colheitas = [], isLoading } = useQuery({ queryKey: ["colheitas"], queryFn: async () => (await fetchJson<any>("/api/colheitas")).map(mapColheita) });

  const addColheita = async (c: Colheita) => { await postJson("/api/colheitas", c); qc.invalidateQueries({ queryKey: ["colheitas"] }); };
  const removeColheita = async (id: string) => { await deleteJson("/api/colheitas", id); qc.invalidateQueries({ queryKey: ["colheitas"] }); };
  const updateColheita = async (c: Colheita) => { await putJson("/api/colheitas", c); qc.invalidateQueries({ queryKey: ["colheitas"] }); };

  return { colheitas, isLoading, addColheita, removeColheita, updateColheita };
}
