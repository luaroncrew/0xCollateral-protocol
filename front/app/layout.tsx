import { PropsWithChildren } from "react";

import type { Metadata, NextPage } from "next";

import { Inter, Space_Grotesk } from "next/font/google";

import { RootLayout } from "@/components/0x/layouts/root-layout";

import { ThemeProvider } from "@/components/0x/providers/theme";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

export const metadata: Metadata = {
  title: "0xCollateral - DeFi Lending with Credit Card Collateral",
  description:
    "Borrow and lend crypto assets using credit card pre-authorization as collateral",
};

const Layout: NextPage<PropsWithChildren> = ({ children }) => {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${spaceGrotesk.variable} font-sans`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <RootLayout>{children}</RootLayout>
        </ThemeProvider>
      </body>
    </html>
  );
};

export default Layout;
