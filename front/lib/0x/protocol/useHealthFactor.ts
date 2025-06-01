"use client";

import { useAccount, useReadContract } from "wagmi";

import { TOKENS_OPERATED_BY_0XCOLLATERAL_SYMBOLE, TOKENS_OPERATED_BY_0XCOLLATERAL_SYMBOLE_ADDRESSE } from "@/app/constants/tokens";
import { get0xConfig } from "../config";

export const useHealthFactor = (token: TOKENS_OPERATED_BY_0XCOLLATERAL_SYMBOLE) => {

    const lendingPoolABI = [
        {
            inputs: [
                { name: "_user", type: "address" },
                { name: "_token", type: "address" },
            ],
            name: "getHealthFactor",
            outputs: [{ name: "", type: "uint256" }],
            stateMutability: "view",
            type: "function",
        },
    ] as const

    const { address } = useAccount();

    const { LENDING_POOL_ADDRESS } = get0xConfig();

    const result = useReadContract({
        address: LENDING_POOL_ADDRESS,
        abi: lendingPoolABI,
        functionName: 'getHealthFactor',
        args: [
            address!,
            TOKENS_OPERATED_BY_0XCOLLATERAL_SYMBOLE_ADDRESSE[token],
        ],
    })

    return result.data ?? 0;
}