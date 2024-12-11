"use client";

import React from "react";
import { RainbowKitCustomConnectButton } from "@/components/scaffold-eth";

export const Header = () => {
  return (
    <div className="w-[90%] mx-auto flex justify-between py-6 px-16">
      <div className="flex flex-row gap-x-10 items-center">
        <div className="text-lg text-gray-600">Memecoin Maverick</div>
      </div>
      <div className="flex flex-row gap-x-10 items-center">
        <RainbowKitCustomConnectButton />
      </div>
    </div>
  );
};
