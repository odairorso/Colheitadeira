"use server"

import { db } from "@/db";
import { transactions } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createTransaction(formData: FormData) {
  const rawAmount = formData.get("amount") as string;
  const categoryIdStr = formData.get("categoryId") as string;
  const description = formData.get("description") as string;
  const type = formData.get("type") as string; // 'INCOME' ou 'EXPENSE'
  const hectares = formData.get("hectares") as string;
  const userIdStr = formData.get("userId") as string;
  const formaPagamento = formData.get("formaPagamento") as string | null;

  // Lê a data do form como string local (ex: "2026-07-08T14:30")
  // Interpreta como horário LOCAL para evitar bug de -1 dia causado pelo UTC
  const dateStr = formData.get("date") as string;
  let parsedDate: Date;
  if (dateStr) {
    // "2026-07-08T14:30" → split em partes locais, sem converter UTC
    const [datePart, timePart] = dateStr.split("T");
    const [year, month, day] = datePart.split("-").map(Number);
    const [hour = 0, minute = 0] = (timePart || "00:00").split(":").map(Number);
    parsedDate = new Date(year, month - 1, day, hour, minute);
  } else {
    parsedDate = new Date();
  }

  if (!rawAmount || !categoryIdStr) {
    throw new Error("Preencha o valor e a categoria");
  }

  const amount = parseFloat(rawAmount.replace(',', '.'));

  await db.insert(transactions).values({
    type,
    amount: amount.toString(),
    categoryId: parseInt(categoryIdStr),
    description,
    date: parsedDate,
    hectares: hectares ? hectares : null,
    userId: userIdStr ? userIdStr : undefined,
    formaPagamento: formaPagamento || null,
  });

  revalidatePath("/");
  redirect("/");
}
