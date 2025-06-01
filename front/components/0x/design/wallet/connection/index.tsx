"use client";

import { FC } from "react";

import { useAccount } from "wagmi";

import { WalletAccount } from "../account";
import { WalletConnectors } from "../connectors";

export const Connection: FC = () => {
  const { isConnected } = useAccount();

  return isConnected ? <WalletAccount /> : <WalletConnectors />;
};
