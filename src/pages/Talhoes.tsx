import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Trash2, Map } from "lucide-react";
import { useTalhoes } from "@/store/useAppStore";
import type { Talhao } from "@/types/agroharvest";
import { toast } from "sonner";

const TalhoesPage = () => {
  const { talhoes, addTalhao, removeTalhao } = useTalhoes();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ nome: "", area_hectares: "", cultura: "", safra: "", observacoes: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nome.trim()) { toast.error("Nome é obrigatório"); return; }
    addTalhao({
      id: crypto.randomUUID(),
      nome: form.nome,
      area_hectares: form.area_hectares ? parseFloat(form.area_hectares) : 0,
      cultura: form.cultura,
      safra: form.safra,
      observacoes: form.observacoes,
      createdAt: new Date().toISOString(),
    });
    setForm({ nome: "", area_hectares: "", cultura: "", safra: "", observacoes: "" });
    setOpen(false);
    toast.success("Talhão cadastrado!");
  };

  return (
    <div>
      <PageHeader
        title="Talhões"
        description="Áreas de cultivo da propriedade"
        action={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button><Plus className="mr-2 h-4 w-4" />Novo Talhão</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Cadastrar Talhão</DialogTitle></DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label>Nome *</Label>
                  <Input value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} placeholder="Ex: Talhão 1, Área Norte" />
                </div>
                <div>
                  <Label>Área (hectares)</Label>
                  <Input type="number" step="0.01" value={form.area_hectares} onChange={(e) => setForm({ ...form, area_hectares: e.target.value })} />
                </div>
                <div>
                  <Label>Cultura</Label>
                  <Input value={form.cultura} onChange={(e) => setForm({ ...form, cultura: e.target.value })} placeholder="Ex: Soja, Milho" />
                </div>
                <div>
                  <Label>Safra</Label>
                  <Input value={form.safra} onChange={(e) => setForm({ ...form, safra: e.target.value })} placeholder="Ex: 2025/2026" />
                </div>
                <div>
                  <Label>Observações</Label>
                  <Textarea value={form.observacoes} onChange={(e) => setForm({ ...form, observacoes: e.target.value })} />
                </div>
                <Button type="submit" className="w-full">Salvar</Button>
              </form>
            </DialogContent>
          </Dialog>
        }
      />

      {talhoes.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Map className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Nenhum talhão cadastrado ainda.</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Área (ha)</TableHead>
                  <TableHead>Cultura</TableHead>
                  <TableHead>Safra</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {talhoes.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell className="font-medium">{t.nome}</TableCell>
                    <TableCell>{t.area_hectares ? t.area_hectares.toLocaleString("pt-BR") : "—"}</TableCell>
                    <TableCell>{t.cultura || "—"}</TableCell>
                    <TableCell>{t.safra || "—"}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" onClick={() => { removeTalhao(t.id); toast.success("Talhão removido"); }}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
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

export default TalhoesPage;
