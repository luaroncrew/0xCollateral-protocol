"use client";

import {
  TOKENS_OPERATED_BY_0XCOLLATERAL_SYMBOLE,
  TOKENS_OPERATED_BY_0XCOLLATERAL_SYMBOLE_ADDRESSE,
} from "@/app/constants/tokens";
import { get0xConfig } from "@/lib/0x/config";
import { useNotification } from "@blockscout/app-sdk";
import { useWriteContract, useAccount } from "wagmi";

import abi from "@/lib/0x/gen/abi.json";
import { parseEther } from "viem";

export const useWithdraw = () => {
  const { writeContractAsync } = useWriteContract();

  const { chainId } = useAccount();
  const { openTxToast } = useNotification();

  const { LENDING_POOL_ADDRESS } = get0xConfig();

  return async (
    token: TOKENS_OPERATED_BY_0XCOLLATERAL_SYMBOLE,
    amount: number
  ) => {
    const writeResult = await writeContractAsync(
      {
        abi,
        address: LENDING_POOL_ADDRESS,
        functionName: "withdraw",
        args: [
          TOKENS_OPERATED_BY_0XCOLLATERAL_SYMBOLE_ADDRESSE[token],
          parseEther(amount.toString()),
        ],
      },
      {}
    );

    if (chainId) {
      await openTxToast(chainId.toString(), writeResult);
    }
  };
};
