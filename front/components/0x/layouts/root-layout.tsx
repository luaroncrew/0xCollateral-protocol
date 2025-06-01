"use server";

import { FC, PropsWithChildren } from "react";

import { Connection } from "../design/wallet/connection";
import { WalletProvider } from "../providers/wallet";
import { BlockScoutProvider } from "./blockscout";

export const RootLayout: FC<PropsWithChildren> = async ({ children }) => {
  return (
    <WalletProvider>
      <main className="container max-w-6xl mx-auto py-8 px-4">
        <BlockScoutProvider>
          <header className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">0xCollateral</h1>
            <Connection />
          </header>
          {children}
        </BlockScoutProvider>
      </main>
    </WalletProvider>
  );
};
