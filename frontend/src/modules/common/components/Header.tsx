"use client";

import Link from "next/link";
import Image from "next/image";

import { Button } from "@/modules/common/components/ui/button";
import ExternalLink from "@/modules/common/components/ExternalLink";
import { useRouter } from "next/navigation";

const Header = () => {
  const router = useRouter();

  const handleGetStarted = () => {
    // TODO: If user isn't logged then redirect to 'onboarding' else redirect to 'dashboard'
    router.push("/onboarding");
  };

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
            <Button size="sm" onClick={handleGetStarted}>
              Get Started
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
