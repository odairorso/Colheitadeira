// Next.js instrumentation hook — roda uma vez na inicialização do servidor
// Garante que colunas novas existam antes de qualquer query
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    try {
      const { neon } = await import('@neondatabase/serverless');
      if (!process.env.DATABASE_URL) return;
      const sql = neon(process.env.DATABASE_URL);
      await sql`ALTER TABLE transactions ADD COLUMN IF NOT EXISTS forma_pagamento VARCHAR(20) DEFAULT NULL`;
      console.log('[migration] forma_pagamento: OK');
    } catch (e: any) {
      console.error('[migration] erro:', e.message);
    }
  }
}
