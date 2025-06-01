"use client";

import { FC, useState } from "react";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { TokenInput } from "@/components/token-input";
import SupplyPosition from "@/models/supply-position";
import { useWithdraw } from "../../../lib/0x/protocol/useWithdraw";


export const WithdrawSuppliedTokenModal: FC<{
    isOpen: boolean;
    onClose: () => void;
    position: SupplyPosition;
}> = (props) => {
    const [amount, setAmount] = useState<number>(0);

    const withdraw = useWithdraw();

    return (
        <Dialog
            open={props.isOpen}
            onOpenChange={(open) => !open && props.onClose()}
        >
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Withdraw {props.position.symbol}</DialogTitle>
                </DialogHeader>
                <div className="space-y-6 py-4">
                    <TokenInput
                        value={amount}
                        onAmountChange={setAmount}
                        token={props.position.symbol}
                        availableTokens={[]}
                        inputFor="withdraw"
                    />
                </div>
                <DialogFooter>
                    <Button
                        onClick={() => withdraw(props.position.symbol, amount)}
                        className="w-full gradient-button-lend text-white"
                    >
                        Withdraw
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
