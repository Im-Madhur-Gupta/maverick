import { useAppKitAccount, useDisconnect } from "@reown/appkit/react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/modules/common/components/ui/popover";
import { WalletIcon, UserCircle2Icon, LogOutIcon } from "lucide-react";
import { Button } from "@/modules/common/components/ui/button";
import { useAppStore } from "@/modules/common/store/use-app-store";
import { useRouter } from "next/navigation";

const ConnectedUserInfo = () => {
  const router = useRouter();
  const { disconnect } = useDisconnect();
  const { logout } = useAppStore();
  const { address, embeddedWalletInfo } = useAppKitAccount();

  const handleDisconnect = () => {
    disconnect();
    logout();
    router.push("/");
  };

  // Computed values

  const isSocialLogin = embeddedWalletInfo?.user?.email;

  const getDisconnectButtonText = () => {
    if (isSocialLogin) {
      return "Logout";
    }
    return "Disconnect";
  };
  const disconnectButtonText = getDisconnectButtonText();

  return (
    <Popover>
      <PopoverTrigger>
        <div className="flex items-center space-x-2 border border-gray-200 rounded-md px-2 py-1">
          {isSocialLogin ? (
            <>
              <UserCircle2Icon />
              <span>{embeddedWalletInfo?.user?.email}</span>
            </>
          ) : (
            <>
              <WalletIcon />
              <span>{`${address?.slice(0, 6)}...${address?.slice(-6)}`}</span>
            </>
          )}
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-fit" sideOffset={10}>
        <Button onClick={handleDisconnect} className="flex items-center">
          <LogOutIcon />
          <span>{disconnectButtonText}</span>
        </Button>
      </PopoverContent>
    </Popover>
  );
};

export default ConnectedUserInfo;
