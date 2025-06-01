"use client";

import { useState, useEffect, PropsWithChildren } from "react";
import { notFound, useParams, useRouter } from "next/navigation";
import { TokenIcon } from "@web3icons/react";
import { ArrowLeft } from "lucide-react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { TOKEN_DATA } from "@/app/constants/detailsChartData";
import { NextPage } from "next";

const SupplyDetails: NextPage<PropsWithChildren> = ({ children }) => {
  const { symbole } = useParams<{ symbole: string }>();

  const router = useRouter();

  const token = TOKEN_DATA.find((token) => {
    return token.symbol.toLowerCase() === symbole?.toLowerCase();
  });

  if (!token) {
    return notFound();
  }

  return (
    <TooltipProvider>
      <main className="container max-w-7xl mx-auto py-8 px-4">
        {/* Navigation */}
        <div className="mb-6">
          <button
            onClick={() => router.push("/")}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft size={16} className="mr-2" />
            Go Back
          </button>
        </div>
        {/* Token Header */}
        <header className="flex flex-wrap md:flex-nowrap justify-between items-center gap-6 mb-8 bg-white rounded-xl p-6 border">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-purple-50 rounded-full p-2 flex items-center justify-center">
              <TokenIcon
                symbol={token.symbol.toLowerCase()}
                variant="branded"
                size={48}
              />
            </div>
            <div>
              <h2 className="text-2xl font-bold">{token.name}</h2>
              <div className="text-sm text-gray-500">
                Oracle Price: {token.oraclePrice}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <div className="bg-gray-50 rounded-xl p-3 min-w-[120px]">
              <div className="text-sm text-gray-500">Reserve Size</div>
              <div className="text-lg font-bold">{token.reserveSize}</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-3 min-w-[120px]">
              <div className="text-sm text-gray-500">Utilization</div>
              <div className="text-lg font-bold">{token.utilizationRate}%</div>
            </div>
          </div>
        </header>
        {children}
      </main>
    </TooltipProvider>
  );
};

export default SupplyDetails;
