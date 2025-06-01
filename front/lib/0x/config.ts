"use client"

const config = {
    PLEDGER_URL: "https://0x-pledger.xonery.dev",
    LENDING_POOL_ADDRESS: "0xDFF0Fb950Dc006C504419dE5fB7D70b7E4f463a2",
} as const

export const get0xConfig = () => {
    return config
}