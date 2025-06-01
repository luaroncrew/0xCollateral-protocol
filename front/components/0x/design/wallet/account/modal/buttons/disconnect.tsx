"use client";

import { FC } from "react";

import { useAccount, useDisconnect } from "wagmi";

import { WalletIcon } from "@web3icons/react";

import { Button } from "@/components/ui/button";

export const WalletDisconnect: FC<{
  onDisconnect: () => void;
}> = (props) => {
  const { connector } = useAccount();

  const { disconnect } = useDisconnect();

  return (
    <Button
      variant="outline"
      className="w-full flex items-center justify-center gap-2 py-6 text-gray-600"
      onClick={() => {
        disconnect();
        props.onDisconnect();
      }}
    >
      <span>Disconnect from</span>
      <span>{connector?.name}</span>
    </Button>
  );
};
