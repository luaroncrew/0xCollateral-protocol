"use client";

import { FC, use, useEffect, useMemo, useState } from "react";

import { Card, CardHeader, CardContent } from "@/components/ui/card";

import { useSupplyPositions, useSupplyPositionsTotalAPY, useSupplyPositionsTotalBalance } from "@/app/constants/market";
import { Button } from "@/components/ui/button";
import { SupplyPositionCard } from "@/app/components/positions/supply-position-card";
import { SupplyTokenModal } from "@/app/components/modals/supply-token-modal";
import { TOKENS_OPERATED_BY_0XCOLLATERAL, TOKENS_OPERATED_BY_0XCOLLATERAL_SYMBOLES } from "@/app/constants/tokens";

export const SupplySummaryCard: FC = () => {

  const [showModal, setShowModal] = useState(false);

  const totalAPY = useSupplyPositionsTotalAPY();

  const totalBalance = useSupplyPositionsTotalBalance();

  const supplyPositions = useSupplyPositions();

  return (
    <Card className="overflow-hidden shadow-sm gradient-lend">
      <CardHeader className="flex flex-row items-center justify-between p-6">
        <h2 className="text-xl font-medium">Your Supplies</h2>
        <div className="flex gap-2">
          <Button
            onClick={() => setShowModal(true)}
            className="gradient-button-lend"
          >
            Supply
          </Button>
          <SupplyTokenModal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            defaultToken={TOKENS_OPERATED_BY_0XCOLLATERAL.ETH}
          />
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="mb-1 text-3xl">
          <span>${totalBalance}</span>
        </div>
        <div>
          <span className="text-sm text-muted-foreground">{totalAPY}% APY</span>
        </div>
        <div>
          <h3 className="text-lg font-medium mt-4">
            Open Positions ({supplyPositions.length})
          </h3>
          <div className="flex flex-col gap-2 mt-4">
            {supplyPositions.map((position, idx) => (
              <SupplyPositionCard position={position} key={idx} />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
