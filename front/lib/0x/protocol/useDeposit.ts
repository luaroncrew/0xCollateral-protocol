"use client";

import {
  TOKENS_OPERATED_BY_0XCOLLATERAL_SYMBOLE,
  TOKENS_OPERATED_BY_0XCOLLATERAL_SYMBOLE_ADDRESSE,
} from "@/app/constants/tokens";
import { get0xConfig } from "@/lib/0x/config";
import { useNotification } from "@blockscout/app-sdk";
import { parseEther } from "viem";
import { useAccount, useWriteContract } from "wagmi";

const ABI = [
  {
    inputs: [
      { name: "_token", type: "address" },
      { name: "_amount", type: "uint256" },
      { name: "_from", type: "address" },
    ],
    name: "deposit",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
];

export const useDeposit = () => {
  const { address, chainId } = useAccount();

  const { openTxToast } = useNotification();

  const { writeContractAsync } = useWriteContract();

  const { LENDING_POOL_ADDRESS } = get0xConfig();

  return async (
    token: TOKENS_OPERATED_BY_0XCOLLATERAL_SYMBOLE,
    amount: number
  ) => {
    const writeResult = await writeContractAsync(
      {
        abi: ABI,
        address: LENDING_POOL_ADDRESS,
        functionName: "deposit",
        args: [
          TOKENS_OPERATED_BY_0XCOLLATERAL_SYMBOLE_ADDRESSE[token],
          amount,
          address,
        ],
        value: BigInt(amount),
      },
      {}
    );

    if (chainId) {
      await openTxToast(chainId.toString(), writeResult);
    }
  };
};
