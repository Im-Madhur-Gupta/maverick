"use client";

import { usePathname } from "next/navigation";
import ExternalLink from "./ExternalLink";

const Footer = () => {
  const pathname = usePathname();

  const hideFooter = pathname.includes("/dashboard");
  if (hideFooter) {
    return null;
  }

  return (
    <footer className="w-full bg-primary z-50">
      <div className="max-w-6xl mx-auto p-12 grid grid-cols-2 gap-4">
        <div>
          <h3 className="text-lg font-bold mb-4">Maverick</h3>
          <p className="text-sm">
            Empowering your trading with AI-driven insights and seamless
            automation for smarter, more efficient decision-making.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-bold mb-4">Quick Links</h3>
          <ul className="space-y-2">
            <li>
              <ExternalLink href="https://github.com/Im-Madhur-Gupta/memecoin-maverick">
                About
              </ExternalLink>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
