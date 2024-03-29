'use client';
import React, { useState } from 'react';
import { ChakraProvider } from "@chakra-ui/react";
import Header from "./components/Header";
import Footer from './components/Footer';
import { KeepKeyWalletProvider } from './contexts/WalletProvider';
import { extendTheme } from "@chakra-ui/react";
import HomePage from '.';
import '@fontsource/share-tech-mono';
import { PricesProvider } from './contexts/PricesContext';
import { UserConnectionProvider } from './contexts/UserConnectionContext';
export default function Home() {
  const [selectedChains, setSelectedChains] = useState<string[]>([]);

  const theme = extendTheme({
    styles: {
      global: {
        html: {
          height: "100%",
        },
        body: {
          minHeight: "100vh", // This ensures the body takes at least the full viewport height
          overflowX: "hidden", // Prevents horizontal scrolling
          bg: "black",
        },
        "#__next": { // This assumes you are using Next.js. Adjust the selector if using a different setup.
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
        },
      },
    },
    fonts: {
      heading: "Share Tech Mono, monospace",
      body: "Share Tech Mono, monospace",
    },
  });

  return (
    <ChakraProvider theme={theme}>
      <UserConnectionProvider>
        <KeepKeyWalletProvider selectedChains={selectedChains}>

          <PricesProvider>
            <Header />
            <HomePage />
            <Footer />
          </PricesProvider>

        </KeepKeyWalletProvider>
      </UserConnectionProvider>
    </ChakraProvider>
  );
};
