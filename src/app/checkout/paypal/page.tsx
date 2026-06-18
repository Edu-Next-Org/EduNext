import { Suspense } from "react";
import PaypalCheckoutContent from "@/modules/Payment/PaypalCheckoutContent";

export default function PaypalCheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen w-full items-center justify-center bg-gray-100">
          <p className="text-gray-500">Loading checkout...</p>
        </div>
      }
    >
      <PaypalCheckoutContent />
    </Suspense>
  );
}
