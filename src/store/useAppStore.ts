import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { Produtor, Empresa, Talhao, Lancamento, Colheita } from "@/types/agroharvest";

// ---- DB row types (snake_case retornado pela API) ----
interface ProdutorRow { id: string; nome: string; telefone: string | null; endereco: string | null; observacoes: string | null; created_at: string; }
interface EmpresaRow { id: string; nome: string; tipo: Empresa["tipo"]; telefone: string | null; endereco: string | null; cidade: string | null; estado: string | null; observacoes: string | null; created_at: string; }
interface TalhaoRow { id: string; nome: string; area_hectares: string | number; cultura: string | null; safra: string | null; observacoes: string | null; created_at: string; }
interface LancamentoRow { id: string; tipo: Lancamento["tipo"]; categoria: string; descricao: string | null; valor: string | number; data: string; talhao_id: string | null; empresa_id: string | null; produtor_id: string | null; created_at: string; }
interface ColheitaRow { id: string; talhao_id: string | null; produtor_id: string | null; data: string; quantidade: string | number; unidade: Colheita["unidade"]; umidade: string | number | null; cultura: string; valor_saca: string | number | null; hectares: string | number | null; observacoes: string | null; created_at: string; }

// ---- Generic fetch helpers ----
async function fetchJson<T>(url: string): Promise<T[]> {
  const res = await fetch(url);
  if (!res.ok) {
    const data = await res.json().catch(() => ({})) as { error?: string };
    throw new Error(data.error || "Erro ao carregar dados");
  }
  return res.json() as Promise<T[]>;
}

async function postJson(url: string, body: unknown): Promise<unknown> {
  const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  if (!res.ok) {
    const data = await res.json().catch(() => ({})) as { error?: string };
    throw new Error(data.error || "Erro ao salvar");
  }
  return res.json();
}

