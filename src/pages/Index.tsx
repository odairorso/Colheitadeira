import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLancamentos } from "@/store/useAppStore";
import { useColheitas } from "@/store/useAppStore";
import { useTalhoes } from "@/store/useAppStore";
import { useProdutores } from "@/store/useAppStore";
import { useEmpresas } from "@/store/useAppStore";
import { DollarSign, TrendingUp, TrendingDown, Wheat, Users, Building2, Map } from "lucide-react";

const Dashboard = () => {
  const { lancamentos } = useLancamentos();
  const { colheitas } = useColheitas();
  const { talhoes } = useTalhoes();
  const { produtores } = useProdutores();
  const { empresas } = useEmpresas();

  const totalReceitas = lancamentos
    .filter((l) => l.tipo === "receita")
    .reduce((acc, l) => acc + l.valor, 0);

  const totalDespesas = lancamentos
    .filter((l) => l.tipo === "despesa")
    .reduce((acc, l) => acc + l.valor, 0);

  const saldo = totalReceitas - totalDespesas;

  const totalColheitaSacas = colheitas.reduce((acc, c) => {
    if (c.unidade === "sacas") return acc + c.quantidade;
    if (c.unidade === "kg") return acc + c.quantidade / 60;
    if (c.unidade === "toneladas") return acc + (c.quantidade * 1000) / 60;
    if (c.unidade === "arrobas") return acc + (c.quantidade * 15) / 60;
    return acc;
  }, 0);

  const stats = [
    {
      title: "Receitas",
      value: `R$ ${totalReceitas.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
      icon: TrendingUp,
      color: "text-success",
    },
    {
      title: "Despesas",
      value: `R$ ${totalDespesas.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
      icon: TrendingDown,
      color: "text-destructive",
    },
    {
      title: "Saldo",
      value: `R$ ${saldo.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
      icon: DollarSign,
      color: saldo >= 0 ? "text-success" : "text-destructive",
    },
    {
      title: "Colheita Total",
      value: `${totalColheitaSacas.toLocaleString("pt-BR", { maximumFractionDigits: 1 })} sacas`,
      icon: Wheat,
      color: "text-primary",
    },
  ];

  const counters = [
    { title: "Produtores", count: produtores.length, icon: Users },
    { title: "Empresas", count: empresas.length, icon: Building2 },
    { title: "Talhões", count: talhoes.length, icon: Map },
  ];

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Visão geral da sua operação agrícola"
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        {stats.map((stat) => (
          <Card key={stat.title} className="premium-card relative overflow-hidden group">
            <div className={`absolute top-0 right-0 w-24 h-24 -mt-8 -mr-8 rounded-full opacity-10 blur-2xl group-hover:opacity-20 transition-opacity bg-current ${stat.color}`}></div>
            <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg bg-background/50 backdrop-blur-sm shadow-sm border border-border/50`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-xl md:text-2xl font-bold tracking-tight">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {counters.map((c) => (
          <Card key={c.title} className="premium-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {c.title}
              </CardTitle>
              <div className="p-2 bg-secondary/50 rounded-lg">
                <c.icon className="h-5 w-5 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-muted-foreground">{c.count}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {lancamentos.length === 0 && colheitas.length === 0 && (
        <Card className="mt-8 border-dashed border-2 glass-panel premium-card">
          <CardContent className="py-16 text-center">
            <div className="w-20 h-20 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-6 shadow-inner">
              <Wheat className="h-10 w-10 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3 gradient-text">Bem-vindo ao AgroHarvest Premium!</h3>
            <p className="text-muted-foreground max-w-md mx-auto text-lg leading-relaxed">
              Comece cadastrando seus produtores, empresas e talhões. Depois registre seus lançamentos e colheitas para ter controle total da sua operação.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;
