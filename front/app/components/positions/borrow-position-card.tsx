"use client";

import { FC, useState } from "react";
import { TokenIcon } from "@web3icons/react";
import { Card, CardContent } from "@/components/ui/card";
import { convertTokenToDollars } from "@/components/0x/utils/tokens";
import { Button } from "@/components/ui/button";
import BorrowPosition from "@/models/borrow-position";
import { WithdrawSuppliedTokenModal } from "../modals/withdraw-supplied-token-modal";
import { RepayTokenModal } from "../modals/repay-borrow-token-modal";


export const BorrowPositionCard: FC<{
    date?: Date
    position: BorrowPosition;
}> = (props) => {

    const [showModal, setShowModal] = useState(false);

    const dollars = convertTokenToDollars(
        props.position.symbol,
        props.position.debt,
    );

    return (
        <Card className="overflow-hidden border shadow-sm">
            <CardContent className="p-3 flex justify-between items-center">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <TokenIcon
                            symbol={props.position.symbol}
                            size={28}
                            variant="branded"
                        />
                        <span className="text-lg font-medium">
                            {props.position.debt} {props.position.symbol}
                        </span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                        {props.position.apy}% APY
                    </div>
                </div>
                {props.date && (
                    <div>
                        <span className="text-sm text-muted-foreground">
                            {props.date.toLocaleDateString("en-US", {
                                month: "short",
                                day: "2-digit",
                                year: "numeric",
                            })}
                        </span>
                    </div>
                )}
                <div className="flex items-center gap-4">
                    <span className="text-md">${dollars}</span>
                    <div className="flex gap-2">
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                                setShowModal(true)
                            }}
                            className="text-green-950 gradient-button-outline-borrow"
                        >
                            Repay
                        </Button>
                        <RepayTokenModal
                            isOpen={showModal}
                            onClose={() => setShowModal(false)}
                            position={props.position}
                        />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
