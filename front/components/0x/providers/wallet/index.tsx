"use server";

import { headers } from "next/headers";

import { FC, PropsWithChildren } from "react";

import { cookieToInitialState } from "wagmi";

import { WalletWagmiProvider } from "./wagmi";

import { getWagmiConfig } from "../../../../lib/0x/wagmi";

export const WalletProvider: FC<PropsWithChildren> = async (props) => {
  const cookie = (await headers()).get("cookie");

  const wagmiState = cookieToInitialState(getWagmiConfig(), cookie);

  return (
    <WalletWagmiProvider state={wagmiState}>
      {props.children}
    </WalletWagmiProvider>
  );
};
