"use client";

import { useConnect } from "wagmi";

import { WalletConnector } from "./connector";

export const WalletConnectors: React.FC = () => {
  const { connectors } = useConnect();

  return (
    <div className="flex flex-row gap-3 items-center">
      <span>Connect with</span>
      <div>
        {connectors.map((connector) => (
          <WalletConnector key={connector.id} connector={connector} />
        ))}
      </div>
    </div>
  );
};
