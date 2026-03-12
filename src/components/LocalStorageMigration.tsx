import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Upload, CheckCircle2, Loader2 } from "lucide-react";

const KEYS = [
  { key: "agroharvest_produtores", endpoint: "/api/produtores", label: "Produtores" },
  { key: "agroharvest_empresas", endpoint: "/api/empresas", label: "Empresas" },
  { key: "agroharvest_talhoes", endpoint: "/api/talhoes", label: "Talhões" },
  { key: "agroharvest_lancamentos", endpoint: "/api/lancamentos", label: "Lançamentos" },
  { key: "agroharvest_colheitas", endpoint: "/api/colheitas", label: "Colheitas" },
];

function hasLocalData(): boolean {
  return KEYS.some((k) => {
    try {
      const data = localStorage.getItem(k.key);
      if (!data) return false;
      const arr = JSON.parse(data);
      return Array.isArray(arr) && arr.length > 0;
    } catch { return false; }
  });
}

function getLocalCounts(): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const k of KEYS) {
    try {
      const data = localStorage.getItem(k.key);
      counts[k.label] = data ? JSON.parse(data).length : 0;
    } catch { counts[k.label] = 0; }
  }
  return counts;
}

export function LocalStorageMigration({ onDone }: { onDone: () => void }) {
  const [migrating, setMigrating] = useState(false);
  const [done, setDone] = useState(false);

  if (!hasLocalData()) return null;

  const counts = getLocalCounts();

  const migrate = async () => {
    setMigrating(true);
    let total = 0;
    try {
      for (const k of KEYS) {
        const raw = localStorage.getItem(k.key);
        if (!raw) continue;
        const items = JSON.parse(raw);
        if (!Array.isArray(items)) continue;
        for (const item of items) {
          try {
            await fetch(k.endpoint, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(item),
            });
            total++;
          } catch (err) {
            console.warn(`Erro ao migrar item de ${k.label}:`, err);
          }
        }
        // Limpar localStorage após migrar com sucesso
        localStorage.removeItem(k.key);
      }
      toast.success(`${total} registros migrados com sucesso!`);
      setDone(true);
      onDone();
    } catch (err) {
      toast.error("Erro na migração. Tente novamente.");
    } finally {
      setMigrating(false);
    }
  };

  if (done) {
    return (
      <Card className="mb-6 border-green-500/30 bg-green-50/50">
        <CardContent className="py-6 text-center">
          <CheckCircle2 className="mx-auto h-10 w-10 text-green-600 mb-3" />
          <p className="font-semibold text-green-700">Migração concluída! Seus dados estão no banco.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-6 border-amber-500/30 bg-amber-50/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg text-amber-700 flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Dados locais encontrados
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground">
          Encontramos dados salvos neste navegador que ainda não foram enviados para o banco. 
          Deseja migrar agora?
        </p>
        <div className="flex flex-wrap gap-2 text-sm">
          {Object.entries(counts).filter(([, c]) => c > 0).map(([label, count]) => (
            <span key={label} className="px-2 py-1 bg-amber-100 rounded text-amber-800 font-medium">
              {label}: {count}
            </span>
          ))}
        </div>
        <Button onClick={migrate} disabled={migrating} className="w-full">
          {migrating ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Migrando...</> : "Migrar dados para o banco"}
        </Button>
      </CardContent>
    </Card>
  );
}
