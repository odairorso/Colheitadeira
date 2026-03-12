import Link from "next/link";
import { db } from "@/db";
import { transactions, categories } from "@/db/schema";
import { desc, eq, sum } from "drizzle-orm";

export default async function Home() {
  // Buscar totais do banco de dados // TODO: Otimizar query depois
  const allTx = await db.select().from(transactions).orderBy(desc(transactions.date));
  
  const totalReceitas = allTx.filter((t: any) => t.type === 'INCOME').reduce((acc: number, curr: any) => acc + Number(curr.amount), 0);
  const totalDespesas = allTx.filter((t: any) => t.type === 'EXPENSE').reduce((acc: number, curr: any) => acc + Number(curr.amount), 0);
  const saldoLiquido = totalReceitas - totalDespesas;
  
  // Buscar categorias para o histórico
  const allCat = await db.select().from(categories);
  const catMap = Object.fromEntries(allCat.map(c => [c.id, c.name]));
  
  const ultimosLancamentos = allTx.slice(0, 5);

  return (
    <main className="min-h-screen bg-neutral-900 text-neutral-100 p-6 flex flex-col max-w-md mx-auto relative pt-12">
      <header className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-white/90">Gestão da <span className="text-emerald-400">Safra</span></h1>
        <p className="text-neutral-400 text-sm mt-1">Visão Geral da Colheitadeira</p>
      </header>

      {/* Cards de Resumo */}
      <section className="grid grid-cols-2 gap-4 mb-8">
         <div className="bg-neutral-800/50 border border-neutral-700/50 p-4 rounded-3xl col-span-2 shadow-lg backdrop-blur-md">
           <p className="text-sm text-neutral-400 font-medium mb-1">Lucro Líquido</p>
           <h2 className="text-4xl font-black text-emerald-400 tracking-tighter">
             {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(saldoLiquido)}
           </h2>
         </div>
         
         <div className="bg-neutral-800/50 border border-neutral-700/50 p-4 rounded-3xl shadow-md">
           <p className="text-xs text-neutral-400 font-medium mb-1 line-clamp-1">Total Receitas</p>
           <h3 className="text-xl font-bold text-white/90 tracking-tight">
             {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(totalReceitas)}
           </h3>
         </div>

         <div className="bg-neutral-800/50 border border-neutral-700/50 p-4 rounded-3xl shadow-md">
           <p className="text-xs text-neutral-400 font-medium mb-1 line-clamp-1">Total Despesas</p>
           <h3 className="text-xl font-bold text-rose-400 tracking-tight">
             {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(totalDespesas)}
           </h3>
         </div>
      </section>

      {/* Botões de Ação Rapida */}
      <section className="mt-4 flex flex-col gap-4">
        <h3 className="text-sm font-semibold text-neutral-400 uppercase tracking-widest pl-2">Lançamentos</h3>
        
        <Link href="/lancamento/despesa" className="bg-rose-500 hover:bg-rose-600 transition-colors text-white py-6 rounded-3xl flex justify-center items-center shadow-lg shadow-rose-900/20 active:scale-[0.98]">
           <span className="text-xl font-bold tracking-tight">Lançar Despesa</span>
        </Link>
        
        <Link href="/lancamento/receita" className="bg-emerald-500 hover:bg-emerald-600 transition-colors text-white py-6 rounded-3xl flex justify-center items-center shadow-lg shadow-emerald-900/20 active:scale-[0.98]">
           <span className="text-xl font-bold tracking-tight">Lançar Receita</span>
        </Link>
      </section>

      {/* Histórico Recente */}
      <section className="mt-10 flex flex-col gap-3">
         <h3 className="text-sm font-semibold text-neutral-400 uppercase tracking-widest pl-2 mb-2">Últimos Lançamentos</h3>
         {ultimosLancamentos.length === 0 ? (
            <div className="text-center p-8 bg-neutral-800/30 rounded-3xl border border-neutral-800">
               <p className="text-neutral-500 text-sm">Nenhum lançamento registrado</p>
            </div>
         ) : (
           ultimosLancamentos.map((tx: any) => {
               const isInc = tx.type === 'INCOME';
               return (
                  <div key={tx.id} className="bg-neutral-800 border border-neutral-700/50 p-4 rounded-2xl flex items-center justify-between">
                     <div>
                        <p className="font-semibold text-white text-base">
                           {tx.categoryId ? catMap[tx.categoryId] : 'Diversos'}
                        </p>
                        <p className="text-xs text-neutral-500">
                           {new Date(tx.date || new Date()).toLocaleDateString('pt-BR')} 
                           {tx.hectares ? ` • ${tx.hectares} ha` : ''}
                        </p>
                     </div>
                     <span className={`font-bold ${isInc ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {isInc ? '+' : '-'}{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(tx.amount))}
                     </span>
                  </div>
               )
           })
         )}
      </section>

    </main>
  );
}
