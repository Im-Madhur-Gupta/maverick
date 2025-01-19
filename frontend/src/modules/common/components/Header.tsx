"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { useAppKitAccount } from "@reown/appkit/react";

import { Button } from "@/modules/common/components/ui/button";
import ExternalLink from "@/modules/common/components/ExternalLink";
import { useAppStore } from "@/modules/common/store/use-app-store";

const Header = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { isConnected } = useAppKitAccount();
  const { isAuthenticated, checkAuthentication: checkAuth } = useAppStore();

  useEffect(() => {
    if (isConnected) {
      checkAuth();
    }
  }, [isConnected, checkAuth]);

  const handleGetStarted = () => {
    router.push(isAuthenticated ? "/dashboard" : "/onboarding");
  };

  const showButton = pathname === "/";
  const getButtonText = () => {
    if (isAuthenticated) {
      return "Go to Dashboard";
    }
    return "Get Started";
  };
  const buttonText = getButtonText();

  return (
    <header className="bg-background text-primary sticky top-0 z-50 w-full border-b border-border">
      <div className="max-w-6xl mx-auto">
        <div className="container mx-auto py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-4">
            <Image
              src="/icon.png"
              alt="Maverick Logo"
              width={45}
              height={45}
              className="rounded-full"
            />
            <span className="text-3xl font-bold">Maverick</span>
          </Link>

          <nav className="flex items-center space-x-8">
            <ExternalLink href="https://github.com/Im-Madhur-Gupta/memecoin-maverick">
              About
            </ExternalLink>
            {showButton && (
              <Button size="sm" onClick={handleGetStarted}>
                {buttonText}
              </Button>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
