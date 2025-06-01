"use client";

import { FC, Fragment, ReactNode } from "react";

import { TokenIcon } from "@web3icons/react";

import { Card, CardContent } from "@/components/ui/card";

import { convertTokenToDollars } from "../../utils/tokens";
import { TOKENS_OPERATED_BY_0XCOLLATERAL_SYMBOLE } from "@/app/constants/tokens";

export interface Balance {
  symbol: TOKENS_OPERATED_BY_0XCOLLATERAL_SYMBOLE;
  amount: number;
}

export interface Position {
  apy: number;
  balance: Balance;
}

export const AssetPositionCard: FC<{
  date?: Date;
  actions: Array<ReactNode>;
  position: Position;
}> = (props) => {
  const dollars = convertTokenToDollars(
    props.position.balance.symbol,
    props.position.balance.amount
  );

  return (
    <Card className="overflow-hidden border shadow-sm">
      <CardContent className="p-3 flex justify-between items-center">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <TokenIcon
              symbol={props.position.balance.symbol}
              size={28}
              variant="branded"
            />
            <span className="text-lg font-medium">
              {props.position.balance.amount} {props.position.balance.symbol}
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
            {props.actions.map((action, idx) => (
              <Fragment key={idx}>{action}</Fragment>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
