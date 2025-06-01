"use client";

import { FC, useState } from "react";

import { TokenIcon } from "@web3icons/react";

import { Card, CardContent } from "@/components/ui/card";
import SupplyPosition from "@/models/supply-position";
import { convertTokenToDollars } from "@/components/0x/utils/tokens";
import { Button } from "@/components/ui/button";
import { WithdrawSuppliedTokenModal } from "@/app/components/modals/withdraw-supplied-token-modal";


export const SupplyPositionCard: FC<{
    date?: Date
    position: SupplyPosition;
}> = (props) => {

    const [showModal, setShowModal] = useState(false);

    const dollars = convertTokenToDollars(
        props.position.symbol,
        props.position.balance,
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
                            {props.position.balance} {props.position.symbol}
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
                            onClick={() => setShowModal(true)}
                            className="text-purple-950 gradient-button-outline-lend"
                        >
                            Withdraw
                        </Button>
                        <WithdrawSuppliedTokenModal
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
