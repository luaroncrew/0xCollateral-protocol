"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TokenIcon } from "@web3icons/react";
import { FC, useState } from "react";
import { SupplyTokenModal } from "@/app/components/modals/supply-token-modal";
import Link from "next/link";
import TokenToSupply from "@/models/token/token-to-supply";

interface AssetToSupplyCardProps {
  token: TokenToSupply;
}

export const AssetToSupplyCard: FC<AssetToSupplyCardProps> = ({ token }) => {
  const [showSupplyModal, setShowSupplyModal] = useState(false);

  return (
    <Card className="overflow-hidden border shadow-sm">
      <CardContent className="p-3 hover:bg-muted transition-colors duration-200 ease-in-out">
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
            <div className="text-sm w-32">{token.walletBalance}</div>
            <div className="text-sm text-muted-foreground w-20">
              {token.apyStable}%
            </div>
          </div>
          <div className="flex gap-2 ml-2">
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                setShowSupplyModal(true);
              }}
              className="gradient-button-outline-lend text-purple-950"
            >
              Supply
            </Button>
            <SupplyTokenModal
              isOpen={showSupplyModal}
              onClose={() => setShowSupplyModal(false)}
              defaultToken={token.symbol}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
