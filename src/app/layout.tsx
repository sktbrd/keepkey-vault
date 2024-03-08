import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { WalletContext, KeepKeyWalletProvider } from "./contexts/WalletProvider";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "KeepKey Vault",
  description: "by KeepKey Devs",
};

export default function RootLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {
  return (
    <html lang="en">
      <KeepKeyWalletProvider selectedChains={[]}>
        <body className={inter.className}>{children}</body>
      </KeepKeyWalletProvider>
    </html>
  );
}
