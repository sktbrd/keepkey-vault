import React from "react";
import Balances from "./components/Balances";

// make an index component that will ocuppy 100% of the viewpor t

export default function HomePage() {
    return (
        <div style={{ height: "100vh", width: "100vw" }}>
            <Balances />
        </div>
    );
}