"use client";

import { FC, useCallback, useState } from "react";

import { useAccount } from "wagmi";

import { z } from "zod";

import {
  TOKENS_OPERATED_BY_0XCOLLATERAL_SYMBOLE,
  TOKENS_OPERATED_BY_0XCOLLATERAL_SYMBOLES,
} from "@/app/constants/tokens";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import { TokenInput } from "@/components/token-input";
import { get0xConfig } from "@/lib/0x/config";

import { useDeposit } from "../../../lib/0x/protocol/useDeposit";
import { parseEther } from "viem";

export const SupplyTokenModal: FC<{
  isOpen: boolean;
  onClose: () => void;
  defaultToken: TOKENS_OPERATED_BY_0XCOLLATERAL_SYMBOLE;
}> = (props) => {
  const [amount, setAmount] = useState(0);

  const [token, setToken] = useState(props.defaultToken);

  const { address } = useAccount();

  const supply = useDeposit();

  const handleSupply = useCallback(
    async (amount: number, token: TOKENS_OPERATED_BY_0XCOLLATERAL_SYMBOLE) => {
      const config = get0xConfig();

      if (token === "ZCT") {
        const result = await fetch(
          `${config.PLEDGER_URL}/api/v1/payments/intent`,
          {
            body: JSON.stringify({
              amount,
              address,
            }),
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!result.ok) {
          throw new Error(result.statusText);
        }

        const schema = z.object({
          payment_url: z.string().url(),
        });

        const json = await result.json();

        const parsed = schema.safeParse(json);
        if (!parsed.success) {
          throw new Error("Failed to parse payment intent response");
        }

        const { payment_url } = parsed.data;

        const proxy = window.open(payment_url, "_blank");
        if (!proxy) {
          throw new Error("Failed to open payment URL");
        }
      } else {
        const amountInWei = parseEther(amount.toString());
        await supply(token, Number(amountInWei));
      }

      props.onClose();
    },
    [token, address, props, supply]
  );

  return (
    <Dialog
      open={props.isOpen}
      onOpenChange={(open) => !open && props.onClose()}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Supply {token}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <TokenInput
            value={amount}
            token={token}
            availableTokens={TOKENS_OPERATED_BY_0XCOLLATERAL_SYMBOLES}
            inputFor="supply"
            onAmountChange={setAmount}
            onTokenChange={setToken}
          />
        </div>
        <DialogFooter>
          <Button
            onClick={() => handleSupply(amount, token)}
            className="w-full gradient-button-lend text-white"
          >
            Supply {token}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
