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
    <main className="min-h-screen bg-neutral-950 text-neutral-100 p-6 flex flex-col max-w-md mx-auto relative overflow-hidden">
      {/* Background Orbs */}
      <div className={`absolute top-[-10%] ${isDespesa ? 'left-[-10%]' : 'right-[-10%]'} w-72 h-72 bg-${color}-500/10 rounded-full blur-[100px] pointer-events-none`}></div>

      <header className="mb-10 pt-8 flex items-center justify-between z-10">
         <div>
            <h1 className={`text-4xl font-black tracking-tighter bg-gradient-to-r ${isDespesa ? 'from-rose-400 to-red-300' : 'from-emerald-400 to-teal-200'} bg-clip-text text-transparent`}>
                Nova {isDespesa ? "Despesa" : "Receita"}
            </h1>
            <p className="text-neutral-400 text-sm mt-1 font-medium">Preencha os dados abaixo</p>
         </div>
         <Link href="/" className="bg-white/5 border border-white/5 p-4 rounded-full hover:bg-white/10 transition-colors backdrop-blur-md shadow-xl flex items-center justify-center">
            <svg className="w-5 h-5 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
         </Link>
      </header>

      <form action={async (formData) => {
         "use server";
         await createTransaction(formData);
      }} className="flex flex-col gap-6 z-10 pb-10">
        <input type="hidden" name="type" value={typeStr} />

        {/* Quem está lançando? */}
        <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-widest text-neutral-400 ml-2">Quem está lançando?</label>
            <div className="relative">
              <select name="userId" className={`w-full bg-white/5 border border-white/5 backdrop-blur-md rounded-2xl p-5 text-white hover:bg-white/10 focus:border-${color}-500/50 outline-none transition-all appearance-none cursor-pointer font-medium`}>
                {userList.map((u: any) => (
                    <option key={u.id} value={u.id} className="text-black">{u.name}</option>
                ))}
              </select>
              <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none">
                 <svg className="w-5 h-5 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </div>
            </div>
        </div>

        {/* Valor */}
         <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-widest text-neutral-400 ml-2">Valor (R$)</label>
            <div className="relative group">
              <span className={`absolute left-5 top-1/2 -translate-y-1/2 text-2xl font-black text-${color}-400/50 group-focus-within:text-${color}-400 transition-colors`}>R$</span>
              <input 
                 type="number" step="0.01" 
                 name="amount" 
                 required
                 placeholder="0,00"
                 className={`w-full bg-white/5 border border-white/5 backdrop-blur-md rounded-[2rem] p-6 pl-16 text-4xl font-black text-white placeholder-white/20 focus:border-${color}-500/50 focus:bg-white/10 outline-none transition-all shadow-xl`}
              />
            </div>
        </div>
        
        {/* Categoria */}
         <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-widest text-neutral-400 ml-2">O que é?</label>
            <div className="grid grid-cols-2 gap-3">
               {allowedCategories.map((cat: any) => (
                   <label key={cat.id} className="cursor-pointer group relative">
                      <input type="radio" name="categoryId" value={cat.id} className="peer sr-only" required />
                      <div className={`h-full bg-white/5 border border-white/5 backdrop-blur-md rounded-2xl p-5 flex items-center justify-center text-center text-sm font-semibold text-neutral-300 peer-checked:bg-${color}-500/20 peer-checked:border-${color}-400/50 peer-checked:text-${color}-300 transition-all hover:bg-white/10`}>
                          {cat.name}
                      </div>
                      <div className={`absolute top-2 right-2 w-3 h-3 rounded-full bg-${color}-400 opacity-0 peer-checked:opacity-100 transition-opacity`}></div>
                   </label>
               ))}
            </div>
        </div>

        {/* Hectares / Area (só pra receita) */}
        {!isDespesa && (
             <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase tracking-widest text-neutral-400 ml-2">Área (Hectares) - <span className="text-emerald-400/70">Opcional</span></label>
                <div className="relative">
                  <input 
                     type="number" step="0.1" 
                     name="hectares" 
                     placeholder="Quantos ha colhidos?"
                     className="w-full bg-white/5 border border-white/5 backdrop-blur-md rounded-2xl p-5 text-white placeholder-white/20 focus:border-emerald-500/50 outline-none transition-all font-medium"
                  />
                  <span className="absolute right-5 top-1/2 -translate-y-1/2 text-neutral-500 font-bold">ha</span>
                </div>
            </div>
        )}

        {/* Data */}
        <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-widest text-neutral-400 ml-2">Data e Hora</label>
            <input 
                type="datetime-local" 
                name="date"
                defaultValue={new Date().toISOString().slice(0, 16)} 
                className={`w-full bg-white/5 border border-white/5 backdrop-blur-md rounded-2xl p-5 text-white focus:border-${color}-500/50 outline-none transition-all font-medium`}
            />
        </div>

        {/* Detalhes / Descriçaõ */}
         <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-widest text-neutral-400 ml-2">Detalhes extras da nota/serviço</label>
            <textarea 
               name="description" 
               rows={3}
               placeholder="Ex: Nota #123, Posto X, Peça Y..."
               className={`w-full bg-white/5 border border-white/5 backdrop-blur-md rounded-[2rem] p-5 text-white placeholder-white/20 focus:border-${color}-500/50 outline-none transition-all resize-none font-medium`}
            />
        </div>

        <button type="submit" className={`mt-6 relative overflow-hidden group bg-gradient-to-br ${isDespesa ? 'from-rose-500 to-rose-600' : 'from-emerald-500 to-emerald-600'} text-white font-black text-xl py-6 rounded-[2rem] shadow-2xl shadow-${color}-500/25 active:scale-[0.98] transition-all`}>
           <div className={`absolute inset-0 bg-gradient-to-r ${isDespesa ? 'from-rose-400 to-rose-500' : 'from-emerald-400 to-emerald-500'} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
           <span className="relative z-10 flex items-center justify-center gap-2">
              Salvar {isDespesa ? "Despesa" : "Receita"}
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
           </span>
        </button>
      </form>
    </main>
  );
}
