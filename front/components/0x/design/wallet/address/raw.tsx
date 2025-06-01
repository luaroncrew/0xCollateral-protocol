import { FC } from "react";

import { formatWalletAddress } from "@/components/0x/utils/address";

export const WalletAddressRaw: FC<{
  address: `0x${string}`;
  className?: string;
}> = (props) => {
  return (
    <span className={`font-mono ${props.className}`}>
      {formatWalletAddress(props.address)}
    </span>
  );
};
