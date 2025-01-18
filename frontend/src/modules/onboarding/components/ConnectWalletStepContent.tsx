import { Loader2 } from "lucide-react";
import { Button } from "@/modules/common/components/ui/button";

interface ConnectWalletContentProps {
  isLoading: boolean;
  onConnect: () => void;
}

const ConnectWalletStepContent = ({
  isLoading,
  onConnect,
}: ConnectWalletContentProps) => {
  return (
    <Button size="sm" onClick={onConnect} disabled={isLoading}>
      {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
      Connect Wallet
    </Button>
  );
};

export default ConnectWalletStepContent;
