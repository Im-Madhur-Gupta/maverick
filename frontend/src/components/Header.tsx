"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "./ui/button";
import ExternalLink from "./ExternalLink";

const Header = () => {
  return (
    <header className="bg-background text-primary sticky top-0 z-50">
      <div className="py-4 flex justify-between items-center">
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
          <Button size="sm">Get Started</Button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
