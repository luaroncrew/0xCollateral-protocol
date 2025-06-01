"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TokenIcon } from "@web3icons/react";
import { FC, useState } from "react";
import { BorrowTokenModal } from "@/app/components/modals/borrow-token-modal";
import Link from "next/link";
import TokenToBorrow from "@/models/token/token-to-borrow";

interface PositionCardProps {
  token: TokenToBorrow;
}

export const AssetToBorrowCard: FC<PositionCardProps> = ({ token }) => {
  const [showBorrowModal, setShowBorrowModal] = useState(false);

  return (
    <Card className="overflow-hidden border shadow-sm">
      <CardContent className="p-3 hover:bg-muted transition-colors duration-200 ease-in-out">
        <div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1">
              <Link
                href={`/token-details/${token.symbol.toLowerCase()}`}
                className="font-medium w-24 flex flex-row gap-1 items-center"
              >
                <TokenIcon
                  symbol={token.symbol}
                  variant="branded"
                  size="28"
                  color="black"
                />
                {token.symbol}
              </Link>
              <div className="text-sm w-20">{token.available}</div>
              <div className="text-sm text-muted-foreground w-24">
                {token.apyStable}%
              </div>
              <div className="text-sm text-muted-foreground w-24">
                {token.apyVariable}%
              </div>
            </div>
            <div className="flex gap-2 ml-2">
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowBorrowModal(true);
                }}
                className="gradient-button-outline-borrow text-green-950"
              >
                Borrow
              </Button>
              <BorrowTokenModal
                initialToken={token.symbol}
                isOpen={showBorrowModal}
                onClose={() => setShowBorrowModal(false)}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
