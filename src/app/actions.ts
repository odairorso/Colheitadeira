"use server"

import { db } from "@/db";
import { transactions } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createTransaction(formData: FormData) {
  // Pega os dados do form
  const rawAmount = formData.get("amount") as string;
  const categoryIdStr = formData.get("categoryId") as string;
  const description = formData.get("description") as string;
  const type = formData.get("type") as string; // 'INCOME' ou 'EXPENSE'
  const dateStr = formData.get("date") as string;
  const hectares = formData.get("hectares") as string;

  // Usa o User_ID de acordo com a seleção (simplificado)
  const role = formData.get("role") as string;
  // TODO: Buscar o ID correto do user baseado no banco. Fixando temporariamente para não falhar a FK.
  
  if (!rawAmount || !categoryIdStr) {
    return { error: "Preencha o valor e a categoria" };
  }
  
  // Limpa o valor (remove R$, pontos)
  const amount = parseFloat(rawAmount.replace(/[R$\s\.]/g, '').replace(',', '.'));

  await db.insert(transactions).values({
    type,
    amount: amount.toString(),
    categoryId: parseInt(categoryIdStr),
    description,
    date: dateStr ? new Date(dateStr) : new Date(),
    hectares: hectares ? hectares : null,
  });

  revalidatePath("/");
  redirect("/");
}
