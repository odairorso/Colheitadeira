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
    <main className="min-h-screen bg-neutral-950 text-neutral-100 p-6 flex flex-col max-w-md mx-auto relative pt-12 overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-emerald-500/20 rounded-full blur-[80px] pointer-events-none"></div>
      <div className="absolute top-[40%] right-[-10%] w-64 h-64 bg-rose-500/10 rounded-full blur-[80px] pointer-events-none"></div>

      <header className="mb-10 z-10">
        <h1 className="text-3xl font-black tracking-tighter text-white">
          Gestão <span className="bg-gradient-to-r from-emerald-400 to-teal-200 bg-clip-text text-transparent">Safra</span>
        </h1>
        <p className="text-neutral-400 text-sm mt-1 font-medium">Painel de Controle da Colheitadeira</p>
      </header>

      {/* Cards de Resumo */}
      <section className="grid grid-cols-2 gap-4 mb-10 z-10">
         <div className="bg-gradient-to-br from-neutral-800/80 to-neutral-900/80 border border-white/5 p-6 rounded-[2rem] col-span-2 shadow-2xl backdrop-blur-xl relative overflow-hidden group">
           <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
           <p className="text-sm text-neutral-400 font-semibold tracking-wide uppercase mb-2">Lucro Líquido</p>
           <h2 className="text-5xl font-black text-white tracking-tighter flex items-center gap-1">
             <span className="text-2xl text-emerald-400 mb-2">R$</span> 
             {new Intl.NumberFormat('pt-BR', { style: 'decimal', minimumFractionDigits: 2 }).format(saldoLiquido)}
           </h2>
         </div>
         
         <div className="bg-white/5 border border-white/5 p-5 rounded-[2rem] shadow-xl backdrop-blur-md">
           <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center mb-3">
              <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
           </div>
           <p className="text-xs text-neutral-400 font-semibold uppercase tracking-wider mb-1 line-clamp-1">Receitas</p>
           <h3 className="text-xl font-bold text-white tracking-tight">
             {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(totalReceitas)}
           </h3>
         </div>

         <div className="bg-white/5 border border-white/5 p-5 rounded-[2rem] shadow-xl backdrop-blur-md">
            <div className="w-8 h-8 rounded-full bg-rose-500/20 flex items-center justify-center mb-3">
              <svg className="w-4 h-4 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
           </div>
           <p className="text-xs text-neutral-400 font-semibold uppercase tracking-wider mb-1 line-clamp-1">Despesas</p>
           <h3 className="text-xl font-bold text-white tracking-tight">
             {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(totalDespesas)}
           </h3>
         </div>
      </section>

      {/* Botões de Ação Rapida */}
      <section className="flex gap-4 z-10">
        <Link href="/lancamento/despesa" className="flex-1 bg-gradient-to-br from-rose-500 to-rose-600 hover:from-rose-400 hover:to-rose-500 text-white p-5 rounded-[2rem] shadow-lg shadow-rose-500/25 active:scale-[0.97] transition-all flex flex-col items-center justify-center gap-2 border border-rose-400/20">
           <div className="bg-white/20 p-3 rounded-full mb-1">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" /></svg>
           </div>
           <span className="text-sm font-bold tracking-wide">Despesa</span>
        </Link>
        
        <Link href="/lancamento/receita" className="flex-1 bg-gradient-to-br from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white p-5 rounded-[2rem] shadow-lg shadow-emerald-500/25 active:scale-[0.97] transition-all flex flex-col items-center justify-center gap-2 border border-emerald-400/20">
           <div className="bg-white/20 p-3 rounded-full mb-1">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
           </div>
           <span className="text-sm font-bold tracking-wide">Receita</span>
        </Link>
      </section>

      {/* Histórico Recente */}
      <section className="mt-12 flex flex-col gap-4 z-10 pb-10">
         <div className="flex items-center justify-between pl-2 pr-2">
            <h3 className="text-sm font-bold text-neutral-300 uppercase tracking-widest">Últimos Lançamentos</h3>
         </div>
         <div className="flex flex-col gap-3">
             {ultimosLancamentos.length === 0 ? (
                <div className="text-center p-10 bg-white/5 rounded-[2rem] border border-white/5 backdrop-blur-md text-neutral-400 flex flex-col items-center gap-2">
                   <svg className="w-8 h-8 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                   <p className="text-sm">Nenhum registro encontrado</p>
                </div>
             ) : (
               ultimosLancamentos.map((tx: any) => {
                   const isInc = tx.type === 'INCOME';
                   return (
                      <div key={tx.id} className="bg-white/5 border border-white/5 p-5 rounded-[1.5rem] flex items-center justify-between backdrop-blur-md hover:bg-white/10 transition-colors">
                         <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isInc ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                               <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  {isInc ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />}
                               </svg>
                            </div>
                            <div>
                               <p className="font-bold text-white text-base tracking-tight leading-tight">
                                  {tx.categoryId ? catMap[tx.categoryId] : 'Diversos'}
                               </p>
                               <p className="text-xs text-neutral-400 font-medium mt-0.5">
                                  {new Date(tx.date || new Date()).toLocaleDateString('pt-BR', {day:'2-digit', month:'short'})} 
                                  {tx.hectares ? ` • ${tx.hectares} ha` : ''}
                               </p>
                            </div>
                         </div>
                         <span className={`font-black tracking-tight ${isInc ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {isInc ? '+' : '-'}{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(tx.amount))}
                         </span>
                      </div>
                   )
               })
             )}
         </div>
      </section>

    </main>
  );
}
