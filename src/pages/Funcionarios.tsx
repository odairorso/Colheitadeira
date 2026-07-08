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
import { Plus, Trash2, Users2 } from "lucide-react";
import { toast } from "sonner";

interface Funcionario {
  id: string;
  nome: string;
  cargo: string;
  telefone: string;
  cpf: string;
  salario: string;
  dataAdmissao: string;
  status: "ativo" | "inativo";
  observacoes: string;
}

const CARGOS = [
  "Operador de Colheitadeira",
  "Operador de Trator",
  "Auxiliar de Campo",
  "Motorista",
  "Mecânico",
  "Gerente de Fazenda",
  "Técnico Agrícola",
  "Outro",
];

const FuncionariosPage = () => {
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    nome: "",
    cargo: "",
    telefone: "",
    cpf: "",
    salario: "",
    dataAdmissao: new Date().toISOString().split("T")[0],
    status: "ativo" as "ativo" | "inativo",
    observacoes: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nome || !form.cargo) {
      toast.error("Nome e cargo são obrigatórios");
      return;
    }
    setFuncionarios((prev) => [
      ...prev,
      { id: crypto.randomUUID(), ...form },
    ]);
    setForm({
      nome: "",
      cargo: "",
      telefone: "",
      cpf: "",
      salario: "",
      dataAdmissao: new Date().toISOString().split("T")[0],
      status: "ativo",
      observacoes: "",
    });
    setOpen(false);
    toast.success("Funcionário cadastrado!");
  };

  const remover = (id: string) => {
    setFuncionarios((prev) => prev.filter((f) => f.id !== id));
    toast.success("Funcionário removido");
  };

  return (
    <div>
      <PageHeader
        title="Funcionários"
        description="Cadastro e gestão da equipe de trabalho"
        action={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button><Plus className="mr-2 h-4 w-4" />Novo Funcionário</Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto">
              <DialogHeader><DialogTitle>Cadastrar Funcionário</DialogTitle></DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label>Nome Completo *</Label>
                  <Input value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} placeholder="Nome do funcionário" />
                </div>
                <div>
                  <Label>Cargo *</Label>
                  <Select value={form.cargo} onValueChange={(v) => setForm({ ...form, cargo: v })}>
                    <SelectTrigger><SelectValue placeholder="Selecione o cargo" /></SelectTrigger>
                    <SelectContent>
                      {CARGOS.map((c) => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Telefone</Label>
                    <Input value={form.telefone} onChange={(e) => setForm({ ...form, telefone: e.target.value })} placeholder="(00) 00000-0000" />
                  </div>
                  <div>
                    <Label>CPF</Label>
                    <Input value={form.cpf} onChange={(e) => setForm({ ...form, cpf: e.target.value })} placeholder="000.000.000-00" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Salário (R$)</Label>
                    <Input type="number" step="0.01" value={form.salario} onChange={(e) => setForm({ ...form, salario: e.target.value })} placeholder="0,00" />
                  </div>
                  <div>
                    <Label>Data de Admissão</Label>
                    <Input type="date" value={form.dataAdmissao} onChange={(e) => setForm({ ...form, dataAdmissao: e.target.value })} />
                  </div>
                </div>
                <div>
                  <Label>Status</Label>
                  <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as "ativo" | "inativo" })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ativo">Ativo</SelectItem>
                      <SelectItem value="inativo">Inativo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Observações</Label>
                  <Textarea value={form.observacoes} onChange={(e) => setForm({ ...form, observacoes: e.target.value })} placeholder="Informações adicionais..." />
                </div>
                <Button type="submit" className="w-full">Salvar</Button>
              </form>
            </DialogContent>
          </Dialog>
        }
      />

      {funcionarios.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Users2 className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Nenhum funcionário cadastrado ainda.</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Cargo</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead>Salário</TableHead>
                  <TableHead>Admissão</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {funcionarios.map((f) => (
                  <TableRow key={f.id}>
                    <TableCell className="font-medium">{f.nome}</TableCell>
                    <TableCell>{f.cargo}</TableCell>
                    <TableCell>{f.telefone || "—"}</TableCell>
                    <TableCell>
                      {f.salario
                        ? `R$ ${parseFloat(f.salario).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`
                        : "—"}
                    </TableCell>
                    <TableCell>{new Date(f.dataAdmissao).toLocaleDateString("pt-BR")}</TableCell>
                    <TableCell>
                      <Badge variant={f.status === "ativo" ? "default" : "secondary"}>
                        {f.status === "ativo" ? "Ativo" : "Inativo"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" onClick={() => remover(f.id)}>
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

export default FuncionariosPage;
