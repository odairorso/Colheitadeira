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
import { Plus, Trash2, Wheat, Pencil, DollarSign } from "lucide-react";
import { useColheitas, useTalhoes, useProdutores, useLancamentos } from "@/store/useAppStore";
import { UNIDADES_COLHEITA } from "@/types/agroharvest";
import type { Colheita } from "@/types/agroharvest";
import { toast } from "sonner";

const emptyForm = {
  talhaoId: "",
  produtorId: "",
  data: new Date().toISOString().split("T")[0],
  quantidade: "",
  unidade: "sacas" as Colheita["unidade"],
  umidade: "",
  cultura: "",
  valorSaca: "",
  observacoes: "",
};

const ColheitasPage = () => {
  const { colheitas, addColheita, removeColheita, updateColheita } = useColheitas();
  const { talhoes } = useTalhoes();
  const { produtores } = useProdutores();
  const { addLancamento } = useLancamentos();

  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const openNew = () => {
    setEditingId(null);
    setForm(emptyForm);
    setOpen(true);
  };

  const openEdit = (c: Colheita) => {
    setEditingId(c.id);
    setForm({
      talhaoId: c.talhaoId || "",
      produtorId: c.produtorId || "",
      data: c.data,
      quantidade: String(c.quantidade),
      unidade: c.unidade,
      umidade: c.umidade ? String(c.umidade) : "",
      cultura: c.cultura,
      valorSaca: c.valorSaca ? String(c.valorSaca) : "",
      observacoes: c.observacoes || "",
    });
    setOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.quantidade || !form.cultura) {
      toast.error("Quantidade e cultura são obrigatórios");
      return;
    }

    if (editingId) {
      const original = colheitas.find((c) => c.id === editingId)!;
      updateColheita({
        ...original,
        talhaoId: form.talhaoId,
        produtorId: form.produtorId || undefined,
        data: form.data,
        quantidade: parseFloat(form.quantidade),
        unidade: form.unidade,
        umidade: form.umidade ? parseFloat(form.umidade) : 0,
        cultura: form.cultura,
        valorSaca: form.valorSaca ? parseFloat(form.valorSaca) : undefined,
        observacoes: form.observacoes,
      });
      toast.success("Colheita atualizada!");
    } else {
      addColheita({
        id: crypto.randomUUID(),
        talhaoId: form.talhaoId,
        produtorId: form.produtorId || undefined,
        data: form.data,
        quantidade: parseFloat(form.quantidade),
        unidade: form.unidade,
        umidade: form.umidade ? parseFloat(form.umidade) : 0,
        cultura: form.cultura,
        valorSaca: form.valorSaca ? parseFloat(form.valorSaca) : undefined,
        observacoes: form.observacoes,
        createdAt: new Date().toISOString(),
      });
      toast.success("Colheita registrada!");
    }

    setForm(emptyForm);
    setOpen(false);
    setEditingId(null);
  };

  const talhaoNome = (id: string) => talhoes.find((t) => t.id === id)?.nome || "—";
  const produtorNome = (id?: string) => (id ? produtores.find((p) => p.id === id)?.nome : null) || "—";
  const unidadeLabel = (u: string) => UNIDADES_COLHEITA.find((x) => x.value === u)?.label || u;

  return (
    <div>
      <PageHeader
        title="Colheitas"
        description="Registro de colheitas por talhão e produtor"
        action={
          <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) { setEditingId(null); setForm(emptyForm); } }}>
            <DialogTrigger asChild>
              <Button onClick={openNew}><Plus className="mr-2 h-4 w-4" />Nova Colheita</Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingId ? "Editar Colheita" : "Registrar Colheita"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label>Cultura *</Label>
                  <Input value={form.cultura} onChange={(e) => setForm({ ...form, cultura: e.target.value })} placeholder="Ex: Soja, Milho, Café" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Quantidade *</Label>
                    <Input type="number" step="0.01" value={form.quantidade} onChange={(e) => setForm({ ...form, quantidade: e.target.value })} />
                  </div>
                  <div>
                    <Label>Unidade</Label>
                    <Select value={form.unidade} onValueChange={(v) => setForm({ ...form, unidade: v as Colheita["unidade"] })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {UNIDADES_COLHEITA.map((u) => (
                          <SelectItem key={u.value} value={u.value}>{u.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Umidade (%)</Label>
                    <Input type="number" step="0.1" value={form.umidade} onChange={(e) => setForm({ ...form, umidade: e.target.value })} placeholder="Ex: 14.5" />
                  </div>
                  <div>
                    <Label>Valor da Saca (R$)</Label>
                    <Input type="number" step="0.01" value={form.valorSaca} onChange={(e) => setForm({ ...form, valorSaca: e.target.value })} placeholder="Ex: 125.00" />
                  </div>
                </div>
                <div>
                  <Label>Data</Label>
                  <Input type="date" value={form.data} onChange={(e) => setForm({ ...form, data: e.target.value })} />
                </div>
                {talhoes.length > 0 && (
                  <div>
                    <Label>Talhão</Label>
                    <Select value={form.talhaoId} onValueChange={(v) => setForm({ ...form, talhaoId: v })}>
                      <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                      <SelectContent>
                        {talhoes.map((t) => (
                          <SelectItem key={t.id} value={t.id}>{t.nome}</SelectItem>
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
                <div>
                  <Label>Observações</Label>
                  <Textarea value={form.observacoes} onChange={(e) => setForm({ ...form, observacoes: e.target.value })} />
                </div>
                <Button type="submit" className="w-full">{editingId ? "Salvar Alterações" : "Salvar"}</Button>
              </form>
            </DialogContent>
          </Dialog>
        }
      />

      {colheitas.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Wheat className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Nenhuma colheita registrada ainda.</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Cultura</TableHead>
                  <TableHead>Quantidade</TableHead>
                  <TableHead>Valor Saca</TableHead>
                  <TableHead>Total (R$)</TableHead>
                  <TableHead>Umidade</TableHead>
                  <TableHead>Talhão</TableHead>
                  <TableHead>Produtor</TableHead>
                  <TableHead className="w-24"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[...colheitas].reverse().map((c) => (
                  <TableRow key={c.id}>
                    <TableCell>{new Date(c.data).toLocaleDateString("pt-BR")}</TableCell>
                    <TableCell className="font-medium">{c.cultura}</TableCell>
                    <TableCell>{c.quantidade.toLocaleString("pt-BR")} {unidadeLabel(c.unidade)}</TableCell>
                    <TableCell>{c.valorSaca ? `R$ ${c.valorSaca.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}` : "—"}</TableCell>
                    <TableCell className="font-semibold text-success">
                      {c.valorSaca ? `R$ ${(c.quantidade * c.valorSaca).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}` : "—"}
                    </TableCell>
                    <TableCell>{c.umidade ? `${c.umidade}%` : "—"}</TableCell>
                    <TableCell>{talhaoNome(c.talhaoId)}</TableCell>
                    <TableCell>{produtorNome(c.produtorId)}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {c.valorSaca && (
                          <Button
                            variant="ghost"
                            size="icon"
                            title="Gerar Receita"
                            onClick={async () => {
                              const total = c.quantidade * c.valorSaca!;
                              await addLancamento({
                                id: crypto.randomUUID(),
                                tipo: "receita",
                                categoria: "Venda de grãos",
                                descricao: `${c.cultura} - ${c.quantidade} ${unidadeLabel(c.unidade)} x R$ ${c.valorSaca!.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
                                valor: total,
                                data: c.data,
                                talhaoId: c.talhaoId || undefined,
                                produtorId: c.produtorId || undefined,
                                createdAt: new Date().toISOString(),
                              });
                              toast.success(`Receita de R$ ${total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })} gerada!`);
                            }}
                          >
                            <DollarSign className="h-4 w-4 text-green-600" />
                          </Button>
                        )}
                        <Button variant="ghost" size="icon" onClick={() => openEdit(c)}>
                          <Pencil className="h-4 w-4 text-primary" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => { removeColheita(c.id); toast.success("Colheita removida"); }}>
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

export default ColheitasPage;
