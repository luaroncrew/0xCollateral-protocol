"use client";

import { FC, useState } from "react";

import { Button } from "@/components/ui/button";
import { TokenInput } from "@/components/token-input";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";

import { convertTokenToDollars } from "@/components/0x/utils/tokens";
import BorrowPosition from "@/models/borrow-position";
import { useRepay } from "../../../lib/0x/protocol/useRepay";

export const RepayTokenModal: FC<{
    isOpen: boolean;
    onClose: () => void;
    position: BorrowPosition;
}> = (props) => {
    const [amount, setAmount] = useState(0);

    const dollars = convertTokenToDollars(
        props.position.symbol,
        props.position.debt
    );

    const repay = useRepay()

    return (
        <Dialog
            open={props.isOpen}
            onOpenChange={(open) => !open && props.onClose()}
        >
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Repay ${props.position.symbol}</DialogTitle>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    <div className="text-sm text-muted-foreground mb-2">
                        Transaction overview
                    </div>

                    <div className="bg-muted/50 rounded-lg p-4 mb-4">
                        <div className="flex justify-between items-center">
                            <div className="text-sm">Currently borrowed</div>
                            <div className="flex gap-1 font-medium">
                                <span>{props.position.debt}</span>
                                <span>{props.position.symbol}</span>
                                <span>(${dollars})</span>
                            </div>
                        </div>
                    </div>
                    <TokenInput
                        value={amount}
                        token={props.position.symbol}
                        availableTokens={[props.position.symbol]}
                        onAmountChange={setAmount}
                        inputFor={"repay"}
                    />
                </div>

                <DialogFooter>
                    <Button
                        onClick={() => repay(props.position.symbol, amount)}
                        className="w-full gradient-button-borrow text-white"
                    >
                        Repay
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
