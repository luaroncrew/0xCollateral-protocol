"use client";

import { FC, useCallback } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { WalletAddressSymbole } from "../../address/symbol";

import { WalletAddress } from "./buttons/address";
import { WalletDisconnect } from "./buttons/disconnect";

import { useEnsAvatar, useEnsName } from "wagmi";
import { useTransactionPopup } from "@blockscout/app-sdk";

export const WalletAccountModal: FC<{
  isOpen: boolean;
  onClose: () => void;
  address: `0x${string}`;
  chainId?: number;
}> = (props) => {
  const { data: ensName } = useEnsName({
    address: props.address,
  });

  const { data: ensAvatar } = useEnsAvatar({
    name: ensName || undefined,
  });

  const { openPopup } = useTransactionPopup();

  const showAddressTransactions = useCallback(() => {
    if (!props.chainId) return;

    openPopup({
      "address": props.address,
      "chainId": props.chainId.toString(),
    })

    props.onClose();
  }, [props.address, props.chainId])

  return (
    <Dialog
      open={props.isOpen}
      onOpenChange={(open) => !open && props.onClose()}
    >
      <DialogContent className="sm:max-w-[380px] p-0 overflow-hidden">
        <DialogHeader className="p-0">
          <DialogTitle className="sr-only">Wallet Connected</DialogTitle>
        </DialogHeader>
        <div className="p-6 text-center">
          <h2 className="text-xl font-medium mb-8">Connected</h2>
          {/* Avatar */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-32 h-32 rounded-full overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-purple-600 via-blue-500 to-emerald-400"></div>
                <img
                  alt="Wallet avatar"
                  src={ensAvatar || undefined}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow-sm border border-gray-200">
                <WalletAddressSymbole />
              </div>
            </div>
          </div>
          {/* Address */}
          <WalletAddress address={props.address} />
          {/* Show wallet transactions */}
          {props.chainId && (
            <button
              className="py-4 text-sm text-gray-600 hover:text-gray-800 transition-colors"
              onClick={showAddressTransactions}>
              View history with Blockscout
            </button>
          )}
          {/* Disconnect */}
          <WalletDisconnect
            onDisconnect={() => {
              props.onClose();
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
