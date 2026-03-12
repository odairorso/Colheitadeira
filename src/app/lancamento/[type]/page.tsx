import { db } from "@/db";
import { categories, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { createTransaction } from "../../actions";
import Link from "next/link";

export default async function Lancamento({ params }: { params: { type: string } }) {
  const resolvedParams = await params;
  const isDespesa = resolvedParams.type === "despesa";
  const typeStr = isDespesa ? "EXPENSE" : "INCOME";

  // Busca do DB:
  const allowedCategories = await db.select().from(categories).where(eq(categories.type, typeStr));
  const userList = await db.select().from(users);

  // Cor
  const color = isDespesa ? "rose" : "emerald";

  return (
    <main className="min-h-screen bg-neutral-900 text-neutral-100 p-6 flex flex-col max-w-md mx-auto">
      <header className="mb-8 pt-8 flex items-center justify-between">
         <div>
            <h1 className={`text-2xl font-bold tracking-tight text-${color}-400`}>
                Nova {isDespesa ? "Despesa" : "Receita"}
            </h1>
            <p className="text-neutral-400 text-sm mt-1">Preencha os dados abaixo</p>
         </div>
         <Link href="/" className="bg-neutral-800 p-3 rounded-full hover:bg-neutral-700 transition-colors">
            X
         </Link>
      </header>

      <form action={async (formData) => {
         "use server";
         await createTransaction(formData);
      }} className="flex flex-col gap-6">
        <input type="hidden" name="type" value={typeStr} />

        {/* Quem está lançando? */}
        <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-neutral-400">Quem está lançando?</label>
            <select name="userId" className="bg-neutral-800/80 border border-neutral-700 rounded-2xl p-4 text-white hover:border-neutral-600 focus:border-emerald-500 outline-none transition-colors appearance-none">
              {userList.map((u: any) => (
                  <option key={u.id} value={u.id}>{u.name}</option>
              ))}
            </select>
        </div>

        {/* Valor */}
         <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-neutral-400">Valor (R$)</label>
            <input 
               type="number" step="0.01" 
               name="amount" 
               required
               placeholder="0,00"
               className="bg-neutral-800/80 border border-neutral-700 rounded-2xl p-6 text-3xl font-bold text-white placeholder-neutral-600 focus:border-emerald-500 outline-none transition-colors"
            />
        </div>
        
        {/* Categoria */}
         <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-neutral-400">O que é?</label>
            <div className="grid grid-cols-2 gap-2">
               {allowedCategories.map((cat: any) => (
                   <label key={cat.id} className="cursor-pointer">
                      <input type="radio" name="categoryId" value={cat.id} className="peer sr-only" required />
                      <div className={`bg-neutral-800/50 border border-neutral-700 rounded-xl p-4 text-center text-sm font-medium peer-checked:bg-${color}-500/20 peer-checked:border-${color}-500 peer-checked:text-${color}-400 transition-all`}>
                          {cat.name}
                      </div>
                   </label>
               ))}
            </div>
        </div>

        {/* Hectares / Area (só pra receita) */}
        {!isDespesa && (
             <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-neutral-400">Área (Hectares) - <span className="text-xs">Opcional</span></label>
                <input 
                   type="number" step="0.1" 
                   name="hectares" 
                   placeholder="Quantos ha colhidos?"
                   className="bg-neutral-800/80 border border-neutral-700 rounded-2xl p-4 text-white focus:border-emerald-500 outline-none transition-colors"
                />
            </div>
        )}

        {/* Data */}
        <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-neutral-400">Data e Hora</label>
            <input 
                type="datetime-local" 
                name="date"
                defaultValue={new Date().toISOString().slice(0, 16)} 
                className="bg-neutral-800/80 border border-neutral-700 rounded-2xl p-4 text-white focus:border-emerald-500 outline-none transition-colors appearance-none"
            />
        </div>

        {/* Detalhes / Descriçaõ */}
         <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-neutral-400">Detalhes extras da nota/serviço</label>
            <textarea 
               name="description" 
               rows={2}
               placeholder="Ex: Nota #123, Posto X, Peça Y..."
               className="bg-neutral-800/80 border border-neutral-700 rounded-2xl p-4 text-white placeholder-neutral-600 focus:border-emerald-500 outline-none transition-colors resize-none"
            />
        </div>

        <button type="submit" className={`mt-4 bg-${color}-500 hover:bg-${color}-600 text-white font-bold text-xl py-6 rounded-3xl shadow-lg shadow-${color}-900/20 active:scale-[0.98] transition-all`}>
           Salvar {isDespesa ? "Despesa" : "Receita"}
        </button>
      </form>
    </main>
  );
}
