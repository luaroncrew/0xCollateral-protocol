// Generate mock data for charts
export function generateAPYData(baseAPY: number, period: string, type: "supply" | "borrow") {
    const dataPoints = period === "1m" ? 30 : period === "6m" ? 180 : 365
    const volatility = type === "supply" ? 0.3 : 0.5 // Borrow rates are more volatile
    const data = []

    let currentAPY = baseAPY

    for (let i = 0; i < dataPoints; i++) {
        // Add some random fluctuation to the APY
        const change = (Math.random() - 0.5) * volatility
        currentAPY = Math.max(0.1, currentAPY + change) // Ensure APY doesn't go below 0.1%

        // Create date for x-axis
        const date = new Date()
        date.setDate(date.getDate() - (dataPoints - i))

        data.push({
            date: date.toISOString().split("T")[0],
            apy: Number.parseFloat(currentAPY.toFixed(2)),
            avg: Number.parseFloat(baseAPY.toFixed(2)),
        })
    }

    return data
}

// Generate interest rate model data
export function generateInterestRateModelData(utilizationRate: number, borrowAPY: number) {
    const data = []

    // Generate data points for the interest rate curve
    for (let i = 0; i <= 100; i += 5) {
        let rate

        if (i <= 80) {
            // Linear increase up to optimal point (80%)
            rate = (i / 80) * borrowAPY * 0.8
        } else {
            // Exponential increase after optimal point
            const excessUtilization = i - 80
            rate = borrowAPY * 0.8 + ((excessUtilization * excessUtilization) / 400) * borrowAPY * 1.5
        }

        data.push({
            utilization: i,
            rate: Number.parseFloat(rate.toFixed(2)),
            optimal: i === 80 ? rate : null,
            current: i === Math.round(utilizationRate) ? rate : null,
        })
    }

    return data
}

// Format data for Tremor charts
export function formatAPYDataForTremor(data: any[], period: string) {
    // For longer periods, we need to reduce the number of data points to avoid overcrowding
    let formattedData = [...data]

    if (period === "6m") {
        // For 6 months, show weekly data
        formattedData = data.filter((_, index) => index % 7 === 0)
    } else if (period === "1y") {
        // For 1 year, show bi-weekly data
        formattedData = data.filter((_, index) => index % 14 === 0)
    }

    return formattedData.map((item) => ({
        date: item.date,
        APY: item.apy,
        Average: item.avg,
    }))
}

export function formatInterestRateDataForTremor(data: any[]) {
    return data.map((item) => ({
        utilization: `${item.utilization}%`,
        "Interest Rate": item.rate,
        ...(item.optimal !== null ? { "Optimal Point": item.rate } : {}),
        ...(item.current !== null ? { "Current Rate": item.rate } : {}),
    }))
}

// Token data constants
export const TOKEN_DATA = [
    {
        name: "Ethereum",
        symbol: "ETH",
        reserveSize: "$3.80B",
        availableLiquidity: "$392.03M",
        utilizationRate: 89.69,
        oraclePrice: "$1,629.22",
        totalSupplied: "2.33M of 3.00M",
        supplyAPY: 2.07,
        maxLTV: 80.5,
        liquidationThreshold: 83.0,
        liquidationPenalty: 5.0,
        totalBorrowed: "2.09M of 2.70M",
        borrowAPY: 2.73,
        borrowCap: "2.70M",
        reserveFactor: 15.0,
        eMode: true,
        canBeCollateral: true,
        borrowable: true,
    },
     {
        name: "USD Coin",
        symbol: "USDC",
        reserveSize: "$5.2B",
        availableLiquidity: "$1.8B",
        utilizationRate: 65.38,
        oraclePrice: "$1.00",
        totalSupplied: "3.4B of 5.2B",
        supplyAPY: 1.82,
        maxLTV: 87.0,
        liquidationThreshold: 90.0,
        liquidationPenalty: 4.0,
        totalBorrowed: "3.4B of 5.2B",
        borrowAPY: 2.15,
        borrowCap: "3.5B",
        reserveFactor: 10.0,
        eMode: true,
        canBeCollateral: true,
        borrowable: true,
    },
    {
        name: "Dai Stablecoin",
        symbol: "DAI",
        reserveSize: "$1.2B",
        availableLiquidity: "$420M",
        utilizationRate: 65.0,
        oraclePrice: "$1.00",
        totalSupplied: "780M of 1.2B",
        supplyAPY: 1.95,
        maxLTV: 85.0,
        liquidationThreshold: 88.0,
        liquidationPenalty: 4.5,
        totalBorrowed: "780M of 1.2B",
        borrowAPY: 2.35,
        borrowCap: "800M",
        reserveFactor: 12.0,
        eMode: true,
        canBeCollateral: true,
        borrowable: true,
    },
    {
        name: "Aave",
        symbol: "AAVE",
        reserveSize: "$320M",
        availableLiquidity: "$120M",
        utilizationRate: 62.5,
        oraclePrice: "$92.45",
        totalSupplied: "200M of 320M",
        supplyAPY: 2.8,
        maxLTV: 70.0,
        liquidationThreshold: 75.0,
        liquidationPenalty: 7.5,
        totalBorrowed: "200M of 320M",
        borrowAPY: 3.5,
        borrowCap: "250M",
        reserveFactor: 20.0,
        eMode: true,
        canBeCollateral: true,
        borrowable: true,
    },
    {
        name: "Chainlink",
        symbol: "LINK",
        reserveSize: "$580M",
        availableLiquidity: "$230M",
        utilizationRate: 60.34,
        oraclePrice: "$14.23",
        totalSupplied: "350M of 580M",
        supplyAPY: 2.3,
        maxLTV: 75.0,
        liquidationThreshold: 80.0,
        liquidationPenalty: 6.5,
        totalBorrowed: "350M of 580M",
        borrowAPY: 2.9,
        borrowCap: "400M",
        reserveFactor: 18.0,
        eMode: true,
        canBeCollateral: true,
        borrowable: true,
    }
]

// Chart configuration constants
export const CHART_PERIODS = ["1m", "6m", "1y"]

export const CHART_COLORS = {
    supply: {
        primary: "purple",
        secondary: "gray",
    },
    borrow: {
        primary: "emerald",
        secondary: "gray",
    },
    interestRate: {
        line: "purple",
        current: "orange",
        optimal: "blue",
    },
    utilization: {
        used: "purple",
        available: "slate",
    },
}

// Wallet constants
export const SUPPORTED_CHAINS = {
    1: "Ethereum",
    137: "Polygon",
    56: "BNB Chain",
    42161: "Arbitrum",
    10: "Optimism",
}

export const CHAIN_ICONS = {
    1: "eth",
    137: "matic",
    56: "bnb",
    42161: "arb",
    10: "op",
}

