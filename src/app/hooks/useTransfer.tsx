// hooks/useHandleTransfer.ts

import { useContext } from 'react';
import { AssetValue } from '@coinmasters/core';

export function useHandleTransfer(keepkeyInstance: any) {
    const handleTransfer = async ({ asset, amount, destination, chain, memo = '', from }: any) => {
        console.log("handleTransfer: input: ", { asset, amount, destination, chain, memo })
        const walletMethods = keepkeyInstance[chain]?.walletMethods;
        console.log(walletMethods)
        if (!asset || !amount || !from) return;

        if (asset && keepkeyInstance[chain]?.walletMethods) {
            try {
                const assetString = `${chain}.${asset}`;
                console.log("assetString: ", assetString);
                await AssetValue.loadStaticAssets();

                let assetValue = await AssetValue.fromString(
                    assetString,
                    amount
                );

                let sendPayload = {
                    assetValue,
                    memo,
                    recipient: destination,
                    from,
                };
                console.log(sendPayload)
                const txHash = await keepkeyInstance[chain]?.walletMethods.transfer(sendPayload);

                return txHash;
            } catch (error) {
                console.error("Transfer failed", error);
                throw error;
            }
        }
    };

    return handleTransfer;
}
