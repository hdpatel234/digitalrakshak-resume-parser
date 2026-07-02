import { prisma } from "@/lib/db/prisma";

export class PlanService {
  async getAllPlans(includeInactive = false) {
    return prisma.plan.findMany({
      where: includeInactive ? undefined : { isActive: true },
      orderBy: { price: "asc" }
    });
  }

  async createPlan(data: { name: string; price: number; credits: number; features?: any }) {
    return prisma.plan.create({
      data: {
        name: data.name,
        price: data.price,
        credits: data.credits,
        features: data.features || {},
        currency: "INR"
      }
    });
  }

  async updatePlan(id: string, data: { name?: string; price?: number; credits?: number; features?: any; isActive?: boolean }) {
    return prisma.plan.update({
      where: { id },
      data
    });
  }

  /**
   * We "soft delete" plans so we don't break existing historical subscriptions
   * that point to this plan.
   */
  async deletePlan(id: string) {
    return prisma.plan.update({
      where: { id },
      data: { isActive: false }
    });
  }
}

export const planService = new PlanService();
