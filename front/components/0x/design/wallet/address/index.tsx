"use client";

import { FC } from "react";

import { useEnsName } from "wagmi";

import { WalletAddressRaw } from "./raw";
import { WalletAddressSymbole } from "./symbol";

export const WalletAddress: FC<{
  address: `0x${string}`;
}> = (props) => {
  const { data: ensName } = useEnsName({ address: props.address });
  return (
    <div className="flex flex-row items-center gap-3">
      <div className="flex flex-col items-center gap-2">
        <WalletAddressRaw address={props.address} />
        {ensName && <span className="font-mono">{ensName}</span>}
      </div>
      <span>
        <WalletAddressSymbole />
      </span>
    </div>
  );
};
