"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { State, WagmiProvider } from "wagmi";

import { FC, PropsWithChildren, useState } from "react";

import { getWagmiConfig } from "../../../../lib/0x/wagmi";

export const WalletWagmiProvider: FC<
  PropsWithChildren<{
    state?: State;
  }>
> = (props) => {

  const [wagmiConfig] = useState(() => getWagmiConfig());
  const [queryClient] = useState(() => new QueryClient());

  return (
    <WagmiProvider config={wagmiConfig} initialState={props.state}>
      <QueryClientProvider client={queryClient}>
        {props.children}
      </QueryClientProvider>
    </WagmiProvider>
  );
};
