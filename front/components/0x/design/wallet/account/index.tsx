"use client";

import { FC, useState } from "react";

import { useAccount } from "wagmi";

import { Button } from "@/components/ui/button";

import { WalletAccountModal } from "./modal";

import { WalletAddress } from "../address";

export const WalletAccount: FC = () => {
  const { address, chainId } = useAccount();

  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Button
        variant="outline"
        onClick={() => {
          setShowModal(true);
        }}
      >
        {address && <WalletAddress address={address} />}
      </Button>
      {address && (
        <WalletAccountModal
          chainId={chainId}
          isOpen={showModal}
          address={address}
          onClose={() => {
            setShowModal(false);
          }}
        />
      )}
    </>
  );
};
