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

  const userIdStr = formData.get("userId") as string;
  
  if (!rawAmount || !categoryIdStr) {
    throw new Error("Preencha o valor e a categoria");
  }
  
  // HTML5 type="number" sends data using dot as decimal separator (e.g. 12.34)
  // Fallback to replace comma if needed
  const amount = parseFloat(rawAmount.replace(',', '.'));

  await db.insert(transactions).values({
    type,
    amount: amount.toString(),
    categoryId: parseInt(categoryIdStr),
    description,
    date: dateStr ? new Date(dateStr) : new Date(),
    hectares: hectares ? hectares : null,
    userId: userIdStr ? userIdStr : undefined,
  });

  revalidatePath("/");
  redirect("/");
}