async function putJson(url: string, body: unknown): Promise<unknown> {
  const res = await fetch(url, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  if (!res.ok) {
    const data = await res.json().catch(() => ({})) as { error?: string };
    throw new Error(data.error || "Erro ao atualizar");
  }
  return res.json();
}

async function deleteJson(url: string, id: string): Promise<unknown> {
  const res = await fetch(url, { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
  if (!res.ok) {
    const data = await res.json().catch(() => ({})) as { error?: string };
    throw new Error(data.error || "Erro ao remover");
  }
  return res.json();
}

// ---- mappers: DB snake_case → frontend camelCase ----
function mapProdutor(r: ProdutorRow): Produtor {
  return { id: r.id, nome: r.nome, telefone: r.telefone ?? "", endereco: r.endereco ?? "", observacoes: r.observacoes ?? "", createdAt: r.created_at };
}
function mapEmpresa(r: EmpresaRow): Empresa {
  return { id: r.id, nome: r.nome, tipo: r.tipo, telefone: r.telefone ?? "", endereco: r.endereco ?? "", cidade: r.cidade ?? "", estado: r.estado ?? "", observacoes: r.observacoes ?? "", createdAt: r.created_at };
}
function mapTalhao(r: TalhaoRow): Talhao {
  return { id: r.id, nome: r.nome, area_hectares: Number(r.area_hectares) || 0, cultura: r.cultura ?? "", safra: r.safra ?? "", observacoes: r.observacoes ?? "", createdAt: r.created_at };
}
function mapLancamento(r: LancamentoRow): Lancamento {
  return { id: r.id, tipo: r.tipo, categoria: r.categoria, descricao: r.descricao ?? "", valor: Number(r.valor), data: r.data, talhaoId: r.talhao_id ?? undefined, empresaId: r.empresa_id ?? undefined, produtorId: r.produtor_id ?? undefined, createdAt: r.created_at };
}
function mapColheita(r: ColheitaRow): Colheita {
  return { id: r.id, talhaoId: r.talhao_id ?? "", produtorId: r.produtor_id ?? undefined, data: r.data, quantidade: Number(r.quantidade), unidade: r.unidade, umidade: Number(r.umidade) || 0, cultura: r.cultura, valorSaca: r.valor_saca != null ? Number(r.valor_saca) : undefined, hectares: r.hectares != null ? Number(r.hectares) : undefined, observacoes: r.observacoes ?? "", createdAt: r.created_at };
}

// ---- HOOKS ----

export function useProdutores() {
  const qc = useQueryClient();
  const { data: produtores = [], isLoading } = useQuery({ queryKey: ["produtores"], queryFn: async () => (await fetchJson<ProdutorRow>("/api/produtores")).map(mapProdutor) });

  const addProdutor = async (p: Produtor) => { await postJson("/api/produtores", p); qc.invalidateQueries({ queryKey: ["produtores"] }); };
  const removeProdutor = async (id: string) => { await deleteJson("/api/produtores", id); qc.invalidateQueries({ queryKey: ["produtores"] }); };
  const updateProdutor = async (p: Produtor) => { await putJson("/api/produtores", p); qc.invalidateQueries({ queryKey: ["produtores"] }); };

  return { produtores, isLoading, addProdutor, removeProdutor, updateProdutor };
}

export function useEmpresas() {
  const qc = useQueryClient();
  const { data: empresas = [], isLoading } = useQuery({ queryKey: ["empresas"], queryFn: async () => (await fetchJson<EmpresaRow>("/api/empresas")).map(mapEmpresa) });

  const addEmpresa = async (e: Empresa) => { await postJson("/api/empresas", e); qc.invalidateQueries({ queryKey: ["empresas"] }); };
  const removeEmpresa = async (id: string) => { await deleteJson("/api/empresas", id); qc.invalidateQueries({ queryKey: ["empresas"] }); };
  const updateEmpresa = async (e: Empresa) => { await putJson("/api/empresas", e); qc.invalidateQueries({ queryKey: ["empresas"] }); };

  return { empresas, isLoading, addEmpresa, removeEmpresa, updateEmpresa };
}

export function useTalhoes() {
  const qc = useQueryClient();
  const { data: talhoes = [], isLoading } = useQuery({ queryKey: ["talhoes"], queryFn: async () => (await fetchJson<TalhaoRow>("/api/talhoes")).map(mapTalhao) });

  const addTalhao = async (t: Talhao) => { await postJson("/api/talhoes", t); qc.invalidateQueries({ queryKey: ["talhoes"] }); };
  const removeTalhao = async (id: string) => { await deleteJson("/api/talhoes", id); qc.invalidateQueries({ queryKey: ["talhoes"] }); };
  const updateTalhao = async (t: Talhao) => { await putJson("/api/talhoes", t); qc.invalidateQueries({ queryKey: ["talhoes"] }); };

  return { talhoes, isLoading, addTalhao, removeTalhao, updateTalhao };
}

export function useLancamentos() {
  const qc = useQueryClient();
  const { data: lancamentos = [], isLoading } = useQuery({ queryKey: ["lancamentos"], queryFn: async () => (await fetchJson<LancamentoRow>("/api/lancamentos")).map(mapLancamento) });

  const addLancamento = async (l: Lancamento) => { await postJson("/api/lancamentos", l); qc.invalidateQueries({ queryKey: ["lancamentos"] }); };
  const removeLancamento = async (id: string) => { await deleteJson("/api/lancamentos", id); qc.invalidateQueries({ queryKey: ["lancamentos"] }); };
  const updateLancamento = async (l: Lancamento) => { await putJson("/api/lancamentos", l); qc.invalidateQueries({ queryKey: ["lancamentos"] }); };

  return { lancamentos, isLoading, addLancamento, removeLancamento, updateLancamento };
}

export function useColheitas() {
  const qc = useQueryClient();
  const { data: colheitas = [], isLoading } = useQuery({ queryKey: ["colheitas"], queryFn: async () => (await fetchJson<ColheitaRow>("/api/colheitas")).map(mapColheita) });

  const addColheita = async (c: Colheita) => { await postJson("/api/colheitas", c); qc.invalidateQueries({ queryKey: ["colheitas"] }); };
  const removeColheita = async (id: string) => { await deleteJson("/api/colheitas", id); qc.invalidateQueries({ queryKey: ["colheitas"] }); };
  const updateColheita = async (c: Colheita) => { await putJson("/api/colheitas", c); qc.invalidateQueries({ queryKey: ["colheitas"] }); };

  return { colheitas, isLoading, addColheita, removeColheita, updateColheita };
}
