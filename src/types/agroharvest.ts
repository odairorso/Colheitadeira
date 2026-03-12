export interface Produtor {
  id: string;
  nome: string;
  telefone: string;
  endereco: string;
  observacoes: string;
  createdAt: string;
}

export interface Empresa {
  id: string;
  nome: string;
  tipo: "pecas" | "insumos" | "servicos" | "outros";
  telefone: string;
  endereco: string;
  cidade?: string;
  estado?: string;
  observacoes: string;
  createdAt: string;
}

export interface Talhao {
  id: string;
  nome: string;
  area_hectares: number;
  cultura: string;
  safra: string;
  observacoes: string;
  createdAt: string;
}

export interface Lancamento {
  id: string;
  tipo: "receita" | "despesa";
  categoria: string;
  descricao: string;
  valor: number;
  data: string;
  talhaoId?: string;
  empresaId?: string;
  produtorId?: string;
  createdAt: string;
}

export interface Colheita {
  id: string;
  talhaoId: string;
  produtorId?: string;
  data: string;
  quantidade: number;
  unidade: "sacas" | "toneladas" | "kg" | "arrobas" | "hectares";
  umidade: number;
  cultura: string;
  valorSaca?: number;
  hectares?: number;
  observacoes: string;
  createdAt: string;
}

export const CATEGORIAS_RECEITA = [
  "Venda de grãos",
  "Venda de animais",
  "Prestação de serviço",
  "Outros",
];

export const CATEGORIAS_DESPESA = [
  "Combustível",
  "Peças e manutenção",
  "Insumos",
  "Sementes",
  "Defensivos",
  "Fertilizantes",
  "Mão de obra",
  "Frete",
  "Outros",
];

export const TIPOS_EMPRESA = [
  { value: "pecas", label: "Peças" },
  { value: "insumos", label: "Insumos" },
  { value: "servicos", label: "Serviços" },
  { value: "outros", label: "Outros" },
];

export const UNIDADES_COLHEITA = [
  { value: "sacas", label: "Sacas (60kg)" },
  { value: "toneladas", label: "Toneladas" },
  { value: "kg", label: "Quilogramas" },
  { value: "arrobas", label: "Arrobas" },
  { value: "hectares", label: "Hectares (ha)" },
];
