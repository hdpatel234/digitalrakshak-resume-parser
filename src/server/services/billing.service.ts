import { prisma } from "@/lib/db/prisma";

export class BillingService {
  /**
   * Securely deducts credits from a tenant's wallet using an atomic database transaction.
   * If the balance is insufficient, it throws an error and rolls back automatically.
   */
  async deductCredits(tenantId: string, credits: number, action: string, description?: string) {
    if (credits <= 0) return null;

    // Use Prisma's interactive transaction to ensure no race conditions
    return await prisma.$transaction(async (tx) => {
      // 1. Fetch wallet exclusively (if using PostgreSQL/MySQL this avoids concurrency bugs)
      const wallet = await tx.wallet.findUnique({
        where: { tenantId }
      });

      if (!wallet) {
        throw new Error("Wallet not found for this tenant.");
      }

      const creditsBefore = wallet.balance;

      if (creditsBefore < credits) {
        throw new Error("Insufficient credits. Please top up your balance.");
      }

      const creditsAfter = creditsBefore - credits;

      // 2. Deduct the wallet balance
      const updatedWallet = await tx.wallet.update({
        where: { id: wallet.id },
        data: {
          balance: creditsAfter
        }
      });

      // 3. Insert transaction log
      const log = await tx.walletTransaction.create({
        data: {
          walletId: wallet.id,
          type: "DEBIT",
          creditsBefore,
          creditsUsed: credits,
          creditsAfter,
          action,
          description
        }
      });

      return { wallet: updatedWallet, transaction: log };
    });
  }

  /**
   * Securely adds credits to a tenant's wallet.
   * If the wallet doesn't exist, it creates one automatically.
   */
  async addCredits(tenantId: string, credits: number, action: string, description?: string) {
    if (credits <= 0) return null;

    return await prisma.$transaction(async (tx) => {
      let wallet = await tx.wallet.findUnique({
        where: { tenantId }
      });

      // Auto-create wallet if missing
      if (!wallet) {
        wallet = await tx.wallet.create({
          data: { tenantId, balance: 0 }
        });
      }

      const creditsBefore = wallet.balance;
      const creditsAfter = creditsBefore + credits;

      const updatedWallet = await tx.wallet.update({
        where: { id: wallet.id },
        data: { balance: creditsAfter }
      });

      const log = await tx.walletTransaction.create({
        data: {
          walletId: wallet.id,
          type: "CREDIT",
          creditsBefore,
          creditsUsed: 0, // Since it's an addition
          creditsAfter,
          action,
          description
        }
      });

      return { wallet: updatedWallet, transaction: log };
    });
  }

  /**
   * Helper function to perform a fast, non-mutating check
   * to fail early before doing heavy processing.
   */
  async hasSufficientCredits(tenantId: string, requiredCredits: number): Promise<boolean> {
    const wallet = await prisma.wallet.findUnique({
      where: { tenantId },
      select: { balance: true }
    });
    
    if (!wallet) return false;
    return wallet.balance >= requiredCredits;
  }
}

export const billingService = new BillingService();
