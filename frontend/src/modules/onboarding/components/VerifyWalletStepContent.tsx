import { Loader2 } from "lucide-react";
import { Button } from "@/modules/common/components/ui/button";

interface VerifyWalletContentProps {
  isLoading: boolean;
  onVerify: () => void;
}

const VerifyWalletStepContent = ({
  isLoading,
  onVerify,
}: VerifyWalletContentProps) => {
  return (
    <Button size="sm" onClick={onVerify} disabled={isLoading} className="w-fit">
      {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
      Sign Message
    </Button>
  );
};

export default VerifyWalletStepContent;
