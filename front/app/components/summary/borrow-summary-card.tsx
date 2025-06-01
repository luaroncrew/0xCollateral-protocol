"use client";

import { FC, useState } from "react";

import { Card, CardHeader, CardContent } from "@/components/ui/card";

import { getBorrowPositionsTotalAPY, getBorrowPositionsTotalDebt, useBorrowPositions } from "@/app/constants/market";
import { Button } from "@/components/ui/button";
import { BorrowPositionCard } from "@/app/components/positions/borrow-position-card";
import { BorrowTokenModal } from "@/app/components/modals/borrow-token-modal";
import { TOKENS_OPERATED_BY_0XCOLLATERAL } from "@/app/constants/tokens";


export const BorrowSummaryCard: FC = () => {
  const [showModal, setShowModal] = useState(false);

  const totalAPY = getBorrowPositionsTotalAPY();
  const totalDept = getBorrowPositionsTotalDebt();

  const borrowPositions = useBorrowPositions();

  return (
    <Card className="overflow-hidden shadow-sm gradient-borrow">
      <CardHeader className="flex flex-row items-center justify-between p-6">
        <h2 className="text-xl font-medium">Your Borrows</h2>
        <div className="flex gap-2">
          <Button
            onClick={() => setShowModal(true)}
            className="gradient-button-borrow"
          >
            Borrow
          </Button>
          <BorrowTokenModal
            initialToken={TOKENS_OPERATED_BY_0XCOLLATERAL.ETH}
            isOpen={showModal}
            onClose={() => setShowModal(false)}
          />
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="mb-1 text-3xl">
          <span>${totalDept}</span>
        </div>
        <div>
          <span className="text-sm text-muted-foreground">{totalAPY}% APY</span>
        </div>
        <div>
          <h3 className="text-lg font-medium mt-4">
            Open Positions ({borrowPositions.length})
          </h3>
          <div className="flex flex-col gap-2 mt-4">
            {borrowPositions.map((position, idx) => (
              <BorrowPositionCard position={position} key={idx} />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
