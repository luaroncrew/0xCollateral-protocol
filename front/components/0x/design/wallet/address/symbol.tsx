"use client";

import { FC } from "react";

import { TokenIcon } from "@web3icons/react";

import { useConnectorClient } from "wagmi";

export const WalletAddressSymbole: FC = () => {
  const { data } = useConnectorClient();

  const symbol = data?.chain.nativeCurrency.symbol;

  return symbol && <TokenIcon symbol={symbol} variant="branded" size={24} />;
};
