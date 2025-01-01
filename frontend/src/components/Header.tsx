import React from "react";
import HeaderLink from "./HeaderLink";

export const Header = () => {
  return (
    <div className="w-[90%] mx-auto flex justify-between py-6 px-16">
      <HeaderLink href="/">Memecoin Maverick</HeaderLink>
      <div className="flex items-center gap-x-12">
        <HeaderLink href="/create">Create</HeaderLink>
        <HeaderLink
          href="https://github.com/Im-Madhur-Gupta/memecoin-maverick/blob/main/README.md"
          openInNewTab
        >
          About
        </HeaderLink>
      </div>
    </div>
  );
};
