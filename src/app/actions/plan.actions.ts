"use server";

import { prisma } from "@/lib/db/prisma";
import { revalidatePath } from "next/cache";

export async function createPlan(formData: FormData) {
  const name = formData.get("name") as string;
  const price = parseFloat(formData.get("price") as string);
  const credits = parseInt(formData.get("credits") as string, 10);
  const description = formData.get("description") as string;

  if (!name || isNaN(price) || isNaN(credits)) {
    throw new Error("Invalid input data");
  }

  await prisma.plan.create({
    data: {
      name,
      price,
      credits,
      features: { description },
      currency: "INR"
    }
  });

  revalidatePath("/admin/plans");
}

export async function updatePlan(id: string, formData: FormData) {
  const name = formData.get("name") as string;
  const price = parseFloat(formData.get("price") as string);
  const credits = parseInt(formData.get("credits") as string, 10);
  const description = formData.get("description") as string;
  const isActive = formData.get("isActive") === "on";

  await prisma.plan.update({
    where: { id },
    data: {
      name,
      price,
      credits,
      features: { description },
      isActive
    }
  });

  revalidatePath("/admin/plans");
}
