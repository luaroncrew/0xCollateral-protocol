"use client";

import {
  TOKENS_OPERATED_BY_0XCOLLATERAL_SYMBOLE,
  TOKENS_OPERATED_BY_0XCOLLATERAL_SYMBOLE_ADDRESSE,
} from "@/app/constants/tokens";
import { get0xConfig } from "@/lib/0x/config";
import { useNotification } from "@blockscout/app-sdk";
import { useAccount, useWriteContract } from "wagmi";

import { parseEther } from "viem";

export const useBorrow = () => {
  const { chainId } = useAccount();

  const { openTxToast } = useNotification();

  const { writeContractAsync } = useWriteContract();

  const { LENDING_POOL_ADDRESS } = get0xConfig();

  return async (
    token: TOKENS_OPERATED_BY_0XCOLLATERAL_SYMBOLE,
    amount: number
  ) => {
    if (chainId) {
      const writeResult = await writeContractAsync(
        {
          abi: [
            {
              type: "function",
              name: "borrow",
              inputs: [
                {
                  name: "_token",
                  type: "address",
                  internalType: "address",
                },
                {
                  name: "_amount",
                  type: "uint256",
                  internalType: "uint256",
                },
              ],
              outputs: [],
              stateMutability: "nonpayable",
            },
          ],
          address: LENDING_POOL_ADDRESS,
          functionName: "borrow",
          args: [
            TOKENS_OPERATED_BY_0XCOLLATERAL_SYMBOLE_ADDRESSE[token],
            parseEther(amount.toString()),
          ],
        },
        {}
      );

      await openTxToast(chainId.toString(), writeResult);
    }
  };
};
