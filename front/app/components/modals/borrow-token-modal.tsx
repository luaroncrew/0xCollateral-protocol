"use client";

import { FC, useEffect, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import { TokenInput } from "@/components/token-input";
import {
  TOKENS_OPERATED_BY_0XCOLLATERAL_SYMBOLES,
  TOKENS_OPERATED_BY_0XCOLLATERAL_SYMBOLE,
  TOKENS_OPERATED_BY_0XCOLLATERAL_SYMBOLE_ADDRESSE,
} from "@/app/constants/tokens";
import { useBorrow } from "../../../lib/0x/protocol/useBorrow";
import { get0xConfig } from "@/lib/0x/config";
import { useAccount } from "wagmi";

import abi from "@/lib/0x/gen/abi.json";
import { createPublicClient, http } from "viem";
import { sepolia } from "viem/chains";
import { useHealthFactor } from "@/lib/0x/protocol/useHealthFactor";

export const BorrowTokenModal: FC<{
  initialToken: TOKENS_OPERATED_BY_0XCOLLATERAL_SYMBOLE;
  isOpen: boolean;
  onClose: () => void;
}> = (props) => {
  const calculateAPY = () => {
    // generate a number between 4 and 100
    const randomValue = Math.random() * 100;
    return Math.round(Math.floor(randomValue) + 4) / 100;
  };

  const [amount, setAmount] = useState<number>(0);

  const [token, setToken] = useState(props.initialToken);

  const [borrowAPY, setBorrowAPY] = useState(calculateAPY);

  const handleAmountChange = (value: number) => {
    setAmount(value);
    const newAPY = calculateAPY();
    setBorrowAPY(newAPY);
  };

  const handleTokenChange = (
    value: TOKENS_OPERATED_BY_0XCOLLATERAL_SYMBOLE
  ) => {
    setToken(value);

    const newAPY = calculateAPY();

    setBorrowAPY(newAPY);
  };

  const borrow = useBorrow();

  const healthFactor = useHealthFactor(token);

  return (
    <Dialog
      open={props.isOpen}
      onOpenChange={(open) => !open && props.onClose()}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Borrow {token}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <TokenInput
            value={amount}
            token={token}
            availableTokens={TOKENS_OPERATED_BY_0XCOLLATERAL_SYMBOLES}
            inputFor="borrow"
            onAmountChange={handleAmountChange}
            onTokenChange={handleTokenChange}
          />
          <div>
            <h3 className="font-medium mb-2">Transaction overview</h3>
            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Health Factor</span>
                <span className="font-medium text-green-600">-</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Borrow APY</span>
                <span className="font-medium">{borrowAPY} %</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Gas Fees</span>
                <span className="font-medium">0.0000312 ETH</span>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            onClick={() => borrow(token, amount)}
            className="w-full gradient-button-borrow text-white"
          >
            Borrow {token}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
