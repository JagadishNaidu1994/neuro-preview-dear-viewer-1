import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface SubscriptionCancellationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (discountAccepted: boolean) => void;
}

const SubscriptionCancellationModal = ({
  isOpen,
  onClose,
  onConfirm,
}: SubscriptionCancellationModalProps) => {
  const [step, setStep] = useState(1);

  const handleNextStep = () => {
    setStep((prev) => prev + 1);
  };

  const handleConfirm = (discountAccepted: boolean) => {
    onConfirm(discountAccepted);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        {step === 1 && (
          <>
            <DialogHeader>
              <DialogTitle>Are you sure you want to cancel?</DialogTitle>
            </DialogHeader>
            <div>
              <h3 className="font-semibold mb-2">Benefits of your subscription:</h3>
              <ul className="list-disc list-inside text-sm text-gray-600">
                <li>Save 20% on every order</li>
                <li>Hassle-free automatic restocking</li>
                <li>Early access to new products</li>
                <li>Exclusive member-only discounts</li>
              </ul>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={onClose}>
                Keep Subscription
              </Button>
              <Button variant="destructive" onClick={handleNextStep}>
                Yes, Cancel
              </Button>
            </DialogFooter>
          </>
        )}
        {step === 2 && (
          <>
            <DialogHeader>
              <DialogTitle>Wait! Get 20% off your next order.</DialogTitle>
            </DialogHeader>
            <div>
              <p>
                We'd hate to see you go. As a valued customer, we'd like to
                offer you a 20% discount on your next subscription order.
              </p>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => handleConfirm(false)}>
                No, Thanks
              </Button>
              <Button onClick={() => handleConfirm(true)}>
                Accept Discount
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SubscriptionCancellationModal;
