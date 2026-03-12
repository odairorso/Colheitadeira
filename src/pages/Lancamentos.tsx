import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Receipt, Pencil } from "lucide-react";
import { useLancamentos, useTalhoes, useEmpresas, useProdutores } from "@/store/useAppStore";
import { CATEGORIAS_RECEITA, CATEGORIAS_DESPESA } from "@/types/agroharvest";
import type { Lancamento } from "@/types/agroharvest";
import { toast } from "sonner";

const emptyForm = {
  tipo: "despesa" as "receita" | "despesa",
  categoria: "",
  descricao: "",
  valor: "",
  data: new Date().toISOString().split("T")[0],
  talhaoId: "",
  empresaId: "",
  produtorId: "",
};

const LancamentosPage = () => {
  const { lancamentos, addLancamento, removeLancamento, updateLancamento } = useLancamentos();
  const { talhoes } = useTalhoes();
  const { empresas } = useEmpresas();
  const { produtores } = useProdutores();

  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const categorias = form.tipo === "receita" ? CATEGORIAS_RECEITA : CATEGORIAS_DESPESA;

  const openNew = () => {
    setEditingId(null);
    setForm(emptyForm);
    setOpen(true);
  };

  const openEdit = (l: Lancamento) => {
    setEditingId(l.id);
    setForm({
      tipo: l.tipo,
      categoria: l.categoria,
      descricao: l.descricao || "",
      valor: String(l.valor),
      data: l.data,
      talhaoId: l.talhaoId || "",
      empresaId: l.empresaId || "",
      produtorId: l.produtorId || "",
    });
    setOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.categoria || !form.valor) {
      toast.error("Categoria e valor são obrigatórios");
      return;
    }

    if (editingId) {
      const original = lancamentos.find((l) => l.id === editingId)!;
      updateLancamento({
        ...original,
        tipo: form.tipo,
        categoria: form.categoria,
        descricao: form.descricao,
        valor: parseFloat(form.valor),
        data: form.data,
        talhaoId: form.talhaoId || undefined,
        empresaId: form.empresaId || undefined,
        produtorId: form.produtorId || undefined,
      });
      toast.success("Lançamento atualizado!");
    } else {
      const lancamento: Lancamento = {
        id: crypto.randomUUID(),
        tipo: form.tipo,
        categoria: form.categoria,
        descricao: form.descricao,
        valor: parseFloat(form.valor),
        data: form.data,
        talhaoId: form.talhaoId || undefined,
        empresaId: form.empresaId || undefined,
        produtorId: form.produtorId || undefined,
        createdAt: new Date().toISOString(),
      };
      addLancamento(lancamento);
      toast.success("Lançamento registrado!");
    }

    setForm(emptyForm);
    setOpen(false);
    setEditingId(null);
  };

  return (
    <div>
      <PageHeader
        title="Lançamentos"
        description="Receitas e despesas da operação"
        action={
          <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) { setEditingId(null); setForm(emptyForm); } }}>
            <DialogTrigger asChild>
              <Button onClick={openNew}><Plus className="mr-2 h-4 w-4" />Novo Lançamento</Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingId ? "Editar Lançamento" : "Registrar Lançamento"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label>Tipo *</Label>
                  <Select value={form.tipo} onValueChange={(v) => setForm({ ...form, tipo: v as "receita" | "despesa", categoria: "" })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="receita">Receita</SelectItem>
                      <SelectItem value="despesa">Despesa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Categoria *</Label>
                  <Select value={form.categoria} onValueChange={(v) => setForm({ ...form, categoria: v })}>
                    <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                    <SelectContent>
                      {categorias.map((c) => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Valor (R$) *</Label>
                  <Input type="number" step="0.01" value={form.valor} onChange={(e) => setForm({ ...form, valor: e.target.value })} placeholder="0,00" />
                </div>
                <div>
                  <Label>Data</Label>
                  <Input type="date" value={form.data} onChange={(e) => setForm({ ...form, data: e.target.value })} />
                </div>
                <div>
                  <Label>Descrição</Label>
                  <Textarea value={form.descricao} onChange={(e) => setForm({ ...form, descricao: e.target.value })} />
                </div>
                {talhoes.length > 0 && (
                  <div>
                    <Label>Talhão</Label>
                    <Select value={form.talhaoId} onValueChange={(v) => setForm({ ...form, talhaoId: v })}>
                      <SelectTrigger><SelectValue placeholder="Opcional" /></SelectTrigger>
                      <SelectContent>
                        {talhoes.map((t) => (
                          <SelectItem key={t.id} value={t.id}>{t.nome}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                {empresas.length > 0 && (
                  <div>
                    <Label>Empresa</Label>
                    <Select value={form.empresaId} onValueChange={(v) => setForm({ ...form, empresaId: v })}>
                      <SelectTrigger><SelectValue placeholder="Opcional" /></SelectTrigger>
                      <SelectContent>
                        {empresas.map((emp) => (
                          <SelectItem key={emp.id} value={emp.id}>{emp.nome}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                {produtores.length > 0 && (
                  <div>
                    <Label>Produtor</Label>
                    <Select value={form.produtorId} onValueChange={(v) => setForm({ ...form, produtorId: v })}>
                      <SelectTrigger><SelectValue placeholder="Opcional" /></SelectTrigger>
                      <SelectContent>
                        {produtores.map((p) => (
                          <SelectItem key={p.id} value={p.id}>{p.nome}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                <Button type="submit" className="w-full">{editingId ? "Salvar Alterações" : "Salvar"}</Button>
              </form>
            </DialogContent>
          </Dialog>
        }
      />

      {lancamentos.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Receipt className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Nenhum lançamento registrado ainda.</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead className="text-right">Valor</TableHead>
                  <TableHead className="w-24"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[...lancamentos].reverse().map((l) => (
                  <TableRow key={l.id}>
                    <TableCell>{new Date(l.data).toLocaleDateString("pt-BR")}</TableCell>
                    <TableCell>
                      <Badge variant={l.tipo === "receita" ? "default" : "destructive"}>
                        {l.tipo === "receita" ? "Receita" : "Despesa"}
                      </Badge>
                    </TableCell>
                    <TableCell>{l.categoria}</TableCell>
                    <TableCell className="max-w-[200px] truncate">{l.descricao || "—"}</TableCell>
                    <TableCell className="text-right font-medium">
                      R$ {l.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" onClick={() => openEdit(l)}>
                          <Pencil className="h-4 w-4 text-primary" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => { removeLancamento(l.id); toast.success("Lançamento removido"); }}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default LancamentosPage;
