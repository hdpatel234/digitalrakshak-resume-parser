"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface RazorpayModalProps {
  planId: string;
  isOpen: boolean;
  onClose: () => void;
}

export function RazorpayModal({ planId, isOpen, onClose }: RazorpayModalProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Inject Razorpay checkout script dynamically
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    if (isOpen && planId) {
      handleCheckout();
    }
  }, [isOpen, planId]);

  const handleCheckout = async () => {
    setLoading(true);

    try {
      // 1. Create Order on our backend
      const res = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId }),
      });
      const result = await res.json();

      if (!res.ok || !result.success) {
        toast.error("Failed to initialize checkout.");
        onClose();
        return;
      }

      const { orderId, amount, currency, keyId } = result.data;

      // 2. Open Razorpay Interface
      const options = {
        key: keyId,
        amount: amount,
        currency: currency,
        name: "Digitalrakshak Resume Parser",
        description: "Subscription Upgrade",
        order_id: orderId,
        handler: async function (response: any) {
          // 3. Verify Payment
          const verifyRes = await fetch("/api/payments/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });

          const verifyData = await verifyRes.json();
          if (verifyRes.ok && verifyData.success) {
            toast.success("Payment successful! Redirecting...");
            router.push("/payment/success");
          } else {
            toast.error("Payment verification failed.");
            router.push("/payment/failed");
          }
        },
        prefill: {
          name: "User",
          email: "user@example.com",
        },
        theme: {
          color: "#3b82f6",
        },
        modal: {
          ondismiss: function () {
            toast.info("Payment cancelled.");
            onClose();
          },
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on("payment.failed", function (response: any) {
        toast.error(`Payment failed: ${response.error.description}`);
        router.push("/payment/failed");
      });
      rzp.open();
    } catch (error) {
      toast.error("An unexpected error occurred.");
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return null; // This is a headless component that spawns the Razorpay popup
}
