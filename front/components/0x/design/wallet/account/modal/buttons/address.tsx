"use client";

import { Copy } from "lucide-react";

import { FC } from "react";
import { WalletAddressRaw } from "../../../address/raw";

export const WalletAddress: FC<{
  address: `0x${string}`;
}> = (props) => {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(props.address);
  };

  return (
    <div className="flex items-center justify-center gap-2">
      <WalletAddressRaw address={props.address} className="text-md" />
      <button
        onClick={copyToClipboard}
        className="text-gray-500 hover:text-gray-700 transition-colors"
        aria-label="Copy address"
      >
        <Copy className="h-4 w-4" />
      </button>
    </div>
  );
};
