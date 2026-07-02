import { prisma } from "@/lib/db/prisma";
import { billingService } from "@/server/services/billing.service";

export class SubscriptionService {
  /**
   * Checks if a tenant has an active subscription
   */
  async validateSubscription(tenantId: string): Promise<boolean> {
    const sub = await prisma.subscription.findFirst({
      where: {
        tenantId,
        status: "ACTIVE",
        currentPeriodEnd: {
          gt: new Date()
        }
      }
    });
    return !!sub;
  }

  /**
   * Assigns a plan to a tenant and automatically deposits the associated credits into their wallet.
   * Calculates the renewal date (+30 days).
   */
  async assignSubscription(tenantId: string, planId: string) {
    const plan = await prisma.plan.findUnique({
      where: { id: planId }
    });

    if (!plan || !plan.isActive) {
      throw new Error("Invalid or inactive plan selected.");
    }

    // 1. Calculate 30 days from now
    const currentPeriodEnd = new Date();
    currentPeriodEnd.setDate(currentPeriodEnd.getDate() + 30);

    // 2. Check if tenant already has an active subscription
    const existingSub = await prisma.subscription.findFirst({
      where: { tenantId }
    });

    let subscription;

    if (existingSub) {
      // Upgrade / Downgrade / Renew
      subscription = await prisma.subscription.update({
        where: { id: existingSub.id },
        data: {
          planId: plan.id,
          status: "ACTIVE",
          currentPeriodEnd,
          cancelAtPeriodEnd: false
        }
      });
    } else {
      // New Subscription
      subscription = await prisma.subscription.create({
        data: {
          tenantId,
          planId: plan.id,
          status: "ACTIVE",
          currentPeriodEnd
        }
      });
    }

    // 3. Automatically assign the plan credits to the tenant's wallet
    await billingService.addCredits(
      tenantId, 
      plan.credits, 
      "SUBSCRIPTION_CREATED", 
      `Assigned ${plan.credits} credits from ${plan.name} plan.`
    );

    // 4. Log the action globally
    await prisma.billingHistory.create({
      data: {
        tenantId,
        action: existingSub ? "SUBSCRIPTION_UPDATED" : "SUBSCRIPTION_CREATED",
        details: { planName: plan.name, creditsAssigned: plan.credits }
      }
    });

    return subscription;
  }
}

export const subscriptionService = new SubscriptionService();
