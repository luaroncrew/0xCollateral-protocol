"use client"

import { NotificationProvider, TransactionPopupProvider } from "@blockscout/app-sdk"
import { FC, PropsWithChildren } from "react"

export const BlockScoutProvider: FC<PropsWithChildren> = ({ children }) => {
    return <NotificationProvider>
        <TransactionPopupProvider>
            {children}
        </TransactionPopupProvider>
    </NotificationProvider>
}

