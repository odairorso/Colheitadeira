// Migration: adiciona coluna forma_pagamento na tabela transactions
// Execute: npx tsx src/db/migrate-forma-pagamento.ts
import { db } from "./index";
import { sql } from "drizzle-orm";

async function migrate() {
  try {
    await db.execute(sql`
      ALTER TABLE transactions
      ADD COLUMN IF NOT EXISTS forma_pagamento VARCHAR(20) DEFAULT NULL
    `);
    console.log("✅ Coluna forma_pagamento adicionada com sucesso!");
    process.exit(0);
  } catch (e: any) {
    console.error("❌ Erro na migration:", e.message);
    process.exit(1);
  }
}

migrate();
