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
import { Plus, Trash2, Building2, Pencil } from "lucide-react";
import { useEmpresas } from "@/store/useAppStore";
import { TIPOS_EMPRESA } from "@/types/agroharvest";
import type { Empresa } from "@/types/agroharvest";
import { toast } from "sonner";

const ESTADOS_BR = [
  "AC","AL","AP","AM","BA","CE","DF","ES","GO","MA",
  "MT","MS","MG","PA","PB","PR","PE","PI","RJ","RN",
  "RS","RO","RR","SC","SP","SE","TO",
];

const emptyForm = {
  nome: "",
  tipo: "pecas" as Empresa["tipo"],
  telefone: "",
  endereco: "",
  cidade: "",
  estado: "",
  observacoes: "",
};

const EmpresasPage = () => {
  const { empresas, addEmpresa, removeEmpresa, updateEmpresa } = useEmpresas() as any;
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const openNew = () => {
    setEditingId(null);
    setForm(emptyForm);
    setOpen(true);
  };

  const openEdit = (emp: Empresa) => {
    setEditingId(emp.id);
    setForm({
      nome: emp.nome,
      tipo: emp.tipo,
      telefone: emp.telefone || "",
      endereco: emp.endereco || "",
      cidade: emp.cidade || "",
      estado: emp.estado || "",
      observacoes: emp.observacoes || "",
    });
    setOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nome.trim()) { toast.error("Nome é obrigatório"); return; }

    if (editingId) {
      const original = empresas.find((emp: Empresa) => emp.id === editingId)!;
      if (updateEmpresa) {
        updateEmpresa({ ...original, ...form });
        toast.success("Empresa atualizada!");
      }
    } else {
      addEmpresa({ id: crypto.randomUUID(), ...form, createdAt: new Date().toISOString() });
      toast.success("Empresa cadastrada!");
    }

    setForm(emptyForm);
    setOpen(false);
    setEditingId(null);
  };

  const tipoLabel = (t: string) => TIPOS_EMPRESA.find((x) => x.value === t)?.label || t;

  return (
    <div>
      <PageHeader
        title="Empresas"
        description="Fornecedores de peças, insumos e serviços"
        action={
          <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) { setEditingId(null); setForm(emptyForm); } }}>
            <DialogTrigger asChild>
              <Button onClick={openNew}><Plus className="mr-2 h-4 w-4" />Nova Empresa</Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingId ? "Editar Empresa" : "Cadastrar Empresa"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label>Nome *</Label>
                  <Input value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} placeholder="Nome da empresa" />
                </div>
                <div>
                  <Label>Tipo</Label>
                  <Select value={form.tipo} onValueChange={(v) => setForm({ ...form, tipo: v as Empresa["tipo"] })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {TIPOS_EMPRESA.map((t) => (
                        <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Telefone</Label>
                  <Input value={form.telefone} onChange={(e) => setForm({ ...form, telefone: e.target.value })} placeholder="(99) 99999-9999" />
                </div>
                <div>
                  <Label>Endereço</Label>
                  <Input value={form.endereco} onChange={(e) => setForm({ ...form, endereco: e.target.value })} placeholder="Rua, número, bairro" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Cidade</Label>
                    <Input value={form.cidade} onChange={(e) => setForm({ ...form, cidade: e.target.value })} placeholder="Ex: Naviraí" />
                  </div>
                  <div>
                    <Label>Estado</Label>
                    <Select value={form.estado} onValueChange={(v) => setForm({ ...form, estado: v })}>
                      <SelectTrigger><SelectValue placeholder="UF" /></SelectTrigger>
                      <SelectContent>
                        {ESTADOS_BR.map((uf) => (
                          <SelectItem key={uf} value={uf}>{uf}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
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

      {empresas.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Building2 className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Nenhuma empresa cadastrada ainda.</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead>Cidade / Estado</TableHead>
                  <TableHead className="w-24"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {empresas.map((emp: Empresa) => (
                  <TableRow key={emp.id}>
                    <TableCell className="font-medium">{emp.nome}</TableCell>
                    <TableCell>{tipoLabel(emp.tipo)}</TableCell>
                    <TableCell>{emp.telefone || "—"}</TableCell>
                    <TableCell>
                      {emp.cidade && emp.estado
                        ? `${emp.cidade} / ${emp.estado}`
                        : emp.cidade || emp.estado || "—"}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" onClick={() => openEdit(emp)}>
                          <Pencil className="h-4 w-4 text-primary" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => { removeEmpresa(emp.id); toast.success("Empresa removida"); }}>
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

export default EmpresasPage;
