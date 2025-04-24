import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { CheckCircle2 } from "lucide-react";

interface PaymentSuccessProps {
  onClose: () => void;
}

export default function PaymentSuccess({ onClose }: PaymentSuccessProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg px-4 pt-5 pb-4 overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full sm:p-6 mx-4">
        <div>
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>
          <div className="mt-3 text-center sm:mt-5">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Payment Successful
            </h3>
            <div className="mt-2">
              <p className="text-sm text-gray-500">
                Your travel insurance has been successfully purchased. A confirmation email with your policy details has been sent to your email address.
              </p>
            </div>
          </div>
        </div>
        <div className="mt-5 sm:mt-6">
          <Button className="w-full" onClick={onClose}>
            Return to Home
          </Button>
        </div>
      </div>
    </div>
  );
}
