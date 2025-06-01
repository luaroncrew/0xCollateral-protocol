"use client";

import { useState } from "react";

import Link from "next/link";

import { NextPage } from "next";

import { notFound, useParams } from "next/navigation";

import { TokenIcon } from "@web3icons/react";

import { ExternalLink, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { TooltipProvider } from "@/components/ui/tooltip";

import { TOKEN_DATA, CHART_PERIODS } from "@/app/constants/detailsChartData";

import {
  generateAPYData,
  generateInterestRateModelData,
  formatAPYDataForTremor,
  formatInterestRateDataForTremor,
} from "@/app/constants/detailsChartData";

import { AreaChart, LineChart, DonutChart } from "@tremor/react";

import { useAccount } from "wagmi";

const SupplyDetails: NextPage = () => {
  const { symbole } = useParams<{ symbole: string }>();

  const { isConnected } = useAccount();

  const [activeChartPeriod, setActiveChartPeriod] = useState("1m");

  const [supplyAmount, setSupplyAmount] = useState<number>(0);

  const token = TOKEN_DATA.find((token) => {
    return token.symbol.toLowerCase() === symbole?.toLowerCase();
  });

  if (token == null) {
    return notFound();
  }

  // Generate chart data
  const supplyData = generateAPYData(
    token.supplyAPY,
    activeChartPeriod,
    "supply"
  );
  const borrowData = generateAPYData(
    token.borrowAPY,
    activeChartPeriod,
    "borrow"
  );
  const rateModelData = generateInterestRateModelData(
    token.utilizationRate,
    token.borrowAPY
  );

  const supplyChartData = formatAPYDataForTremor(supplyData, activeChartPeriod);
  const borrowChartData = formatAPYDataForTremor(borrowData, activeChartPeriod);

  const interestRateData = formatInterestRateDataForTremor(rateModelData);

  // Set utilization data for donut chart
  const utilizationData = [
    { name: "Utilized", value: token.utilizationRate },
    { name: "Available", value: 100 - token.utilizationRate },
  ];

  const valueFormatter = (number: number) => `${number.toFixed(2)}%`;

  // Calculate supply value based on input
  const calculateSupplyValue = () => {
    if (!supplyAmount) return "$0.00";
    const numericPrice = Number.parseFloat(
      token.oraclePrice.replace(/[^0-9.]/g, "")
    );
    const value = supplyAmount * numericPrice;

    return `$${value.toFixed(2)}`;
  };

  return (
    <TooltipProvider>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        {/* Supply Action Panel */}
        <div className="lg:col-span-4 lg:order-2">
          <div className="bg-purple-50 rounded-xl p-6 sticky top-6">
            <h2 className="text-xl font-semibold mb-6">
              Supply {token.symbol}
            </h2>

            {!isConnected ? (
              <div className="flex flex-col items-center justify-center py-6 bg-white rounded-xl p-6 border">
                <p className="text-gray-500 text-center mb-4">
                  Please connect a wallet to supply {token.symbol}.
                </p>
                <Button className="bg-purple-500 hover:bg-purple-600 text-white rounded-full px-6">
                  Connect Wallet
                </Button>
              </div>
            ) : (
              <>
                <div className="bg-white rounded-xl p-4 border mb-6">
                  <div className="text-sm text-gray-500 mb-1">
                    Your Supply Balance
                  </div>
                  <div className="text-xl font-bold">0.00 {token.symbol}</div>
                  <div className="text-sm text-gray-500">$0.00</div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amount
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      className="w-full p-3 border rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="0.00"
                      value={supplyAmount}
                      onChange={(e) =>
                        setSupplyAmount(Number.parseFloat(e.target.value))
                      }
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                      <span className="text-purple-500 text-sm cursor-pointer hover:text-purple-700 font-medium">
                        MAX
                      </span>
                      <div className="w-6 h-6">
                        <TokenIcon
                          symbol={token.symbol.toLowerCase()}
                          variant="branded"
                          size={24}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between text-sm mt-2">
                    <span className="text-gray-500">Wallet balance: 0.00</span>
                    <span className="text-gray-500">
                      ${calculateSupplyValue()}
                    </span>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-4 border mb-6">
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Supply APY</span>
                      <span className="font-medium text-purple-600">
                        {token.supplyAPY}%
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Collateralization</span>
                      <span className="font-medium text-purple-600">
                        {token.canBeCollateral ? "Enabled" : "Disabled"}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Health Factor</span>
                      <span className="font-medium text-purple-600">-</span>
                    </div>
                  </div>
                </div>

                <Button className="w-full bg-purple-500 hover:bg-purple-600 text-white rounded-full py-3">
                  Supply {token.symbol}
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Charts and Data */}
        <div className="lg:col-span-8 lg:order-1 space-y-6">
          {/* APY Charts Section */}
          <div className="bg-white rounded-xl p-6 border">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Interest Rate History</h2>
              <div className="flex space-x-2">
                {CHART_PERIODS.map((period) => (
                  <button
                    key={period}
                    onClick={() => setActiveChartPeriod(period)}
                    className={`px-3 py-1 text-sm rounded-full ${activeChartPeriod === period
                      ? "bg-purple-500 text-white"
                      : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                      }`}
                  >
                    {period}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <div className="text-sm font-medium text-gray-700">
                    Supply APY
                  </div>
                  <div className="text-lg font-bold text-purple-600">
                    {token.supplyAPY}%
                  </div>
                </div>
                <AreaChart
                  className="h-48"
                  data={supplyChartData}
                  index="date"
                  categories={["APY"]}
                  colors={["purple"]}
                  valueFormatter={valueFormatter}
                  showLegend={false}
                  showYAxis={true}
                  showGradient={true}
                  startEndOnly={true}
                  curveType="natural"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <div className="text-sm font-medium text-gray-700">
                    Borrow APY
                  </div>
                  <div className="text-lg font-bold text-green-600">
                    {token.borrowAPY}%
                  </div>
                </div>
                <AreaChart
                  className="h-48"
                  data={borrowChartData}
                  index="date"
                  categories={["APY"]}
                  colors={["green"]}
                  valueFormatter={valueFormatter}
                  showLegend={false}
                  showYAxis={true}
                  showGradient={true}
                  startEndOnly={true}
                  curveType="natural"
                />
              </div>
            </div>
          </div>

          {/* Market Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Supply Info */}
            <div className="bg-purple-50 rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4">Supply Information</h2>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-white rounded-xl p-4 border">
                  <div className="text-sm text-gray-500 mb-1">
                    Total Supplied
                  </div>
                  <div className="text-lg font-bold">{token.totalSupplied}</div>
                </div>
                <div className="bg-white rounded-xl p-4 border">
                  <div className="text-sm text-gray-500 mb-1">Supply APY</div>
                  <div className="text-lg font-bold text-purple-600">
                    {token.supplyAPY}%
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-4 border mb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-gray-500 mb-1">
                      Utilization Rate
                    </div>
                    <div className="text-lg font-bold">
                      {token.utilizationRate}%
                    </div>
                  </div>
                  <DonutChart
                    data={utilizationData}
                    category="value"
                    index="name"
                    valueFormatter={valueFormatter}
                    colors={["purple", "slate"]}
                    className="h-24 w-24"
                  />
                </div>
              </div>

              <div className="bg-white rounded-xl p-4 border">
                <h3 className="text-sm font-medium text-gray-700 mb-3">
                  Collateral Parameters
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  <div className="text-center">
                    <div className="text-xs text-gray-500 mb-1">Max LTV</div>
                    <div className="font-medium">{token.maxLTV}%</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-gray-500 mb-1">
                      Liquidation Threshold
                    </div>
                    <div className="font-medium">
                      {token.liquidationThreshold}%
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-gray-500 mb-1">
                      Liquidation Penalty
                    </div>
                    <div className="font-medium">
                      {token.liquidationPenalty}%
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Borrow Info */}
            <div className="bg-green-50 rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4">Borrow Information</h2>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-white rounded-xl p-4 border">
                  <div className="text-sm text-gray-500 mb-1">
                    Total Borrowed
                  </div>
                  <div className="text-lg font-bold">{token.totalBorrowed}</div>
                </div>
                <div className="bg-white rounded-xl p-4 border">
                  <div className="text-sm text-gray-500 mb-1">Borrow APY</div>
                  <div className="text-lg font-bold text-green-600">
                    {token.borrowAPY}%
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-4 border mb-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Borrow Cap</div>
                    <div className="text-lg font-bold">{token.borrowCap}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">
                      Reserve Factor
                    </div>
                    <div className="text-lg font-bold">
                      {token.reserveFactor}%
                    </div>
                  </div>
                </div>
              </div>

              <Link href="/">
                <button className="w-full bg-green-500 hover:bg-green-600 text-white rounded-full py-3 flex justify-center items-center">
                  <span>Go to Borrow</span>
                  <ChevronRight size={16} className="ml-1" />
                </button>
              </Link>
            </div>
          </div>

          {/* Interest Rate Model */}
          <div className="bg-white rounded-xl p-6 border">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Interest Rate Model</h2>
              <div className="text-sm text-purple-600 cursor-pointer flex items-center gap-1">
                <span>View details</span>
                <ExternalLink size={14} />
              </div>
            </div>

            <div className="flex gap-4 mb-4">
              <div className="flex items-center gap-1 text-xs">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span>Interest Rate</span>
              </div>
              <div className="flex items-center gap-1 text-xs">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <span>Current Rate ({token.utilizationRate}%)</span>
              </div>
              <div className="flex items-center gap-1 text-xs">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span>Optimal Point</span>
              </div>
            </div>

            <LineChart
              className="h-64"
              data={interestRateData}
              index="utilization"
              categories={["Interest Rate", "Current Rate", "Optimal Point"]}
              colors={["purple", "orange", "blue"]}
              valueFormatter={valueFormatter}
              showLegend={false}
              showYAxis={true}
              curveType="monotone"
              connectNulls={true}
            />
          </div>

          {/* E-Mode Info */}
          <div className="bg-gray-50 rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">E-Mode Information</h2>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-200 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                </div>
                <span className="text-sm">{token.symbol} correlated</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white rounded-xl p-4 border">
                <p className="text-sm text-gray-600">
                  E-Mode increases your LTV for a selected category of assets,
                  meaning that when E-mode is enabled, you will have higher
                  borrowing power over assets of the same E-mode category.
                </p>
              </div>

              <div className="bg-white rounded-xl p-4 border">
                <div className="grid grid-cols-3 gap-2">
                  <div className="text-center">
                    <div className="text-xs text-gray-500 mb-1">
                      E-Mode Max LTV
                    </div>
                    <div className="font-medium">{token.maxLTV + 5}%</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-gray-500 mb-1">
                      E-Mode Threshold
                    </div>
                    <div className="font-medium">
                      {token.liquidationThreshold + 5}%
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-gray-500 mb-1">
                      E-Mode Penalty
                    </div>
                    <div className="font-medium">
                      {token.liquidationPenalty - 3}%
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default SupplyDetails;
