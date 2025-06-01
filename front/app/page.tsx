"use client";

import { NextPage } from "next";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import {
  useTokensAvailableToBorrow,
  useTokensAvailableToSupply,
} from "@/app/constants/tokens";
import { AssetToBorrowCard } from "@/app/components/assets/asset-to-borrow-card";
import { PositionCardSkeleton } from "@/app/components/positions/position-card-skeleton";
import { AssetToSupplyCard } from "@/app/components/assets/asset-to-supply-card";
import { SupplySummaryCard } from "@/app/components/summary/supply-summary-card";
import { BorrowSummaryCard } from "@/app/components/summary/borrow-summary-card";

const Home: NextPage = () => {
  const [isLoading, setIsLoading] = useState(true);

  // Initial loading effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const tokenAvailableToSupply = useTokensAvailableToSupply();
  const tokenAvailableToBorrow = useTokensAvailableToBorrow();

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* total balance $, weighted average APY anc collateral amount $ must be preset*/}
        <SupplySummaryCard />

        {/* total balance $, weighted average APY and collateral use rate % must be preset */}
        <BorrowSummaryCard />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-medium mb-4">Assets to Supply</h2>

          {/* Column labels for supply assets */}
          <div className="flex items-center px-3 py-2 text-sm font-medium text-muted-foreground gap-x-4">
            <div className="w-24">Asset</div>
            <div className="w-32">Wallet Balance</div>
            <div className="w-20">APY</div>
          </div>

          {isLoading ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <PositionCardSkeleton key={i} />
              ))}
            </div>
          ) : tokenAvailableToSupply.length > 0 ? (
            <div className="space-y-2">
              {tokenAvailableToSupply.map((token) => (
                <AssetToSupplyCard key={token.id} token={token} />
              ))}
            </div>
          ) : (
            <Card className="p-6 text-center text-muted-foreground">
              No assets available to supply
            </Card>
          )}
        </div>

        <div>
          <h2 className="text-xl font-medium mb-4">Assets to Borrow</h2>

          {/* Column labels for borrow assets */}
          <div className="flex items-center px-3 py-2 text-sm font-medium text-muted-foreground gap-x-4">
            <div className="w-24">Asset</div>
            <div className="w-20">Available</div>
            <div className="w-24">APY Stable</div>
            <div className="w-24">APY Variable</div>
          </div>

          {isLoading ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <PositionCardSkeleton key={i} />
              ))}
            </div>
          ) : tokenAvailableToBorrow.length > 0 ? (
            <div className="space-y-2">
              {tokenAvailableToBorrow.map((token) => (
                <AssetToBorrowCard key={token.id} token={token} />
              ))}
            </div>
          ) : (
            <Card className="p-6 text-center text-muted-foreground">
              No assets available to borrow
            </Card>
          )}
        </div>
      </div>
    </>
  );
};

export default Home;
