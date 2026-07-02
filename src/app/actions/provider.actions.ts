"use server";

import { prisma } from "@/lib/db/prisma";
import { revalidatePath } from "next/cache";

export async function createProvider(formData: FormData) {
  const name = formData.get("name") as string;
  
  if (!name) throw new Error("Name is required");

  await prisma.apiProvider.create({
    data: { name }
  });

  revalidatePath("/admin/providers");
}

export async function toggleProviderActive(id: string, isActive: boolean) {
  await prisma.apiProvider.update({
    where: { id },
    data: { isActive }
  });

  revalidatePath("/admin/providers");
}

export async function createModel(formData: FormData) {
  const providerId = formData.get("providerId") as string;
  const modelName = formData.get("modelName") as string;
  const costPerRequest = parseFloat(formData.get("costPerRequest") as string) || 0;

  if (!providerId || !modelName) throw new Error("Missing fields");

  await prisma.providerModel.create({
    data: {
      providerId,
      modelName,
      costPerRequest
    }
  });

  revalidatePath("/admin/models");
}
