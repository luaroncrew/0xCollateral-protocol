"use client"

import { TOKENS_OPERATED_BY_0XCOLLATERAL_SYMBOLE, TOKENS_OPERATED_BY_0XCOLLATERAL_SYMBOLE_ADDRESSE } from "@/app/constants/tokens";
import { get0xConfig } from "@/lib/0x/config";
import { useNotification } from "@blockscout/app-sdk";
import { useWriteContract, useAccount } from "wagmi";

import abi from "@/lib/0x/gen/abi.json";


export const useRepay = () => {
    const { writeContractAsync } = useWriteContract()

    const { chainId } = useAccount();

    const { openTxToast } = useNotification();

    const { LENDING_POOL_ADDRESS } = get0xConfig()

    return async (token: TOKENS_OPERATED_BY_0XCOLLATERAL_SYMBOLE, amount: number) => {
        const poolAddress = LENDING_POOL_ADDRESS;

        const writeResult = await writeContractAsync({
            abi,
            address: poolAddress,
            functionName: "repay",
            args: [
                TOKENS_OPERATED_BY_0XCOLLATERAL_SYMBOLE_ADDRESSE[token],
                amount,
            ]
        }, {})

        if (chainId) {
            await openTxToast(chainId.toString(), writeResult);
        }

    }
}